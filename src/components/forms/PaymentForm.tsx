"use client";

import { useRef, useState } from "react";
import toast from "react-hot-toast";

import { searchFlat } from "@/services/flatsService";
import { updatePayment } from "@/services/paymentService";
import { getLoggedInUser } from "@/services/authService";
import { saveFlatComment } from "@/services/flatCommentService";

export default function PaymentForm() {
  const flatInputRef = useRef<HTMLInputElement>(null);

  const [flatNumber, setFlatNumber] = useState("");
  const [flat, setFlat] = useState<any>(null);
  const [form, setForm] = useState<any>(null);

  const [loading, setLoading] = useState(false);
  const [savingComment, setSavingComment] = useState(false);

  const currentUser = getLoggedInUser();

  const isAdmin = currentUser?.role === "Admin";

  const canEdit = () => {
    if (!form) return false;

    if (!form.collected_by) return true;

    if (isAdmin) return true;

    return form.collected_by === currentUser?.username;
  };

  // =====================================================
  // SEARCH FLAT
  // =====================================================

  async function handleSearch() {
    if (!flatNumber.trim()) {
      toast.error("Please enter Flat Number.");
      flatInputRef.current?.focus();
      return;
    }

    try {
      setLoading(true);

      const data = await searchFlat(
        flatNumber.trim()
      );

      setFlat(data);

      setForm({
        ...data,

        owner_name:
          data.owner_name ?? "",

        mobile_number:
          data.mobile_number ?? "",

        family_members:
          data.family_members === 0
            ? ""
            : data.family_members,

        subscription_amount:
          data.subscription_amount === 0
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
          data.collected_by &&
          data.collected_by.trim() !== ""
            ? data.collected_by
            : currentUser?.username ?? "",

        status:
          data.status ?? "Pending",
      });

      toast.success("Flat Found");
    } catch (err) {
      console.error(err);

      toast.error("Flat not found");

      setFlat(null);
      setForm(null);
    } finally {
      setLoading(false);
    }
  }

  // =====================================================
  // SAVE COMMENT
  //
  // Any logged-in user can save/update comments.
  // Payment ownership does NOT affect this.
  // =====================================================

  async function handleSaveComment() {
    if (!flat || !form) {
      return;
    }

    if (!currentUser) {
      toast.error(
        "You must be logged in to update comments."
      );
      return;
    }

    try {
      setSavingComment(true);

      const result =
        await saveFlatComment(
          flat.flat_number,
          form.comments ?? ""
        );

      setForm((previousForm: any) => ({
        ...previousForm,
        comments:
          result.comments ?? "",
      }));

      setFlat((previousFlat: any) => ({
        ...previousFlat,
        comments:
          result.comments ?? "",
      }));

      toast.success(
        "Comment saved successfully."
      );
    } catch (err: any) {
      console.error(err);

      toast.error(
        err?.message ||
          "Failed to save comment."
      );
    } finally {
      setSavingComment(false);
    }
  }

  // =====================================================
  // SAVE PAYMENT
  // =====================================================

  async function handleSave() {
    if (!canEdit()) {
      return toast.error(
        "You can edit only subscriptions collected by you."
      );
    }

    if (!form.owner_name.trim()) {
      return toast.error(
        "Owner Name is required."
      );
    }

    if (
      !/^[a-zA-Z\s]+$/.test(
        form.owner_name
      )
    ) {
      return toast.error(
        "Owner Name can contain alphabets and spaces only."
      );
    }

    // Mobile Number is OPTIONAL.
    // If entered, it must be exactly 10 digits.
    if (
      form.mobile_number &&
      !/^\d{10}$/.test(
        form.mobile_number
      )
    ) {
      return toast.error(
        "Mobile Number must contain exactly 10 digits."
      );
    }

    if (!form.family_members) {
      return toast.error(
        "Please enter number of family members."
      );
    }

    if (!form.subscription_amount) {
      return toast.error(
        "Please enter subscription amount."
      );
    }

    if (!form.payment_mode) {
      return toast.error(
        "Please select payment mode."
      );
    }

    if (form.status !== "Paid") {
      return toast.error(
        "Please change Payment Status to Paid before collecting the subscription."
      );
    }

    try {
      setLoading(true);

      await updatePayment(
        flat.flat_number,
        {
          owner_name:
            form.owner_name.trim(),

          mobile_number:
            form.mobile_number,

          family_members:
            Number(
              form.family_members
            ),

          subscription_amount:
            Number(
              form.subscription_amount
            ),

          payment_mode:
            form.payment_mode,

          receipt_number:
            form.receipt_number,

          transaction_id:
            form.transaction_id,

          comments:
            form.comments ?? "",

          collected_by:
            form.collected_by,

          status:
            form.status,
        }
      );

      toast.success(
        `₹${form.subscription_amount} collected successfully`
      );

      setFlat(form);

      setFlatNumber("");

      flatInputRef.current?.focus();
    } catch (err: any) {
      console.error(err);

      toast.error(
        err?.message ||
          "Failed to save payment."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="bg-linear-to-r from-blue-700 to-blue-900 px-8 py-6">

        <h2 className="text-2xl font-bold text-white">
          Quick Subscription Collection
        </h2>

        <p className="text-blue-100 mt-2">
          Search a flat and collect subscription quickly.
        </p>

      </div>

      <div className="p-5 md:p-8">

        {/* =====================================================
            SEARCH
        ===================================================== */}

        <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 md:p-6">

          <label className="block font-semibold text-gray-700 mb-2">
            Flat Number
          </label>

          <div className="flex flex-col md:flex-row gap-4">

            <input
              ref={flatInputRef}
              value={flatNumber}
              onChange={(e) =>
                setFlatNumber(
                  e.target.value.toUpperCase()
                )
              }
              onKeyDown={(e) => {
                if (
                  e.key === "Enter"
                ) {
                  handleSearch();
                }
              }}
              placeholder="Example : UG-01-01A"
              className="flex-1 border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <button
              type="button"
              onClick={handleSearch}
              disabled={loading}
              className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded-lg font-semibold disabled:bg-gray-400"
            >
              {loading
                ? "Searching..."
                : "Search Flat"}
            </button>

          </div>

        </div>

        {flat && form && (

          <div className="mt-8">

            {/* =====================================================
                FLAT COMMENTS
                Always editable by any logged-in user
            ===================================================== */}

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8">

              <div className="mb-4">

                <h3 className="text-xl font-bold text-blue-900">
                  Flat Comments
                </h3>

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
                className="w-full border rounded-lg p-3 bg-white resize-y focus:ring-2 focus:ring-blue-500 outline-none"
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

            {/* =====================================================
                FLAT DETAILS
            ===================================================== */}

            <div className="bg-gray-50 border rounded-xl p-5 mb-8">

              <h3 className="text-xl font-bold text-blue-800">
                Flat Details
              </h3>

              <div className="grid md:grid-cols-2 gap-6 mt-5">

                <div>

                  <p className="text-sm text-gray-500">
                    Flat Number
                  </p>

                  <p className="font-bold text-lg">
                    {flat.flat_number}
                  </p>

                </div>

                <div>

                  <p className="text-sm text-gray-500">
                    Current Status
                  </p>

                  <span
                    className={`inline-flex px-4 py-2 rounded-full text-white font-semibold ${
                      form.status ===
                      "Paid"
                        ? "bg-green-600"
                        : "bg-red-600"
                    }`}
                  >
                    {form.status}
                  </span>

                </div>

              </div>

            </div>

            {/* =====================================================
                PAYMENT FORM
            ===================================================== */}

            <div className="grid lg:grid-cols-2 gap-6">

              {/* Owner Name */}

              <div>

                <label className="block font-semibold mb-2">
                  Owner Name *
                </label>

                <input
                  type="text"
                  disabled={
                    !canEdit()
                  }
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Enter owner name"
                  value={
                    form.owner_name
                  }
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
                />

              </div>

              {/* Mobile Number */}

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
                  pattern="[0-9]{10}"
                  disabled={
                    !canEdit()
                  }
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Enter 10 digit mobile number"
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
                />

              </div>

              {/* Family Members */}

              <div>

                <label className="block font-semibold mb-2">
                  Number of Family Members *
                </label>

                <input
                  type="number"
                  min="1"
                  disabled={
                    !canEdit()
                  }
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Enter number of family members"
                  value={
                    form.family_members
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,

                      family_members:
                        e.target.value,
                    })
                  }
                />

              </div>

              {/* Subscription Amount */}

              <div>

                <label className="block font-semibold mb-2">
                  Subscription Amount (₹) *
                </label>

                <input
                  type="number"
                  min="0"
                  disabled={
                    !canEdit()
                  }
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Enter subscription amount"
                  value={
                    form.subscription_amount
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,

                      subscription_amount:
                        e.target.value,
                    })
                  }
                />

              </div>

              {/* Payment Mode */}

              <div>

                <label className="block font-semibold mb-2">
                  Payment Mode *
                </label>

                <select
                  disabled={
                    !canEdit()
                  }
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
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

                </select>

              </div>

              {/* Receipt Number */}

              <div>

                <label className="block font-semibold mb-2">
                  Receipt Number
                </label>

                <input
                  disabled={
                    !canEdit()
                  }
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Enter receipt number"
                  value={
                    form.receipt_number
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,

                      receipt_number:
                        e.target.value,
                    })
                  }
                />

              </div>

              {/* Transaction ID */}

              <div>

                <label className="block font-semibold mb-2">
                  Transaction ID
                </label>

                <input
                  disabled={
                    !canEdit()
                  }
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="UPI / Bank Transaction ID"
                  value={
                    form.transaction_id
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,

                      transaction_id:
                        e.target.value,
                    })
                  }
                />

              </div>

              {/* Collected By */}

              <div>

                <label className="block font-semibold mb-2">
                  Collected By
                </label>

                <input
                  type="text"
                  readOnly
                  disabled
                  value={
                    form.collected_by ||
                    currentUser?.username ||
                    ""
                  }
                  className="w-full border rounded-lg p-3 bg-gray-100 text-gray-700 cursor-not-allowed"
                />

              </div>

              {/* Payment Status */}

              <div className="lg:col-span-2">

                <label className="block font-semibold mb-2">
                  Payment Status
                </label>

                <select
                  disabled={
                    !canEdit()
                  }
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                  value={
                    form.status
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,

                      status:
                        e.target.value,
                    })
                  }
                >

                  <option value="Pending">
                    🔴 Pending
                  </option>

                  <option value="Paid">
                    🟢 Paid
                  </option>

                </select>

              </div>

            </div>

            {/* =====================================================
                PERMISSION WARNING
            ===================================================== */}

            {!canEdit() && (

              <div className="mt-6 bg-yellow-50 border border-yellow-300 rounded-lg p-4">

                <p className="text-yellow-800 font-semibold">
                  This subscription was collected by{" "}
                  <strong>
                    {form.collected_by}
                  </strong>.
                </p>

                <p className="text-sm text-yellow-700 mt-1">
                  Only the original collector or the Admin can edit the payment details.
                  Comments can still be updated by anyone.
                </p>

              </div>

            )}

            {/* =====================================================
                COLLECT BUTTON
            ===================================================== */}

            <div className="mt-10">

              <button
                type="button"
                onClick={
                  handleSave
                }
                disabled={
                  loading ||
                  form.status !==
                    "Paid" ||
                  !canEdit()
                }
                className={`w-full text-lg font-bold py-4 rounded-xl shadow-lg transition-all ${
                  loading
                    ? "bg-gray-400 text-white"
                    : !canEdit()
                    ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                    : form.status ===
                      "Paid"
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-gray-400 text-gray-200 cursor-not-allowed"
                }`}
              >
                {loading
                  ? "Saving Payment..."
                  : !canEdit()
                  ? "🔒 Not Your Collection"
                  : form.status ===
                    "Paid"
                  ? "💰 Collect Subscription"
                  : "🔒 Select Paid to Collect"}
              </button>

            </div>

          </div>

        )}

      </div>

    </div>
  );
}