import mongoose, { Schema, Document } from "mongoose";

export interface IComment extends Document {
  videoId: string;
  platform: string;
  sessionId: string;
  username: string;
  text: string;
  likes: number;
  likedBy: string[]; // Session IDs who liked this comment
  replies: Array<{
    sessionId: string;
    username: string;
    text: string;
    createdAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema: Schema = new Schema({
  videoId: {
    type: String,
    required: true,
    index: true
  },
  platform: {
    type: String,
    required: true
  },
  sessionId: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true,
    maxlength: 1000
  },
  likes: {
    type: Number,
    default: 0
  },
  likedBy: [{
    type: String
  }],
  replies: [{
    sessionId: String,
    username: String,
    text: { type: String, maxlength: 500 },
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for fast queries
CommentSchema.index({ videoId: 1, createdAt: -1 });
CommentSchema.index({ createdAt: -1 });

export default mongoose.model<IComment>("Comment", CommentSchema);

