import mongoose from "mongoose";

const EmailVerificationSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  code: { type: String, required: true },
  verified: { type: Boolean, default: false },
  expiresAt: { type: Date, required: true },
});

export default mongoose.model("EmailVerification", EmailVerificationSchema);
