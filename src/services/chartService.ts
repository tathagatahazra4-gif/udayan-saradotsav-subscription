import { supabase } from "@/supabase/client";

export async function getBuildingCollection() {
  const { data, error } = await supabase
   .from("flats")
   .select("building_no, building_type, subscription_amount, status");

  if (error) throw error;
  if (!data || data.length === 0) return [];

  const grouped: Record<string, any> = {};

  data.forEach((flat: any) => {
    const bType = flat.building_type || "UG"; // fallback if null
    const bNo = flat.building_no || "0";
    const key = `${bType}-${bNo}`;

    if (!grouped[key]) {
      grouped[key] = {
        building: key,
        collection: 0,
        paid: 0,
        pending: 0,
      };
    }

    if (flat.status?.toLowerCase() === "paid") {
      grouped[key].paid++;
      grouped[key].collection += Number(flat.subscription_amount) || 0;
    } else {
      grouped[key].pending++;
    }
  });

  return Object.values(grouped).sort((a: any, b: any) =>
    a.building.localeCompare(b.building)
  );
}