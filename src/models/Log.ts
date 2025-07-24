import mongoose from "mongoose";

const LogSchema = new mongoose.Schema({
  childId: { type: mongoose.Schema.Types.ObjectId, ref: "Child" },
  type: { type: String, required: true }, // e.g. "login", "lock", "unlock"
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("Log", LogSchema);
