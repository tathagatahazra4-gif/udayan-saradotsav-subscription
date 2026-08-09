import { supabase } from "@/supabase/client";
import { getLoggedInUser } from "@/services/authService";
import { addActivity } from "@/services/activityService";

export async function saveFlatComment(
  flatNumber: string,
  comments: string
) {
  const user = getLoggedInUser();

  if (!user) {
    throw new Error("User not logged in.");
  }

  const { data, error } = await supabase
    .from("flats")
    .update({
      comments: comments.trim(),
      last_updated_by: user.username,
      updated_by: user.username,
      updated_at: new Date().toISOString(),
    })
    .eq("flat_number", flatNumber)
    .select("flat_number, comments")
    .single();

  if (error) {
    console.error(
      "Failed to save flat comment:",
      error
    );

    throw error;
  }

  try {
    await addActivity(
      flatNumber,
      "COMMENT UPDATED",
      `Flat comment updated by ${user.username}`
    );
  } catch (err) {
    console.warn(
      "Comment activity log failed:",
      err
    );
  }

  return data;
}