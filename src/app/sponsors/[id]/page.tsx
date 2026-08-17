"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useRouter,
} from "next/navigation";

import AppLayout from "@/components/layout/AppLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

import {
  getSponsorById,
  updateSponsor,
} from "@/services/sponsorService";

import { getLoggedInUser } from "@/services/authService";

export default function EditSponsorPage() {
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
    async function loadSponsor() {
      try {
        const data =
          await getSponsorById(
            id as string
          );

        setForm({
          ...data,

          company_name:
            data.company_name ?? "",

          amount:
            data.amount ?? "",

          payment_mode:
            data.payment_mode ?? "",

          cheque_number:
            data.cheque_number ?? "",

          voucher_id:
            data.voucher_id ?? "",

          point_of_contact:
            data.point_of_contact ?? "",
        });
      } catch (err) {
        console.error(err);

        alert(
          "Sponsor record not found."
        );

        router.push(
          "/sponsors"
        );
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadSponsor();
    }
  }, [id, router]);

  if (loading) {
    return (
      <ProtectedRoute>
        <AppLayout>
          <div className="p-8 text-xl">
            Loading Sponsor...
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
        "Only the original creator or the Admin can edit this sponsor record."
      );

      return;
    }

    const companyName =
      String(
        form.company_name ?? ""
      ).trim();

    const amount =
      Number(
        form.amount
      );

    const paymentMode =
      String(
        form.payment_mode ?? ""
      ).trim();

    const chequeNumber =
      String(
        form.cheque_number ?? ""
      ).trim();

    const voucherId =
      String(
        form.voucher_id ?? ""
      ).trim();

    const pointOfContact =
      String(
        form.point_of_contact ?? ""
      ).trim();

    if (!companyName) {
      alert(
        "Company Name is required."
      );

      return;
    }

    if (
      Number.isNaN(amount) ||
      amount <= 0
    ) {
      alert(
        "Amount must be greater than zero."
      );

      return;
    }

    if (!paymentMode) {
      alert(
        "Payment Mode is required."
      );

      return;
    }

    try {
      setSaving(true);

      await updateSponsor(
        form.id,
        {
          company_name:
            companyName,

          amount,

          payment_mode:
            paymentMode,

          cheque_number:
            chequeNumber,

          voucher_id:
            voucherId,

          point_of_contact:
            pointOfContact,
        }
      );

      alert(
        "Sponsor record updated successfully."
      );

      router.push(
        "/sponsors"
      );
    } catch (err: any) {
      console.error(err);

      alert(
        err?.message ||
          "Failed to update sponsor record."
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
            Edit Sponsor / Advertisement
          </h1>

          <p className="text-gray-500 mt-2 mb-8">
            Update sponsor contribution details.
          </p>

          {!canEdit && (

            <div className="mb-6 bg-yellow-50 border border-yellow-300 rounded-xl p-4">

              <p className="font-semibold text-yellow-800">
                This record was created by{" "}
                {form.created_by ||
                  "another user"}.
              </p>

              <p className="text-sm text-yellow-700 mt-1">
                Only the original creator or the Admin can edit this record.
              </p>

            </div>

          )}

          <div className="space-y-5">

            {/* Company Name */}

            <div>

              <label className="block font-semibold mb-2">
                Company Name *
              </label>

              <input
                type="text"
                disabled={!canEdit}
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
                className="w-full border rounded-lg p-3 disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Enter company name"
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

            {/* Payment Mode */}

            <div>

              <label className="block font-semibold mb-2">
                Payment Mode *
              </label>

              <select
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

            {/* Cheque Number */}

            <div>

              <label className="block font-semibold mb-2">
                Cheque Number
                <span className="text-gray-400 font-normal">
                  {" "}
                  (Optional)
                </span>
              </label>

              <input
                type="text"
                disabled={!canEdit}
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
                className="w-full border rounded-lg p-3 disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Enter cheque number"
              />

            </div>

            {/* Voucher ID */}

            <div>

              <label className="block font-semibold mb-2">
                Voucher ID
                <span className="text-gray-400 font-normal">
                  {" "}
                  (Optional)
                </span>
              </label>

              <input
                type="text"
                disabled={!canEdit}
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
                placeholder="Enter payment received voucher ID"
                className="w-full border rounded-lg p-3 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />

            </div>

            {/* Point Of Contact */}

            <div>

              <label className="block font-semibold mb-2">
                Point Of Contact
                <span className="text-gray-400 font-normal">
                  {" "}
                  (Optional)
                </span>
              </label>

              <input
                type="text"
                disabled={!canEdit}
                value={
                  form.point_of_contact
                }
                onChange={(e) =>
                  setForm({
                    ...form,

                    point_of_contact:
                      e.target.value,
                  })
                }
                placeholder="Enter person who brought the sponsor"
                className="w-full border rounded-lg p-3 disabled:bg-gray-100 disabled:cursor-not-allowed"
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