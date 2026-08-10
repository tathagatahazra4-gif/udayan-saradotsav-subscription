"use client";

import { useEffect, useState } from "react";
import {
  useParams,
  useRouter,
  useSearchParams,
} from "next/navigation";

import AppLayout from "@/components/layout/AppLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

import { searchFlat } from "@/services/flatsService";
import { updatePayment } from "@/services/paymentService";
import { getLoggedInUser } from "@/services/authService";
import { saveFlatComment } from "@/services/flatCommentService";

export default function EditFlatPage() {
  const { flatNumber } = useParams();

  const router = useRouter();

  const searchParams = useSearchParams();

  const fromBuilding =
    searchParams.get("fromBuilding");

  const [form, setForm] = useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [
    savingComment,
    setSavingComment,
  ] = useState(false);

  const currentUser = getLoggedInUser();

  const isAdmin =
    currentUser?.role === "Admin";

  // =====================================================
  // RETURN TO PREVIOUS SOURCE
  // =====================================================

  function navigateAfterSave() {
    if (fromBuilding) {
      router.push(
        `/buildings/${encodeURIComponent(
          fromBuilding
        )}`
      );
    } else {
      router.push("/flats");
    }
  }

  // =====================================================
  // PERMISSION CHECK
  // =====================================================

  const canEdit = () => {
    if (!form || !currentUser) {
      return false;
    }

    if (isAdmin) {
      return true;
    }

    if (!form.collected_by?.trim()) {
      return true;
    }

    return (
      form.collected_by ===
      currentUser.username
    );
  };

  // =====================================================
  // LOAD FLAT
  // =====================================================

  useEffect(() => {
    async function loadFlat() {
      try {
        const data =
          await searchFlat(
            decodeURIComponent(
              flatNumber as string
            )
          );

        if (!data) {
          throw new Error(
            "Flat not found."
          );
        }

        setForm({
          ...data,

          owner_name:
            data.owner_name ?? "",

          mobile_number:
            data.mobile_number ?? "",

          family_members:
            Number(
              data.family_members
            ) === 0
              ? ""
              : data.family_members,

          subscription_amount:
            Number(
              data.subscription_amount
            ) === 0
              ? ""
              : data.subscription_amount,

          payment_mode:
            data.payment_mode ?? "",

          receipt_number:
            data.receipt_number ?? "",

          transaction_id:
            data.transaction_id ?? "",

          comments:
            data.comments ?? "",

          collected_by:
            data.collected_by ?? "",

          status:
            data.status ?? "Pending",
        });
      } catch (err) {
        console.error(err);

        alert("Flat not found.");

        if (fromBuilding) {
          router.push(
            `/buildings/${encodeURIComponent(
              fromBuilding
            )}`
          );
        } else {
          router.push("/flats");
        }
      } finally {
        setLoading(false);
      }
    }

    loadFlat();
  }, [
    flatNumber,
    router,
    fromBuilding,
  ]);

  // =====================================================
  // SAVE COMMENT
  // Can be used by ANY logged-in user
  // =====================================================

  async function handleSaveComment() {
    if (!form) {
      return;
    }

    if (!currentUser) {
      alert(
        "You must be logged in to update comments."
      );

      return;
    }

    try {
      setSavingComment(true);

      const result =
        await saveFlatComment(
          form.flat_number,
          form.comments ?? ""
        );

      setForm(
        (previousForm: any) => ({
          ...previousForm,

          comments:
            result.comments ?? "",
        })
      );

      alert(
        "Comment saved successfully."
      );
    } catch (err: any) {
      console.error(err);

      alert(
        err?.message ||
          "Failed to save comment."
      );
    } finally {
      setSavingComment(false);
    }
  }

  // =====================================================
  // SAVE PAYMENT DETAILS
  // =====================================================

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

    const comments = String(
      form.comments ?? ""
    ).trim();

    const allMandatoryFieldsFilled =
      ownerName !== "" &&
      familyMembers !== "" &&
      Number(familyMembers) > 0 &&
      subscriptionAmount !== "" &&
      Number(subscriptionAmount) > 0 &&
      paymentMode !== "";

    const allMandatoryFieldsEmpty =
      ownerName === "" &&
      familyMembers === "" &&
      subscriptionAmount === "" &&
      paymentMode === "";

    const resettingToPending =
      form.status === "Pending" &&
      allMandatoryFieldsEmpty;

    // =====================================================
    // RESET TO PENDING
    // =====================================================

    if (resettingToPending) {
      const confirmReset =
        window.confirm(
          "This will erase all payment details, remove the collector and restore the flat to Pending. Continue?"
        );

      if (!confirmReset) {
        return;
      }

      try {
        setSaving(true);

        await updatePayment(
          form.flat_number,
          {
            owner_name: "",

            mobile_number: "",

            family_members: 0,

            subscription_amount: 0,

            payment_mode: "",

            receipt_number: "",

            transaction_id: "",

            comments,

            collected_by: "",

            status: "Pending",
          }
        );

        alert(
          "The subscription has been restored to Pending. Any volunteer can now collect it."
        );

        navigateAfterSave();
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

    // =====================================================
    // INVALID PENDING CASE
    // =====================================================

    if (form.status === "Pending") {
      alert(
        "To restore this record to Pending, clear all mandatory fields: Owner Name, Family Members, Subscription Amount and Payment Mode."
      );

      return;
    }

    // =====================================================
    // NORMAL PAID VALIDATION
    // =====================================================

    if (!allMandatoryFieldsFilled) {
      alert(
        "All mandatory fields are required for a Paid subscription. To release this flat, clear all mandatory fields and change the status to Pending."
      );

      return;
    }

    if (
      !/^[a-zA-Z\s]+$/.test(
        ownerName
      )
    ) {
      alert(
        "Owner Name can contain alphabets and spaces only."
      );

      return;
    }

    // Mobile Number is optional.
    // If supplied, it must be exactly 10 digits.

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

    if (
      !Number.isInteger(
        Number(familyMembers)
      ) ||
      Number(familyMembers) < 1
    ) {
      alert(
        "Family Members must be a whole number greater than zero."
      );

      return;
    }

    if (
      Number.isNaN(
        Number(
          subscriptionAmount
        )
      ) ||
      Number(
        subscriptionAmount
      ) <= 0
    ) {
      alert(
        "Subscription Amount must be greater than zero."
      );

      return;
    }

    // =====================================================
    // SAVE NORMAL EDIT
    // =====================================================

    try {
      setSaving(true);

      await updatePayment(
        form.flat_number,
        {
          owner_name:
            ownerName,

          mobile_number:
            mobileNumber,

          family_members:
            Number(
              familyMembers
            ),

          subscription_amount:
            Number(
              subscriptionAmount
            ),

          payment_mode:
            paymentMode,

          receipt_number:
            receiptNumber,

          transaction_id:
            transactionId,

          comments,

          collected_by:
            form.collected_by,

          status: "Paid",
        }
      );

      alert(
        "Payment details updated successfully."
      );

      navigateAfterSave();
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

  // =====================================================
  // LOADING
  // =====================================================

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

        <div className="max-w-3xl mx-auto bg-white shadow rounded-lg p-5 md:p-8">

          {/* Page Header */}

          <h1 className="text-3xl font-bold mb-2">
            Edit Flat
          </h1>

          <p className="text-gray-500 mb-6">
            Flat {form.flat_number}
          </p>

          {/* =====================================================
              FLAT COMMENTS
          ===================================================== */}

          <div className="mb-8 bg-blue-50 border border-blue-200 rounded-xl p-5">

            <div className="mb-4">

              <h2 className="text-xl font-bold text-blue-900">
                Flat Comments
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Any logged-in user can add or update notes for this flat.
              </p>

            </div>

            <textarea
              rows={4}
              value={
                form.comments ?? ""
              }
              onChange={(e) =>
                setForm({
                  ...form,

                  comments:
                    e.target.value,
                })
              }
              placeholder="Example: Flat locked, owner unavailable, revisit after 6 PM..."
              className="w-full border rounded-lg p-3 bg-white resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex justify-end mt-3">

              <button
                type="button"
                onClick={
                  handleSaveComment
                }
                disabled={
                  savingComment
                }
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-5 py-2 rounded-lg font-semibold transition"
              >
                {savingComment
                  ? "Saving..."
                  : "Save Comment"}
              </button>

            </div>

          </div>

          {/* Permission Warning */}

          {!editable && (

            <div className="mb-6 rounded-lg border border-yellow-300 bg-yellow-50 p-4">

              <p className="font-semibold text-yellow-800">
                This record was collected by{" "}
                {form.collected_by}.
              </p>

              <p className="mt-1 text-sm text-yellow-700">
                Only the original collector or the Admin
                can edit the payment details below.
                Comments can still be updated by anyone.
              </p>

            </div>

          )}

          <p className="text-gray-500 mb-8">
            Update a Paid subscription or completely
            clear its mandatory details and change the status
            to Pending to release the flat.
          </p>

          {/* =====================================================
              PAYMENT DETAILS
          ===================================================== */}

          <div className="space-y-5">

            {/* Flat Number */}

            <div>

              <label className="font-semibold block mb-2">
                Flat Number
              </label>

              <input
                value={
                  form.flat_number
                }
                disabled
                className="w-full border rounded p-3 bg-gray-100 cursor-not-allowed"
              />

            </div>

            {/* Owner Name */}

            <div>

              <label className="font-semibold block mb-2">
                Owner Name *
              </label>

              <input
                type="text"
                value={
                  form.owner_name
                }
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

            {/* Mobile Number */}

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
                value={
                  form.mobile_number
                }
                disabled={!editable}
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
                className="w-full border rounded p-3 disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Enter 10 digit mobile number"
              />

            </div>

            {/* Family Members */}

            <div>

              <label className="font-semibold block mb-2">
                Family Members *
              </label>

              <input
                type="number"
                min="1"
                value={
                  form.family_members
                }
                disabled={!editable}
                onChange={(e) =>
                  setForm({
                    ...form,

                    family_members:
                      e.target.value,
                  })
                }
                className="w-full border rounded p-3 disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Enter number of family members"
              />

            </div>

            {/* Subscription Amount */}

            <div>

              <label className="font-semibold block mb-2">
                Subscription Amount *
              </label>

              <input
                type="number"
                min="1"
                value={
                  form.subscription_amount
                }
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

            {/* Payment Mode */}

            <div>

              <label className="font-semibold block mb-2">
                Payment Mode *
              </label>

              <select
                value={
                  form.payment_mode
                }
                disabled={!editable}
                onChange={(e) =>
                  setForm({
                    ...form,

                    payment_mode:
                      e.target.value,
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

            {/* Receipt Number */}

            <div>

              <label className="font-semibold block mb-2">
                Receipt Number
              </label>

              <input
                value={
                  form.receipt_number
                }
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

            {/* Transaction ID */}

            <div>

              <label className="font-semibold block mb-2">
                Transaction ID
              </label>

              <input
                value={
                  form.transaction_id
                }
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

            {/* Collected By */}

            <div>

              <label className="font-semibold block mb-2">
                Collected By
              </label>

              <input
                value={
                  form.collected_by ||
                  ""
                }
                readOnly
                disabled
                className="w-full border rounded p-3 bg-gray-100 cursor-not-allowed"
              />

            </div>

            {/* Status */}

            <div>

              <label className="font-semibold block mb-2">
                Status
              </label>

              <select
                value={
                  form.status
                }
                disabled={!editable}
                onChange={(e) =>
                  setForm({
                    ...form,

                    status:
                      e.target.value,
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

            {/* Save Payment Button */}

            <button
              type="button"
              onClick={
                handleSave
              }
              disabled={
                saving ||
                !editable
              }
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white p-4 rounded-lg font-semibold"
            >
              {saving
                ? "Saving..."
                : !editable
                ? "Not Allowed to Edit Payment Details"
                : form.status ===
                  "Pending"
                ? "Restore Flat to Pending"
                : "Save Changes"}
            </button>

          </div>

        </div>

      </AppLayout>
    </ProtectedRoute>
  );
}