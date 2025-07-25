"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendVerificationCode = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
const sendVerificationCode = async (email, code) => {
    const mailOptions = {
        from: `"Parental Controls" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Your Verification Code",
        text: `Your verification code is: ${code}`,
    };
    await transporter.sendMail(mailOptions);
};
exports.sendVerificationCode = sendVerificationCode;
