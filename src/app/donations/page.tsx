"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  FaDonate,
  FaUsers,
  FaEdit,
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
  });

  async function loadDonations() {
    try {
      setLoading(true);

      const data =
        await getDonations();

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
      return alert("Donor Name is required.");
    }

    if (
      !form.amount ||
      Number(form.amount) <= 0
    ) {
      return alert(
        "Donation Amount is required."
      );
    }

    if (
      form.mobile_number &&
      !/^\d{10}$/.test(form.mobile_number)
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

        amount: Number(form.amount),

        flat_number:
          form.flat_number.trim(),

        mobile_number:
          form.mobile_number,

        bill_number:
          form.bill_number.trim(),

        payment_mode:
          form.payment_mode,
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
      });

      loadDonations();
    } catch (err: any) {
      console.error(err);

      alert(
        err.message ||
          "Failed to save donation."
      );
    } finally {
      setSaving(false);
    }
  }

  const totalAmount = donations.reduce(
    (sum, d) =>
      sum + Number(d.amount || 0),
    0
  );

  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="space-y-8">

          <div>
            <h1 className="text-4xl font-bold text-blue-900">
              Donations
            </h1>

            <p className="text-gray-500 mt-2">
              Collect Puja donations and
              maintain records.
            </p>
          </div>

          {/* Summary */}

          <div className="grid md:grid-cols-2 gap-6">

            <div className="bg-white rounded-2xl shadow-lg border p-6 flex justify-between items-center">

              <div>

                <p className="text-gray-500">
                  Total Donations
                </p>

                <h2 className="text-3xl font-bold text-green-700 mt-2">
                  ₹
                  {totalAmount.toLocaleString(
                    "en-IN"
                  )}
                </h2>

              </div>

              <FaDonate className="text-4xl text-green-600" />

            </div>

            <div className="bg-white rounded-2xl shadow-lg border p-6 flex justify-between items-center">

              <div>

                <p className="text-gray-500">
                  Total Donors
                </p>

                <h2 className="text-3xl font-bold text-blue-700 mt-2">
                  {donations.length}
                </h2>

              </div>

              <FaUsers className="text-4xl text-blue-600" />

            </div>

          </div>

          {/* Donation Form */}

          <div className="bg-white rounded-2xl shadow-lg border p-6">

            <h2 className="text-2xl font-bold mb-6">
              Collect Donation
            </h2>

            <div className="grid md:grid-cols-2 gap-5">

              <div>

                <label className="font-semibold block mb-2">
                  Donor Name *
                </label>

                <input
                  className="w-full border rounded-lg p-3"
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
                />

              </div>

              <div>

                <label className="font-semibold block mb-2">
                  Amount *
                </label>

                <input
                  type="number"
                  className="w-full border rounded-lg p-3"
                  value={form.amount}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      amount:
                        e.target.value,
                    })
                  }
                />

              </div>

              <div>

                <label className="font-semibold block mb-2">
                  Flat Number
                </label>

                <input
                  className="w-full border rounded-lg p-3"
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
                />

              </div>

              <div>

                <label className="font-semibold block mb-2">
                  Mobile Number
                </label>

                <input
                  maxLength={10}
                  className="w-full border rounded-lg p-3"
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
                          .slice(0, 10),
                    })
                  }
                />

              </div>

              <div>

                <label className="font-semibold block mb-2">
                  Bill Number
                </label>

                <input
                  className="w-full border rounded-lg p-3"
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
                />

              </div>

              <div>

                <label className="font-semibold block mb-2">
                  Payment Mode
                </label>

                <select
                  className="w-full border rounded-lg p-3"
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
                    Select
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

            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="mt-8 w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-semibold"
            >
              {saving
                ? "Saving..."
                : "Collect Donation"}
            </button>

          </div>

          {/* Donation History */}

          <div className="bg-white rounded-2xl shadow-lg border overflow-x-auto">

            <table className="min-w-full">

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

                ) : donations.length ===
                  0 ? (

                  <tr>

                    <td
                      colSpan={7}
                      className="text-center py-10 text-gray-500"
                    >
                      No donations found.
                    </td>

                  </tr>

                ) : (

                  donations.map(
                    (donation) => (

                      <tr
                        key={donation.id}
                        className="border-b hover:bg-blue-50"
                      >

                        <td className="p-4 font-semibold">
                          {
                            donation.donor_name
                          }
                        </td>

                        <td className="p-4">
                          {donation.flat_number ||
                            "-"}
                        </td>

                        <td className="p-4 text-center font-bold text-green-700">
                          ₹
                          {Number(
                            donation.amount
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </td>

                        <td className="p-4 text-center">
                          {donation.payment_mode ||
                            "-"}
                        </td>

                        <td className="p-4 text-center">
                          {donation.bill_number ||
                            "-"}
                        </td>

                        <td className="p-4 text-center">
                          {donation.created_by}
                        </td>

                        <td className="p-4 text-center">

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