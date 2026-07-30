import { supabase } from "@/supabase/client";
import { Flat } from "@/types/flat";

export async function uploadFlats(flats: Flat[]) {
  const { data, error } = await supabase
    .from("flats")
    .insert(flats)
    .select();

  if (error) {
    console.log("Supabase Error:", JSON.stringify(error, null, 2));
    throw error;
  }

  return data;
}