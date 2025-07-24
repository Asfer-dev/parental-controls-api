import express from "express";
import { authenticateToken } from "../middleware/auth.middleware";
import {
  setRestrictions,
  getRestrictions,
  updateRestrictions,
} from "../controllers/restrictions.controller";
import { catchAsync } from "../utils/catchAsync";

const router = express.Router();

router.post(
  "/:id/restrictions",
  authenticateToken,
  catchAsync(setRestrictions)
);
router.get("/:id/restrictions", authenticateToken, catchAsync(getRestrictions));
router.put(
  "/:id/restrictions",
  authenticateToken,
  catchAsync(updateRestrictions)
);

export default router;
