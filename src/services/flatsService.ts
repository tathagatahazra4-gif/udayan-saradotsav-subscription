import { supabase } from "@/supabase/client";

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

  return data;
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