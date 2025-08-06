import { Request, Response } from "express";
import Child from "../models/Child";
import mongoose from "mongoose";

export const setRestrictions = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { chatEnabled, purchaseAllowed, screenTimeLimit, allowedHours } =
    req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      status: false,
      message: "Invalid child ID",
      error: "Malformed ObjectId",
    });
  }

  try {
    const child = await Child.findOne({
      _id: id,
      parentId: (req as any).userId,
    });

    if (!child) {
      return res.status(404).json({
        status: false,
        message: "Child not found or unauthorized",
        error: "Invalid ID or access denied",
      });
    }

    child.restrictions = {
      chatEnabled,
      purchaseAllowed,
      screenTimeLimit,
      allowedHours,
    };

    await child.save();

    return res.json({
      status: true,
      message: "Restrictions set",
      data: { restrictions: child.restrictions },
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Failed to set restrictions",
      error,
    });
  }
};

export const getRestrictions = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      status: false,
      message: "Invalid child ID",
      error: "Malformed ObjectId",
    });
  }

  try {
    const child = await Child.findOne({
      _id: id,
      parentId: (req as any).userId,
    });

    if (!child) {
      return res.status(404).json({
        status: false,
        message: "Child not found or unauthorized",
        error: "Invalid ID or access denied",
      });
    }

    return res.json({
      status: true,
      message: "Restrictions retrieved successfully",
      data: { restrictions: child.restrictions },
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Failed to get restrictions",
      error,
    });
  }
};

export const updateRestrictions = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      status: false,
      message: "Invalid child ID",
      error: "Malformed ObjectId",
    });
  }

  try {
    const child = await Child.findOne({
      _id: id,
      parentId: (req as any).userId,
    });

    if (!child) {
      return res.status(404).json({
        status: false,
        message: "Child not found or unauthorized",
        error: "Invalid ID or access denied",
      });
    }

    child.restrictions = {
      ...child.restrictions,
      ...updates,
    };

    await child.save();

    return res.json({
      status: true,
      message: "Restrictions updated",
      data: { restrictions: child.restrictions },
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Failed to update restrictions",
      error,
    });
  }
};
