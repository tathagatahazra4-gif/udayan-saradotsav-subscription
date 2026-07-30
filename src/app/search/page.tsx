"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FaSearch,
  FaUser,
  FaPhone,
  FaUsers,
  FaMoneyBillWave,
  FaFilePdf,
  FaEdit,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

import AppLayout from "@/components/layout/AppLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

import { searchFlat } from "@/services/flatsService";
import { generateReceipt } from "@/services/pdfReceiptServices";

export default function SearchPage() {
  const [flatNo, setFlatNo] = useState("");
  const [flat, setFlat] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function handleSearch() {
    if (!flatNo.trim()) {
      alert("Please enter a Flat Number.");
      return;
    }

    try {
      setLoading(true);

      const data = await searchFlat(flatNo.trim());

      setFlat(data);
    } catch {
      alert("Flat not found.");
      setFlat(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ProtectedRoute>
      <AppLayout>

        <div className="max-w-5xl mx-auto space-y-8">

          {/* Header */}

          <div>

            <h1 className="text-4xl font-bold text-blue-900">
              Search Subscription
            </h1>

            <p className="text-gray-500 mt-2">
              Search any resident using the Flat Number.
            </p>

          </div>

          {/* Search Box */}

          <div className="bg-white rounded-2xl shadow-lg p-6">

            <div className="flex flex-col lg:flex-row gap-4">

              <input
                value={flatNo}
                onChange={(e) => setFlatNo(e.target.value)}
                placeholder="Enter Flat Number (Example: UV-12-02B)"
                className="flex-1 border rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
              />

              <button
                onClick={handleSearch}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold shadow flex items-center justify-center gap-3"
              >
                <FaSearch />

                {loading ? "Searching..." : "Search"}

              </button>

            </div>

          </div>

          {/* Result */}

          {flat && (

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

              {/* Top */}

              <div
                className={`p-6 text-white ${
                  flat.status === "Paid"
                    ? "bg-green-600"
                    : "bg-red-600"
                }`}
              >

                <div className="flex justify-between items-center">

                  <div>

                    <h2 className="text-3xl font-bold">
                      {flat.flat_number}
                    </h2>

                    <p className="opacity-90">
                      Resident Details
                    </p>

                  </div>

                  <div className="text-5xl">

                    {flat.status === "Paid" ? (
                      <FaCheckCircle />
                    ) : (
                      <FaTimesCircle />
                    )}

                  </div>

                </div>

              </div>

              {/* Details */}

              <div className="grid md:grid-cols-2 gap-8 p-8">

                <div className="space-y-5">

                  <div className="flex items-center gap-4">

                    <FaUser className="text-blue-600 text-xl" />

                    <div>

                      <p className="text-gray-500">
                        Owner
                      </p>

                      <h3 className="font-semibold">
                        {flat.owner_name || "-"}
                      </h3>

                    </div>

                  </div>

                  <div className="flex items-center gap-4">

                    <FaPhone className="text-green-600 text-xl" />

                    <div>

                      <p className="text-gray-500">
                        Mobile
                      </p>

                      <h3 className="font-semibold">
                        {flat.mobile_number || "-"}
                      </h3>

                    </div>

                  </div>

                  <div className="flex items-center gap-4">

                    <FaUsers className="text-purple-600 text-xl" />

                    <div>

                      <p className="text-gray-500">
                        Family Members
                      </p>

                      <h3 className="font-semibold">
                        {flat.family_members}
                      </h3>

                    </div>

                  </div>

                </div>

                <div className="space-y-5">

                  <div className="flex items-center gap-4">

                    <FaMoneyBillWave className="text-orange-600 text-xl" />

                    <div>

                      <p className="text-gray-500">
                        Subscription
                      </p>

                      <h3 className="font-semibold">
                        ₹{flat.subscription_amount}
                      </h3>

                    </div>

                  </div>

                  <div>

                    <p className="text-gray-500">
                      Payment Mode
                    </p>

                    <h3 className="font-semibold">
                      {flat.payment_mode || "-"}
                    </h3>

                  </div>

                  <div>

                    <p className="text-gray-500">
                      Receipt Number
                    </p>

                    <h3 className="font-semibold">
                      {flat.receipt_number || "-"}
                    </h3>

                  </div>

                  <div>

                    <p className="text-gray-500">
                      Status
                    </p>

                    <span
                      className={`inline-block mt-1 px-4 py-2 rounded-full text-white font-semibold ${
                        flat.status === "Paid"
                          ? "bg-green-600"
                          : "bg-red-600"
                      }`}
                    >
                      {flat.status}
                    </span>

                  </div>

                </div>

              </div>

              {/* Buttons */}

              <div className="border-t bg-gray-50 p-6 flex flex-col md:flex-row gap-4">

                <Link
                  href={`/flats/${flat.flat_number}`}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-4 rounded-xl font-semibold flex items-center justify-center gap-3"
                >
                  <FaEdit />

                  Edit Payment

                </Link>

                <button
                  onClick={() => generateReceipt(flat)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-3"
                >
                  <FaFilePdf />

                  Download Receipt

                </button>

              </div>

            </div>

          )}

        </div>

      </AppLayout>
    </ProtectedRoute>
  );
}