import { supabase } from "@/supabase/client";

export async function getBuildingFlats(building: string) {
  const [type, number] = building.split("-");

  const { data, error } = await supabase
    .from("flats")
    .select("*")
    .eq("building_type", type)
    .eq("building_no", Number(number))
    .order("flat_number");

  if (error) throw error;

  return data ?? [];
}