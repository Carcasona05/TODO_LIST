import type { Request, Response } from "express";
import { supabase } from "../config/supabase.ts";
import type { User } from "@supabase/supabase-js";
import { profileService } from "../services/profileService.ts";

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

export const getProfile = async (req: Request & {user?: User; token: string}, res: Response) => {
  const user = req.user;
  
  if(!user){
    return res.status(401).json({ error: "Unauthorized" });
  }
  const { data, error } = await profileService.getProfile(user.id, req.token);

  if (error) return res.status(400).json({ error });
  res.json({
    name: data?.name ?? "",
    email: user.email,
  });
};

export const updateAccount = async (req: Request & {user?: User; token: string}, res: Response) => {
  const user = req.user;
  if (!user){
    return res.status(401).json({ error: "Unauthorized" });
  }

  const {name, email, password} = req.body;
  let updatedAuthData = null;

  if (name) {
    await profileService.updateName(user.id, { name }, req.token);
  }

  if (email || password) {
    const { data, error } = await profileService.updateAuth(user.id, { email, password });
    
    if (error) return res.status(400).json({ error: error.message });
    
    updatedAuthData = data;
  }

  res.json({
    message: "Account updated successfully",
    profile: name ? { name } : null,
    auth: updatedAuthData,
  });
};
