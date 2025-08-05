import mongoose, { Schema, Document } from "mongoose";

export interface ISession extends Document {
  childId: mongoose.Types.ObjectId;
  startTime: Date;
  endTime?: Date;
  isActive: boolean;
  durationMinutes: number;
}

const SessionSchema = new Schema<ISession>({
  childId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Child",
    required: true,
  },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  isActive: { type: Boolean, default: true },
  durationMinutes: { type: Number, default: 0 },
});

export default mongoose.model<ISession>("Session", SessionSchema);
