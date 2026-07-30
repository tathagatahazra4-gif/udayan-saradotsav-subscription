import { supabase } from "@/supabase/client";

export async function getDashboardStats() {
  const { data, error } = await supabase
    .from("flats")
    .select("status, subscription_amount, payment_date");

  if (error) throw error;

  const totalFlats = data.length;

  const paidFlats = data.filter(f => f.status === "Paid").length;

  const pendingFlats = totalFlats - paidFlats;

  const totalCollection = data
    .filter(f => f.status === "Paid")
    .reduce((sum, f) => sum + (f.subscription_amount || 0), 0);

  const today = new Date().toISOString().split("T")[0];

  const todaysCollection = data
    .filter(
      f =>
        f.payment_date &&
        f.payment_date.startsWith(today)
    )
    .reduce((sum, f) => sum + (f.subscription_amount || 0), 0);

  return {
    totalFlats,
    paidFlats,
    pendingFlats,
    totalCollection,
    todaysCollection,
    collectionPercentage:
      totalFlats === 0
        ? 0
        : ((paidFlats / totalFlats) * 100).toFixed(1),
  };
}