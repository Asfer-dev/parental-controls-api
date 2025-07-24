import express from "express";
import {
  createChild,
  deleteChild,
  getAllChildren,
  updateChild,
} from "../controllers/children.controller";
import { authenticateToken } from "../middleware/auth.middleware";
import { catchAsync } from "../utils/catchAsync";

const router = express.Router();

router.post("/", authenticateToken, catchAsync(createChild));
router.get("/", authenticateToken, catchAsync(getAllChildren));
router.put("/:id", authenticateToken, catchAsync(updateChild));
router.delete("/:id", authenticateToken, catchAsync(deleteChild));

export default router;
