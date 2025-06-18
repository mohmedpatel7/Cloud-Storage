import mongoose from "mongoose";

const FileSchema = new mongoose.Schema({
  originalName: String,
  storedName: String,
  filePath: String,
  size: Number,
  type: String,
  uploadDate: { type: Date, default: Date.now },
});

export default mongoose.models.File || mongoose.model("File", FileSchema);
