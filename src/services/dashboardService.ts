import { supabase } from "@/supabase/client";

import { getDonationTotal } from "@/services/donationService";
import { getSponsorTotal } from "@/services/sponsorService";
import { getGovernmentGrantTotal } from "@/services/governmentGrantService";

export async function getDashboardStats() {
  const { data, error } = await supabase
    .from("flats")
    .select(
      "status, subscription_amount, payment_date, payment_mode"
    );

  if (error) {
    throw error;
  }

  const flats = data ?? [];

  const totalFlats = flats.length;

  const paidFlats = flats.filter(
    (flat) => flat.status === "Paid"
  );

  const paidFlatsCount = paidFlats.length;

  const pendingFlats =
    totalFlats - paidFlatsCount;

  // ============================================
  // SUBSCRIPTION COLLECTION
  // ============================================

  const subscriptionCollection =
    paidFlats.reduce(
      (sum, flat) =>
        sum +
        Number(
          flat.subscription_amount || 0
        ),
      0
    );

  // ============================================
  // CASH COLLECTION
  // Subscription only
  // ============================================

  const cashCollection =
    paidFlats
      .filter(
        (flat) =>
          flat.payment_mode === "Cash"
      )
      .reduce(
        (sum, flat) =>
          sum +
          Number(
            flat.subscription_amount || 0
          ),
        0
      );

  // ============================================
  // UPI COLLECTION
  // Subscription only
  // ============================================

  const upiCollection =
    paidFlats
      .filter(
        (flat) =>
          flat.payment_mode === "UPI"
      )
      .reduce(
        (sum, flat) =>
          sum +
          Number(
            flat.subscription_amount || 0
          ),
        0
      );

  // ============================================
  // TODAY'S SUBSCRIPTION COLLECTION
  // ============================================

  const today =
    new Date()
      .toISOString()
      .split("T")[0];

  const todaysCollection =
    paidFlats
      .filter(
        (flat) =>
          flat.payment_date &&
          flat.payment_date.startsWith(
            today
          )
      )
      .reduce(
        (sum, flat) =>
          sum +
          Number(
            flat.subscription_amount || 0
          ),
        0
      );

  // ============================================
  // OTHER INCOME SOURCES
  // ============================================

  const [
    donationCollection,
    sponsorCollection,
    governmentGrantCollection,
  ] = await Promise.all([
    getDonationTotal(),
    getSponsorTotal(),
    getGovernmentGrantTotal(),
  ]);

  // ============================================
  // GRAND TOTAL
  //
  // Subscription
  // + Donations
  // + Sponsors / Advertisements
  // + Government Grants
  // ============================================

  const grandTotalCollection =
    subscriptionCollection +
    donationCollection +
    sponsorCollection +
    governmentGrantCollection;

  // ============================================
  // RETURN DASHBOARD STATS
  // ============================================

  return {
    totalFlats,

    paidFlats:
      paidFlatsCount,

    pendingFlats,

    // Keep this temporarily for any old components
    // still using stats.totalCollection
    totalCollection:
      subscriptionCollection,

    subscriptionCollection,

    donationCollection,

    sponsorCollection,

    governmentGrantCollection,

    grandTotalCollection,

    cashCollection,

    upiCollection,

    todaysCollection,

    collectionPercentage:
      totalFlats === 0
        ? 0
        : (
            (paidFlatsCount /
              totalFlats) *
            100
          ).toFixed(1),
  };
}