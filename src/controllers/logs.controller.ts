import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Log from "../models/Log";
import Child from "../models/Child";
import { AppError } from "../utils/AppError";

export const getLogs = async (
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

  const logs = await Log.find({ childId: id }).sort({ timestamp: -1 });

  res.json({ logs });
};
