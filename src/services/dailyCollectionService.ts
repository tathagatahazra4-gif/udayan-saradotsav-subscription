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

  // ============================================
  // TOTAL COLLECTION
  // ============================================

  const totalCollection =
    collections.reduce(
      (sum, flat) =>
        sum +
        Number(
          flat.subscription_amount || 0
        ),
      0
    );

  // ============================================
  // CASH COLLECTION
  // ============================================

  const cashCollection =
    collections
      .filter(
        (flat) =>
          flat.payment_mode === "Cash"
      )
      .reduce(
        (sum, flat) =>
          sum +
          Number(
            flat.subscription_amount || 0
          ),
        0
      );

  // ============================================
  // UPI COLLECTION
  // ============================================

  const upiCollection =
    collections
      .filter(
        (flat) =>
          flat.payment_mode === "UPI"
      )
      .reduce(
        (sum, flat) =>
          sum +
          Number(
            flat.subscription_amount || 0
          ),
        0
      );

  // ============================================
  // VOLUNTEER SUMMARY
  // ============================================

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

    volunteerSummary[volunteer].amount +=
      Number(
        flat.subscription_amount || 0
      );
  });

  return {
    collections,

    totalCollection,

    cashCollection,

    upiCollection,

    totalFlats:
      collections.length,

    totalVolunteers:
      Object.keys(
        volunteerSummary
      ).length,

    volunteerSummary:
      Object.values(
        volunteerSummary
      ).sort(
        (a, b) =>
          b.amount - a.amount
      ),
  };
}