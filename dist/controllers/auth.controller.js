"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = exports.verifyEmail = exports.requestVerification = void 0;
const EmailVerification_1 = __importDefault(require("../models/EmailVerification"));
const mailer_1 = require("../utils/mailer");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Parent_1 = __importDefault(require("../models/Parent"));
const requestVerification = async (req, res) => {
    const { email } = req.body;
    if (!email)
        return res.status(400).json({ message: "Email is required" });
    const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await EmailVerification_1.default.findOneAndUpdate({ email }, { code, verified: false, expiresAt }, { upsert: true, new: true });
    await (0, mailer_1.sendVerificationCode)(email, code);
    return res.json({ message: "Verification code sent" });
};
exports.requestVerification = requestVerification;
const verifyEmail = async (req, res) => {
    const { email, code } = req.body;
    if (!email || !code)
        return res.status(400).json({ message: "Email and code are required" });
    const record = await EmailVerification_1.default.findOne({ email });
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
exports.verifyEmail = verifyEmail;
const register = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ message: "Email and password are required" });
    const existingVerification = await EmailVerification_1.default.findOne({ email });
    if (!existingVerification || !existingVerification.verified) {
        return res.status(400).json({ message: "Email not verified" });
    }
    const existingUser = await Parent_1.default.findOne({ email });
    if (existingUser)
        return res.status(409).json({ message: "User already exists" });
    const salt = await bcrypt_1.default.genSalt(10);
    const passwordHash = await bcrypt_1.default.hash(password, salt);
    const newUser = new Parent_1.default({ email, passwordHash });
    await newUser.save();
    const token = jsonwebtoken_1.default.sign({ id: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
    return res.status(201).json({ token });
};
exports.register = register;
const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ message: "Email and password are required" });
    const user = await Parent_1.default.findOne({ email });
    if (!user)
        return res.status(404).json({ message: "User not found" });
    const isMatch = await bcrypt_1.default.compare(password, user.passwordHash);
    if (!isMatch)
        return res.status(401).json({ message: "Invalid credentials" });
    const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
    return res.json({ token });
};
exports.login = login;
