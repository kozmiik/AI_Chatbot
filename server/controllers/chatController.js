import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function chatController(req, res) {
  try {
    const { message } = req.body;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(message);

    const botReply = result.response.text();

    res.json({ reply: botReply });
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ error: "Error generating chat response" });
  }
}
