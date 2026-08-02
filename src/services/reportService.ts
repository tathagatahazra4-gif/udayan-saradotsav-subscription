import { supabase } from "@/supabase/client";
import { getLoggedInUser } from "@/services/authService";

export async function getReportData() {
  const user = getLoggedInUser();

  let query = supabase
    .from("flats")
    .select("*")
    .order("flat_number", { ascending: true });

  // Volunteers can see only their own collections.
  // Admin can see everything.
  if (user?.role !== "Admin") {
    query = query.eq(
      "collected_by",
      user?.username
    );
  }

  const { data, error } = await query;

  if (error) throw error;

  return data ?? [];
}

export async function getVolunteerCollectionReport() {
  const { data, error } = await supabase
    .from("flats")
    .select(
      "collected_by, subscription_amount, status"
    );

  if (error) throw error;

  const summary: Record<
    string,
    {
      volunteer: string;
      amount: number;
      flats: number;
    }
  > = {};

  (data ?? []).forEach((row) => {
    if (
      row.status !== "Paid" ||
      !row.collected_by
    )
      return;

    const volunteer = row.collected_by;

    if (!summary[volunteer]) {
      summary[volunteer] = {
        volunteer,
        amount: 0,
        flats: 0,
      };
    }

    summary[volunteer].amount += Number(
      row.subscription_amount || 0
    );

    summary[volunteer].flats += 1;
  });

  return Object.values(summary).sort(
    (a, b) => b.amount - a.amount
  );
}