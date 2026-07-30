import { supabase } from "@/supabase/client";

export async function getBuildingCollection() {
  const { data, error } = await supabase
    .from("flats")
    .select(
      "building_no, building_type, subscription_amount, status"
    );

  if (error) throw error;

  const grouped: Record<
    string,
    {
      building: string;
      collection: number;
      paid: number;
      pending: number;
    }
  > = {};

  data.forEach((flat: any) => {
    const key = `${flat.building_type}-${flat.building_no}`;

    if (!grouped[key]) {
      grouped[key] = {
        building: key,
        collection: 0,
        paid: 0,
        pending: 0,
      };
    }

    if (flat.status === "Paid") {
      grouped[key].paid++;
      grouped[key].collection +=
        flat.subscription_amount || 0;
    } else {
      grouped[key].pending++;
    }
  });

  return Object.values(grouped).sort((a, b) =>
    a.building.localeCompare(b.building)
  );
}