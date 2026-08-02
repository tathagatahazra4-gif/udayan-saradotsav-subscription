import { supabase } from "@/supabase/client";

export async function login(username: string, password: string) {
  const { data, error } = await supabase
    .from("committee_users")
    .select("*")
    .eq("username", username)
    .eq("password", password)
    .eq("active", true)
    .single();

  if (error || !data) {
    throw new Error("Invalid username or password.");
  }

  await supabase
    .from("committee_users")
    .update({
      last_login: new Date().toISOString(),
    })
    .eq("id", data.id);

  localStorage.setItem("committeeUser", JSON.stringify(data));

  return data;
}

export function getLoggedInUser() {
  if (typeof window === "undefined") return null;

  const user = localStorage.getItem("committeeUser");

  return user ? JSON.parse(user) : null;
}

export function logout() {
  localStorage.removeItem("committeeUser");
}