"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import AppLayout from "@/components/layout/AppLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

import { getBuildingFlats } from "@/services/buildingService";

export default function BuildingDetailsPage() {
  const { building } = useParams();

  const [flats, setFlats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  useEffect(() => {
    async function load() {
      try {
        const data = await getBuildingFlats(building as string);
        setFlats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (building) {
      load();
    }
  }, [building]);

  const filteredFlats = useMemo(() => {
    return flats.filter((flat) => {
      const matchesSearch =
        flat.flat_number
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        flat.owner_name
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        flat.mobile_number
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        status === "All" ||
        flat.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [flats, search, status]);

  const totalFlats = flats.length;

  const paidFlats = flats.filter(
    (flat) => flat.status === "Paid"
  ).length;

  const pendingFlats = totalFlats - paidFlats;

  const totalCollection = flats
    .filter((flat) => flat.status === "Paid")
    .reduce(
      (sum, flat) => sum + (flat.subscription_amount || 0),
      0
    );

  const collectionPercentage =
    totalFlats === 0
      ? 0
      : Math.round((paidFlats / totalFlats) * 100);

  if (loading) {
    return (
      <ProtectedRoute>
        <AppLayout>
          <div className="p-8 text-xl font-semibold">
            Loading Building...
          </div>
        </AppLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <AppLayout>

        <div className="space-y-8">

          <div>

            <h1 className="text-4xl font-bold">
              Building {building}
            </h1>

            <p className="text-gray-500 mt-2">
              Building Overview
            </p>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">

            <div className="bg-blue-600 text-white rounded-xl p-5 shadow">
              <p>Total Flats</p>

              <h2 className="text-3xl font-bold mt-2">
                {totalFlats}
              </h2>
            </div>

            <div className="bg-green-600 text-white rounded-xl p-5 shadow">
              <p>Paid Flats</p>

              <h2 className="text-3xl font-bold mt-2">
                {paidFlats}
              </h2>
            </div>

            <div className="bg-red-600 text-white rounded-xl p-5 shadow">
              <p>Pending Flats</p>

              <h2 className="text-3xl font-bold mt-2">
                {pendingFlats}
              </h2>
            </div>

            <div className="bg-purple-600 text-white rounded-xl p-5 shadow">
              <p>Collection</p>

              <h2 className="text-3xl font-bold mt-2">
                ₹{totalCollection}
              </h2>
            </div>

          </div>

          <div className="bg-white rounded-xl shadow p-6">

            <div className="flex justify-between items-center mb-2">

              <h2 className="font-bold text-lg">
                Collection Progress
              </h2>

              <span className="font-semibold">
                {collectionPercentage}%
              </span>

            </div>

            <div className="w-full bg-gray-200 rounded-full h-4">

              <div
                className="bg-green-600 h-4 rounded-full transition-all duration-500"
                style={{
                  width: `${collectionPercentage}%`,
                }}
              />

            </div>

          </div>

          <div className="flex flex-col md:flex-row gap-4">

            <input
              type="text"
              placeholder="Search Flat / Owner / Mobile"
              className="border rounded-lg p-3 flex-1"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            <select
              className="border rounded-lg p-3 w-48"
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
            >
              <option>All</option>
              <option>Paid</option>
              <option>Pending</option>
            </select>

          </div>

          <div className="bg-white rounded-xl shadow overflow-hidden">

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
                    Status
                  </th>

                  <th className="p-4 text-center">
                    Amount
                  </th>

                  <th className="p-4 text-center">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredFlats.map((flat) => (

                  <tr
                    key={flat.flat_number}
                    className="border-t hover:bg-gray-50"
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

                      <span
                        className={`px-3 py-1 rounded-full text-white text-sm ${
                          flat.status === "Paid"
                            ? "bg-green-600"
                            : "bg-red-600"
                        }`}
                      >
                        {flat.status}
                      </span>

                    </td>

                    <td className="p-4 text-center">
                      ₹{flat.subscription_amount}
                    </td>

                    <td className="p-4 text-center">

                      <Link
                        href={`/flats/${flat.flat_number}`}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                      >
                        Edit
                      </Link>

                    </td>

                  </tr>

                ))}

                {filteredFlats.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center p-8 text-gray-500"
                    >
                      No flats found.
                    </td>
                  </tr>
                )}

              </tbody>

            </table>

          </div>

        </div>

      </AppLayout>
    </ProtectedRoute>
  );
}