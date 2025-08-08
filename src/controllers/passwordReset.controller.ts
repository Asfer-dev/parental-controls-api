import { Request, Response } from "express";
import bcrypt from "bcrypt";
import Parent from "../models/Parent";
import PasswordReset from "../models/PasswordReset";
import { sendPasswordResetCode } from "../utils/mailer";

// ENV knobs (or use hardcoded like you did with 10 minutes)
const RESET_CODE_TTL_MINUTES = Number(process.env.RESET_CODE_TTL_MINUTES || 10);
const RESET_CODE_SALT_ROUNDS = Number(process.env.RESET_CODE_SALT_ROUNDS || 10);
const MAX_RESET_ATTEMPTS = Number(process.env.MAX_RESET_ATTEMPTS || 5);

/**
 * POST /auth/request-password-reset
 * body: { email }
 *
 * Always respond 200 to avoid revealing whether the email exists.
 */
export const requestPasswordReset = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      message: "Email is required",
      status: false,
      error: "Failed to send reset code",
    });
  }

  // If the user doesn't exist, we still return success later (no info leak)
  const user = await Parent.findOne({ email });

  // Generate code either way (but only send email if user exists)
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const codeHash = await bcrypt.hash(code, RESET_CODE_SALT_ROUNDS);
  const expiresAt = new Date(Date.now() + RESET_CODE_TTL_MINUTES * 60 * 1000);

  // Invalidate previous tokens for this email (optional but recommended)
  await PasswordReset.deleteMany({ email });

  // Create new reset record
  await PasswordReset.create({
    email,
    codeHash,
    expiresAt,
    attempts: 0,
  });

  // Only send mail if user exists (avoids user enumeration via mail volume)
  if (user) {
    await sendPasswordResetCode(email, code);
  }

  return res.json({
    message: "If that email exists, a reset code has been sent.",
    status: true,
    data: {},
  });
};

/**
 * POST /auth/verify-reset-code
 * body: { email, code }
 */
export const verifyResetCode = async (req: Request, res: Response) => {
  const { email, code } = req.body;
  if (!email || !code) {
    return res.status(400).json({
      message: "Email and code are required",
      status: false,
      error: "Failed to verify code",
    });
  }

  const record = await PasswordReset.findOne({ email }).sort({ createdAt: -1 });
  if (!record) {
    return res.status(400).json({
      message: "Invalid or expired code",
      status: false,
      error: "Failed to verify code",
    });
  }

  if (record.usedAt) {
    return res.status(400).json({
      message: "Code already used",
      status: false,
      error: "Failed to verify code",
    });
  }

  if (new Date() > record.expiresAt) {
    return res.status(400).json({
      message: "Code expired",
      status: false,
      error: "Failed to verify code",
    });
  }

  // Brute-force protection
  if (record.attempts >= MAX_RESET_ATTEMPTS) {
    return res.status(429).json({
      message: "Too many attempts. Request a new code.",
      status: false,
      error: "Failed to verify code",
    });
  }

  const isMatch = await bcrypt.compare(code, record.codeHash);
  if (!isMatch) {
    record.attempts += 1;
    await record.save();
    return res.status(400).json({
      message: "Invalid code",
      status: false,
      error: "Failed to verify code",
    });
  }

  return res.json({
    message: "Code verified",
    status: true,
    data: {},
  });
};

/**
 * POST /auth/reset-password
 * body: { email, code, newPassword }
 * Verifies the code and sets the new password atomically.
 */
export const resetPassword = async (req: Request, res: Response) => {
  const { email, code, newPassword } = req.body;

  if (!email || !code || !newPassword) {
    return res.status(400).json({
      message: "Email, code, and newPassword are required",
      status: false,
      error: "Failed to reset password",
    });
  }

  const user = await Parent.findOne({ email });
  // Always generic errors below to avoid enumeration.
  if (!user) {
    // Pretend success to avoid leaking whether user exists.
    return res.json({
      message: "Password reset successful",
      status: true,
    });
  }

  const record = await PasswordReset.findOne({ email }).sort({ createdAt: -1 });
  if (!record || record.usedAt || new Date() > record.expiresAt) {
    return res.status(400).json({
      message: "Invalid or expired code",
      status: false,
      error: "Failed to reset password",
    });
  }

  if (record.attempts >= MAX_RESET_ATTEMPTS) {
    return res.status(429).json({
      message: "Too many attempts. Request a new code.",
      status: false,
      error: "Failed to reset password",
    });
  }

  const isMatch = await bcrypt.compare(code, record.codeHash);
  if (!isMatch) {
    record.attempts += 1;
    await record.save();
    return res.status(400).json({
      message: "Invalid code",
      status: false,
      error: "Failed to reset password",
    });
  }

  // Consume the reset record (single-use)
  record.usedAt = new Date();
  await record.save();

  // Hash the new password and save
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(newPassword, salt);

  user.passwordHash = passwordHash;
  await user.save();

  return res.json({
    message: "Password reset successful",
    status: true,
  });
};
