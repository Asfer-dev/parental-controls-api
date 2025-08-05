import express from "express";
import { startSession } from "../controllers/session.controller";
import { authenticateToken } from "../middleware/auth.middleware";
import { stopSession } from "../controllers/session.controller";
import { getSessionStatus } from "../controllers/session.controller";

const router = express.Router();

router.post("/children/:id/sessions/start", authenticateToken, startSession);

router.post("/children/:id/sessions/stop", authenticateToken, stopSession);

router.get(
  "/children/:id/sessions/status",
  authenticateToken,
  getSessionStatus
);

export default router;
