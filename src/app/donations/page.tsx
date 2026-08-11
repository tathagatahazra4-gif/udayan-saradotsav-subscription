"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  FaDonate,
  FaEdit,
  FaMoneyBill,
  FaMobileAlt,
  FaUniversity,
  FaMoneyCheckAlt,
} from "react-icons/fa";

import AppLayout from "@/components/layout/AppLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

import {
  getDonations,
  addDonation,
} from "@/services/donationService";

export default function DonationsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [donations, setDonations] = useState<any[]>([]);

  const [form, setForm] = useState({
    donor_name: "",
    amount: "",
    flat_number: "",
    mobile_number: "",
    bill_number: "",
    payment_mode: "",
    purpose: "",
  });

  async function loadDonations() {
    try {
      setLoading(true);

      const data = await getDonations();

      setDonations(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load donations.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDonations();
  }, []);

  async function handleSave() {
    if (!form.donor_name.trim()) {
      return alert(
        "Donor Name is required."
      );
    }

    if (
      !form.amount ||
      Number(form.amount) <= 0
    ) {
      return alert(
        "Donation Amount is required."
      );
    }

    // Payment Mode is mandatory
    if (!form.payment_mode) {
      return alert(
        "Payment Mode is required."
      );
    }

    if (
      form.mobile_number &&
      !/^\d{10}$/.test(
        form.mobile_number
      )
    ) {
      return alert(
        "Mobile Number must contain exactly 10 digits."
      );
    }

    try {
      setSaving(true);

      await addDonation({
        donor_name:
          form.donor_name.trim(),

        amount:
          Number(form.amount),

        flat_number:
          form.flat_number.trim(),

        mobile_number:
          form.mobile_number,

        bill_number:
          form.bill_number.trim(),

        payment_mode:
          form.payment_mode,

        purpose:
          form.purpose,
      });

      alert(
        "Donation collected successfully."
      );

      setForm({
        donor_name: "",
        amount: "",
        flat_number: "",
        mobile_number: "",
        bill_number: "",
        payment_mode: "",
        purpose: "",
      });

      await loadDonations();
    } catch (err: any) {
      console.error(err);

      alert(
        err?.message ||
          "Failed to save donation."
      );
    } finally {
      setSaving(false);
    }
  }

  const totalAmount = donations.reduce(
    (sum, donation) =>
      sum +
      Number(
        donation.amount || 0
      ),
    0
  );

  const cashDonation = donations
    .filter(
      (donation) =>
        donation.payment_mode === "Cash"
    )
    .reduce(
      (sum, donation) =>
        sum +
        Number(
          donation.amount || 0
        ),
      0
    );

  const upiDonation = donations
    .filter(
      (donation) =>
        donation.payment_mode === "UPI"
    )
    .reduce(
      (sum, donation) =>
        sum +
        Number(
          donation.amount || 0
        ),
      0
    );

  const bankTransferDonation = donations
    .filter(
      (donation) =>
        donation.payment_mode ===
        "Bank Transfer"
    )
    .reduce(
      (sum, donation) =>
        sum +
        Number(
          donation.amount || 0
        ),
      0
    );

  const chequeDonation = donations
    .filter(
      (donation) =>
        donation.payment_mode ===
        "Cheque"
    )
    .reduce(
      (sum, donation) =>
        sum +
        Number(
          donation.amount || 0
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
              Donations
            </h1>

            <p className="text-gray-500 mt-2">
              Collect Puja donations and maintain records.
            </p>
          </div>

          {/* Donation Summary */}

          <div>

            <h2 className="text-2xl font-bold text-gray-800 mb-5">
              Donation Collection Summary
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5">

              {/* Total */}

              <div className="bg-white rounded-2xl shadow-lg border p-6">

                <div className="flex items-center justify-between gap-4">

                  <div>

                    <p className="text-gray-500">
                      Total Donations
                    </p>

                    <h2 className="text-3xl font-bold text-green-700 mt-2">
                      ₹
                      {formatAmount(
                        totalAmount
                      )}
                    </h2>

                  </div>

                  <FaDonate className="text-4xl text-green-600" />

                </div>

              </div>

              {/* Cash */}

              <div className="bg-white rounded-2xl shadow-lg border p-6">

                <div className="flex items-center justify-between gap-4">

                  <div>

                    <p className="text-gray-500">
                      Cash Donations
                    </p>

                    <h2 className="text-3xl font-bold text-emerald-700 mt-2">
                      ₹
                      {formatAmount(
                        cashDonation
                      )}
                    </h2>

                  </div>

                  <FaMoneyBill className="text-4xl text-emerald-600" />

                </div>

              </div>

              {/* UPI */}

              <div className="bg-white rounded-2xl shadow-lg border p-6">

                <div className="flex items-center justify-between gap-4">

                  <div>

                    <p className="text-gray-500">
                      UPI Donations
                    </p>

                    <h2 className="text-3xl font-bold text-cyan-700 mt-2">
                      ₹
                      {formatAmount(
                        upiDonation
                      )}
                    </h2>

                  </div>

                  <FaMobileAlt className="text-4xl text-cyan-600" />

                </div>

              </div>

              {/* Bank */}

              <div className="bg-white rounded-2xl shadow-lg border p-6">

                <div className="flex items-center justify-between gap-4">

                  <div>

                    <p className="text-gray-500">
                      Bank Transfer
                    </p>

                    <h2 className="text-3xl font-bold text-blue-700 mt-2">
                      ₹
                      {formatAmount(
                        bankTransferDonation
                      )}
                    </h2>

                  </div>

                  <FaUniversity className="text-4xl text-blue-600" />

                </div>

              </div>

              {/* Cheque */}

              <div className="bg-white rounded-2xl shadow-lg border p-6">

                <div className="flex items-center justify-between gap-4">

                  <div>

                    <p className="text-gray-500">
                      Cheque Donations
                    </p>

                    <h2 className="text-3xl font-bold text-purple-700 mt-2">
                      ₹
                      {formatAmount(
                        chequeDonation
                      )}
                    </h2>

                  </div>

                  <FaMoneyCheckAlt className="text-4xl text-purple-600" />

                </div>

              </div>

            </div>

          </div>

          {/* Donation Form */}

          <div className="bg-white rounded-2xl shadow-lg border p-6">

            <h2 className="text-2xl font-bold mb-6">
              Collect Donation
            </h2>

            <div className="grid md:grid-cols-2 gap-5">

              {/* Donor Name */}

              <div>

                <label className="font-semibold block mb-2">
                  Donor Name *
                </label>

                <input
                  className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={
                    form.donor_name
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,
                      donor_name:
                        e.target.value,
                    })
                  }
                  placeholder="Enter donor name"
                />

              </div>

              {/* Amount */}

              <div>

                <label className="font-semibold block mb-2">
                  Amount *
                </label>

                <input
                  type="number"
                  min="1"
                  className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  placeholder="Enter donation amount"
                />

              </div>

              {/* Flat Number */}

              <div>

                <label className="font-semibold block mb-2">
                  Flat Number
                  <span className="text-gray-400 font-normal">
                    {" "}
                    (Optional)
                  </span>
                </label>

                <input
                  className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={
                    form.flat_number
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,
                      flat_number:
                        e.target.value.toUpperCase(),
                    })
                  }
                  placeholder="Enter flat number"
                />

              </div>

              {/* Mobile */}

              <div>

                <label className="font-semibold block mb-2">
                  Mobile Number
                  <span className="text-gray-400 font-normal">
                    {" "}
                    (Optional)
                  </span>
                </label>

                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={
                    form.mobile_number
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,
                      mobile_number:
                        e.target.value
                          .replace(
                            /\D/g,
                            ""
                          )
                          .slice(
                            0,
                            10
                          ),
                    })
                  }
                  placeholder="Enter 10 digit mobile number"
                />

              </div>

              {/* Bill Number */}

              <div>

                <label className="font-semibold block mb-2">
                  Bill Number
                  <span className="text-gray-400 font-normal">
                    {" "}
                    (Optional)
                  </span>
                </label>

                <input
                  className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={
                    form.bill_number
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,
                      bill_number:
                        e.target.value,
                    })
                  }
                  placeholder="Enter bill number"
                />

              </div>

              {/* Payment Mode */}

              <div>

                <label className="font-semibold block mb-2">
                  Payment Mode *
                </label>

                <select
                  required
                  className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

              {/* Purpose */}

              <div className="md:col-span-2">

                <label className="font-semibold block mb-2">
                  Purpose / Remarks
                  <span className="text-gray-400 font-normal">
                    {" "}
                    (Optional)
                  </span>
                </label>

                <textarea
                  rows={4}
                  value={
                    form.purpose
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,
                      purpose:
                        e.target.value,
                    })
                  }
                  placeholder="Example: General Donation, Bhog, Decoration, Lighting, Cultural Programme, In memory of..., etc."
                  className="w-full border rounded-lg p-3 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                : "Collect Donation"}
            </button>

          </div>

          {/* Donation History */}

          <div className="bg-white rounded-2xl shadow-lg border overflow-x-auto">

            <table className="min-w-[1100px] w-full">

              <thead className="bg-blue-900 text-white">

                <tr>

                  <th className="p-4 text-left">
                    Donor
                  </th>

                  <th className="p-4 text-left">
                    Flat
                  </th>

                  <th className="p-4 text-center">
                    Amount
                  </th>

                  <th className="p-4 text-center">
                    Mode
                  </th>

                  <th className="p-4 text-center">
                    Bill No.
                  </th>

                  <th className="p-4 text-left">
                    Purpose / Remarks
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
                      colSpan={8}
                      className="text-center py-10"
                    >
                      Loading...
                    </td>

                  </tr>

                ) : donations.length === 0 ? (

                  <tr>

                    <td
                      colSpan={8}
                      className="text-center py-10 text-gray-500"
                    >
                      No donations found.
                    </td>

                  </tr>

                ) : (

                  donations.map(
                    (donation) => (

                      <tr
                        key={
                          donation.id
                        }
                        className="border-b hover:bg-blue-50"
                      >

                        <td className="p-4 font-semibold">
                          {
                            donation.donor_name
                          }
                        </td>

                        <td className="p-4 whitespace-nowrap">
                          {donation.flat_number ||
                            "-"}
                        </td>

                        <td className="p-4 text-center font-bold text-green-700 whitespace-nowrap">
                          ₹
                          {formatAmount(
                            donation.amount
                          )}
                        </td>

                        <td className="p-4 text-center whitespace-nowrap">
                          {donation.payment_mode ||
                            "-"}
                        </td>

                        <td className="p-4 text-center whitespace-nowrap">
                          {donation.bill_number ||
                            "-"}
                        </td>

                        <td className="p-4 max-w-xs whitespace-pre-wrap">
                          {donation.purpose ||
                            "-"}
                        </td>

                        <td className="p-4 text-center whitespace-nowrap">
                          {donation.created_by ||
                            donation.collected_by ||
                            "-"}
                        </td>

                        <td className="p-4 text-center whitespace-nowrap">

                          <Link
                            href={`/donations/${donation.id}`}
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