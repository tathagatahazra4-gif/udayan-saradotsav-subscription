import { supabase } from "@/supabase/client";

export async function updatePayment(
  flatNumber: string,
  values: {
    owner_name: string;
    mobile_number: string;
    family_members: number;
    subscription_amount: number;
    payment_mode: string;
    receipt_number: string;
    transaction_id: string;
    collected_by: string;
    status: string;
  }
) {
  const { error } = await supabase
    .from("flats")
    .update({
      ...values,

      // Save only the DATE (YYYY-MM-DD)
      payment_date: new Date()
        .toISOString()
        .split("T")[0],

      // Save full timestamp
      updated_at: new Date().toISOString(),
    })
    .eq("flat_number", flatNumber);

  if (error) {
    console.error("Supabase Update Error:", error);
    throw error;
  }
}