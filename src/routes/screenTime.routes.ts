import express from "express";
import { authenticateToken } from "../middleware/auth.middleware";

import {
  setScreenTimeLimit,
  getScreenTime,
  lockChild,
  unlockChild,
} from "../controllers/screenTime.controller";
import { catchAsync } from "../utils/catchAsync";

const router = express.Router();

router.post(
  "/:id/screen-time",
  authenticateToken,
  catchAsync(setScreenTimeLimit)
);
router.get("/:id/screen-time", authenticateToken, catchAsync(getScreenTime));
router.post("/:id/lock", authenticateToken, catchAsync(lockChild));
router.post("/:id/unlock", authenticateToken, catchAsync(unlockChild));

export default router;
