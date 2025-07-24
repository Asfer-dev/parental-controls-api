import express from "express";
import {
  login,
  register,
  requestVerification,
  verifyEmail,
} from "../controllers/auth.controller";
import { catchAsync } from "../utils/catchAsync";

const router = express.Router();

router.post("/request-verification", catchAsync(requestVerification));
router.post("/verify-email", catchAsync(verifyEmail));

router.post("/register", catchAsync(register));

router.post("/login", catchAsync(login));

export default router;
