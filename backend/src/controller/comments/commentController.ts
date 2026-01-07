import { Request, Response } from "express";
import Comment from "../../models/Comment";
import User from "../../models/User";
import Analytics from "../../models/Analytics";

// Get comments for a video
export async function getComments(req: Request, res: Response) {
  try {
    const { videoId, platform } = req.query;
    
    if (!videoId) {
      return res.status(400).json({ success: false, message: "videoId required" });
    }
    
    const comments = await Comment.find({ videoId, platform })
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.json({
      success: true,
      data: comments,
      total: comments.length
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// Post a comment
export async function postComment(req: Request, res: Response) {
  try {
    const { videoId, platform, text } = req.body;
    const sessionId = req.sessionId;
    
    if (!sessionId || !videoId || !text) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }
    
    // Get user
    const user = await User.findOne({ sessionId });
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }
    
    // Create comment
    const comment = await Comment.create({
      videoId,
      platform: platform || "xvideos",
      sessionId,
      username: user.username,
      text: text.trim().substring(0, 1000) // Max 1000 chars
    });
    
    // Add comment ID to user
    await User.findOneAndUpdate(
      { sessionId },
      { $push: { comments: comment._id } }
    );
    
    // Track in analytics
    const now = new Date();
    const hour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), 0, 0, 0);
    await Analytics.findOneAndUpdate(
      { hour },
      { $inc: { "interactions.comments": 1 } },
      { upsert: true }
    );
    
    res.json({ success: true, data: comment });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// Like a comment
export async function likeComment(req: Request, res: Response) {
  try {
    const { commentId } = req.body;
    const sessionId = req.sessionId;
    
    if (!sessionId || !commentId) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }
    
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }
    
    // Check if already liked
    const alreadyLiked = comment.likedBy.includes(sessionId);
    
    if (alreadyLiked) {
      // Unlike
      await Comment.findByIdAndUpdate(commentId, {
        $inc: { likes: -1 },
        $pull: { likedBy: sessionId }
      });
      res.json({ success: true, action: "unliked", likes: comment.likes - 1 });
    } else {
      // Like
      await Comment.findByIdAndUpdate(commentId, {
        $inc: { likes: 1 },
        $addToSet: { likedBy: sessionId }
      });
      res.json({ success: true, action: "liked", likes: comment.likes + 1 });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// Reply to a comment
export async function replyComment(req: Request, res: Response) {
  try {
    const { commentId, text } = req.body;
    const sessionId = req.sessionId;
    
    if (!sessionId || !commentId || !text) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }
    
    const user = await User.findOne({ sessionId });
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }
    
    const comment = await Comment.findByIdAndUpdate(
      commentId,
      {
        $push: {
          replies: {
            sessionId,
            username: user.username,
            text: text.trim().substring(0, 500),
            createdAt: new Date()
          }
        }
      },
      { new: true }
    );
    
    if (!comment) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }
    
    res.json({ success: true, data: comment });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

