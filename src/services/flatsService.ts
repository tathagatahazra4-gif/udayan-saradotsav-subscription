import { supabase } from "@/supabase/client";
import { getLoggedInUser } from "@/services/authService";

/**
 * Search a single flat by flat number
 */
export async function searchFlat(flatNumber: string) {
  const { data, error } = await supabase
    .from("flats")
    .select("*")
    .eq("flat_number", flatNumber.toUpperCase())
    .single();

  if (error) {
    throw error;
  }

  const user = getLoggedInUser();

  if (!user) {
    throw new Error("User not logged in.");
  }

  const isAdmin = user.role === "admin";

  const canEdit =
    isAdmin ||
    !data.collected_by ||
    data.collected_by === user.username;

  return {
    ...data,
    canEdit,
  };
}

/**
 * Get all flats
 */
export async function getAllFlats() {
  const { data, error } = await supabase
    .from("flats")
    .select("*")
    .order("flat_number", { ascending: true });

  if (error) {
    throw error;
  }

  return data ?? [];
}