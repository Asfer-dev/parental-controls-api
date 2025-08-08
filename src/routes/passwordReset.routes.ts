// routes/passwordReset.routes.ts
import express from "express";
import { catchAsync } from "../utils/catchAsync";
import {
  requestPasswordReset,
  verifyResetCode, // keep if your UI needs a separate verify step
  resetPassword,
} from "../controllers/passwordReset.controller"; // <-- controller dedicated to resets

const router = express.Router();

// Request a reset code (always responds 200 to avoid user enumeration)
router.post("/request-password-reset", catchAsync(requestPasswordReset));

// Optional: verify the code before the actual reset (some UIs do this as a 2-step)
router.post("/verify-reset-code", catchAsync(verifyResetCode));

// Reset password using email + code + newPassword
router.post("/reset-password", catchAsync(resetPassword));

export default router;
