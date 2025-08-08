import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendVerificationCode = async (email: string, code: string) => {
  const mailOptions = {
    from: `"Parental Controls" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your Verification Code",
    text: `Your verification code is: ${code}`,
  };

  await transporter.sendMail(mailOptions);
};

export const sendPasswordResetCode = async (email: string, code: string) => {
  const mailOptions = {
    from: `"Parental Controls" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your Password Reset Code",
    text: `Use this code to reset your password (valid for 10 minutes): ${code}`,
  };

  await transporter.sendMail(mailOptions);
};
