"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaBuilding } from "react-icons/fa";

import AppLayout from "@/components/layout/AppLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

import { getBuildingCollection } from "@/services/chartService";

export default function BuildingsPage() {
  const [buildings, setBuildings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await getBuildingCollection();
        setBuildings(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const filteredBuildings = buildings.filter((building) =>
    building.building.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <ProtectedRoute>
        <AppLayout>
          <div className="flex items-center justify-center h-[70vh]">
            <h2 className="text-2xl font-semibold">
              Loading Buildings...
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

          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">

            <div>

              <h1 className="text-2xl md:text-4xl font-bold text-blue-900">
                Buildings Overview
              </h1>

              <p className="text-sm md:text-base text-gray-500 mt-1 md:mt-2">
                View collection progress for each building.
              </p>

            </div>

            <input
              type="text"
              placeholder="Search Building..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-80 border rounded-xl px-4 py-3 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

          {/* Summary */}

          <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6">

            <div className="flex justify-between items-center">

              <div>

                <p className="text-gray-500">
                  Total Buildings
                </p>

                <h2 className="text-2xl md:text-3xl font-bold text-blue-900">
                  {filteredBuildings.length}
                </h2>

              </div>

              <FaBuilding className="text-4xl md:text-5xl text-blue-600" />

            </div>

          </div>

          {/* Building Cards */}

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

            {filteredBuildings.map((building) => {

              const total = building.paid + building.pending;

              const percentage =
                total === 0
                  ? 0
                  : Math.round((building.paid / total) * 100);

              return (

                <div
                  key={building.building}
                  className="bg-white rounded-2xl shadow-lg p-5 md:p-6 hover:shadow-xl transition-all duration-300"
                >

                  <div className="flex justify-between items-center">

                    <div>

                      <h2 className="text-xl md:text-2xl font-bold text-blue-900">
                        {building.building}
                      </h2>

                      <p className="text-gray-500 text-sm">
                        Building Summary
                      </p>

                    </div>

                    <FaBuilding className="text-3xl md:text-4xl text-blue-500" />

                  </div>

                  {/* Statistics */}

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">

                    <div>

                      <p className="text-gray-500 text-sm">
                        Paid
                      </p>

                      <h3 className="text-xl md:text-2xl font-bold text-green-600">
                        {building.paid}
                      </h3>

                    </div>

                    <div>

                      <p className="text-gray-500 text-sm">
                        Pending
                      </p>

                      <h3 className="text-xl md:text-2xl font-bold text-red-600">
                        {building.pending}
                      </h3>

                    </div>

                    <div className="col-span-2 md:col-span-1">

                      <p className="text-gray-500 text-sm">
                        Collection
                      </p>

                      <h3 className="text-lg md:text-xl font-bold text-purple-700 break-words">
                        ₹{building.collection}
                      </h3>

                    </div>

                  </div>

                  {/* Progress */}

                  <div className="mt-6">

                    <div className="flex justify-between text-sm mb-2">

                      <span>
                        Collection Progress
                      </span>

                      <span className="font-semibold">
                        {percentage}%
                      </span>

                    </div>

                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">

                      <div
                        className="h-3 bg-green-600 rounded-full transition-all duration-500"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />

                    </div>

                  </div>

                  {/* Button */}

                  <div className="mt-8">

                    <Link
                      href={`/buildings/${building.building}`}
                      className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition text-base"
                    >
                      View Flats →
                    </Link>

                  </div>

                </div>

              );
            })}

            {filteredBuildings.length === 0 && (

              <div className="col-span-full bg-white rounded-2xl shadow p-10 text-center text-gray-500">

                No buildings found.

              </div>

            )}

          </div>

        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}