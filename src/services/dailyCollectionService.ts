import { supabase } from "@/supabase/client";

export async function getDailyCollection(
  selectedDate: string
) {
  const { data, error } = await supabase
    .from("flats")
    .select(`
      flat_number,
      owner_name,
      subscription_amount,
      payment_mode,
      collected_by,
      receipt_number,
      transaction_id,
      payment_date,
      payment_timestamp,
      updated_at,
      status
    `)
    .eq("status", "Paid")
    .eq("payment_date", selectedDate)
    .order("payment_timestamp", {
      ascending: false,
      nullsFirst: false,
    });

  if (error) {
    console.error(
      "Daily Collection Error:",
      error
    );
    throw error;
  }

  const collections =
    (data ?? []).map((flat) => ({
      ...flat,
      payment_timestamp:
        flat.payment_timestamp ??
        flat.updated_at ??
        null,
    }));

  const totalCollection = collections.reduce(
    (sum, flat) =>
      sum + Number(flat.subscription_amount || 0),
    0
  );

  const volunteerSummary: Record<
    string,
    {
      volunteer: string;
      flats: number;
      amount: number;
    }
  > = {};

  collections.forEach((flat) => {
    const volunteer =
      flat.collected_by || "Unknown";

    if (!volunteerSummary[volunteer]) {
      volunteerSummary[volunteer] = {
        volunteer,
        flats: 0,
        amount: 0,
      };
    }

    volunteerSummary[volunteer].flats += 1;

    volunteerSummary[volunteer].amount += Number(
      flat.subscription_amount || 0
    );
  });

  return {
    collections,

    totalCollection,

    totalFlats: collections.length,

    totalVolunteers: Object.keys(
      volunteerSummary
    ).length,

    volunteerSummary: Object.values(
      volunteerSummary
    ).sort((a, b) => b.amount - a.amount),
  };
}