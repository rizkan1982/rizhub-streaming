import mongoose, { Schema, Document } from "mongoose";

export interface IAnalytics extends Document {
  hour: Date; // Rounded to nearest hour
  visitors: {
    total: number;
    unique: string[]; // Session IDs
  };
  videos: {
    watched: Array<{
      videoId: string;
      platform: string;
      count: number;
    }>;
    totalViews: number;
  };
  interactions: {
    comments: number;
    likes: number;
    unlikes: number;
  };
  createdAt: Date;
}

const AnalyticsSchema: Schema = new Schema({
  hour: {
    type: Date,
    required: true,
    index: true
  },
  visitors: {
    total: { type: Number, default: 0 },
    unique: [{ type: String }]
  },
  videos: {
    watched: [{
      videoId: String,
      platform: String,
      count: { type: Number, default: 0 }
    }],
    totalViews: { type: Number, default: 0 }
  },
  interactions: {
    comments: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    unlikes: { type: Number, default: 0 }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Unique index on hour to prevent duplicates
AnalyticsSchema.index({ hour: 1 }, { unique: true });

export default mongoose.model<IAnalytics>("Analytics", AnalyticsSchema);

