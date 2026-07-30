import { supabase } from "@/supabase/client";

export async function getRecentPayments() {
  const { data, error } = await supabase
    .from("flats")
    .select(
      "flat_number, owner_name, subscription_amount, payment_mode, collected_by, updated_at"
    )
    .eq("status", "Paid")
    .order("updated_at", { ascending: false })
    .limit(10);

  if (error) {
    throw error;
  }

  return data ?? [];
}