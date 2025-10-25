import mongoose, { Schema, Document } from "mongoose";

export interface ILike extends Document {
  videoId: string;
  platform: string;
  sessionId: string;
  createdAt: Date;
}

const LikeSchema: Schema = new Schema({
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
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to prevent duplicate likes
LikeSchema.index({ videoId: 1, sessionId: 1 }, { unique: true });
LikeSchema.index({ createdAt: -1 });

export default mongoose.model<ILike>("Like", LikeSchema);

