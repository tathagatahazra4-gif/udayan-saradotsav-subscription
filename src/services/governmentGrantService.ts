import { supabase } from "@/supabase/client";
import { getLoggedInUser } from "@/services/authService";

export async function addGovernmentGrant(
  values: {
    amount: number;
    cheque_number: string;
    received_from: string;
  }
) {
  const user = getLoggedInUser();

  if (!user) {
    throw new Error("User not logged in.");
  }

  if (
    !values.amount ||
    values.amount <= 0
  ) {
    throw new Error(
      "Amount must be greater than zero."
    );
  }

  const chequeNumber =
    values.cheque_number.trim();

  const receivedFrom =
    values.received_from.trim();

  const now = new Date();

  const { data, error } =
    await supabase
      .from("government_grants")
      .insert({
        amount:
          values.amount,

        cheque_number:
          chequeNumber,

        received_from:
          receivedFrom,

        created_by:
          user.username,

        updated_by:
          user.username,

        received_date:
          now
            .toISOString()
            .split("T")[0],

        updated_at:
          now.toISOString(),
      })
      .select()
      .single();

  if (error) {
    console.error(
      "Government Grant insert error:",
      error
    );

    throw error;
  }

  return data;
}

export async function getGovernmentGrants() {
  const { data, error } =
    await supabase
      .from("government_grants")
      .select("*")
      .order("received_date", {
        ascending: false,
      });

  if (error) {
    console.error(
      "Government Grant fetch error:",
      error
    );

    throw error;
  }

  return data ?? [];
}

export async function getGovernmentGrantById(
  grantId: string
) {
  const { data, error } =
    await supabase
      .from("government_grants")
      .select("*")
      .eq("id", grantId)
      .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateGovernmentGrant(
  grantId: string,
  values: {
    amount: number;
    cheque_number: string;
    received_from: string;
  }
) {
  const user = getLoggedInUser();

  if (!user) {
    throw new Error(
      "User not logged in."
    );
  }

  const {
    data: existingGrant,
    error: fetchError,
  } = await supabase
    .from("government_grants")
    .select("created_by")
    .eq("id", grantId)
    .single();

  if (fetchError) {
    throw fetchError;
  }

  if (!existingGrant) {
    throw new Error(
      "Government Grant record not found."
    );
  }

  const isAdmin =
    user.role === "Admin";

  if (
    !isAdmin &&
    existingGrant.created_by !==
      user.username
  ) {
    throw new Error(
      "You are not allowed to edit this Government Grant record."
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

  const { data, error } =
    await supabase
      .from("government_grants")
      .update({
        amount:
          values.amount,

        cheque_number:
          values.cheque_number.trim(),

        received_from:
          values.received_from.trim(),

        updated_by:
          user.username,

        updated_at:
          new Date().toISOString(),
      })
      .eq("id", grantId)
      .select()
      .single();

  if (error) {
    console.error(
      "Government Grant update error:",
      error
    );

    throw error;
  }

  return data;
}

export async function getGovernmentGrantTotal() {
  const { data, error } =
    await supabase
      .from("government_grants")
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