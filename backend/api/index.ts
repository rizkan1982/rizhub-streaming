// Vercel serverless function handler
// Load environment variables FIRST
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import scrapeRoutes from "../src/router/endpoint";
import { connectDatabase } from "../src/config/database";

const app = express();

// Connect to database (non-blocking)
connectDatabase().catch(err => {
  console.error("Database connection failed:", err);
  console.log("⚠️  Continuing without database");
});

// Middleware
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "DELETE", "PUT"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🎬 RizHub Premium Entertainment API is running!",
    version: "3.0.0",
    endpoints: {
      videos: [
        "GET /xvideos/search?key=query&page=1",
        "GET /xvideos/get?id=videoId",
        "GET /xvideos/random",
        "GET /xvideos/related?id=videoId"
      ],
      social: [
        "GET /comments?videoId=xxx&platform=xvideos",
        "POST /comments",
        "POST /likes/toggle"
      ],
      admin: [
        "POST /admin/login",
        "GET /admin/dashboard"
      ]
    }
  });
});

// API Routes
app.use("/", scrapeRoutes());

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found",
    path: req.path
  });
});

// Error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err);
  res.status(500).json({
    success: false,
    message: "Internal server error"
  });
});

// Export for Vercel serverless
export default app;

