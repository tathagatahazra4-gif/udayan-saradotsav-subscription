import { supabase } from "@/supabase/client";
import { getLoggedInUser } from "@/services/authService";

export async function addSponsor(values: {
  company_name: string;
  amount: number;
  payment_mode: string;
  cheque_number: string;
  voucher_id: string;
}) {
  const user = getLoggedInUser();

  if (!user) {
    throw new Error("User not logged in.");
  }

  const companyName =
    values.company_name.trim();

  const paymentMode =
    values.payment_mode.trim();

  const chequeNumber =
    values.cheque_number.trim();

  const voucherId =
    values.voucher_id.trim();

  if (!companyName) {
    throw new Error(
      "Company Name is required."
    );
  }

  if (
    !values.amount ||
    values.amount <= 0
  ) {
    throw new Error(
      "Amount must be greater than zero."
    );
  }

  if (!paymentMode) {
    throw new Error(
      "Payment Mode is required."
    );
  }

  const now = new Date();

  const { data, error } =
    await supabase
      .from("advertisement_sponsors")
      .insert({
        company_name: companyName,

        amount: values.amount,

        payment_mode: paymentMode,

        cheque_number: chequeNumber,

        voucher_id: voucherId,

        collected_by: user.username,

        created_by: user.username,

        updated_by: user.username,

        collection_date:
          now.toISOString().split("T")[0],

        collection_timestamp:
          now.toISOString(),

        updated_at:
          now.toISOString(),
      })
      .select()
      .single();

  if (error) {
    console.error(
      "Sponsor insert error:",
      error
    );

    throw error;
  }

  return data;
}

export async function getSponsors() {
  const { data, error } =
    await supabase
      .from("advertisement_sponsors")
      .select("*")
      .order(
        "collection_timestamp",
        {
          ascending: false,
        }
      );

  if (error) {
    console.error(
      "Sponsor fetch error:",
      error
    );

    throw error;
  }

  return data ?? [];
}

export async function getSponsorById(
  sponsorId: string
) {
  const { data, error } =
    await supabase
      .from("advertisement_sponsors")
      .select("*")
      .eq("id", sponsorId)
      .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateSponsor(
  sponsorId: string,
  values: {
    company_name: string;
    amount: number;
    payment_mode: string;
    cheque_number: string;
    voucher_id: string;
  }
) {
  const user = getLoggedInUser();

  if (!user) {
    throw new Error(
      "User not logged in."
    );
  }

  const {
    data: existingSponsor,
    error: fetchError,
  } = await supabase
    .from("advertisement_sponsors")
    .select("created_by")
    .eq("id", sponsorId)
    .single();

  if (fetchError) {
    throw fetchError;
  }

  if (!existingSponsor) {
    throw new Error(
      "Sponsor record not found."
    );
  }

  const isAdmin =
    user.role === "Admin";

  if (
    !isAdmin &&
    existingSponsor.created_by !==
      user.username
  ) {
    throw new Error(
      "You are not allowed to edit this sponsor record."
    );
  }

  const companyName =
    values.company_name.trim();

  const paymentMode =
    values.payment_mode.trim();

  const chequeNumber =
    values.cheque_number.trim();

  const voucherId =
    values.voucher_id.trim();

  if (!companyName) {
    throw new Error(
      "Company Name is required."
    );
  }

  if (
    !values.amount ||
    values.amount <= 0
  ) {
    throw new Error(
      "Amount must be greater than zero."
    );
  }

  if (!paymentMode) {
    throw new Error(
      "Payment Mode is required."
    );
  }

  const { data, error } =
    await supabase
      .from("advertisement_sponsors")
      .update({
        company_name: companyName,

        amount: values.amount,

        payment_mode: paymentMode,

        cheque_number: chequeNumber,

        voucher_id: voucherId,

        updated_by:
          user.username,

        updated_at:
          new Date().toISOString(),
      })
      .eq("id", sponsorId)
      .select()
      .single();

  if (error) {
    console.error(
      "Sponsor update error:",
      error
    );

    throw error;
  }

  return data;
}

export async function getSponsorTotal() {
  const { data, error } =
    await supabase
      .from("advertisement_sponsors")
      .select("amount");

  if (error) {
    throw error;
  }

  return (data ?? []).reduce(
    (sum, row) =>
      sum +
      Number(row.amount || 0),
    0
  );
}