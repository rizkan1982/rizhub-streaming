import mongoose from "mongoose";
import { logger } from "../utils/logger";

// Use MONGO_URI from .env file, fallback to local MongoDB
const MONGODB_URI = process.env.MONGO_URI || "mongodb://localhost:27017/rizhub";

export async function connectDatabase() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });
    
    logger.info("✅ MongoDB Connected Successfully");
    logger.info(`📊 Database: ${mongoose.connection.name}`);
    logger.info(`🌐 Host: ${mongoose.connection.host}`);
    
    // Create default admin if not exists
    await createDefaultAdmin();
    
  } catch (error: any) {
    console.error("❌ MongoDB Connection Error (FULL):");
    console.error(error);
    logger.error("❌ MongoDB Connection Error:", error.message);
    logger.warn("⚠️  Running without database - some features will be disabled");
    logger.info("💡 Video streaming will work, but admin panel requires MongoDB");
    // Don't exit - app can still work for video streaming
  }
}

// Create default admin user on first connection
async function createDefaultAdmin() {
  try {
    const Admin = mongoose.model("Admin");
    const existingAdmin = await Admin.findOne({ username: "rizhub_admin" });
    
    if (!existingAdmin) {
      const bcrypt = await import("bcryptjs");
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || "RizHub2025!@#SecurePass", salt);
      
      await Admin.create({
        username: process.env.ADMIN_USERNAME || "rizhub_admin",
        password: hashedPassword,
        role: "admin",
      });
      
      logger.info("✅ Default admin created: rizhub_admin");
    } else {
      logger.info("ℹ️  Admin user already exists");
    }
  } catch (error: any) {
    // Model might not exist yet, that's ok
    logger.warn("⚠️  Admin creation skipped (database not connected)");
  }
}

export default mongoose;

