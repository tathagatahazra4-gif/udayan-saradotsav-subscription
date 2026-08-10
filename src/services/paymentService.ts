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
    comments: string;
    collected_by: string;
    status: string;
  }
) {
  const user = getLoggedInUser();

  if (!user) {
    throw new Error("User not logged in.");
  }

  const ownerName = values.owner_name.trim();
  const mobileNumber = values.mobile_number.trim();
  const paymentMode = values.payment_mode.trim();
  const comments = values.comments?.trim() ?? "";

  const allMandatoryFieldsEmpty =
    ownerName === "" &&
    values.family_members === 0 &&
    values.subscription_amount === 0 &&
    paymentMode === "";

  const allMandatoryFieldsFilled =
    ownerName !== "" &&
    values.family_members > 0 &&
    values.subscription_amount > 0 &&
    paymentMode !== "";

  const resettingToPending =
    values.status === "Pending" &&
    allMandatoryFieldsEmpty;

  if (
    values.status === "Pending" &&
    !resettingToPending
  ) {
    throw new Error(
      "To reset a subscription you must clear ALL mandatory fields."
    );
  }

  if (
    values.status === "Paid" &&
    !allMandatoryFieldsFilled
  ) {
    throw new Error(
      "All mandatory fields are required for a Paid subscription."
    );
  }

  if (
    values.status === "Paid" &&
    !/^[a-zA-Z\s]+$/.test(ownerName)
  ) {
    throw new Error(
      "Owner Name can contain alphabets and spaces only."
    );
  }

  if (
    mobileNumber !== "" &&
    !/^\d{10}$/.test(mobileNumber)
  ) {
    throw new Error(
      "Mobile Number must contain exactly 10 digits."
    );
  }

  const {
    data: existingFlat,
    error: fetchError,
  } = await supabase
    .from("flats")
    .select("status, collected_by")
    .eq("flat_number", flatNumber)
    .single();

  if (fetchError) {
    throw fetchError;
  }

  if (!existingFlat) {
    throw new Error("Flat not found.");
  }

  const existingCollector =
    existingFlat.collected_by?.trim() || "";

  const isAdmin =
    user.role === "Admin";

  const isNewCollection =
    existingFlat.status === "Pending" &&
    values.status === "Paid";

  const isPaidRecord =
    existingFlat.status === "Paid";

  if (
    isPaidRecord &&
    !isAdmin &&
    existingCollector !== user.username
  ) {
    throw new Error(
      "You are not allowed to edit this subscription."
    );
  }

  let collectedBy = existingCollector;

  if (resettingToPending) {
    collectedBy = "";
  } else if (isNewCollection) {
    collectedBy = user.username;
  } else if (!collectedBy) {
    collectedBy = user.username;
  }

  const now = new Date();

  const payload = resettingToPending
    ? {
        owner_name: "",
        mobile_number: "",
        family_members: 0,
        subscription_amount: 0,
        payment_mode: "",
        receipt_number: "",
        transaction_id: "",
        status: "Pending",

        collected_by: "",
        created_by: null,

        payment_date: null,

        // Clear exact payment time when record is released
        payment_timestamp: null,

        // Keep comments even after reset
        comments,

        last_updated_by: user.username,
        updated_by: user.username,
        updated_at: now.toISOString(),
      }
    : {
        owner_name: ownerName,
        mobile_number: mobileNumber,
        family_members:
          values.family_members,
        subscription_amount:
          values.subscription_amount,
        payment_mode: paymentMode,
        receipt_number:
          values.receipt_number.trim(),
        transaction_id:
          values.transaction_id.trim(),
        comments,

        status: "Paid",

        collected_by: collectedBy,

        created_by:
          existingCollector ||
          user.username,

        // Set only when payment is collected for the first time
        payment_date:
          isNewCollection
            ? now
                .toISOString()
                .split("T")[0]
            : undefined,

        // Exact collection timestamp
        // Normal edits do NOT overwrite it
        payment_timestamp:
          isNewCollection
            ? now.toISOString()
            : undefined,

        last_updated_by:
          user.username,

        updated_by:
          user.username,

        updated_at:
          now.toISOString(),
      };

  let updateQuery = supabase
    .from("flats")
    .update(payload)
    .eq("flat_number", flatNumber);

  /*
   * Prevent two volunteers from collecting
   * the same Pending flat simultaneously.
   */
  if (isNewCollection) {
    updateQuery = updateQuery
      .eq("status", "Pending")
      .eq(
        "collected_by",
        existingCollector
      );
  }

  /*
   * Protect existing Paid records against
   * simultaneous changes.
   */
  if (isPaidRecord) {
    updateQuery = updateQuery
      .eq("status", "Paid")
      .eq(
        "collected_by",
        existingCollector
      );
  }

  const { data, error } =
    await updateQuery.select();

  if (error) {
    console.error(
      "Payment update error:",
      error
    );

    throw error;
  }

  if (!data || data.length === 0) {
    if (isNewCollection) {
      throw new Error(
        "This flat has already been collected by another volunteer. Please refresh and check the record."
      );
    }

    throw new Error(
      "This record was changed by another user. Please refresh and try again."
    );
  }

  const action = resettingToPending
    ? "RESET SUBSCRIPTION"
    : isNewCollection
    ? "COLLECTED SUBSCRIPTION"
    : "UPDATED SUBSCRIPTION";

  const description = resettingToPending
    ? `Subscription reset by ${user.username}`
    : `₹${values.subscription_amount} | ${values.payment_mode} | Updated by ${user.username}`;

  try {
    await addActivity(
      flatNumber,
      action,
      description
    );
  } catch (err) {
    console.warn(
      "Activity log failed",
      err
    );
  }

  return data;
}