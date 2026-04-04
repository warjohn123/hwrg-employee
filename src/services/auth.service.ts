import { supabase } from "../lib/supabase";
import { fetchUserDetails } from "./user.service";

export async function loginUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Login error:", error.message);
    throw error.message;
  }

  const user = await fetchUserDetails(data.user.id);

  if (!user?.is_active) {
    await supabase.auth.signOut();
    throw "Access denied";
  }

  return data;
}
