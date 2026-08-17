"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  FaFileExcel,
  FaMoneyBillWave,
  FaCheckCircle,
  FaTimesCircle,
  FaList,
  FaHandHoldingHeart,
  FaBullhorn,
  FaChartPie,
} from "react-icons/fa";

import AppLayout from "@/components/layout/AppLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

import { getReportData } from "@/services/reportService";

import {
  getDonations,
  getDonationTotal,
} from "@/services/donationService";

import {
  getSponsors,
  getSponsorTotal,
} from "@/services/sponsorService";

import {
  getGovernmentGrantTotal,
} from "@/services/governmentGrantService";

import {
  exportToExcel,
  exportDonationsToExcel,
  exportSponsorsToExcel,
  exportOverallCollectionSummary,
} from "@/services/exportService";

export default function ReportsPage() {
  const [
    rows,
    setRows,
  ] =
    useState<any[]>([]);

  const [
    donations,
    setDonations,
  ] =
    useState<any[]>([]);

  const [
    sponsors,
    setSponsors,
  ] =
    useState<any[]>([]);

  const [
    donationTotal,
    setDonationTotal,
  ] =
    useState(0);

  const [
    sponsorTotal,
    setSponsorTotal,
  ] =
    useState(0);

  const [
    governmentGrantTotal,
    setGovernmentGrantTotal,
  ] =
    useState(0);

  const [
    search,
    setSearch,
  ] =
    useState("");

  const [
    status,
    setStatus,
  ] =
    useState("All");

  const [
    loadingExports,
    setLoadingExports,
  ] =
    useState(true);

  const [
    exportingReport,
    setExportingReport,
  ] =
    useState<string | null>(
      null
    );

  useEffect(() => {
    async function load() {
      try {
        setLoadingExports(true);

        const [
          subscriptionData,
          donationData,
          sponsorData,
          donationAmount,
          sponsorAmount,
          governmentGrantAmount,
        ] =
          await Promise.all([
            getReportData(),

            getDonations(),

            getSponsors(),

            getDonationTotal(),

            getSponsorTotal(),

            getGovernmentGrantTotal(),
          ]);

        setRows(
          subscriptionData
        );

        setDonations(
          donationData
        );

        setSponsors(
          sponsorData
        );

        setDonationTotal(
          donationAmount
        );

        setSponsorTotal(
          sponsorAmount
        );

        setGovernmentGrantTotal(
          governmentGrantAmount
        );
      } catch (err) {
        console.error(
          "Failed to load report data:",
          err
        );
      } finally {
        setLoadingExports(false);
      }
    }

    load();
  }, []);

  const filtered =
    useMemo(() => {
      return rows.filter(
        (row) => {
          const keyword =
            search
              .trim()
              .toLowerCase();

          const flatNumber =
            String(
              row.flat_number ||
                ""
            ).toLowerCase();

          const ownerName =
            String(
              row.owner_name ||
                ""
            ).toLowerCase();

          const mobileNumber =
            String(
              row.mobile_number ||
                ""
            ).toLowerCase();

          const matchesSearch =
            !keyword ||
            flatNumber.includes(
              keyword
            ) ||
            ownerName.includes(
              keyword
            ) ||
            mobileNumber.includes(
              keyword
            );

          const matchesStatus =
            status === "All" ||
            row.status ===
              status;

          return (
            matchesSearch &&
            matchesStatus
          );
        }
      );
    }, [
      rows,
      search,
      status,
    ]);

  // ============================================
  // FILTERED SUBSCRIPTION TOTAL
  // ============================================

  const totalCollection =
    filtered
      .filter(
        (row) =>
          row.status ===
          "Paid"
      )
      .reduce(
        (
          sum,
          row
        ) =>
          sum +
          Number(
            row.subscription_amount ||
              0
          ),
        0
      );

  // ============================================
  // FULL SUBSCRIPTION TOTAL
  // ============================================

  const subscriptionTotal =
    rows
      .filter(
        (row) =>
          row.status ===
          "Paid"
      )
      .reduce(
        (
          sum,
          row
        ) =>
          sum +
          Number(
            row.subscription_amount ||
              0
          ),
        0
      );

  const paidCount =
    filtered.filter(
      (row) =>
        row.status ===
        "Paid"
    ).length;

  const pendingCount =
    filtered.filter(
      (row) =>
        row.status ===
        "Pending"
    ).length;

  const grandTotal =
    subscriptionTotal +
    donationTotal +
    sponsorTotal +
    governmentGrantTotal;

  const formatAmount = (
    amount: number
  ) =>
    Number(
      amount || 0
    ).toLocaleString(
      "en-IN"
    );

  // ============================================
  // EXPORT HANDLERS
  // ============================================

  function finishExport() {
    window.setTimeout(
      () => {
        setExportingReport(
          null
        );
      },
      500
    );
  }

  function handleSubscriptionExport() {
    if (
      loadingExports ||
      exportingReport
    ) {
      return;
    }

    try {
      setExportingReport(
        "subscriptions"
      );

      exportToExcel(
        filtered
      );
    } catch (err) {
      console.error(
        "Subscription export failed:",
        err
      );

      alert(
        "Failed to export subscription report."
      );
    } finally {
      finishExport();
    }
  }

  function handleDonationExport() {
    if (
      loadingExports ||
      exportingReport
    ) {
      return;
    }

    try {
      setExportingReport(
        "donations"
      );

      exportDonationsToExcel(
        donations
      );
    } catch (err) {
      console.error(
        "Donation export failed:",
        err
      );

      alert(
        "Failed to export donation report."
      );
    } finally {
      finishExport();
    }
  }

  function handleSponsorExport() {
    if (
      loadingExports ||
      exportingReport
    ) {
      return;
    }

    try {
      setExportingReport(
        "sponsors"
      );

      exportSponsorsToExcel(
        sponsors
      );
    } catch (err) {
      console.error(
        "Sponsor export failed:",
        err
      );

      alert(
        "Failed to export sponsor report."
      );
    } finally {
      finishExport();
    }
  }

  function handleOverallSummaryExport() {
    if (
      loadingExports ||
      exportingReport
    ) {
      return;
    }

    try {
      setExportingReport(
        "overall"
      );

      exportOverallCollectionSummary(
        {
          subscriptionCollection:
            subscriptionTotal,

          donationCollection:
            donationTotal,

          sponsorCollection:
            sponsorTotal,

          governmentGrantCollection:
            governmentGrantTotal,
        }
      );
    } catch (err) {
      console.error(
        "Overall summary export failed:",
        err
      );

      alert(
        "Failed to export overall collection summary."
      );
    } finally {
      finishExport();
    }
  }

  return (
    <ProtectedRoute>
      <AppLayout>

        <div className="space-y-8">

          {/* Header */}

          <div>

            <h1 className="text-4xl font-bold text-blue-900">
              Reports
            </h1>

            <p className="text-gray-500 mt-2">
              View, filter and export Puja collection reports.
            </p>

          </div>

          {/* ============================================
              EXPORT REPORTS
          ============================================ */}

          <div className="relative z-10 bg-white rounded-2xl shadow-lg border p-6">

            <div className="mb-6">

              <h2 className="text-2xl font-bold text-blue-900">
                Export Reports
              </h2>

              <p className="text-gray-500 mt-1">
                Download separate Excel reports for subscriptions, donations, sponsorships and the overall collection summary.
              </p>

            </div>

            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

              {/* Subscription Export */}

              <button
                type="button"
                onClick={
                  handleSubscriptionExport
                }
                disabled={
                  loadingExports ||
                  exportingReport !==
                    null
                }
                className="
                  relative
                  z-20
                  w-full
                  min-h-[130px]
                  flex
                  flex-col
                  items-center
                  justify-center
                  gap-3
                  bg-green-600
                  hover:bg-green-700
                  active:bg-green-800
                  disabled:bg-gray-400
                  disabled:cursor-not-allowed
                  text-white
                  rounded-xl
                  p-6
                  shadow-lg
                  font-semibold
                  transition
                  touch-manipulation
                  select-none
                  cursor-pointer
                "
              >

                <FaFileExcel
                  className="
                    text-4xl
                    pointer-events-none
                  "
                />

                <span className="pointer-events-none text-center">
                  {exportingReport ===
                  "subscriptions"
                    ? "Exporting..."
                    : "Export Subscriptions"}
                </span>

              </button>

              {/* Donation Export */}

              <button
                type="button"
                onClick={
                  handleDonationExport
                }
                disabled={
                  loadingExports ||
                  exportingReport !==
                    null
                }
                className="
                  relative
                  z-20
                  w-full
                  min-h-[130px]
                  flex
                  flex-col
                  items-center
                  justify-center
                  gap-3
                  bg-pink-600
                  hover:bg-pink-700
                  active:bg-pink-800
                  disabled:bg-gray-400
                  disabled:cursor-not-allowed
                  text-white
                  rounded-xl
                  p-6
                  shadow-lg
                  font-semibold
                  transition
                  touch-manipulation
                  select-none
                  cursor-pointer
                "
              >

                <FaHandHoldingHeart
                  className="
                    text-4xl
                    pointer-events-none
                  "
                />

                <span className="pointer-events-none text-center">
                  {exportingReport ===
                  "donations"
                    ? "Exporting..."
                    : "Export Donations"}
                </span>

              </button>

              {/* Sponsor Export */}

              <button
                type="button"
                onClick={
                  handleSponsorExport
                }
                disabled={
                  loadingExports ||
                  exportingReport !==
                    null
                }
                className="
                  relative
                  z-20
                  w-full
                  min-h-[130px]
                  flex
                  flex-col
                  items-center
                  justify-center
                  gap-3
                  bg-purple-600
                  hover:bg-purple-700
                  active:bg-purple-800
                  disabled:bg-gray-400
                  disabled:cursor-not-allowed
                  text-white
                  rounded-xl
                  p-6
                  shadow-lg
                  font-semibold
                  transition
                  touch-manipulation
                  select-none
                  cursor-pointer
                "
              >

                <FaBullhorn
                  className="
                    text-4xl
                    pointer-events-none
                  "
                />

                <span className="pointer-events-none text-center">
                  {exportingReport ===
                  "sponsors"
                    ? "Exporting..."
                    : "Export Sponsors / Ads"}
                </span>

              </button>

              {/* Overall Summary */}

              <button
                type="button"
                onClick={
                  handleOverallSummaryExport
                }
                disabled={
                  loadingExports ||
                  exportingReport !==
                    null
                }
                className="
                  relative
                  z-20
                  w-full
                  min-h-[130px]
                  flex
                  flex-col
                  items-center
                  justify-center
                  gap-3
                  bg-blue-700
                  hover:bg-blue-800
                  active:bg-blue-900
                  disabled:bg-gray-400
                  disabled:cursor-not-allowed
                  text-white
                  rounded-xl
                  p-6
                  shadow-lg
                  font-semibold
                  transition
                  touch-manipulation
                  select-none
                  cursor-pointer
                "
              >

                <FaChartPie
                  className="
                    text-4xl
                    pointer-events-none
                  "
                />

                <span className="pointer-events-none text-center">
                  {exportingReport ===
                  "overall"
                    ? "Exporting..."
                    : "Export Overall Summary"}
                </span>

              </button>

            </div>

          </div>

          {/* ============================================
              OVERALL COLLECTION SUMMARY
          ============================================ */}

          <div>

            <h2 className="text-2xl font-bold text-gray-800 mb-5">
              Overall Collection Summary
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5">

              {/* Subscription */}

              <div className="bg-white rounded-2xl shadow border p-5">

                <p className="text-gray-500">
                  Subscriptions
                </p>

                <h3 className="text-2xl font-bold text-green-700 mt-2 whitespace-nowrap">
                  ₹
                  {formatAmount(
                    subscriptionTotal
                  )}
                </h3>

              </div>

              {/* Donations */}

              <div className="bg-white rounded-2xl shadow border p-5">

                <p className="text-gray-500">
                  Donations
                </p>

                <h3 className="text-2xl font-bold text-pink-700 mt-2 whitespace-nowrap">
                  ₹
                  {formatAmount(
                    donationTotal
                  )}
                </h3>

              </div>

              {/* Sponsors */}

              <div className="bg-white rounded-2xl shadow border p-5">

                <p className="text-gray-500">
                  Sponsors / Ads
                </p>

                <h3 className="text-2xl font-bold text-purple-700 mt-2 whitespace-nowrap">
                  ₹
                  {formatAmount(
                    sponsorTotal
                  )}
                </h3>

              </div>

              {/* Government */}

              <div className="bg-white rounded-2xl shadow border p-5">

                <p className="text-gray-500">
                  Government Grants
                </p>

                <h3 className="text-2xl font-bold text-teal-700 mt-2 whitespace-nowrap">
                  ₹
                  {formatAmount(
                    governmentGrantTotal
                  )}
                </h3>

              </div>

              {/* Grand Total */}

              <div className="bg-green-700 rounded-2xl shadow-lg text-white p-5">

                <p className="text-green-100">
                  Grand Total
                </p>

                <h3 className="text-3xl font-bold mt-2 whitespace-nowrap">
                  ₹
                  {formatAmount(
                    grandTotal
                  )}
                </h3>

              </div>

            </div>

          </div>

          {/* ============================================
              SUBSCRIPTION REPORT SUMMARY
          ============================================ */}

          <div>

            <h2 className="text-2xl font-bold text-gray-800 mb-5">
              Subscription Report
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

              <div className="bg-green-600 rounded-2xl text-white p-6 shadow-lg">

                <div className="flex justify-between items-center">

                  <div>

                    <p>
                      Filtered Collection
                    </p>

                    <h2 className="text-3xl font-bold mt-2 whitespace-nowrap">
                      ₹
                      {formatAmount(
                        totalCollection
                      )}
                    </h2>

                  </div>

                  <FaMoneyBillWave className="shrink-0 text-4xl opacity-80" />

                </div>

              </div>

              <div className="bg-blue-600 rounded-2xl text-white p-6 shadow-lg">

                <div className="flex justify-between items-center">

                  <div>

                    <p>
                      Total Records
                    </p>

                    <h2 className="text-3xl font-bold mt-2">
                      {
                        filtered.length
                      }
                    </h2>

                  </div>

                  <FaList className="shrink-0 text-4xl opacity-80" />

                </div>

              </div>

              <div className="bg-green-700 rounded-2xl text-white p-6 shadow-lg">

                <div className="flex justify-between items-center">

                  <div>

                    <p>
                      Paid Flats
                    </p>

                    <h2 className="text-3xl font-bold mt-2">
                      {
                        paidCount
                      }
                    </h2>

                  </div>

                  <FaCheckCircle className="shrink-0 text-4xl opacity-80" />

                </div>

              </div>

              <div className="bg-red-600 rounded-2xl text-white p-6 shadow-lg">

                <div className="flex justify-between items-center">

                  <div>

                    <p>
                      Pending Flats
                    </p>

                    <h2 className="text-3xl font-bold mt-2">
                      {
                        pendingCount
                      }
                    </h2>

                  </div>

                  <FaTimesCircle className="shrink-0 text-4xl opacity-80" />

                </div>

              </div>

            </div>

          </div>

          {/* ============================================
              FILTERS
          ============================================ */}

          <div className="bg-white rounded-2xl shadow-lg p-6">

            <div className="flex flex-col lg:flex-row gap-4">

              <input
                placeholder="Search Flat / Owner / Mobile..."
                value={
                  search
                }
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                className="border rounded-lg px-4 py-3 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <select
                value={
                  status
                }
                onChange={(e) =>
                  setStatus(
                    e.target.value
                  )
                }
                className="border rounded-lg px-4 py-3 w-full lg:w-56"
              >

                <option>
                  All
                </option>

                <option>
                  Paid
                </option>

                <option>
                  Pending
                </option>

              </select>

            </div>

          </div>

          {/* ============================================
              SUBSCRIPTION TABLE
          ============================================ */}

          <div className="overflow-x-auto bg-white rounded-2xl shadow-lg border">

            <table className="min-w-full">

              <thead className="bg-blue-900 text-white sticky top-0">

                <tr>

                  <th className="p-4 text-left">
                    Flat
                  </th>

                  <th className="p-4 text-left">
                    Owner
                  </th>

                  <th className="p-4 text-left">
                    Mobile
                  </th>

                  <th className="p-4 text-center">
                    Amount
                  </th>

                  <th className="p-4 text-center">
                    Status
                  </th>

                </tr>

              </thead>

              <tbody>

                {filtered.length ===
                  0 ? (

                  <tr>

                    <td
                      colSpan={
                        5
                      }
                      className="text-center py-12 text-gray-500"
                    >
                      No records found.
                    </td>

                  </tr>

                ) : (

                  filtered.map(
                    (
                      row
                    ) => (

                      <tr
                        key={
                          row.flat_number
                        }
                        className="border-b hover:bg-blue-50 transition"
                      >

                        <td className="p-4 font-semibold">
                          {
                            row.flat_number
                          }
                        </td>

                        <td className="p-4">
                          {row.owner_name ||
                            "-"}
                        </td>

                        <td className="p-4">
                          {row.mobile_number ||
                            "-"}
                        </td>

                        <td className="p-4 text-center font-semibold whitespace-nowrap">
                          ₹
                          {formatAmount(
                            row.subscription_amount
                          )}
                        </td>

                        <td className="p-4 text-center">

                          <span
                            className={`px-4 py-2 rounded-full text-white text-sm font-medium ${
                              row.status ===
                              "Paid"
                                ? "bg-green-600"
                                : "bg-red-600"
                            }`}
                          >
                            {
                              row.status
                            }
                          </span>

                        </td>

                      </tr>

                    )
                  )

                )}

              </tbody>

            </table>

          </div>

        </div>

      </AppLayout>
    </ProtectedRoute>
  );
}