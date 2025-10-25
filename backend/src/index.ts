// Load environment variables FIRST (before any other imports!)
import dotenv from "dotenv";
dotenv.config();

// Now import everything else
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import scrapeRoutes from "./router/endpoint";
import { logger } from "./utils/logger";
import { connectDatabase } from "./config/database";
import { sessionTracking } from "./middleware/sessionTracking";

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to database
connectDatabase().catch(err => {
  console.error("Database connection failed:", err);
  console.log("⚠️  Continuing without database - video streaming will work, but user tracking is disabled");
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

// Request logging
app.use((req, res, next) => {
  logger.info({
    method: req.method,
    path: req.path,
    ip: req.ip,
    timestamp: new Date().toISOString()
  });
  next();
});

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🎬 RizHub Premium Entertainment API is running!",
    version: "3.0.0",
    features: [
      "✅ Multi-platform video scraping",
      "✅ User session tracking",
      "✅ Comment system (no login required)",
      "✅ Like/Unlike system",
      "✅ Admin dashboard with analytics",
      "✅ Real-time user activity monitoring"
    ],
    endpoints: {
      videos: [
        "GET /xvideos/search?key=query&page=1",
        "GET /xvideos/get?id=videoId",
        "GET /xvideos/random",
        "GET /xvideos/related?id=videoId",
        "GET /xvideos/watch?id=videoId (get stream URL)",
        "GET /xvideos/proxy?url=streamUrl (proxy video)"
      ],
      social: [
        "GET /comments?videoId=xxx&platform=xvideos",
        "POST /comments (body: {videoId, platform, text})",
        "POST /comments/like (body: {commentId})",
        "POST /comments/reply (body: {commentId, text})",
        "GET /likes?videoId=xxx",
        "POST /likes/toggle (body: {videoId, platform})"
      ],
      admin: [
        "POST /admin/login (body: {username, password})",
        "GET /admin/dashboard (requires auth)",
        "GET /admin/users (requires auth)",
        "GET /admin/analytics (requires auth)"
      ]
    },
    documentation: "See START.md for full API documentation"
  });
});

// API Routes - All platforms
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
  logger.error({
    error: err.message,
    stack: err.stack,
    path: req.path
  });
  
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined
  });
});

// Start server
app.listen(PORT, async () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║  🎬 RizHub Premium Entertainment API                  ║
║  🚀 Server: http://localhost:${PORT}                   ║
║  📊 Admin: http://localhost:${PORT}/admin/dashboard    ║
║  📚 Docs: See START.md                                ║
║  🌐 CORS: Enabled                                     ║
║  🔒 Session Tracking: Active                          ║
╚═══════════════════════════════════════════════════════╝
  `);
  logger.info(`Server started on port ${PORT}`);
  
  // Create default admin if not exists
  try {
    const Admin = (await import("./models/Admin")).default;
    const existingAdmin = await Admin.findOne({ username: "rizhub_admin" });
    if (!existingAdmin) {
      await Admin.create({
        username: "rizhub_admin",
        password: "RizHub2025!@#SecurePass",
        role: "admin"
      });
      console.log("✅ Default admin created");
      console.log("   Username: rizhub_admin");
      console.log("   Password: RizHub2025!@#SecurePass");
      console.log("   ⚠️  CHANGE THIS PASSWORD IMMEDIATELY!");
    }
  } catch (error) {
    console.log("⚠️  Admin creation skipped (database not connected)");
  }
});
