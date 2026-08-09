import { supabase } from "@/supabase/client";
import { getLoggedInUser } from "@/services/authService";

/**
 * Get the comment for a building.
 * If the building does not have a comment yet,
 * return an empty comment object.
 */
export async function getBuildingComment(
  building: string
) {
  const { data, error } = await supabase
    .from("building_comments")
    .select(
      "building, comments, updated_by, updated_at"
    )
    .eq("building", building)
    .maybeSingle();

  if (error) {
    console.error(
      "Failed to load building comment:",
      error
    );
    throw error;
  }

  if (!data) {
    return {
      building,
      comments: "",
      updated_by: "",
      updated_at: null,
    };
  }

  return data;
}

/**
 * Save or update the comment for a building.
 *
 * Any logged-in user can update it.
 */
export async function saveBuildingComment(
  building: string,
  comments: string
) {
  const user = getLoggedInUser();

  if (!user) {
    throw new Error("User not logged in.");
  }

  const payload = {
    building,
    comments: comments.trim(),
    updated_by: user.username,
    updated_at: new Date().toISOString(),
  };

  /*
   * Upsert:
   *
   * If the building already exists,
   * update its comment.
   *
   * If it does not exist,
   * create a new row.
   */
  const { data, error } = await supabase
    .from("building_comments")
    .upsert(payload, {
      onConflict: "building",
    })
    .select()
    .single();

  if (error) {
    console.error(
      "Failed to save building comment:",
      error
    );
    throw error;
  }

  return data;
}