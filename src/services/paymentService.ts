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

  /*
   * Mandatory fields are now:
   *
   * Owner Name
   * Family Members
   * Subscription Amount
   * Payment Mode
   *
   * Mobile Number is OPTIONAL.
   */

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

  /*
   * A TRUE reset means:
   *
   * Status = Pending
   * AND
   * all mandatory fields are cleared.
   */
  const resettingToPending =
    values.status === "Pending" &&
    allMandatoryFieldsEmpty;

  // ============================================
  // Prevent partially completed Pending records
  // ============================================

  if (
    values.status === "Pending" &&
    !resettingToPending
  ) {
    throw new Error(
      "To reset a subscription you must clear ALL mandatory fields."
    );
  }

  // ============================================
  // Prevent incomplete Paid records
  // ============================================

  if (
    values.status === "Paid" &&
    !allMandatoryFieldsFilled
  ) {
    throw new Error(
      "All mandatory fields are required for a Paid subscription."
    );
  }

  // ============================================
  // Owner Name validation
  // ============================================

  if (
    values.status === "Paid" &&
    !/^[a-zA-Z\s]+$/.test(ownerName)
  ) {
    throw new Error(
      "Owner Name can contain alphabets and spaces only."
    );
  }

  // ============================================
  // Mobile Number validation
  //
  // Mobile is OPTIONAL.
  // But if entered, it must contain exactly
  // 10 digits.
  // ============================================

  if (
    mobileNumber !== "" &&
    !/^\d{10}$/.test(mobileNumber)
  ) {
    throw new Error(
      "Mobile Number must contain exactly 10 digits."
    );
  }

  // ============================================
  // Read latest database state before saving
  // ============================================

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

  // ============================================
  // Permission
  //
  // Paid records can only be edited/reset by:
  //
  // 1. Original collector
  // 2. Admin
  // ============================================

  if (
    isPaidRecord &&
    !isAdmin &&
    existingCollector !== user.username
  ) {
    throw new Error(
      "You are not allowed to edit this subscription."
    );
  }

  // ============================================
  // Determine collector
  // ============================================

  let collectedBy = existingCollector;

  if (resettingToPending) {
    collectedBy = "";
  } else if (isNewCollection) {
    collectedBy = user.username;
  } else if (!collectedBy) {
    collectedBy = user.username;
  }

  // ============================================
  // Build database payload
  // ============================================

  const payload = resettingToPending
    ? {
        /*
         * Completely release payment information.
         */

        owner_name: "",

        // Mobile is cleared automatically on reset.
        mobile_number: "",

        family_members: 0,

        subscription_amount: 0,

        payment_mode: "",

        receipt_number: "",

        transaction_id: "",

        status: "Pending",

        // Release ownership
        collected_by: "",

        created_by: null,

        payment_date: null,

        /*
         * IMPORTANT:
         *
         * Comments are NOT deleted when a flat is
         * reset.
         *
         * This allows the next volunteer to see
         * useful notes about the flat.
         */
        comments: comments,

        last_updated_by: user.username,

        updated_by: user.username,

        updated_at: new Date().toISOString(),
      }
    : {
        /*
         * Normal collection / edit
         */

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

        comments: comments,

        status: "Paid",

        collected_by: collectedBy,

        created_by:
          existingCollector ||
          user.username,

        /*
         * Set payment date for a new collection.
         *
         * Normal edits don't change the original
         * payment date.
         */
        payment_date:
          isNewCollection
            ? new Date()
                .toISOString()
                .split("T")[0]
            : undefined,

        last_updated_by:
          user.username,

        updated_by:
          user.username,

        updated_at:
          new Date().toISOString(),
      };

  // ============================================
  // Build update query
  // ============================================

  let updateQuery = supabase
    .from("flats")
    .update(payload)
    .eq("flat_number", flatNumber);

  /*
   * Atomic protection against two volunteers
   * collecting the same flat simultaneously.
   *
   * A new collection succeeds only if the
   * database still says Pending.
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
   * Protect Paid edits/reset from simultaneous
   * changes by another user.
   */

  if (isPaidRecord) {
    updateQuery = updateQuery
      .eq("status", "Paid")
      .eq(
        "collected_by",
        existingCollector
      );
  }

  // ============================================
  // Execute update
  // ============================================

  const { data, error } =
    await updateQuery.select();

  if (error) {
    console.error(
      "Payment update error:",
      error
    );

    throw error;
  }

  // ============================================
  // Detect simultaneous modification
  // ============================================

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

  // ============================================
  // Activity Log
  // ============================================

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
    /*
     * Activity log failure must not undo a
     * successful payment update.
     */

    console.warn(
      "Activity log failed",
      err
    );
  }

  return data;
}