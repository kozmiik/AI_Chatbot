import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function chatController(req, res) {
  try {
    const { message } = req.body;

    // Input validation
    if (!message || typeof message !== "string" || message.trim() === "") {
      return res
        .status(400)
        .json({ error: "Invalid input: message must be a non-empty string." });
    }

    // Prevent abuse or extremely long prompts
    if (message.length > 1000) {
      return res
        .status(400)
        .json({ error: "Message too long. Please keep under 1000 characters." });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
    const result = await model.generateContent(message);

    const botReply = result.response.text();

    res.json({ reply: botReply });
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ error: "Error generating chat response" });
  }
}
