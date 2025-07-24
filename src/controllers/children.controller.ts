import { Request, Response } from "express";
import Child from "../models/Child";

export const createChild = async (req: Request, res: Response) => {
  const { name, age, gameUserId } = req.body;

  if (!(req as any).userId)
    return res.status(401).json({ message: "Unauthorized" });

  if (!name || !age || !gameUserId)
    return res.status(400).json({ message: "Missing child data" });

  const child = new Child({
    parentId: (req as any).userId,
    name,
    age,
    gameUserId,
  });

  await child.save();

  return res.status(201).json({ message: "Child added successfully", child });
};

export const getAllChildren = async (req: Request, res: Response) => {
  if (!(req as any).userId)
    return res.status(401).json({ message: "Unauthorized" });

  const children = await Child.find({ parentId: (req as any).userId });

  return res.json({ children });
};

export const updateChild = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, age, gameUserId } = req.body;

  if (!(req as any).userId)
    return res.status(401).json({ message: "Unauthorized" });

  const child = await Child.findOne({ _id: id, parentId: (req as any).userId });

  if (!child) return res.status(404).json({ message: "Child not found" });

  if (name) child.name = name;
  if (age) child.age = age;
  if (gameUserId) child.gameUserId = gameUserId;

  await child.save();

  return res.json({ message: "Child updated", child });
};

export const deleteChild = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!(req as any).userId)
    return res.status(401).json({ message: "Unauthorized" });

  const deleted = await Child.findOneAndDelete({
    _id: id,
    parentId: (req as any).userId,
  });

  if (!deleted)
    return res.status(404).json({ message: "Child not found or not yours" });

  return res.json({ message: "Child deleted successfully" });
};
