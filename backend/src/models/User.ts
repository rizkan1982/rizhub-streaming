import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  sessionId: string;
  username: string; // Anonymous username like "Anonymous_1234"
  watchHistory: Array<{
    videoId: string;
    videoTitle: string;
    platform: string;
    watchedAt: Date;
    duration: number; // seconds watched
  }>;
  watchlist: Array<{
    videoId: string;
    videoTitle: string;
    platform: string;
    addedAt: Date;
  }>;
  likes: string[]; // Video IDs
  comments: string[]; // Comment IDs
  createdAt: Date;
  lastActive: Date;
  ipAddress: string;
  userAgent: string;
}

const UserSchema: Schema = new Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  username: {
    type: String,
    required: true,
    default: function() {
      return `Anonymous_${Math.random().toString(36).substr(2, 9)}`;
    }
  },
  watchHistory: [{
    videoId: String,
    videoTitle: String,
    platform: String,
    watchedAt: { type: Date, default: Date.now },
    duration: { type: Number, default: 0 }
  }],
  watchlist: [{
    videoId: String,
    videoTitle: String,
    platform: String,
    addedAt: { type: Date, default: Date.now }
  }],
  likes: [{ type: String }],
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  createdAt: { type: Date, default: Date.now },
  lastActive: { type: Date, default: Date.now },
  ipAddress: String,
  userAgent: String
});

// Index for fast queries
UserSchema.index({ createdAt: 1 });
UserSchema.index({ lastActive: 1 });

export default mongoose.model<IUser>("User", UserSchema);

