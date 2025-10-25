import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IAdmin extends Document {
  username: string;
  password: string;
  role: string;
  createdAt: Date;
  lastLogin: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const AdminSchema: Schema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: "admin"
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
AdminSchema.pre("save", async function(this: any, next) {
  if (!this.isModified("password")) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password as string, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare password
AdminSchema.methods.comparePassword = async function(this: any, candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password as string);
};

export default mongoose.model<IAdmin>("Admin", AdminSchema);

