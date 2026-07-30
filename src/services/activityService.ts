import { supabase } from "@/supabase/client";

export async function addActivity(
  flatNumber: string,
  action: string,
  user: string
) {
  const { error } = await supabase
    .from("activity_logs")
    .insert([
      {
        flat_number: flatNumber,
        action,
        performed_by: user,
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