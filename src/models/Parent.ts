import mongoose from "mongoose";

const ParentSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: "Child" }],
});

export default mongoose.model("Parent", ParentSchema);
