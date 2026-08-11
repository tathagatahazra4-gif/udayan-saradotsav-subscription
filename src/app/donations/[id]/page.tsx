"use client";

import { useEffect, useState } from "react";
import {
  useParams,
  useRouter,
} from "next/navigation";

import AppLayout from "@/components/layout/AppLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

import {
  getDonationById,
  updateDonation,
} from "@/services/donationService";

import { getLoggedInUser } from "@/services/authService";

export default function EditDonationPage() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const currentUser =
    getLoggedInUser();

  useEffect(() => {
    async function loadDonation() {
      try {
        const data =
          await getDonationById(
            id as string
          );

        setForm({
          ...data,

          donor_name:
            data.donor_name ?? "",

          amount:
            data.amount ?? "",

          flat_number:
            data.flat_number ?? "",

          mobile_number:
            data.mobile_number ?? "",

          bill_number:
            data.bill_number ?? "",

          payment_mode:
            data.payment_mode ?? "",

          purpose:
            data.purpose ?? "",
        });
      } catch (err) {
        console.error(err);

        alert(
          "Donation record not found."
        );

        router.push(
          "/donations"
        );
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadDonation();
    }
  }, [id, router]);

  if (loading) {
    return (
      <ProtectedRoute>
        <AppLayout>
          <div className="p-8 text-xl">
            Loading Donation...
          </div>
        </AppLayout>
      </ProtectedRoute>
    );
  }

  if (!form) {
    return null;
  }

  const canEdit =
    currentUser?.role === "Admin" ||
    form.created_by ===
      currentUser?.username;

  async function handleSave() {
    if (!canEdit) {
      alert(
        "Only the original creator or the Admin can edit this donation."
      );

      return;
    }

    const donorName =
      String(
        form.donor_name ?? ""
      ).trim();

    const amount =
      Number(
        form.amount
      );

    const flatNumber =
      String(
        form.flat_number ?? ""
      ).trim();

    const mobileNumber =
      String(
        form.mobile_number ?? ""
      ).trim();

    const billNumber =
      String(
        form.bill_number ?? ""
      ).trim();

    const paymentMode =
      String(
        form.payment_mode ?? ""
      ).trim();

    const purpose =
      String(
        form.purpose ?? ""
      ).trim();

    if (!donorName) {
      alert(
        "Donor Name is required."
      );

      return;
    }

    if (
      Number.isNaN(amount) ||
      amount <= 0
    ) {
      alert(
        "Donation Amount must be greater than zero."
      );

      return;
    }

    // Payment Mode is mandatory
    if (!paymentMode) {
      alert(
        "Payment Mode is required."
      );

      return;
    }

    if (
      mobileNumber !== "" &&
      !/^\d{10}$/.test(
        mobileNumber
      )
    ) {
      alert(
        "Mobile Number must contain exactly 10 digits."
      );

      return;
    }

    try {
      setSaving(true);

      await updateDonation(
        form.id,
        {
          donor_name:
            donorName,

          amount,

          flat_number:
            flatNumber,

          mobile_number:
            mobileNumber,

          bill_number:
            billNumber,

          payment_mode:
            paymentMode,

          purpose,
        }
      );

      alert(
        "Donation updated successfully."
      );

      router.push(
        "/donations"
      );
    } catch (err: any) {
      console.error(err);

      alert(
        err?.message ||
          "Failed to update donation."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <ProtectedRoute>
      <AppLayout>

        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg border p-6 md:p-8">

          <h1 className="text-3xl font-bold text-blue-900">
            Edit Donation
          </h1>

          <p className="text-gray-500 mt-2 mb-8">
            Update donation details.
          </p>

          {!canEdit && (

            <div className="mb-6 bg-yellow-50 border border-yellow-300 rounded-xl p-4">

              <p className="font-semibold text-yellow-800">
                This donation was created by{" "}
                {form.created_by || "another user"}.
              </p>

              <p className="text-sm text-yellow-700 mt-1">
                Only the original creator or the Admin can edit this record.
              </p>

            </div>

          )}

          <div className="space-y-5">

            {/* Donor Name */}

            <div>

              <label className="block font-semibold mb-2">
                Donor Name *
              </label>

              <input
                type="text"
                disabled={!canEdit}
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
                className="w-full border rounded-lg p-3 disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Enter donor name"
              />

            </div>

            {/* Amount */}

            <div>

              <label className="block font-semibold mb-2">
                Amount *
              </label>

              <input
                type="number"
                min="1"
                disabled={!canEdit}
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
                className="w-full border rounded-lg p-3 disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Enter amount"
              />

            </div>

            {/* Flat Number */}

            <div>

              <label className="block font-semibold mb-2">
                Flat Number
                <span className="text-gray-400 font-normal">
                  {" "}
                  (Optional)
                </span>
              </label>

              <input
                type="text"
                disabled={!canEdit}
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
                className="w-full border rounded-lg p-3 disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Enter flat number"
              />

            </div>

            {/* Mobile */}

            <div>

              <label className="block font-semibold mb-2">
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
                disabled={!canEdit}
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
                className="w-full border rounded-lg p-3 disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Enter 10 digit mobile number"
              />

            </div>

            {/* Bill Number */}

            <div>

              <label className="block font-semibold mb-2">
                Bill Number
                <span className="text-gray-400 font-normal">
                  {" "}
                  (Optional)
                </span>
              </label>

              <input
                type="text"
                disabled={!canEdit}
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
                className="w-full border rounded-lg p-3 disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Enter bill number"
              />

            </div>

            {/* Payment Mode */}

            <div>

              <label className="block font-semibold mb-2">
                Payment Mode *
              </label>

              <select
                required
                disabled={!canEdit}
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
                className="w-full border rounded-lg p-3 disabled:bg-gray-100 disabled:cursor-not-allowed"
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

            {/* Purpose / Remarks */}

            <div>

              <label className="block font-semibold mb-2">
                Purpose / Remarks
                <span className="text-gray-400 font-normal">
                  {" "}
                  (Optional)
                </span>
              </label>

              <textarea
                rows={4}
                disabled={!canEdit}
                value={
                  form.purpose ?? ""
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    purpose:
                      e.target.value,
                  })
                }
                placeholder="Example: General Donation, Bhog, Decoration, Lighting, Cultural Programme, In memory of..., etc."
                className="w-full border rounded-lg p-3 resize-y disabled:bg-gray-100 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

            {/* Created By */}

            <div>

              <label className="block font-semibold mb-2">
                Created By
              </label>

              <input
                type="text"
                value={
                  form.created_by ||
                  form.collected_by ||
                  ""
                }
                readOnly
                disabled
                className="w-full border rounded-lg p-3 bg-gray-100 cursor-not-allowed"
              />

            </div>

            {/* Save */}

            <button
              type="button"
              onClick={
                handleSave
              }
              disabled={
                saving ||
                !canEdit
              }
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold"
            >
              {saving
                ? "Saving..."
                : !canEdit
                ? "Not Allowed to Edit"
                : "Save Changes"}
            </button>

          </div>

        </div>

      </AppLayout>
    </ProtectedRoute>
  );
}