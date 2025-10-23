import express from "express";
import User from "../models/User.js";

const router = express.Router();

// GET /api/chat/history
router.get("/", async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("chatHistory");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ messages: user.chatHistory || [] });
  } catch (err) {
    console.error("History fetch error:", err);
    res.status(500).json({ error: "Failed to fetch chat history" });
  }
});

export default router;
