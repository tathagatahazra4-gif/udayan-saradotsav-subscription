"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FaFileExcel,
  FaMoneyBillWave,
  FaCheckCircle,
  FaTimesCircle,
  FaList,
} from "react-icons/fa";

import AppLayout from "@/components/layout/AppLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

import { getReportData } from "@/services/reportService";
import { exportToExcel } from "@/services/exportService";

export default function ReportsPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  useEffect(() => {
    async function load() {
      try {
        const data = await getReportData();
        setRows(data);
      } catch (err) {
        console.error(err);
      }
    }

    load();
  }, []);

  const filtered = useMemo(() => {
    return rows.filter((row) => {
      const keyword = search.toLowerCase();

      const matchesSearch =
        row.flat_number.toLowerCase().includes(keyword) ||
        (row.owner_name || "")
          .toLowerCase()
          .includes(keyword) ||
        (row.mobile_number || "")
          .includes(keyword);

      const matchesStatus =
        status === "All" ||
        row.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [rows, search, status]);

  const totalCollection = filtered
    .filter((r) => r.status === "Paid")
    .reduce(
      (sum, r) => sum + (r.subscription_amount || 0),
      0
    );

  const paidCount = filtered.filter(
    (r) => r.status === "Paid"
  ).length;

  const pendingCount = filtered.filter(
    (r) => r.status === "Pending"
  ).length;

  return (
    <ProtectedRoute>
      <AppLayout>

        <div className="space-y-6">

          {/* Header */}

          <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-5">

            <div>

              <h1 className="text-4xl font-bold text-blue-900">
                Reports
              </h1>

              <p className="text-gray-500 mt-2">
                View, filter and export subscription reports.
              </p>

            </div>

            <button
              onClick={() => exportToExcel(filtered)}
              className="flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl shadow-lg font-semibold transition"
            >
              <FaFileExcel />
              Export to Excel
            </button>

          </div>

          {/* Summary Cards */}

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

            <div className="bg-green-600 rounded-2xl text-white p-6 shadow-lg">

              <div className="flex justify-between items-center">

                <div>

                  <p>Total Collection</p>

                  <h2 className="text-3xl font-bold mt-2">
                    ₹{totalCollection}
                  </h2>

                </div>

                <FaMoneyBillWave className="text-4xl opacity-80" />

              </div>

            </div>

            <div className="bg-blue-600 rounded-2xl text-white p-6 shadow-lg">

              <div className="flex justify-between items-center">

                <div>

                  <p>Total Records</p>

                  <h2 className="text-3xl font-bold mt-2">
                    {filtered.length}
                  </h2>

                </div>

                <FaList className="text-4xl opacity-80" />

              </div>

            </div>

            <div className="bg-green-700 rounded-2xl text-white p-6 shadow-lg">

              <div className="flex justify-between items-center">

                <div>

                  <p>Paid Flats</p>

                  <h2 className="text-3xl font-bold mt-2">
                    {paidCount}
                  </h2>

                </div>

                <FaCheckCircle className="text-4xl opacity-80" />

              </div>

            </div>

            <div className="bg-red-600 rounded-2xl text-white p-6 shadow-lg">

              <div className="flex justify-between items-center">

                <div>

                  <p>Pending Flats</p>

                  <h2 className="text-3xl font-bold mt-2">
                    {pendingCount}
                  </h2>

                </div>

                <FaTimesCircle className="text-4xl opacity-80" />

              </div>

            </div>

          </div>

          {/* Filters */}

          <div className="bg-white rounded-2xl shadow-lg p-6">

            <div className="flex flex-col lg:flex-row gap-4">

              <input
                placeholder="Search Flat / Owner / Mobile..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="border rounded-lg px-4 py-3 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value)
                }
                className="border rounded-lg px-4 py-3 w-full lg:w-56"
              >
                <option>All</option>
                <option>Paid</option>
                <option>Pending</option>
              </select>

            </div>

          </div>

          {/* Report Table */}

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

                {filtered.length === 0 ? (

                  <tr>

                    <td
                      colSpan={5}
                      className="text-center py-12 text-gray-500"
                    >
                      No records found.
                    </td>

                  </tr>

                ) : (

                  filtered.map((row) => (

                    <tr
                      key={row.flat_number}
                      className="border-b hover:bg-blue-50 transition"
                    >

                      <td className="p-4 font-semibold">
                        {row.flat_number}
                      </td>

                      <td className="p-4">
                        {row.owner_name || "-"}
                      </td>

                      <td className="p-4">
                        {row.mobile_number || "-"}
                      </td>

                      <td className="p-4 text-center font-semibold">
                        ₹{row.subscription_amount}
                      </td>

                      <td className="p-4 text-center">

                        <span
                          className={`px-4 py-2 rounded-full text-white text-sm font-medium ${
                            row.status === "Paid"
                              ? "bg-green-600"
                              : "bg-red-600"
                          }`}
                        >
                          {row.status}
                        </span>

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