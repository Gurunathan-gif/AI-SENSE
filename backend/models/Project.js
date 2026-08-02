import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: { type: String, required: true },
    prompt: { type: String },
    code: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);