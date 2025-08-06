import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Child from "../models/Child";
import { AppError } from "../utils/AppError";
import { logActivity } from "../utils/logger";

export const setScreenTimeLimit = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { screenTimeLimit } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid child ID", 400);
  }

  const child = await Child.findOne({ _id: id, parentId: (req as any).userId });
  if (!child) throw new AppError("Child not found or unauthorized", 404);

  child.restrictions!.screenTimeLimit = screenTimeLimit;
  await child.save();

  res.json({
    status: true,
    message: "Screen time limit updated",
    data: { screenTimeLimit },
  });
};

export const getScreenTime = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid child ID", 400);
  }

  const child = await Child.findOne({ _id: id, parentId: (req as any).userId });
  if (!child) throw new AppError("Child not found or unauthorized", 404);

  res.json({
    status: true,
    message: "Screen time settings retrieved",
    data: {
      isLocked: child.isLocked,
      screenTimeLimit: child.restrictions?.screenTimeLimit,
      allowedHours: child.restrictions?.allowedHours,
    },
  });
};

export const lockChild = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid child ID", 400);
  }

  const child = await Child.findOne({ _id: id, parentId: (req as any).userId });
  if (!child) throw new AppError("Child not found or unauthorized", 404);

  child.isLocked = true;
  await child.save();

  await logActivity(
    child._id.toString(),
    "lock",
    `Child account manually locked`
  );

  res.json({
    status: true,
    message: "Child has been locked",
    data: { isLocked: true },
  });
};

export const unlockChild = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid child ID", 400);
  }

  const child = await Child.findOne({ _id: id, parentId: (req as any).userId });
  if (!child) throw new AppError("Child not found or unauthorized", 404);

  child.isLocked = false;
  await child.save();

  await logActivity(
    child._id.toString(),
    "unlock",
    `Child account manually unlocked`
  );

  res.json({
    status: true,
    message: "Child has been unlocked",
    data: { isLocked: false },
  });
};
