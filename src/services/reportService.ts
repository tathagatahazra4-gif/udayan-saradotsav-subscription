
import { supabase } from "@/supabase/client";

export async function getReportData() {
  const { data, error } = await supabase
    .from("flats")
    .select("*")
    .order("flat_number", { ascending: true });

  if (error) throw error;

  return data ?? [];
}