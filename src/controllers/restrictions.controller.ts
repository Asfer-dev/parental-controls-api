import { Request, Response } from "express";
import Child from "../models/Child";
import mongoose from "mongoose";

export const setRestrictions = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { chatEnabled, purchaseAllowed, screenTimeLimit, allowedHours } =
    req.body;

  const child = await Child.findOne({ _id: id, parentId: (req as any).userId });
  if (!child)
    return res.status(404).json({ message: "Child not found or unauthorized" });

  child.restrictions = {
    chatEnabled,
    purchaseAllowed,
    screenTimeLimit,
    allowedHours,
  };

  await child.save();
  return res.json({
    message: "Restrictions set",
    restrictions: child.restrictions,
  });
};

export const getRestrictions = async (req: Request, res: Response) => {
  const { id } = req.params;

  const child = await Child.findOne({ _id: id, parentId: (req as any).userId });
  if (!child)
    return res.status(404).json({ message: "Child not found or unauthorized" });

  return res.json({ restrictions: child.restrictions });
};

export const updateRestrictions = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid child ID" });
  }

  const child = await Child.findOne({ _id: id, parentId: (req as any).userId });
  if (!child)
    return res.status(404).json({ message: "Child not found or unauthorized" });

  child.restrictions = {
    ...child.restrictions,
    ...updates,
  };

  await child.save();
  return res.json({
    message: "Restrictions updated",
    restrictions: child.restrictions,
  });
};
