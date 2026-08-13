import { supabase } from "@/supabase/client";

export async function getBuildingCollection() {
  const { data, error } = await supabase
    .from("flats")
    .select(
      "building_no, building_type, subscription_amount, status, payment_mode"
    );

  if (error) {
    throw error;
  }

  if (!data || data.length === 0) {
    return [];
  }

  const grouped: Record<string, any> = {};

  data.forEach((flat: any) => {
    const bType =
      flat.building_type || "UG";

    const bNo =
      flat.building_no || "0";

    const key =
      `${bType}-${bNo}`;

    if (!grouped[key]) {
      grouped[key] = {
        building: key,

        collection: 0,

        paid: 0,

        pending: 0,

        cashCount: 0,

        upiCount: 0,

        cashCollection: 0,

        upiCollection: 0,
      };
    }

    const isPaid =
      flat.status?.toLowerCase() ===
      "paid";

    if (isPaid) {
      const amount =
        Number(
          flat.subscription_amount
        ) || 0;

      grouped[key].paid += 1;

      grouped[key].collection +=
        amount;

      // Cash
      if (
        flat.payment_mode ===
        "Cash"
      ) {
        grouped[key].cashCount += 1;

        grouped[key].cashCollection +=
          amount;
      }

      // UPI
      if (
        flat.payment_mode ===
        "UPI"
      ) {
        grouped[key].upiCount += 1;

        grouped[key].upiCollection +=
          amount;
      }
    } else {
      grouped[key].pending += 1;
    }
  });

  return Object.values(
    grouped
  ).sort(
    (a: any, b: any) =>
      a.building.localeCompare(
        b.building
      )
  );
}