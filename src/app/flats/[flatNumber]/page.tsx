"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import AppLayout from "@/components/layout/AppLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

import { searchFlat } from "@/services/flatsService";
import { updatePayment } from "@/services/paymentService";
import { getLoggedInUser } from "@/services/authService";

export default function EditFlatPage() {
  const { flatNumber } = useParams();
  const router = useRouter();

  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const currentUser = getLoggedInUser();
  const isAdmin = currentUser?.role === "Admin";

  const canEdit = () => {
    if (!form || !currentUser) {
      return false;
    }

    // Admin can edit every record
    if (isAdmin) {
      return true;
    }

    // A completely released Pending flat has no collector
    if (!form.collected_by?.trim()) {
      return true;
    }

    // Paid or previously owned records can only be edited
    // by their corresponding collector
    return form.collected_by === currentUser.username;
  };

  useEffect(() => {
    async function loadFlat() {
      try {
        const data = await searchFlat(
          decodeURIComponent(flatNumber as string)
        );

        if (!data) {
          throw new Error("Flat not found.");
        }

        setForm({
          ...data,

          owner_name: data.owner_name ?? "",
          mobile_number: data.mobile_number ?? "",

          family_members:
            Number(data.family_members) === 0
              ? ""
              : data.family_members,

          subscription_amount:
            Number(data.subscription_amount) === 0
              ? ""
              : data.subscription_amount,

          payment_mode: data.payment_mode ?? "",
          receipt_number: data.receipt_number ?? "",
          transaction_id: data.transaction_id ?? "",
          collected_by: data.collected_by ?? "",
          status: data.status ?? "Pending",
        });
      } catch (err) {
        console.error(err);
        alert("Flat not found.");
        router.push("/flats");
      } finally {
        setLoading(false);
      }
    }

    loadFlat();
  }, [flatNumber, router]);

  async function handleSave() {
    if (!form) {
      return;
    }

    if (!canEdit()) {
      alert(
        "Only the original collector or the Admin can edit this Paid record."
      );
      return;
    }

    const ownerName = String(
      form.owner_name ?? ""
    ).trim();

    const mobileNumber = String(
      form.mobile_number ?? ""
    ).trim();

    const familyMembers = String(
      form.family_members ?? ""
    ).trim();

    const subscriptionAmount = String(
      form.subscription_amount ?? ""
    ).trim();

    const paymentMode = String(
      form.payment_mode ?? ""
    ).trim();

    const receiptNumber = String(
      form.receipt_number ?? ""
    ).trim();

    const transactionId = String(
      form.transaction_id ?? ""
    ).trim();

    const allMandatoryFieldsFilled =
      ownerName !== "" &&
      mobileNumber !== "" &&
      familyMembers !== "" &&
      Number(familyMembers) > 0 &&
      subscriptionAmount !== "" &&
      Number(subscriptionAmount) > 0 &&
      paymentMode !== "";

    const allMandatoryFieldsEmpty =
      ownerName === "" &&
      mobileNumber === "" &&
      familyMembers === "" &&
      subscriptionAmount === "" &&
      paymentMode === "";

    const resettingToPending =
      form.status === "Pending" &&
      allMandatoryFieldsEmpty;

    /*
     * RESET CASE
     *
     * A record can be restored to Pending only when:
     * 1. Status is Pending
     * 2. Every mandatory field is empty
     */
    if (resettingToPending) {
      const confirmReset = window.confirm(
        "This will erase all payment details, remove the collector and restore the flat to Pending. Continue?"
      );

      if (!confirmReset) {
        return;
      }

      try {
        setSaving(true);

        await updatePayment(form.flat_number, {
          owner_name: "",
          mobile_number: "",
          family_members: 0,
          subscription_amount: 0,
          payment_mode: "",
          receipt_number: "",
          transaction_id: "",
          collected_by: "",
          status: "Pending",
        });

        alert(
          "The subscription has been restored to Pending. Any volunteer can now collect it."
        );

        router.push("/flats");
      } catch (err: any) {
        console.error(err);

        alert(
          err?.message ||
            "Failed to restore the subscription to Pending."
        );
      } finally {
        setSaving(false);
      }

      return;
    }

    /*
     * INVALID PENDING CASE
     *
     * Pending cannot be saved while only some fields
     * have been cleared or payment details still remain.
     */
    if (form.status === "Pending") {
      alert(
        "To restore this record to Pending, clear all mandatory fields: Owner Name, Mobile Number, Family Members, Subscription Amount and Payment Mode."
      );
      return;
    }

    /*
     * NORMAL PAID EDIT
     *
     * Every mandatory field must remain completed.
     */
    if (!allMandatoryFieldsFilled) {
      alert(
        "All mandatory fields are required for a Paid subscription. To release this flat, clear all mandatory fields and change the status to Pending."
      );
      return;
    }

    if (!/^[a-zA-Z\s]+$/.test(ownerName)) {
      alert(
        "Owner Name can contain alphabets and spaces only."
      );
      return;
    }

    if (!/^\d{10}$/.test(mobileNumber)) {
      alert(
        "Mobile Number must contain exactly 10 digits."
      );
      return;
    }

    if (
      !Number.isInteger(Number(familyMembers)) ||
      Number(familyMembers) < 1
    ) {
      alert(
        "Family Members must be a whole number greater than zero."
      );
      return;
    }

    if (
      Number.isNaN(Number(subscriptionAmount)) ||
      Number(subscriptionAmount) <= 0
    ) {
      alert(
        "Subscription Amount must be greater than zero."
      );
      return;
    }

    try {
      setSaving(true);

      await updatePayment(form.flat_number, {
        owner_name: ownerName,
        mobile_number: mobileNumber,
        family_members: Number(familyMembers),
        subscription_amount: Number(
          subscriptionAmount
        ),
        payment_mode: paymentMode,
        receipt_number: receiptNumber,
        transaction_id: transactionId,

        // The service preserves the original collector.
        collected_by: form.collected_by,

        status: "Paid",
      });

      alert("Payment details updated successfully.");

      router.push("/flats");
    } catch (err: any) {
      console.error(err);

      alert(
        err?.message ||
          "Failed to update the payment details."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <AppLayout>
          <div className="p-8 text-xl">
            Loading...
          </div>
        </AppLayout>
      </ProtectedRoute>
    );
  }

  if (!form) {
    return null;
  }

  const editable = canEdit();

  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="max-w-3xl mx-auto bg-white shadow rounded-lg p-8">
          <h1 className="text-3xl font-bold mb-2">
            Edit Flat
          </h1>

          <p className="text-gray-500 mb-8">
            Update a Paid subscription or completely
            clear its details and change the status to
            Pending to release the flat.
          </p>

          {!editable && (
            <div className="mb-6 rounded-lg border border-yellow-300 bg-yellow-50 p-4">
              <p className="font-semibold text-yellow-800">
                This record was collected by{" "}
                {form.collected_by}.
              </p>

              <p className="mt-1 text-sm text-yellow-700">
                Only the original collector or the Admin
                can edit this Paid record.
              </p>
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="font-semibold block mb-2">
                Flat Number
              </label>

              <input
                value={form.flat_number}
                disabled
                className="w-full border rounded p-3 bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="font-semibold block mb-2">
                Owner Name *
              </label>

              <input
                type="text"
                value={form.owner_name}
                disabled={!editable}
                onChange={(e) =>
                  setForm({
                    ...form,
                    owner_name:
                      e.target.value.replace(
                        /[^a-zA-Z\s]/g,
                        ""
                      ),
                  })
                }
                className="w-full border rounded p-3 disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Enter owner name"
              />
            </div>

            <div>
              <label className="font-semibold block mb-2">
                Mobile Number *
              </label>

              <input
                type="tel"
                inputMode="numeric"
                maxLength={10}
                value={form.mobile_number}
                disabled={!editable}
                onChange={(e) =>
                  setForm({
                    ...form,
                    mobile_number:
                      e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 10),
                  })
                }
                className="w-full border rounded p-3 disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Enter 10 digit mobile number"
              />
            </div>

            <div>
              <label className="font-semibold block mb-2">
                Family Members *
              </label>

              <input
                type="number"
                min="1"
                value={form.family_members}
                disabled={!editable}
                onChange={(e) =>
                  setForm({
                    ...form,
                    family_members: e.target.value,
                  })
                }
                className="w-full border rounded p-3 disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Enter number of family members"
              />
            </div>

            <div>
              <label className="font-semibold block mb-2">
                Subscription Amount *
              </label>

              <input
                type="number"
                min="1"
                value={form.subscription_amount}
                disabled={!editable}
                onChange={(e) =>
                  setForm({
                    ...form,
                    subscription_amount:
                      e.target.value,
                  })
                }
                className="w-full border rounded p-3 disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Enter subscription amount"
              />
            </div>

            <div>
              <label className="font-semibold block mb-2">
                Payment Mode *
              </label>

              <select
                value={form.payment_mode}
                disabled={!editable}
                onChange={(e) =>
                  setForm({
                    ...form,
                    payment_mode: e.target.value,
                  })
                }
                className="w-full border rounded p-3 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
              </select>
            </div>

            <div>
              <label className="font-semibold block mb-2">
                Receipt Number
              </label>

              <input
                value={form.receipt_number}
                disabled={!editable}
                onChange={(e) =>
                  setForm({
                    ...form,
                    receipt_number:
                      e.target.value,
                  })
                }
                className="w-full border rounded p-3 disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Enter receipt number"
              />
            </div>

            <div>
              <label className="font-semibold block mb-2">
                Transaction ID
              </label>

              <input
                value={form.transaction_id}
                disabled={!editable}
                onChange={(e) =>
                  setForm({
                    ...form,
                    transaction_id:
                      e.target.value,
                  })
                }
                className="w-full border rounded p-3 disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="UPI / Bank Transaction ID"
              />
            </div>

            <div>
              <label className="font-semibold block mb-2">
                Collected By
              </label>

              <input
                value={form.collected_by || ""}
                readOnly
                disabled
                className="w-full border rounded p-3 bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="font-semibold block mb-2">
                Status
              </label>

              <select
                value={form.status}
                disabled={!editable}
                onChange={(e) =>
                  setForm({
                    ...form,
                    status: e.target.value,
                  })
                }
                className="w-full border rounded p-3 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="Pending">
                  Pending
                </option>

                <option value="Paid">
                  Paid
                </option>
              </select>
            </div>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !editable}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white p-4 rounded-lg font-semibold"
            >
              {saving
                ? "Saving..."
                : !editable
                ? "Not Allowed to Edit"
                : form.status === "Pending"
                ? "Restore Flat to Pending"
                : "Save Changes"}
            </button>
          </div>
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}