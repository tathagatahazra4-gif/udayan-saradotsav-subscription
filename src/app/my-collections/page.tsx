"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  FaRupeeSign,
  FaHome,
  FaSearch,
  FaEdit,
  FaMoneyBill,
  FaMobileAlt,
  FaCalendarDay,
} from "react-icons/fa";

import AppLayout from "@/components/layout/AppLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

import { getMyCollections } from "@/services/reportService";

interface CollectionFlat {
  flat_number: string;
  owner_name: string | null;
  mobile_number: string | null;
  family_members: number | null;
  subscription_amount:
    | number
    | string
    | null;
  payment_mode: string | null;
  receipt_number: string | null;
  transaction_id: string | null;
  payment_date: string | null;
  status: string;
  collected_by: string | null;
}

function getTodayLocalDate() {
  const now = new Date();

  const year =
    now.getFullYear();

  const month =
    String(
      now.getMonth() + 1
    ).padStart(
      2,
      "0"
    );

  const day =
    String(
      now.getDate()
    ).padStart(
      2,
      "0"
    );

  return `${year}-${month}-${day}`;
}

export default function MyCollectionsPage() {
  const [
    collections,
    setCollections,
  ] =
    useState<CollectionFlat[]>(
      []
    );

  const [
    username,
    setUsername,
  ] =
    useState("");

  const [
    totalFlats,
    setTotalFlats,
  ] =
    useState(0);

  const [
    totalCollection,
    setTotalCollection,
  ] = useState(0);

  const [
    cashCollection,
    setCashCollection,
  ] = useState(0);

  const [
    upiCollection,
    setUpiCollection,
  ] = useState(0);

  const [
    search,
    setSearch,
  ] =
    useState("");

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    error,
    setError,
  ] =
    useState("");

  const [
    selectedDate,
    setSelectedDate,
  ] =
    useState(
      getTodayLocalDate()
    );

  useEffect(() => {
    async function loadCollections() {
      try {
        setLoading(true);
        setError("");

        const result =
          await getMyCollections();

        setUsername(
          result.username
        );

        setCollections(
          result.collections
        );

        setTotalFlats(
          result.totalFlats
        );

        setTotalCollection(
          result.totalCollection
        );

        setCashCollection(
          result.cashCollection ?? 0
        );

        setUpiCollection(
          result.upiCollection ?? 0
        );
      } catch (err: any) {
        console.error(
          "Failed to load collections:",
          err
        );

        setError(
          err?.message ||
            "Failed to load your collections."
        );
      } finally {
        setLoading(false);
      }
    }

    loadCollections();
  }, []);

  const filteredCollections =
    collections.filter(
      (flat) => {
        const keyword =
          search
            .trim()
            .toLowerCase();

        if (!keyword) {
          return true;
        }

        return (
          flat.flat_number
            .toLowerCase()
            .includes(
              keyword
            ) ||

          (
            flat.owner_name ||
            ""
          )
            .toLowerCase()
            .includes(
              keyword
            ) ||

          (
            flat.mobile_number ||
            ""
          )
            .toLowerCase()
            .includes(
              keyword
            ) ||

          (
            flat.receipt_number ||
            ""
          )
            .toLowerCase()
            .includes(
              keyword
            ) ||

          (
            flat.transaction_id ||
            ""
          )
            .toLowerCase()
            .includes(
              keyword
            ) ||

          (
            flat.payment_mode ||
            ""
          )
            .toLowerCase()
            .includes(
              keyword
            )
        );
      }
    );

  // ============================================
  // DAY-WISE COLLECTION
  // ============================================

  const selectedDayCollections =
    collections.filter(
      (flat) =>
        flat.payment_date ===
        selectedDate
    );

  const selectedDayTotal =
    selectedDayCollections.reduce(
      (
        sum,
        flat
      ) =>
        sum +
        Number(
          flat.subscription_amount ||
            0
        ),
      0
    );

  const selectedDayCash =
    selectedDayCollections
      .filter(
        (flat) =>
          flat.payment_mode ===
          "Cash"
      )
      .reduce(
        (
          sum,
          flat
        ) =>
          sum +
          Number(
            flat.subscription_amount ||
              0
          ),
        0
      );

  const selectedDayUPI =
    selectedDayCollections
      .filter(
        (flat) =>
          flat.payment_mode ===
          "UPI"
      )
      .reduce(
        (
          sum,
          flat
        ) =>
          sum +
          Number(
            flat.subscription_amount ||
              0
          ),
        0
      );

  const formatAmount = (
    amount:
      | number
      | string
      | null
  ) =>
    Number(
      amount || 0
    ).toLocaleString(
      "en-IN"
    );

  const formatDate = (
    date:
      | string
      | null
  ) => {
    if (!date) {
      return "-";
    }

    return new Date(
      `${date}T00:00:00`
    ).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <AppLayout>
          <div className="flex items-center justify-center h-[70vh]">
            <h2 className="text-2xl font-semibold">
              Loading My Collections...
            </h2>
          </div>
        </AppLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <AppLayout>

        <div className="space-y-7">

          {/* Page Header */}

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">

            <div>
              <h1 className="text-4xl font-bold text-blue-900">
                My Collections
              </h1>

              <p className="text-gray-500 mt-2">
                View and edit subscriptions
                collected by{" "}

                <span className="font-semibold text-blue-800">
                  {username}
                </span>
                .
              </p>
            </div>

            <div className="relative w-full lg:w-96">

              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder="Search flat, owner, mobile, mode..."
                className="w-full border rounded-xl pl-11 pr-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

          </div>

          {/* Error */}

          {error && (
            <div className="bg-red-50 border border-red-300 text-red-700 rounded-xl p-4">
              {error}
            </div>
          )}

          {/* Summary Cards */}

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

            {/* Flats Collected */}

            <div className="bg-white rounded-2xl shadow-lg border p-5 md:p-6 overflow-hidden">

              <div className="grid grid-cols-[minmax(0,1fr)_56px] items-center gap-3">

                <div className="min-w-0">

                  <p className="text-gray-500 font-medium">
                    Flats Collected
                  </p>

                  <h2
                    className="
                      mt-2
                      font-bold
                      text-blue-900
                      leading-none
                      whitespace-nowrap
                      text-[clamp(1.5rem,2vw,2.25rem)]
                    "
                  >
                    {totalFlats}
                  </h2>

                </div>

                <div className="shrink-0 w-14 h-14 bg-blue-100 text-blue-700 text-2xl md:text-3xl rounded-2xl flex items-center justify-center">
                  <FaHome />
                </div>

              </div>

            </div>

            {/* Total Collection */}

            <div className="bg-white rounded-2xl shadow-lg border p-5 md:p-6 overflow-hidden">

              <div className="grid grid-cols-[minmax(0,1fr)_56px] items-center gap-3">

                <div className="min-w-0">

                  <p className="text-gray-500 font-medium">
                    Total Collection
                  </p>

                  <h2
                    className="
                      mt-2
                      font-bold
                      text-green-700
                      leading-none
                      whitespace-nowrap
                      text-[clamp(1.35rem,1.75vw,2rem)]
                    "
                  >
                    ₹{formatAmount(
                      totalCollection
                    )}
                  </h2>

                </div>

                <div className="shrink-0 w-14 h-14 bg-green-100 text-green-700 text-2xl md:text-3xl rounded-2xl flex items-center justify-center">
                  <FaRupeeSign />
                </div>

              </div>

            </div>

            {/* Cash Collection */}

            <div className="bg-white rounded-2xl shadow-lg border p-5 md:p-6 overflow-hidden">

              <div className="grid grid-cols-[minmax(0,1fr)_56px] items-center gap-3">

                <div className="min-w-0">

                  <p className="text-gray-500 font-medium">
                    Cash Collection
                  </p>

                  <h2
                    className="
                      mt-2
                      font-bold
                      text-emerald-700
                      leading-none
                      whitespace-nowrap
                      text-[clamp(1.35rem,1.75vw,2rem)]
                    "
                  >
                    ₹{formatAmount(
                      cashCollection
                    )}
                  </h2>

                </div>

                <div className="shrink-0 w-14 h-14 bg-emerald-100 text-emerald-700 text-2xl md:text-3xl rounded-2xl flex items-center justify-center">
                  <FaMoneyBill />
                </div>

              </div>

            </div>

            {/* UPI Collection */}

            <div className="bg-white rounded-2xl shadow-lg border p-5 md:p-6 overflow-hidden">

              <div className="grid grid-cols-[minmax(0,1fr)_56px] items-center gap-3">

                <div className="min-w-0">

                  <p className="text-gray-500 font-medium">
                    UPI Collection
                  </p>

                  <h2
                    className="
                      mt-2
                      font-bold
                      text-cyan-700
                      leading-none
                      whitespace-nowrap
                      text-[clamp(1.35rem,1.75vw,2rem)]
                    "
                  >
                    ₹{formatAmount(
                      upiCollection
                    )}
                  </h2>

                </div>

                <div className="shrink-0 w-14 h-14 bg-cyan-100 text-cyan-700 text-2xl md:text-3xl rounded-2xl flex items-center justify-center">
                  <FaMobileAlt />
                </div>

              </div>

            </div>

          </div>

          {/* ============================================
              DAY-WISE COLLECTION
          ============================================ */}

          <div className="bg-white rounded-2xl shadow-lg border p-6 overflow-hidden">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-6">

              <div>
                <h2 className="text-2xl font-bold text-blue-900">
                  Day-wise Collection
                </h2>

                <p className="text-gray-500 mt-1">
                  View your collection summary for a selected date.
                </p>
              </div>

              <div>

                <label className="block text-sm font-semibold text-gray-600 mb-2">
                  Select Date
                </label>

                <div className="flex items-center gap-3">

                  <FaCalendarDay className="shrink-0 text-blue-600 text-xl" />

                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) =>
                      setSelectedDate(
                        e.target.value
                      )
                    }
                    className="border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                </div>

              </div>

            </div>

            <div className="mb-5 text-gray-500">

              Showing collection for{" "}

              <span className="font-semibold text-blue-900">
                {formatDate(
                  selectedDate
                )}
              </span>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

              {/* Flats Collected */}

              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 overflow-hidden">

                <div className="grid grid-cols-[minmax(0,1fr)_44px] items-center gap-3">

                  <div className="min-w-0">

                    <p className="text-gray-500">
                      Flats Collected
                    </p>

                    <h3
                      className="
                        mt-2
                        font-bold
                        text-blue-900
                        leading-none
                        whitespace-nowrap
                        text-[clamp(1.4rem,1.8vw,1.875rem)]
                      "
                    >
                      {selectedDayCollections.length}
                    </h3>

                  </div>

                  <div className="shrink-0 w-11 h-11 flex items-center justify-center">
                    <FaHome className="text-3xl text-blue-600" />
                  </div>

                </div>

              </div>

              {/* Total Collection */}

              <div className="bg-green-50 border border-green-100 rounded-2xl p-5 overflow-hidden">

                <div className="grid grid-cols-[minmax(0,1fr)_44px] items-center gap-3">

                  <div className="min-w-0">

                    <p className="text-gray-500">
                      Total Collection
                    </p>

                    <h3
                      className="
                        mt-2
                        font-bold
                        text-green-700
                        leading-none
                        whitespace-nowrap
                        text-[clamp(1.25rem,1.6vw,1.75rem)]
                      "
                    >
                      ₹{formatAmount(
                        selectedDayTotal
                      )}
                    </h3>

                  </div>

                  <div className="shrink-0 w-11 h-11 flex items-center justify-center">
                    <FaRupeeSign className="text-3xl text-green-600" />
                  </div>

                </div>

              </div>

              {/* Cash Collection */}

              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 overflow-hidden">

                <div className="grid grid-cols-[minmax(0,1fr)_44px] items-center gap-3">

                  <div className="min-w-0">

                    <p className="text-gray-500">
                      Cash Collection
                    </p>

                    <h3
                      className="
                        mt-2
                        font-bold
                        text-emerald-700
                        leading-none
                        whitespace-nowrap
                        text-[clamp(1.25rem,1.6vw,1.75rem)]
                      "
                    >
                      ₹{formatAmount(
                        selectedDayCash
                      )}
                    </h3>

                  </div>

                  <div className="shrink-0 w-11 h-11 flex items-center justify-center">
                    <FaMoneyBill className="text-3xl text-emerald-600" />
                  </div>

                </div>

              </div>

              {/* UPI Collection */}

              <div className="bg-cyan-50 border border-cyan-100 rounded-2xl p-5 overflow-hidden">

                <div className="grid grid-cols-[minmax(0,1fr)_44px] items-center gap-3">

                  <div className="min-w-0">

                    <p className="text-gray-500">
                      UPI Collection
                    </p>

                    <h3
                      className="
                        mt-2
                        font-bold
                        text-cyan-700
                        leading-none
                        whitespace-nowrap
                        text-[clamp(1.25rem,1.6vw,1.75rem)]
                      "
                    >
                      ₹{formatAmount(
                        selectedDayUPI
                      )}
                    </h3>

                  </div>

                  <div className="shrink-0 w-11 h-11 flex items-center justify-center">
                    <FaMobileAlt className="text-3xl text-cyan-600" />
                  </div>

                </div>

              </div>

            </div>

            {selectedDayCollections.length ===
              0 && (

              <div className="mt-5 bg-gray-50 border rounded-xl p-4 text-center text-gray-500">

                No collections found for{" "}
                {formatDate(
                  selectedDate
                )}
                .

              </div>

            )}

          </div>

          {/* Results Count */}

          <div className="bg-white rounded-xl shadow border p-5">

            <p className="text-gray-500">

              Showing{" "}

              <span className="font-bold text-blue-900">
                {
                  filteredCollections.length
                }
              </span>

              {" "}
              of{" "}

              <span className="font-bold text-blue-900">
                {totalFlats}
              </span>

              {" "}
              collected flats

            </p>

          </div>

          {/* Collection Table */}

          <div className="bg-white rounded-2xl shadow-lg border overflow-hidden">

            <div className="overflow-x-auto">

              <table className="min-w-full">

                <thead className="bg-blue-900 text-white">

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
                      Mode
                    </th>

                    <th className="p-4 text-center">
                      Payment Date
                    </th>

                    <th className="p-4 text-center">
                      Receipt
                    </th>

                    <th className="p-4 text-center">
                      Action
                    </th>
                  </tr>

                </thead>

                <tbody>

                  {filteredCollections.length ===
                  0 ? (

                    <tr>

                      <td
                        colSpan={8}
                        className="text-center py-14 text-gray-500"
                      >
                        {search
                          ? "No matching collections found."
                          : "You have not collected any subscriptions yet."}
                      </td>

                    </tr>

                  ) : (

                    filteredCollections.map(
                      (flat) => (

                        <tr
                          key={
                            flat.flat_number
                          }
                          className="border-b hover:bg-blue-50 transition"
                        >

                          <td className="p-4 font-bold text-blue-900 whitespace-nowrap">
                            {
                              flat.flat_number
                            }
                          </td>

                          <td className="p-4 whitespace-nowrap">
                            {flat.owner_name ||
                              "-"}
                          </td>

                          <td className="p-4 whitespace-nowrap">
                            {flat.mobile_number ||
                              "-"}
                          </td>

                          <td className="p-4 text-center font-bold text-green-700 whitespace-nowrap">
                            ₹
                            {formatAmount(
                              flat.subscription_amount
                            )}
                          </td>

                          <td className="p-4 text-center whitespace-nowrap">
                            {flat.payment_mode ||
                              "-"}
                          </td>

                          <td className="p-4 text-center whitespace-nowrap">
                            {formatDate(
                              flat.payment_date
                            )}
                          </td>

                          <td className="p-4 text-center whitespace-nowrap">
                            {flat.receipt_number ||
                              "-"}
                          </td>

                          <td className="p-4 text-center whitespace-nowrap">

                            <Link
                              href={`/flats/${encodeURIComponent(
                                flat.flat_number
                              )}`}
                              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow transition"
                            >

                              <FaEdit />
                              Edit

                            </Link>

                          </td>

                        </tr>

                      )
                    )

                  )}

                </tbody>

              </table>

            </div>

          </div>

        </div>

      </AppLayout>
    </ProtectedRoute>
  );
}