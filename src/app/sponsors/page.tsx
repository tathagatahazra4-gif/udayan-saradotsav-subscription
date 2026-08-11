"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  FaBullhorn,
  FaEdit,
  FaRupeeSign,
} from "react-icons/fa";

import AppLayout from "@/components/layout/AppLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

import {
  addSponsor,
  getSponsors,
} from "@/services/sponsorService";

export default function SponsorsPage() {
  const [sponsors, setSponsors] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [form, setForm] =
    useState({
      company_name: "",
      amount: "",
      payment_mode: "",
      cheque_number: "",
      voucher_id: "",
    });

  async function loadSponsors() {
    try {
      setLoading(true);

      const data =
        await getSponsors();

      setSponsors(data);
    } catch (err) {
      console.error(err);

      alert(
        "Failed to load sponsor records."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSponsors();
  }, []);

  async function handleSave() {
    if (
      !form.company_name.trim()
    ) {
      alert(
        "Company Name is required."
      );

      return;
    }

    if (
      !form.amount ||
      Number(form.amount) <= 0
    ) {
      alert(
        "Amount must be greater than zero."
      );

      return;
    }

    if (!form.payment_mode) {
      alert(
        "Payment Mode is required."
      );

      return;
    }

    try {
      setSaving(true);

      await addSponsor({
        company_name:
          form.company_name,

        amount:
          Number(form.amount),

        payment_mode:
          form.payment_mode,

        cheque_number:
          form.cheque_number,

        voucher_id:
          form.voucher_id,
      });

      alert(
        "Sponsor record saved successfully."
      );

      setForm({
        company_name: "",
        amount: "",
        payment_mode: "",
        cheque_number: "",
        voucher_id: "",
      });

      await loadSponsors();
    } catch (err: any) {
      console.error(err);

      alert(
        err?.message ||
          "Failed to save sponsor record."
      );
    } finally {
      setSaving(false);
    }
  }

  const totalSponsors =
    sponsors.reduce(
      (sum, row) =>
        sum +
        Number(
          row.amount || 0
        ),
      0
    );

  const formatAmount = (
    amount: number
  ) =>
    Number(
      amount || 0
    ).toLocaleString(
      "en-IN"
    );

  return (
    <ProtectedRoute>
      <AppLayout>

        <div className="space-y-8">

          {/* Header */}

          <div>

            <h1 className="text-4xl font-bold text-blue-900">
              Advertisement & Sponsors
            </h1>

            <p className="text-gray-500 mt-2">
              Record advertisement and sponsor contributions.
            </p>

          </div>

          {/* Summary */}

          <div className="bg-white rounded-2xl shadow-lg border p-6">

            <div className="flex justify-between items-center">

              <div>

                <p className="text-gray-500">
                  Total Sponsor Collection
                </p>

                <h2 className="text-4xl font-bold text-green-700 mt-2">
                  ₹
                  {formatAmount(
                    totalSponsors
                  )}
                </h2>

              </div>

              <FaBullhorn className="text-5xl text-purple-600" />

            </div>

          </div>

          {/* Form */}

          <div className="bg-white rounded-2xl shadow-lg border p-6">

            <h2 className="text-2xl font-bold mb-6">
              Add Sponsor / Advertisement
            </h2>

            <div className="grid md:grid-cols-2 gap-5">

              {/* Company Name */}

              <div>

                <label className="font-semibold block mb-2">
                  Company Name *
                </label>

                <input
                  value={
                    form.company_name
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,

                      company_name:
                        e.target.value,
                    })
                  }
                  className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter company name"
                />

              </div>

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
                    placeholder="Enter amount"
                  />

                </div>

              </div>

              {/* Payment Mode */}

              <div>

                <label className="font-semibold block mb-2">
                  Payment Mode *
                </label>

                <select
                  value={
                    form.payment_mode
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,

                      payment_mode:
                        e.target.value,
                    })
                  }
                  className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >

                  <option value="">
                    Select Payment Mode
                  </option>

                  <option value="Cash">
                    Cash
                  </option>

                  <option value="UPI">
                    UPI
                  </option>

                  <option value="Bank Transfer">
                    Bank Transfer
                  </option>

                  <option value="Cheque">
                    Cheque
                  </option>

                </select>

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

              {/* Voucher ID */}

              <div className="md:col-span-2">

                <label className="font-semibold block mb-2">
                  Voucher ID
                  <span className="text-gray-400 font-normal">
                    {" "}
                    (Optional)
                  </span>
                </label>

                <input
                  value={
                    form.voucher_id
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,

                      voucher_id:
                        e.target.value,
                    })
                  }
                  className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter payment received voucher ID"
                />

              </div>

            </div>

            <button
              type="button"
              onClick={
                handleSave
              }
              disabled={
                saving
              }
              className="mt-8 w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-4 rounded-xl font-semibold"
            >
              {saving
                ? "Saving..."
                : "Save Sponsor"}
            </button>

          </div>

          {/* History */}

          <div className="bg-white rounded-2xl shadow-lg border overflow-x-auto">

            <table className="min-w-[1100px] w-full">

              <thead className="bg-blue-900 text-white">

                <tr>

                  <th className="p-4 text-left">
                    Company
                  </th>

                  <th className="p-4 text-center">
                    Amount
                  </th>

                  <th className="p-4 text-center">
                    Payment Mode
                  </th>

                  <th className="p-4 text-center">
                    Cheque
                  </th>

                  <th className="p-4 text-center">
                    Voucher ID
                  </th>

                  <th className="p-4 text-center">
                    Collected By
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
                      colSpan={7}
                      className="text-center py-10"
                    >
                      Loading...
                    </td>

                  </tr>

                ) : sponsors.length === 0 ? (

                  <tr>

                    <td
                      colSpan={7}
                      className="text-center py-10 text-gray-500"
                    >
                      No sponsor records found.
                    </td>

                  </tr>

                ) : (

                  sponsors.map(
                    (sponsor) => (

                      <tr
                        key={sponsor.id}
                        className="border-b hover:bg-blue-50"
                      >

                        <td className="p-4 font-semibold">
                          {
                            sponsor.company_name
                          }
                        </td>

                        <td className="p-4 text-center font-bold text-green-700">
                          ₹
                          {formatAmount(
                            sponsor.amount
                          )}
                        </td>

                        <td className="p-4 text-center whitespace-nowrap">
                          {
                            sponsor.payment_mode
                          }
                        </td>

                        <td className="p-4 text-center whitespace-nowrap">
                          {sponsor.cheque_number ||
                            "-"}
                        </td>

                        <td className="p-4 text-center whitespace-nowrap font-semibold text-blue-800">
                          {sponsor.voucher_id ||
                            "-"}
                        </td>

                        <td className="p-4 text-center whitespace-nowrap">
                          {sponsor.created_by ||
                            sponsor.collected_by ||
                            "-"}
                        </td>

                        <td className="p-4 text-center">

                          <Link
                            href={`/sponsors/${sponsor.id}`}
                            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
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

      </AppLayout>
    </ProtectedRoute>
  );
}