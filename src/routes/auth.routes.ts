import express from "express";
import {
  deleteAccount,
  login,
  register,
  requestVerification,
  verifyEmail,
} from "../controllers/auth.controller";
import { catchAsync } from "../utils/catchAsync";
import { authenticateToken } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/request-verification", catchAsync(requestVerification));
router.post("/verify-email", catchAsync(verifyEmail));

router.post("/register", catchAsync(register));

router.post("/login", catchAsync(login));

router.delete("/account", authenticateToken, catchAsync(deleteAccount));

export default router;
