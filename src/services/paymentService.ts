import { supabase } from "@/supabase/client";
import { getLoggedInUser } from "@/services/authService";
import { addActivity } from "./activityService";

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
  const user = getLoggedInUser();

  if (!user) {
    throw new Error("User not logged in.");
  }

  // Fetch existing flat
  const { data: existingFlat, error: fetchError } = await supabase
    .from("flats")
    .select("status, collected_by")
    .eq("flat_number", flatNumber)
    .single();

  if (fetchError) throw fetchError;

  // Permission check
  if (
    user.role !== "Admin" &&
    existingFlat?.collected_by &&
    existingFlat.collected_by !== user.username
  ) {
    throw new Error(
      "You are not allowed to edit this subscription."
    );
  }

  // Preserve original collector
  const collectedBy =
    existingFlat?.collected_by &&
    existingFlat.collected_by.trim() !== ""
      ? existingFlat.collected_by
      : user.username;

  // Determine activity
  const action =
    existingFlat?.status === "Paid"
      ? "UPDATED SUBSCRIPTION"
      : "COLLECTED SUBSCRIPTION";

  const { error } = await supabase
    .from("flats")
    .update({
      owner_name: values.owner_name,
      mobile_number: values.mobile_number,
      family_members: values.family_members,
      subscription_amount: values.subscription_amount,
      payment_mode: values.payment_mode,
      receipt_number: values.receipt_number,
      transaction_id: values.transaction_id,
      status: values.status,

      collected_by: collectedBy,
      created_by: collectedBy,
      updated_by: user.username,

      payment_date: new Date()
        .toISOString()
        .split("T")[0],

      updated_at: new Date().toISOString(),
    })
    .eq("flat_number", flatNumber);

  if (error) {
    console.error(error);
    throw error;
  }

  await addActivity(
    flatNumber,
    action,
    `₹${values.subscription_amount} | ${values.payment_mode} | Updated by ${user.username}`
  );
}