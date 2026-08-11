"use client";

import {
  useEffect,
  useState,
} from "react";

import AppLayout from "@/components/layout/AppLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

import {
  FaCalendarDay,
  FaRupeeSign,
  FaHome,
  FaUsers,
  FaMoneyBill,
  FaMobileAlt,
} from "react-icons/fa";

import { getDailyCollection } from "@/services/dailyCollectionService";

export default function DailyCollectionPage() {
  const today =
    new Date()
      .toISOString()
      .split("T")[0];

  const [
    selectedDate,
    setSelectedDate,
  ] = useState(today);

  const [
    collections,
    setCollections,
  ] = useState<any[]>([]);

  const [
    volunteerSummary,
    setVolunteerSummary,
  ] = useState<any[]>([]);

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
    totalFlats,
    setTotalFlats,
  ] = useState(0);

  const [
    totalVolunteers,
    setTotalVolunteers,
  ] = useState(0);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        const result =
          await getDailyCollection(
            selectedDate
          );

        setCollections(
          result.collections
        );

        setVolunteerSummary(
          result.volunteerSummary
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

        setTotalFlats(
          result.totalFlats
        );

        setTotalVolunteers(
          result.totalVolunteers
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [selectedDate]);

  const filteredCollections =
    collections.filter((flat) => {
      const keyword =
        search
          .trim()
          .toLowerCase();

      if (!keyword) {
        return true;
      }

      return (
        flat.flat_number
          ?.toLowerCase()
          .includes(keyword) ||

        flat.owner_name
          ?.toLowerCase()
          .includes(keyword) ||

        flat.collected_by
          ?.toLowerCase()
          .includes(keyword) ||

        flat.payment_mode
          ?.toLowerCase()
          .includes(keyword) ||

        flat.receipt_number
          ?.toLowerCase()
          .includes(keyword)
      );
    });

  const formatAmount = (
    amount: number
  ) =>
    Number(
      amount || 0
    ).toLocaleString(
      "en-IN"
    );

  const formatDate = (
    date: string
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

  const formatTime = (
    timestamp: string | null
  ) => {
    if (!timestamp) {
      return "-";
    }

    return new Date(
      timestamp
    ).toLocaleTimeString(
      "en-IN",
      {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }
    );
  };

  return (
    <ProtectedRoute>
      <AppLayout>

        <div className="space-y-8">

          {/* Header */}

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

            <div>

              <h1 className="text-3xl md:text-4xl font-bold text-blue-900">
                Daily Collection
              </h1>

              <p className="text-gray-500 mt-2">
                View detailed subscription
                collections for any date.
              </p>

            </div>

            {/* Date Picker */}

            <div className="bg-white border rounded-xl p-4 shadow-sm">

              <label className="block text-sm font-semibold text-gray-600 mb-2">
                Select Date
              </label>

              <div className="flex items-center gap-3">

                <FaCalendarDay className="text-blue-600" />

                <input
                  type="date"
                  value={
                    selectedDate
                  }
                  onChange={(e) =>
                    setSelectedDate(
                      e.target.value
                    )
                  }
                  className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

            </div>

          </div>

          {/* Summary Cards */}

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5">

            {/* Total Collection */}

            <div className="bg-white rounded-2xl shadow-lg border p-6">

              <div className="flex justify-between items-center">

                <div>

                  <p className="text-gray-500">
                    Total Collection
                  </p>

                  <h2 className="text-3xl font-bold text-green-700 mt-2">
                    ₹
                    {formatAmount(
                      totalCollection
                    )}
                  </h2>

                </div>

                <FaRupeeSign className="text-4xl text-green-600" />

              </div>

            </div>

            {/* Cash Collection */}

            <div className="bg-white rounded-2xl shadow-lg border p-6">

              <div className="flex justify-between items-center">

                <div>

                  <p className="text-gray-500">
                    Cash Collection
                  </p>

                  <h2 className="text-3xl font-bold text-emerald-700 mt-2">
                    ₹
                    {formatAmount(
                      cashCollection
                    )}
                  </h2>

                </div>

                <FaMoneyBill className="text-4xl text-emerald-600" />

              </div>

            </div>

            {/* UPI Collection */}

            <div className="bg-white rounded-2xl shadow-lg border p-6">

              <div className="flex justify-between items-center">

                <div>

                  <p className="text-gray-500">
                    UPI Collection
                  </p>

                  <h2 className="text-3xl font-bold text-cyan-700 mt-2">
                    ₹
                    {formatAmount(
                      upiCollection
                    )}
                  </h2>

                </div>

                <FaMobileAlt className="text-4xl text-cyan-600" />

              </div>

            </div>

            {/* Flats Paid */}

            <div className="bg-white rounded-2xl shadow-lg border p-6">

              <div className="flex justify-between items-center">

                <div>

                  <p className="text-gray-500">
                    Flats Paid
                  </p>

                  <h2 className="text-3xl font-bold text-blue-900 mt-2">
                    {
                      totalFlats
                    }
                  </h2>

                </div>

                <FaHome className="text-4xl text-blue-600" />

              </div>

            </div>

            {/* Volunteers */}

            <div className="bg-white rounded-2xl shadow-lg border p-6">

              <div className="flex justify-between items-center">

                <div>

                  <p className="text-gray-500">
                    Volunteers
                  </p>

                  <h2 className="text-3xl font-bold text-purple-700 mt-2">
                    {
                      totalVolunteers
                    }
                  </h2>

                </div>

                <FaUsers className="text-4xl text-purple-600" />

              </div>

            </div>

          </div>

          {/* Search */}

          <div className="bg-white rounded-xl shadow p-5">

            <input
              type="text"
              placeholder="Search Flat / Owner / Volunteer / Payment Mode / Receipt..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

          {/* Collection Details */}

          <div>

            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 mb-4">

              <h2 className="text-2xl font-bold text-blue-900">
                Collection Details
              </h2>

              <p className="text-gray-500">
                {
                  formatDate(
                    selectedDate
                  )
                }
              </p>

            </div>

            <div className="bg-white rounded-2xl shadow-lg border overflow-x-auto">

              <table className="min-w-[1200px] w-full">

                <thead className="bg-blue-900 text-white">

                  <tr>

                    <th className="p-4 text-left">
                      Flat
                    </th>

                    <th className="p-4 text-center">
                      Time
                    </th>

                    <th className="p-4 text-left">
                      Owner
                    </th>

                    <th className="p-4 text-center">
                      Amount
                    </th>

                    <th className="p-4 text-center">
                      Payment Mode
                    </th>

                    <th className="p-4 text-left">
                      Collected By
                    </th>

                    <th className="p-4 text-center">
                      Receipt
                    </th>

                    <th className="p-4 text-left">
                      Transaction ID
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {loading ? (

                    <tr>

                      <td
                        colSpan={8}
                        className="text-center py-12"
                      >
                        Loading...
                      </td>

                    </tr>

                  ) : filteredCollections.length ===
                    0 ? (

                    <tr>

                      <td
                        colSpan={8}
                        className="text-center py-12 text-gray-500"
                      >
                        No collections found for this date.
                      </td>

                    </tr>

                  ) : (

                    filteredCollections.map(
                      (flat) => (

                        <tr
                          key={
                            flat.flat_number
                          }
                          className="border-b hover:bg-blue-50"
                        >

                          <td className="p-4 font-bold text-blue-900 whitespace-nowrap">
                            {
                              flat.flat_number
                            }
                          </td>

                          <td className="p-4 text-center whitespace-nowrap">
                            {
                              formatTime(
                                flat.payment_timestamp
                              )
                            }
                          </td>

                          <td className="p-4">
                            {
                              flat.owner_name ||
                              "-"
                            }
                          </td>

                          <td className="p-4 text-center font-bold text-green-700 whitespace-nowrap">
                            ₹
                            {
                              formatAmount(
                                flat.subscription_amount
                              )
                            }
                          </td>

                          <td className="p-4 text-center whitespace-nowrap">
                            {
                              flat.payment_mode ||
                              "-"
                            }
                          </td>

                          <td className="p-4 whitespace-nowrap">
                            {
                              flat.collected_by ||
                              "-"
                            }
                          </td>

                          <td className="p-4 text-center whitespace-nowrap">
                            {
                              flat.receipt_number ||
                              "-"
                            }
                          </td>

                          <td className="p-4 whitespace-nowrap">
                            {
                              flat.transaction_id ||
                              "-"
                            }
                          </td>

                        </tr>

                      )
                    )

                  )}

                </tbody>

              </table>

            </div>

          </div>

          {/* Volunteer Summary */}

          <div>

            <h2 className="text-2xl font-bold text-blue-900 mb-4">
              Volunteer Summary
            </h2>

            <div className="bg-white rounded-2xl shadow-lg border overflow-x-auto">

              <table className="min-w-[600px] w-full">

                <thead className="bg-gray-100">

                  <tr>

                    <th className="p-4 text-left">
                      Volunteer
                    </th>

                    <th className="p-4 text-center">
                      Flats Collected
                    </th>

                    <th className="p-4 text-center">
                      Amount
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {volunteerSummary.length ===
                  0 ? (

                    <tr>

                      <td
                        colSpan={3}
                        className="text-center py-10 text-gray-500"
                      >
                        No volunteer collection data.
                      </td>

                    </tr>

                  ) : (

                    volunteerSummary.map(
                      (item) => (

                        <tr
                          key={
                            item.volunteer
                          }
                          className="border-b hover:bg-gray-50"
                        >

                          <td className="p-4 font-semibold">
                            {
                              item.volunteer
                            }
                          </td>

                          <td className="p-4 text-center">
                            {
                              item.flats
                            }
                          </td>

                          <td className="p-4 text-center font-bold text-green-700">
                            ₹
                            {
                              formatAmount(
                                item.amount
                              )
                            }
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