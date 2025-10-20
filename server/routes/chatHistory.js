import express from "express";

const router = express.Router();

// GET /api/chat/history
router.get("/", async (req, res) => {
  try {
    const messages = req.user.chatHistory || [];
    res.json({ messages });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch chat history" });
  }
});

export default router;
