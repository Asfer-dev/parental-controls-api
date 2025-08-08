import mongoose, { Schema, Document } from "mongoose";

export interface IPasswordReset extends Document {
  email: string;
  codeHash: string;
  expiresAt: Date;
  usedAt?: Date | null;
  attempts: number;
}

const PasswordResetSchema = new Schema<IPasswordReset>(
  {
    email: { type: String, index: true, required: true },
    codeHash: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    usedAt: { type: Date, default: null },
    attempts: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// optional: auto-delete expired tokens periodically if you have TTL index
PasswordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model<IPasswordReset>(
  "PasswordReset",
  PasswordResetSchema
);
