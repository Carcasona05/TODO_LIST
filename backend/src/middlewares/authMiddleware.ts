import type { Request, Response, NextFunction } from "express";
import type { User } from "@supabase/supabase-js";
import { supabase } from "../config/supabase.ts";

export const authMiddleware = async (
  req: Request & { user?: User; token?: string },
  res: Response,
  next: NextFunction
) => {
  
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "No token provided" });
    }

    const [type, token] = authHeader.split(" ");

    if (type !== "Bearer" || !token) {
      return res.status(401).json({ error: "Invalid token format" });
    }

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    // attach user to request
    req.user = data.user;
    req.token = token;

    next(); 
    
  } catch (err) {
    res.status(500).json({ error: err });
  }
};