import { supabase } from "@/supabase/client";
import { getLoggedInUser } from "./authService";

export async function addActivity(
  flatNumber: string,
  action: string,
  description: string
) {
  const user = getLoggedInUser();

  if (!user) return;

  const { error } = await supabase
    .from("activity_logs")
    .insert([
      {
        flat_number: flatNumber,
        username: user.username,
        performed_by: user.username,
        action,
        description,
        created_at: new Date().toISOString(),
      },
    ]);

  if (error) throw error;
}

export async function logLogin(username: string) {
  const { error } = await supabase
    .from("activity_logs")
    .insert([
      {
        flat_number: "-",
        username,
        performed_by: username,
        action: "LOGIN",
        description: `${username} logged in`,
        created_at: new Date().toISOString(),
      },
    ]);

  if (error) throw error;
}

export async function logLogout(username: string) {
  const { error } = await supabase
    .from("activity_logs")
    .insert([
      {
        flat_number: "-",
        username,
        performed_by: username,
        action: "LOGOUT",
        description: `${username} logged out`,
        created_at: new Date().toISOString(),
      },
    ]);

  if (error) throw error;
}

export async function getActivities() {
  const { data, error } = await supabase
    .from("activity_logs")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (error) throw error;

  return data ?? [];
}