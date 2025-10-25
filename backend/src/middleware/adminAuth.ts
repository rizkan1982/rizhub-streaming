import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "rizhub-super-secret-key-2025";

export function adminAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    
    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    if (decoded.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid token" });
  }
}

