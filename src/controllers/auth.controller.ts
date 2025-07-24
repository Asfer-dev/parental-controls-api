import { Request, Response } from "express";
import EmailVerification from "../models/EmailVerification";
import { sendVerificationCode } from "../utils/mailer";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Parent from "../models/Parent";

export const requestVerification = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit

  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await EmailVerification.findOneAndUpdate(
    { email },
    { code, verified: false, expiresAt },
    { upsert: true, new: true }
  );

  await sendVerificationCode(email, code);

  return res.json({ message: "Verification code sent" });
};

export const verifyEmail = async (req: Request, res: Response) => {
  const { email, code } = req.body;
  if (!email || !code)
    return res.status(400).json({ message: "Email and code are required" });

  const record = await EmailVerification.findOne({ email });

  if (!record)
    return res.status(404).json({ message: "Verification record not found" });
  if (record.verified)
    return res.status(400).json({ message: "Email already verified" });
  if (record.code !== code)
    return res.status(400).json({ message: "Invalid verification code" });
  if (new Date() > record.expiresAt)
    return res.status(400).json({ message: "Code expired" });

  record.verified = true;
  await record.save();

  return res.json({ message: "Email verified successfully" });
};

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required" });

  const existingVerification = await EmailVerification.findOne({ email });
  if (!existingVerification || !existingVerification.verified) {
    return res.status(400).json({ message: "Email not verified" });
  }

  const existingUser = await Parent.findOne({ email });
  if (existingUser)
    return res.status(409).json({ message: "User already exists" });

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

  return res.status(201).json({ token });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required" });

  const user = await Parent.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });

  return res.json({ token });
};
