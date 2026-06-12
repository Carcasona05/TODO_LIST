import type { Request, Response } from "express";
import { TaskService } from "../services/taskService.ts";
import type { User } from "@supabase/supabase-js";

export const TaskController = {
    async getTasks(req: Request & {user?: User; token: string} , res: Response) {
        const user = req.user;

        if (!user) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const { data, error } = await TaskService.getTasks(user.id, req.token);

        if (error) return res.status(400).json({ error });
        
        res.json(data);
    },

    async createTask(req: Request & {user?: User; token: string}, res: Response){
        const user = req.user;
        const { text } = req.body;

        if (!user){
            return res.status(401).json({ error: "Unauthorized" });
        }
        
        const { data, error } =  await TaskService.createTask(user.id, text, req.token);

        if (error) return res.status(400).json({ error });

        res.json(data);
    },

    async updateTask(req: Request & {user?: User; token: string}, res: Response){
        const user = req.user;
        const rawId = req.params.id;
        const id = Array.isArray(rawId) ? rawId[0]: rawId;

        if (!user) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        if (!id) {
            return res.status(400).json({ error: "Missing task id" });
        }

        const { data, error } = await TaskService.updateTask(id, user.id, req.body, req.token);

        if (error) return res.status(400).json({ error });

        res.json(data);
     },

     async deleteTask(req: Request & {user?: User; token: string}, res: Response){
        const user = req.user;
        const rawId = req.params.id;
        const id = Array.isArray(rawId) ? rawId[0]: rawId;

        if (!user) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        if (!id) {
            return res.status(400).json({ error: "Missing task id" });
        }

        const { data, error } = await TaskService.deleteTask(id,user.id, req.token);

        if (error) return res.status(400).json({ error });

        res.json({ message: "Deleted", data});
     }
}