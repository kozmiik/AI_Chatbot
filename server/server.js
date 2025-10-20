import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import chatController from "./controllers/chatController.js";
import chatHistoryRoutes from "./routes/chatHistory.js";
import { protect } from "./middleware/authMiddleware.js";

dotenv.config();

// Connect Database
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);
app.post("/api/chat", protect, chatController); // protect ensures only logged-in users can chat
app.use("/api/chat/history", protect, chatHistoryRoutes);

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
