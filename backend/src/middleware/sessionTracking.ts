import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import User from "../models/User";
import Analytics from "../models/Analytics";

// Extend Express Request to include sessionId
declare global {
  namespace Express {
    interface Request {
      sessionId?: string;
      user?: any;
    }
  }
}

export async function sessionTracking(req: Request, res: Response, next: NextFunction) {
  try {
    // Get or create session ID from cookie
    let sessionId = req.cookies?.sessionId;
    
    if (!sessionId) {
      sessionId = uuidv4();
      res.cookie("sessionId", sessionId, {
        maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
        httpOnly: true,
        sameSite: "lax"
      });
    }
    
    req.sessionId = sessionId;
    
    // Find or create user
    let user = await User.findOne({ sessionId });
    
    if (!user) {
      user = await User.create({
        sessionId,
        ipAddress: req.ip || req.headers['x-forwarded-for'] as string || 'unknown',
        userAgent: req.headers['user-agent'] || 'unknown'
      });
      console.log(`✅ New user created: ${sessionId}`);
    } else {
      // Update last active
      user.lastActive = new Date();
      await user.save();
    }
    
    req.user = user;
    
    // Track in hourly analytics (non-blocking)
    trackAnalytics(sessionId).catch(err => console.error("Analytics error:", err));
    
    next();
  } catch (error) {
    console.error("Session tracking error:", error);
    // Don't block the request even if tracking fails
    next();
  }
}

async function trackAnalytics(sessionId: string) {
  // Round to nearest hour
  const now = new Date();
  const hour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), 0, 0, 0);
  
  // Update or create hourly analytics
  await Analytics.findOneAndUpdate(
    { hour },
    {
      $inc: { "visitors.total": 1 },
      $addToSet: { "visitors.unique": sessionId }
    },
    { upsert: true, new: true }
  );
}

export async function trackVideoWatch(sessionId: string, videoId: string, platform: string, title: string) {
  try {
    // Add to user's watch history
    await User.findOneAndUpdate(
      { sessionId },
      {
        $push: {
          watchHistory: {
            $each: [{
              videoId,
              videoTitle: title,
              platform,
              watchedAt: new Date()
            }],
            $slice: -100 // Keep only last 100 watches
          }
        }
      }
    );
    
    // Track in hourly analytics
    const now = new Date();
    const hour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), 0, 0, 0);
    
    await Analytics.findOneAndUpdate(
      { hour },
      {
        $inc: {
          "videos.totalViews": 1,
          "videos.watched.$[elem].count": 1
        }
      },
      {
        arrayFilters: [{ "elem.videoId": videoId }],
        upsert: true
      }
    );
  } catch (error) {
    console.error("Track video watch error:", error);
  }
}

