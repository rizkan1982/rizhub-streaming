import { Request, Response } from "express";
import Like from "../../models/Like";
import User from "../../models/User";
import Analytics from "../../models/Analytics";

// Get likes count for a video
export async function getLikes(req: Request, res: Response) {
  try {
    const { videoId } = req.query;
    const sessionId = req.sessionId;
    
    if (!videoId) {
      return res.status(400).json({ success: false, message: "videoId required" });
    }
    
    const count = await Like.countDocuments({ videoId });
    const userLiked = sessionId ? await Like.exists({ videoId, sessionId }) : false;
    
    res.json({
      success: true,
      data: {
        count,
        liked: !!userLiked
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// Toggle like on a video
export async function toggleLike(req: Request, res: Response) {
  try {
    const { videoId, platform } = req.body;
    const sessionId = req.sessionId;
    
    if (!sessionId || !videoId) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }
    
    // Check if already liked
    const existingLike = await Like.findOne({ videoId, sessionId });
    
    const now = new Date();
    const hour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), 0, 0, 0);
    
    if (existingLike) {
      // Unlike
      await Like.deleteOne({ videoId, sessionId });
      await User.findOneAndUpdate(
        { sessionId },
        { $pull: { likes: videoId } }
      );
      
      // Track unlike
      await Analytics.findOneAndUpdate(
        { hour },
        { $inc: { "interactions.unlikes": 1 } },
        { upsert: true }
      );
      
      const count = await Like.countDocuments({ videoId });
      res.json({ success: true, action: "unliked", count, liked: false });
    } else {
      // Like
      await Like.create({
        videoId,
        platform: platform || "xvideos",
        sessionId
      });
      await User.findOneAndUpdate(
        { sessionId },
        { $addToSet: { likes: videoId } }
      );
      
      // Track like
      await Analytics.findOneAndUpdate(
        { hour },
        { $inc: { "interactions.likes": 1 } },
        { upsert: true }
      );
      
      const count = await Like.countDocuments({ videoId });
      res.json({ success: true, action: "liked", count, liked: true });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

