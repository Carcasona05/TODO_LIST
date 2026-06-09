import type { Request, Response, NextFunction } from "express";
import { supabase } from "../config/supabase.ts";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.replace("Bearer ", "");

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    // attach user to request
    (req as any).user = data.user;

    next(); // ✅ allow access
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};