"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import AppLayout from "@/components/layout/AppLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

import { getAllFlats } from "@/services/flatsService";

export default function FlatsPage() {
  const [flats, setFlats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await getAllFlats();
        setFlats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const filteredFlats = flats.filter((flat) => {
    const keyword = search.toLowerCase();

    return (
      flat.flat_number.toLowerCase().includes(keyword) ||
      (flat.owner_name || "")
        .toLowerCase()
        .includes(keyword) ||
      (flat.mobile_number || "").includes(keyword)
    );
  });

  if (loading) {
    return (
      <ProtectedRoute>
        <AppLayout>
          <div className="flex items-center justify-center h-[70vh]">
            <h2 className="text-2xl font-semibold">
              Loading Flats...
            </h2>
          </div>
        </AppLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="space-y-6">

          {/* Header */}

          <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-5">

            <div>

              <h1 className="text-4xl font-bold text-blue-900">
                Flats Management
              </h1>

              <p className="text-gray-500 mt-2">
                View and manage all flats in the society.
              </p>

            </div>

            <input
              type="text"
              placeholder="Search Flat / Owner / Mobile..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded-lg px-4 py-3 w-full lg:w-96 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

          {/* Summary */}

          <div className="bg-white rounded-2xl shadow-lg p-6">

            <div className="flex justify-between items-center">

              <div>

                <p className="text-gray-500">
                  Total Flats
                </p>

                <h2 className="text-3xl font-bold text-blue-900">
                  {filteredFlats.length}
                </h2>

              </div>

              <div className="text-right">

                <p className="text-gray-500">
                  Showing Results
                </p>

                <h2 className="text-xl font-semibold">
                  {filteredFlats.length}
                </h2>

              </div>

            </div>

          </div>

          {/* Table */}

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
                    Members
                  </th>

                  <th className="p-4 text-center">
                    Subscription
                  </th>

                  <th className="p-4 text-center">
                    Status
                  </th>

                  <th className="p-4 text-center">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredFlats.length === 0 ? (

                  <tr>

                    <td
                      colSpan={7}
                      className="text-center py-12 text-gray-500"
                    >
                      No flats found.
                    </td>

                  </tr>

                ) : (

                  filteredFlats.map((flat) => (

                    <tr
                      key={flat.flat_number}
                      className="border-b hover:bg-blue-50 transition"
                    >

                      <td className="p-4 font-semibold">
                        {flat.flat_number}
                      </td>

                      <td className="p-4">
                        {flat.owner_name || "-"}
                      </td>

                      <td className="p-4">
                        {flat.mobile_number || "-"}
                      </td>

                      <td className="p-4 text-center">
                        {flat.family_members}
                      </td>

                      <td className="p-4 text-center font-semibold">
                        ₹{flat.subscription_amount}
                      </td>

                      <td className="p-4 text-center">

                        <span
                          className={`px-4 py-2 rounded-full text-white text-sm font-medium ${
                            flat.status === "Paid"
                              ? "bg-green-600"
                              : "bg-red-600"
                          }`}
                        >
                          {flat.status}
                        </span>

                      </td>

                      <td className="p-4 text-center">

                        <Link
                          href={`/flats/${flat.flat_number}`}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow transition"
                        >
                          Edit
                        </Link>

                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}