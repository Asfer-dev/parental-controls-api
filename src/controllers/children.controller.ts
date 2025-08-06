import { Request, Response } from "express";
import Child from "../models/Child";

export const createChild = async (req: Request, res: Response) => {
  const { name, age, gameUserId } = req.body;

  if (!(req as any).userId) {
    return res.status(401).json({
      status: false,
      message: "Unauthorized",
      error: "Missing userId",
    });
  }

  if (!name || !age || !gameUserId) {
    return res.status(400).json({
      status: false,
      message: "Missing child data",
      error: "Required fields: name, age, gameUserId",
    });
  }

  try {
    const child = new Child({
      parentId: (req as any).userId,
      name,
      age,
      gameUserId,
    });

    await child.save();

    return res.status(201).json({
      status: true,
      message: "Child added successfully",
      data: { child },
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Failed to create child",
      error,
    });
  }
};

export const getAllChildren = async (req: Request, res: Response) => {
  if (!(req as any).userId) {
    return res.status(401).json({
      status: false,
      message: "Unauthorized",
      error: "Missing userId",
    });
  }

  try {
    const children = await Child.find({ parentId: (req as any).userId });

    return res.json({
      status: true,
      message: "Children retrieved successfully",
      data: { children },
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Failed to retrieve children",
      error,
    });
  }
};

export const updateChild = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, age, gameUserId } = req.body;

  if (!(req as any).userId) {
    return res.status(401).json({
      status: false,
      message: "Unauthorized",
      error: "Missing userId",
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
        message: "Child not found",
        error: "Invalid ID or unauthorized access",
      });
    }

    if (name) child.name = name;
    if (age) child.age = age;
    if (gameUserId) child.gameUserId = gameUserId;

    await child.save();

    return res.json({
      status: true,
      message: "Child updated",
      data: { child },
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Failed to update child",
      error,
    });
  }
};

export const deleteChild = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!(req as any).userId) {
    return res.status(401).json({
      status: false,
      message: "Unauthorized",
      error: "Missing userId",
    });
  }

  try {
    const deleted = await Child.findOneAndDelete({
      _id: id,
      parentId: (req as any).userId,
    });

    if (!deleted) {
      return res.status(404).json({
        status: false,
        message: "Child not found or not yours",
        error: "Invalid ID or unauthorized access",
      });
    }

    return res.json({
      status: true,
      message: "Child deleted successfully",
      data: { deletedId: id },
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Failed to delete child",
      error,
    });
  }
};
