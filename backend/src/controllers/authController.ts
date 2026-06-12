import type { Request, Response } from "express";
import { supabase } from "../config/supabase.ts";

export const register = async (req: Request, res: Response) => {
 
  const { name, email, password } = req.body;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  });
  
  if (error) return res.status(400).json({ error: error.message });

  res.json({ message: "Registered", data });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return res.status(401).json({ error: error.message });

  res.json({
    message: "Login successful",
    session: data.session,
    user: data.user,
  });
};