import { supabase } from "@/supabase/client";
import { getLoggedInUser } from "@/services/authService";

export async function addDonation(values: {
  donor_name: string;
  amount: number;
  flat_number: string;
  mobile_number: string;
  bill_number: string;
  payment_mode: string;
}) {
  const user = getLoggedInUser();

  if (!user) {
    throw new Error("User not logged in.");
  }

  const donorName = values.donor_name.trim();
  const flatNumber = values.flat_number.trim();
  const mobileNumber = values.mobile_number.trim();
  const billNumber = values.bill_number.trim();
  const paymentMode = values.payment_mode.trim();

  if (!donorName) {
    throw new Error("Donor Name is required.");
  }

  if (!values.amount || values.amount <= 0) {
    throw new Error(
      "Donation amount must be greater than zero."
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

  const now = new Date();

  const { data, error } = await supabase
    .from("donations")
    .insert({
      donor_name: donorName,
      amount: values.amount,
      flat_number: flatNumber,
      mobile_number: mobileNumber,
      bill_number: billNumber,
      payment_mode: paymentMode,

      collected_by: user.username,
      created_by: user.username,
      updated_by: user.username,

      donation_date:
        now.toISOString().split("T")[0],

      donation_timestamp:
        now.toISOString(),

      updated_at:
        now.toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error(
      "Donation insert error:",
      error
    );

    throw error;
  }

  return data;
}

export async function getDonations() {
  const { data, error } = await supabase
    .from("donations")
    .select("*")
    .order("donation_timestamp", {
      ascending: false,
    });

  if (error) {
    console.error(
      "Donation fetch error:",
      error
    );

    throw error;
  }

  return data ?? [];
}

export async function getDonationById(
  donationId: string
) {
  const { data, error } = await supabase
    .from("donations")
    .select("*")
    .eq("id", donationId)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateDonation(
  donationId: string,
  values: {
    donor_name: string;
    amount: number;
    flat_number: string;
    mobile_number: string;
    bill_number: string;
    payment_mode: string;
  }
) {
  const user = getLoggedInUser();

  if (!user) {
    throw new Error("User not logged in.");
  }

  const {
    data: existingDonation,
    error: fetchError,
  } = await supabase
    .from("donations")
    .select("created_by")
    .eq("id", donationId)
    .single();

  if (fetchError) {
    throw fetchError;
  }

  if (!existingDonation) {
    throw new Error(
      "Donation record not found."
    );
  }

  const isAdmin =
    user.role === "Admin";

  if (
    !isAdmin &&
    existingDonation.created_by !==
      user.username
  ) {
    throw new Error(
      "You are not allowed to edit this donation."
    );
  }

  const donorName =
    values.donor_name.trim();

  const mobileNumber =
    values.mobile_number.trim();

  if (!donorName) {
    throw new Error(
      "Donor Name is required."
    );
  }

  if (
    !values.amount ||
    values.amount <= 0
  ) {
    throw new Error(
      "Donation amount must be greater than zero."
    );
  }

  if (
    mobileNumber !== "" &&
    !/^\d{10}$/.test(
      mobileNumber
    )
  ) {
    throw new Error(
      "Mobile Number must contain exactly 10 digits."
    );
  }

  const { data, error } = await supabase
    .from("donations")
    .update({
      donor_name:
        donorName,

      amount:
        values.amount,

      flat_number:
        values.flat_number.trim(),

      mobile_number:
        mobileNumber,

      bill_number:
        values.bill_number.trim(),

      payment_mode:
        values.payment_mode.trim(),

      // Keep the original creator unchanged
      updated_by:
        user.username,

      updated_at:
        new Date().toISOString(),
    })
    .eq("id", donationId)
    .select()
    .single();

  if (error) {
    console.error(
      "Donation update error:",
      error
    );

    throw error;
  }

  return data;
}

export async function getDonationTotal() {
  const { data, error } = await supabase
    .from("donations")
    .select("amount");

  if (error) {
    throw error;
  }

  return (data ?? []).reduce(
    (sum, row) =>
      sum +
      Number(
        row.amount || 0
      ),
    0
  );
}