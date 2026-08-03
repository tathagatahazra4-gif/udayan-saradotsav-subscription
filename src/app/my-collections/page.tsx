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
} from "react-icons/fa";

import AppLayout from "@/components/layout/AppLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

import { getMyCollections } from "@/services/reportService";

interface CollectionFlat {
  flat_number: string;
  owner_name: string | null;
  mobile_number: string | null;
  family_members: number | null;
  subscription_amount: number | string | null;
  payment_mode: string | null;
  receipt_number: string | null;
  transaction_id: string | null;
  payment_date: string | null;
  status: string;
  collected_by: string | null;
}

export default function MyCollectionsPage() {
  const [collections, setCollections] =
    useState<CollectionFlat[]>([]);

  const [username, setUsername] =
    useState("");

  const [totalFlats, setTotalFlats] =
    useState(0);

  const [
    totalCollection,
    setTotalCollection,
  ] = useState(0);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadCollections() {
      try {
        setLoading(true);
        setError("");

        const result =
          await getMyCollections();

        setUsername(result.username);

        setCollections(
          result.collections
        );

        setTotalFlats(
          result.totalFlats
        );

        setTotalCollection(
          result.totalCollection
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
    collections.filter((flat) => {
      const keyword = search
        .trim()
        .toLowerCase();

      if (!keyword) {
        return true;
      }

      return (
        flat.flat_number
          .toLowerCase()
          .includes(keyword) ||
        (flat.owner_name || "")
          .toLowerCase()
          .includes(keyword) ||
        (flat.mobile_number || "")
          .toLowerCase()
          .includes(keyword) ||
        (flat.receipt_number || "")
          .toLowerCase()
          .includes(keyword) ||
        (flat.transaction_id || "")
          .toLowerCase()
          .includes(keyword)
      );
    });

  const formatAmount = (
    amount: number | string | null
  ) =>
    Number(amount || 0).toLocaleString(
      "en-IN"
    );

  const formatDate = (
    date: string | null
  ) => {
    if (!date) {
      return "-";
    }

    return new Date(
      `${date}T00:00:00`
    ).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
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
                placeholder="Search flat, owner, mobile..."
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div className="bg-white rounded-2xl shadow-lg border p-6">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-gray-500 font-medium">
                    Flats Collected
                  </p>

                  <h2 className="text-4xl font-bold text-blue-900 mt-2">
                    {totalFlats}
                  </h2>
                </div>

                <div className="bg-blue-100 text-blue-700 text-3xl p-5 rounded-2xl">
                  <FaHome />
                </div>

              </div>

            </div>

            <div className="bg-white rounded-2xl shadow-lg border p-6">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-gray-500 font-medium">
                    Total Collection
                  </p>

                  <h2 className="text-4xl font-bold text-green-700 mt-2">
                    ₹
                    {totalCollection.toLocaleString(
                      "en-IN"
                    )}
                  </h2>
                </div>

                <div className="bg-green-100 text-green-700 text-3xl p-5 rounded-2xl">
                  <FaRupeeSign />
                </div>

              </div>

            </div>

          </div>

          {/* Results Count */}

          <div className="bg-white rounded-xl shadow border p-5">

            <p className="text-gray-500">
              Showing{" "}
              <span className="font-bold text-blue-900">
                {
                  filteredCollections.length
                }
              </span>{" "}
              of{" "}
              <span className="font-bold text-blue-900">
                {totalFlats}
              </span>{" "}
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