import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  role: { type: String, enum: ["user", "assistant"], required: true },
  content: { type: String, required: true },
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  chatHistory: [chatSchema],
});

export default mongoose.model("User", userSchema);
