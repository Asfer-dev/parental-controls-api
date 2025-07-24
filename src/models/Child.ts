import mongoose from "mongoose";

const ChildSchema = new mongoose.Schema({
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Parent" },
  name: String,
  age: Number,
  gameUserId: String,
  restrictions: {
    chatEnabled: { type: Boolean, default: true },
    purchaseAllowed: { type: Boolean, default: true },
    screenTimeLimit: { type: Number, default: 120 },
    allowedHours: [String],
  },
  isLocked: { type: Boolean, default: false },
  logs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Log" }],
});

export default mongoose.model("Child", ChildSchema);
