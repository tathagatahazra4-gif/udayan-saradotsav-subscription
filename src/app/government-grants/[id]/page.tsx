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
  getGovernmentGrantById,
  updateGovernmentGrant,
} from "@/services/governmentGrantService";

import { getLoggedInUser } from "@/services/authService";

export default function EditGovernmentGrantPage() {
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
    async function loadGrant() {
      try {
        const data =
          await getGovernmentGrantById(
            id as string
          );

        setForm({
          ...data,

          amount:
            data.amount ?? "",

          cheque_number:
            data.cheque_number ?? "",

          received_from:
            data.received_from ?? "",
        });
      } catch (err) {
        console.error(err);

        alert(
          "Government Grant record not found."
        );

        router.push(
          "/government-grants"
        );
      } finally {
        setLoading(false);
      }
    }

    loadGrant();
  }, [id, router]);

  if (loading) {
    return (
      <ProtectedRoute>
        <AppLayout>
          <div className="p-8 text-xl">
            Loading Government Grant...
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
        "Only the original creator or the Admin can edit this Government Grant record."
      );

      return;
    }

    const amount =
      Number(
        form.amount
      );

    const chequeNumber =
      String(
        form.cheque_number ?? ""
      ).trim();

    const receivedFrom =
      String(
        form.received_from ?? ""
      ).trim();

    if (
      Number.isNaN(amount) ||
      amount <= 0
    ) {
      alert(
        "Amount must be greater than zero."
      );

      return;
    }

    try {
      setSaving(true);

      await updateGovernmentGrant(
        form.id,
        {
          amount,

          cheque_number:
            chequeNumber,

          received_from:
            receivedFrom,
        }
      );

      alert(
        "Government Grant updated successfully."
      );

      router.push(
        "/government-grants"
      );
    } catch (err: any) {
      console.error(err);

      alert(
        err?.message ||
          "Failed to update Government Grant."
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
            Edit Government Grant
          </h1>

          <p className="text-gray-500 mt-2 mb-8">
            Update Government Grant details.
          </p>

          {!canEdit && (

            <div className="mb-6 bg-yellow-50 border border-yellow-300 rounded-xl p-4">

              <p className="font-semibold text-yellow-800">
                This record was created by{" "}
                {form.created_by}.
              </p>

              <p className="text-sm text-yellow-700 mt-1">
                Only the original creator or the Admin can edit this record.
              </p>

            </div>

          )}

          <div className="space-y-5">

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
              />

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
              />

            </div>

            {/* Received From */}

            <div>

              <label className="block font-semibold mb-2">
                Received From
                <span className="text-gray-400 font-normal">
                  {" "}
                  (Optional)
                </span>
              </label>

              <input
                type="text"
                disabled={!canEdit}
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
                placeholder="Example: Kolkata Municipal Corporation"
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
                  form.created_by || ""
                }
                readOnly
                disabled
                className="w-full border rounded-lg p-3 bg-gray-100 cursor-not-allowed"
              />

            </div>

            {/* Received Date */}

            <div>

              <label className="block font-semibold mb-2">
                Received Date
              </label>

              <input
                type="text"
                value={
                  form.received_date || ""
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