import { Request, Response } from "express";
import EmailVerification from "../models/EmailVerification";
import { sendVerificationCode } from "../utils/mailer";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Parent from "../models/Parent";

export const requestVerification = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email)
    return res.status(400).json({
      message: "Email is required",
      status: false,
      error: "Failed to send verification code to email",
    });

  const record = await EmailVerification.findOne({ email });

  if (record && record.verified)
    return res.status(404).json({
      message: "Email already verified",
      status: false,
      error: "Failed to verify email. Email already verified",
    });

  const user = await Parent.findOne({ email });
  if (user) {
    return res.status(400).json({
      message: "Email is alrady registered. Please login",
      status: false,
      error:
        "Failed to send verification code to email. Email already registered.",
    });
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit

  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await EmailVerification.findOneAndUpdate(
    { email },
    { code, verified: false, expiresAt },
    { upsert: true, new: true }
  );

  await sendVerificationCode(email, code);

  return res.json({
    message: "Verification code sent",
    status: true,
    data: { code },
  });
};

export const verifyEmail = async (req: Request, res: Response) => {
  const { email, code } = req.body;
  if (!email || !code)
    return res.status(400).json({ message: "Email and code are required" });

  const record = await EmailVerification.findOne({ email });

  if (!record)
    return res.status(404).json({
      message: "Verification record not found",
      status: false,
      error: "Failed to verify email",
    });
  if (record.verified)
    return res.status(400).json({
      message: "Email already verified",
      status: false,
      error: "Failed to verify email",
    });
  if (record.code !== code)
    return res.status(400).json({
      message: "Invalid verification code",
      status: false,
      error: "Failed to verify email",
    });
  if (new Date() > record.expiresAt)
    return res.status(400).json({
      message: "Code expired",
      status: false,
      error: "Failed to verify email",
    });

  record.verified = true;
  await record.save();

  return res.json({
    message: "Email verified successfully",
    status: true,
    data: { code },
  });
};

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required" });

  const existingVerification = await EmailVerification.findOne({ email });
  if (!existingVerification || !existingVerification.verified) {
    return res.status(400).json({
      message: "Email not verified",
      status: false,
      error: "Failed to register user",
    });
  }

  const existingUser = await Parent.findOne({ email });
  if (existingUser)
    return res.status(409).json({
      message: "User already exists",
      status: false,
      error: "Failed to register user",
    });

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const newUser = new Parent({ email, passwordHash });
  await newUser.save();

  const token = jwt.sign(
    { id: newUser._id },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "7d",
    }
  );

  return res.status(201).json({
    status: true,
    message: "Registrered successfully",
    data: { token },
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({
      message: "Email and password are required",
      status: false,
      error: "Failed to login",
    });

  const user = await Parent.findOne({ email });
  if (!user)
    return res.status(404).json({
      message: "User not found",
      status: false,
      error: "Failed login",
    });

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch)
    return res.status(401).json({
      message: "Invalid credentials",
      status: false,
      error: "Failed to login",
    });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });

  return res.json({ status: true, message: "login successful", data: token });
};

export const deleteAccount = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
        status: false,
        error: "Failed to delete account",
      });
    }

    const user = await Parent.findOneAndDelete({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        status: false,
        error: "Failed to delete account",
      });
    }

    await EmailVerification.deleteOne({ email: user.email });

    return res.json({
      status: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Delete Account Error:", error);
    return res.status(500).json({
      message: "Internal server error",
      status: false,
      error: "Failed to delete account",
    });
  }
};
