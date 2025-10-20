import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function chatController(req, res) {
  try {
    const { message } = req.body;

    // Input validation
    if (!message || typeof message !== "string" || message.trim() === "") {
      return res.status(400).json({ error: "Invalid input: message must be a non-empty string." });
    }
    if (message.length > 1000) {
      return res.status(400).json({ error: "Message too long. Max 1000 characters." });
    }

    const cleanMessage = message.trim();
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
    const result = await model.generateContent(cleanMessage);

    const botReply = result.response.text().trim();

    // Save to user chat history
    req.user.chatHistory.push({ role: "user", content: cleanMessage });
    req.user.chatHistory.push({ role: "assistant", content: botReply });
    await req.user.save();

    res.json({ reply: botReply });
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ error: "Error generating chat response" });
  }
}
