import { createSupabaseUser } from "../config/supabaseUser.ts";
import { supabase } from "../config/supabase.ts";

export const profileService =  {

    async getProfile(userId: string, token: string) {
         const supabaseUser = createSupabaseUser(token);

         return await supabaseUser
         .from("profiles")
         .select("name")
         .eq("id", userId)
         .maybeSingle();
    },

    async updateName(userId: string, data: { name?: string }, token: string) {
         const supabaseUser = createSupabaseUser(token);
     
         return await supabaseUser
         .from("profiles")
         .update(data)
         .eq("id", userId)
         .select()
         .maybeSingle();
         
    },

    async updateAuth(userId: string, data: {email?: string, password?: string}) {

        return await supabase.auth.admin.updateUserById(userId, data);
    }

}