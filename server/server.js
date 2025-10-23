import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import chatController from "./controllers/chatController.js";
import chatHistoryRoutes from "./routes/chatHistory.js";
import { protect } from "./middleware/authMiddleware.js";


const app = express();
app.use(express.json());
app.use(cors());

// Connect to DB (with error handling)
connectDB().catch((err) => {
  console.error("MongoDB connection failed:", err);
  process.exit(1);
});

// Routes
app.use("/api/auth", authRoutes);
app.post("/api/chat", protect, chatController);
app.use("/api/chat/history", protect, chatHistoryRoutes);

// Global error handler (to avoid empty responses)
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Server error. Please try again later." });
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
