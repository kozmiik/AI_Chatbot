import User from "../models/User.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const chatController = async (req, res) => {
  try {
    const { message } = req.body;

    // Validate input
    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ error: "Message must be a non-empty string." });
    }

    if (message.length > 1000) {
      return res.status(400).json({ error: "Message too long. Please keep under 1000 characters." });
    }

    const cleanMessage = message.trim();

    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized: no user found in request." });
    }

    // Initialize Gemini client *inside* controller
    const apiKey = process.env.GEMINI_API_KEY;
    console.log("Gemini key in chatController:", apiKey ? "found" : "missing");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

    // Use `generateContent` properly
    const result = await model.generateContent(cleanMessage);
    const botReply = result.response.text().trim();

    // Save to Mongo
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (!Array.isArray(user.chatHistory)) user.chatHistory = [];
    user.chatHistory.push({ role: "user", content: cleanMessage });
    user.chatHistory.push({ role: "assistant", content: botReply });
    await user.save();

    res.json({ reply: botReply });
  } catch (err) {
  console.error("Chat error:", err);

  if (err.status === 429 || err.statusCode === 429) {
    return res.status(429).json({
      error: "Too many requests. Please wait a few seconds and try again."
    });
  }

  // Generic fallback for all other errors
  res.status(500).json({ error: "Error generating chat response" });
  }
};

export default chatController;
