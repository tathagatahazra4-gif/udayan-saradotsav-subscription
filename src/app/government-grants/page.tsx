"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  FaLandmark,
  FaEdit,
  FaRupeeSign,
} from "react-icons/fa";

import AppLayout from "@/components/layout/AppLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

import {
  addGovernmentGrant,
  getGovernmentGrants,
} from "@/services/governmentGrantService";

export default function GovernmentGrantsPage() {
  const [grants, setGrants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    amount: "",
    cheque_number: "",
    received_from: "",
  });

  async function loadGrants() {
    try {
      setLoading(true);

      const data =
        await getGovernmentGrants();

      setGrants(data);
    } catch (err) {
      console.error(err);

      alert(
        "Failed to load Government Grant records."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadGrants();
  }, []);

  async function handleSave() {
    if (
      !form.amount ||
      Number(form.amount) <= 0
    ) {
      alert(
        "Amount must be greater than zero."
      );

      return;
    }

    try {
      setSaving(true);

      await addGovernmentGrant({
        amount:
          Number(form.amount),

        cheque_number:
          form.cheque_number,

        received_from:
          form.received_from,
      });

      alert(
        "Government Grant saved successfully."
      );

      setForm({
        amount: "",
        cheque_number: "",
        received_from: "",
      });

      await loadGrants();
    } catch (err: any) {
      console.error(err);

      alert(
        err?.message ||
          "Failed to save Government Grant."
      );
    } finally {
      setSaving(false);
    }
  }

  const totalGrant =
    grants.reduce(
      (sum, row) =>
        sum +
        Number(row.amount || 0),
      0
    );

  const formatAmount = (
    amount: number
  ) =>
    Number(
      amount || 0
    ).toLocaleString("en-IN");

  return (
    <ProtectedRoute>
      <AppLayout>

        <div className="space-y-8">

          {/* Header */}

          <div>

            <h1 className="text-4xl font-bold text-blue-900">
              Government Grants
            </h1>

            <p className="text-gray-500 mt-2">
              Record grants received from Government departments or agencies.
            </p>

          </div>

          {/* Summary */}

          <div className="bg-white rounded-2xl shadow-lg border p-6">

            <div className="flex justify-between items-center">

              <div>

                <p className="text-gray-500">
                  Total Government Grant
                </p>

                <h2 className="text-4xl font-bold text-green-700 mt-2">
                  ₹
                  {formatAmount(
                    totalGrant
                  )}
                </h2>

              </div>

              <FaLandmark className="text-5xl text-teal-600" />

            </div>

          </div>

          {/* Form */}

          <div className="bg-white rounded-2xl shadow-lg border p-6">

            <h2 className="text-2xl font-bold mb-6">
              Add Government Grant
            </h2>

            <div className="grid md:grid-cols-2 gap-5">

              {/* Amount */}

              <div>

                <label className="font-semibold block mb-2">
                  Amount *
                </label>

                <div className="relative">

                  <FaRupeeSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                  <input
                    type="number"
                    min="1"
                    value={
                      form.amount
                    }
                    onChange={(e) =>
                      setForm({
                        ...form,
                        amount:
                          e.target.value,
                      })
                    }
                    className="w-full border rounded-lg pl-9 pr-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter grant amount"
                  />

                </div>

              </div>

              {/* Cheque Number */}

              <div>

                <label className="font-semibold block mb-2">
                  Cheque Number
                  <span className="text-gray-400 font-normal">
                    {" "}
                    (Optional)
                  </span>
                </label>

                <input
                  value={
                    form.cheque_number
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,
                      cheque_number:
                        e.target.value,
                    })
                  }
                  className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter cheque number"
                />

              </div>

              {/* Received From */}

              <div className="md:col-span-2">

                <label className="font-semibold block mb-2">
                  Received From
                  <span className="text-gray-400 font-normal">
                    {" "}
                    (Optional)
                  </span>
                </label>

                <input
                  value={
                    form.received_from
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,
                      received_from:
                        e.target.value,
                    })
                  }
                  className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Example: Kolkata Municipal Corporation"
                />

              </div>

            </div>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="mt-8 w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-4 rounded-xl font-semibold"
            >
              {saving
                ? "Saving..."
                : "Save Government Grant"}
            </button>

          </div>

          {/* History */}

          <div className="bg-white rounded-2xl shadow-lg border overflow-x-auto">

            <table className="min-w-[850px] w-full">

              <thead className="bg-blue-900 text-white">

                <tr>

                  <th className="p-4 text-left">
                    Received From
                  </th>

                  <th className="p-4 text-center">
                    Amount
                  </th>

                  <th className="p-4 text-center">
                    Cheque Number
                  </th>

                  <th className="p-4 text-center">
                    Date
                  </th>

                  <th className="p-4 text-center">
                    Created By
                  </th>

                  <th className="p-4 text-center">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {loading ? (

                  <tr>

                    <td
                      colSpan={6}
                      className="text-center py-10"
                    >
                      Loading...
                    </td>

                  </tr>

                ) : grants.length === 0 ? (

                  <tr>

                    <td
                      colSpan={6}
                      className="text-center py-10 text-gray-500"
                    >
                      No Government Grant records found.
                    </td>

                  </tr>

                ) : (

                  grants.map((grant) => (

                    <tr
                      key={grant.id}
                      className="border-b hover:bg-blue-50"
                    >

                      <td className="p-4 font-semibold">
                        {grant.received_from ||
                          "-"}
                      </td>

                      <td className="p-4 text-center font-bold text-green-700">
                        ₹
                        {formatAmount(
                          grant.amount
                        )}
                      </td>

                      <td className="p-4 text-center">
                        {grant.cheque_number ||
                          "-"}
                      </td>

                      <td className="p-4 text-center whitespace-nowrap">
                        {grant.received_date ||
                          "-"}
                      </td>

                      <td className="p-4 text-center">
                        {grant.created_by ||
                          "-"}
                      </td>

                      <td className="p-4 text-center">

                        <Link
                          href={`/government-grants/${grant.id}`}
                          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                        >
                          <FaEdit />
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