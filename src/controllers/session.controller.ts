import { Request, Response } from "express";
import Session from "../models/Session";
import Child from "../models/Child";
import mongoose, { Types } from "mongoose";

export const startSession = async (req: Request, res: Response) => {
  try {
    const { id: childId } = req.params;
    const parentId = (req as any).userId;

    // Validate child ownership
    const child = await Child.findOne({ _id: childId, parentId });
    if (!child) {
      return res
        .status(404)
        .json({ message: "Child not found or unauthorized" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Total minutes used today
    const sessions = await Session.find({
      childId,
      startTime: { $gte: today },
    });

    const totalUsed = sessions.reduce((sum: any, session: any) => {
      return sum + session.durationMinutes;
    }, 0);

    const limit = child.restrictions?.screenTimeLimit ?? 0;

    if (totalUsed >= limit) {
      return res
        .status(403)
        .json({ message: "Screen time limit reached for today" });
    }

    // Create session
    const newSession = await Session.create({
      childId,
      startTime: new Date(),
      isActive: true,
    });

    const remainingTime = limit - totalUsed;
    const stopAfter = Math.min(remainingTime, 180); // max 3 hours safety cap

    setTimeout(async () => {
      const session = await Session.findById(newSession._id);
      if (session && session.isActive) {
        const now = new Date();
        const minutesUsed = Math.floor(
          (now.getTime() - session.startTime.getTime()) / 60000
        );

        session.endTime = now;
        session.durationMinutes = minutesUsed;
        session.isActive = false;
        await session.save();

        console.log(
          `Auto-stopped session ${session._id} after ${minutesUsed} minutes`
        );
      }
    }, stopAfter * 60 * 1000); // Convert minutes to ms

    return res
      .status(201)
      .json({ message: "Session started", sessionId: newSession._id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to start session" });
  }
};

export const stopSession = async (req: Request, res: Response) => {
  try {
    const { id: childId } = req.params;
    const parentId = (req as any).userId;

    if (!Types.ObjectId.isValid(childId)) {
      return res.status(400).json({ message: "Invalid child ID" });
    }

    const child = await Child.findOne({ _id: childId, parentId });
    if (!child) {
      return res
        .status(404)
        .json({ message: "Child not found or unauthorized" });
    }

    const activeSession = await Session.findOne({
      childId,
      isActive: true,
    });

    if (!activeSession) {
      return res.status(400).json({ message: "No active session found" });
    }

    const now = new Date();
    const minutesUsed = Math.floor(
      (now.getTime() - activeSession.startTime.getTime()) / 60000
    );

    activeSession.endTime = now;
    activeSession.durationMinutes = minutesUsed;
    activeSession.isActive = false;

    await activeSession.save();

    return res.status(200).json({
      message: "Session stopped",
      duration: minutesUsed,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to stop session" });
  }
};

export const getSessionStatus = async (req: Request, res: Response) => {
  try {
    const { id: childId } = req.params;
    const parentId = (req as any).userId;

    if (!Types.ObjectId.isValid(childId)) {
      return res.status(400).json({ message: "Invalid child ID" });
    }

    const child = await Child.findOne({ _id: childId, parentId });
    if (!child) {
      return res
        .status(404)
        .json({ message: "Child not found or unauthorized" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sessionsToday = await Session.find({
      childId,
      startTime: { $gte: today },
    });

    const now = new Date();
    let totalUsed = 0;
    let activeSession = null;

    for (const session of sessionsToday) {
      if (session.isActive) {
        activeSession = session;
        const liveDuration = Math.floor(
          (now.getTime() - session.startTime.getTime()) / 60000
        );
        totalUsed += liveDuration;
      } else {
        totalUsed += session.durationMinutes;
      }
    }

    const limit = child.restrictions?.screenTimeLimit ?? 0;
    const remaining = Math.max(limit - totalUsed, 0);

    if (!activeSession) {
      return res.status(200).json({
        isActive: false,
        remainingMinutes: remaining,
        message:
          remaining === 0 ? "Screen time limit reached" : "No active session",
      });
    }

    return res.status(200).json({
      isActive: true,
      sessionId: activeSession._id,
      startedAt: activeSession.startTime,
      remainingMinutes: remaining,
      screenTimeLimit: limit,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch session status" });
  }
};
