import express from "express";
import { getLogs } from "../controllers/logs.controller";
import { authenticateToken } from "../middleware/auth.middleware";
import { catchAsync } from "../utils/catchAsync";

const router = express.Router();

router.get("/:id/logs", authenticateToken, catchAsync(getLogs));

export default router;
