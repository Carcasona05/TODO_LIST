import { createSupabaseUser } from "../config/supabaseUser.ts";

interface UpdateTaskInput {
    title?: string;
    description?: string;
    is_completed?: boolean;
    due_date?: string;
}

export const TaskService = {
    async getTasks(userId: string, token: string) {
        const supabaseUser = createSupabaseUser(token);

        return supabaseUser.from("tasks").select("*").eq("user_id", userId);
    },

    async createTask(userId: string, text: string, token: string) {
        
        const supabaseUser = createSupabaseUser(token);

        return supabaseUser.from("tasks").insert({
            user_id: userId,
            text
        })
        .select()
        .single();
    },

    async updateTask(id: string, userId: string, data: UpdateTaskInput, token: string){
        const supabaseUser = createSupabaseUser(token);
        return supabaseUser
        .from("tasks")
        .update(data)
        .eq("id", id)
        .eq("user_id", userId);
    },

    async deleteTask(id: string, userId: string, token: string){
        const supabaseUser = createSupabaseUser(token);

        return supabaseUser
        .from("tasks")
        .delete()
        .eq("id", id)
        .eq("user_id", userId)
    },
};