// testGemini.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

async function testKey() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
    const result = await model.generateContent("Hello, test!");

    console.log("API response:", result.response.text());
  } catch (err) {
    console.error("API key test failed:", err);
  }
}

testKey();
