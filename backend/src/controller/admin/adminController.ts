import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import Admin from "../../models/Admin";
import User from "../../models/User";
import Comment from "../../models/Comment";
import Like from "../../models/Like";
import Analytics from "../../models/Analytics";

const JWT_SECRET = process.env.JWT_SECRET || "rizhub-super-secret-key-2025";

// Admin Login
export async function adminLogin(req: Request, res: Response) {
  try {
    const { username, password } = req.body;
    
    console.log("🔐 Login attempt:");
    console.log("   Username:", username);
    console.log("   Password length:", password?.length);
    
    if (!username || !password) {
      return res.status(400).json({ success: false, message: "Username and password required" });
    }
    
    // Find admin
    const admin = await Admin.findOne({ username });
    if (!admin) {
      console.log("❌ Admin not found in database");
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
    
    console.log("✅ Admin found:", admin.username);
    
    // Check password
    const isMatch = await admin.comparePassword(password);
    console.log("🔑 Password match:", isMatch);
    
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
    
    // Update last login
    admin.lastLogin = new Date();
    await admin.save();
    
    // Generate JWT
    const token = jwt.sign(
      { id: admin._id, username: admin.username, role: admin.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    
    res.json({
      success: true,
      token,
      admin: {
        username: admin.username,
        role: admin.role,
        lastLogin: admin.lastLogin
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// Get Dashboard Overview
export async function getDashboard(req: Request, res: Response) {
  try {
    // Get current hour analytics
    const now = new Date();
    const currentHour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), 0, 0, 0);
    
    // Get stats for last 24 hours
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const hourlyStats = await Analytics.find({
      hour: { $gte: last24Hours }
    }).sort({ hour: 1 });
    
    // Total users
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({
      lastActive: { $gte: new Date(now.getTime() - 60 * 60 * 1000) } // Last hour
    });
    
    // Total interactions
    const totalComments = await Comment.countDocuments();
    const totalLikes = await Like.countDocuments();
    
    // Currently watching (users active in last 5 minutes)
    const currentlyWatching = await User.find({
      lastActive: { $gte: new Date(now.getTime() - 5 * 60 * 1000) }
    }).select('username watchHistory lastActive').limit(50);
    
    // Most watched videos (last 24h)
    const mostWatched = await User.aggregate([
      { $unwind: "$watchHistory" },
      {
        $match: {
          "watchHistory.watchedAt": { $gte: last24Hours }
        }
      },
      {
        $group: {
          _id: "$watchHistory.videoId",
          title: { $first: "$watchHistory.videoTitle" },
          platform: { $first: "$watchHistory.platform" },
          views: { $sum: 1 }
        }
      },
      { $sort: { views: -1 } },
      { $limit: 10 }
    ]);
    
    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          activeUsers,
          totalComments,
          totalLikes
        },
        hourlyStats,
        currentlyWatching,
        mostWatched
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// Get User List with Filters
export async function getUsers(req: Request, res: Response) {
  try {
    const { page = 1, limit = 50, sortBy = "lastActive" } = req.query;
    
    const users = await User.find()
      .sort({ [sortBy as string]: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .select('-__v');
    
    const total = await User.countDocuments();
    
    res.json({
      success: true,
      data: users,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// Get User Activity Details
export async function getUserActivity(req: Request, res: Response) {
  try {
    const { sessionId } = req.params;
    
    const user = await User.findOne({ sessionId });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
    // Get user's comments
    const comments = await Comment.find({ sessionId })
      .sort({ createdAt: -1 })
      .limit(20);
    
    // Get user's likes
    const likes = await Like.find({ sessionId })
      .sort({ createdAt: -1 })
      .limit(20);
    
    res.json({
      success: true,
      data: {
        user,
        recentComments: comments,
        recentLikes: likes
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// Get All Comments (for moderation)
export async function getAllComments(req: Request, res: Response) {
  try {
    const { page = 1, limit = 50 } = req.query;
    
    const comments = await Comment.find()
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));
    
    const total = await Comment.countDocuments();
    
    res.json({
      success: true,
      data: comments,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// Delete Comment (moderation)
export async function deleteComment(req: Request, res: Response) {
  try {
    const { commentId } = req.params;
    
    const comment = await Comment.findByIdAndDelete(commentId);
    if (!comment) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }
    
    res.json({ success: true, message: "Comment deleted" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// Get Analytics (detailed)
export async function getAnalytics(req: Request, res: Response) {
  try {
    const { startDate, endDate } = req.query;
    
    const start = startDate ? new Date(startDate as string) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate as string) : new Date();
    
    const analytics = await Analytics.find({
      hour: { $gte: start, $lte: end }
    }).sort({ hour: 1 });
    
    // Calculate totals
    const totals = analytics.reduce((acc, curr) => {
      return {
        visitors: acc.visitors + curr.visitors.total,
        uniqueVisitors: acc.uniqueVisitors + curr.visitors.unique.length,
        views: acc.views + curr.videos.totalViews,
        comments: acc.comments + curr.interactions.comments,
        likes: acc.likes + curr.interactions.likes,
        unlikes: acc.unlikes + curr.interactions.unlikes
      };
    }, { visitors: 0, uniqueVisitors: 0, views: 0, comments: 0, likes: 0, unlikes: 0 });
    
    res.json({
      success: true,
      data: {
        analytics,
        totals,
        period: {
          start,
          end,
          hours: analytics.length
        }
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

