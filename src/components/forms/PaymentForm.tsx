"use client";

import { useRef, useState } from "react";
import toast from "react-hot-toast";

import { searchFlat } from "@/services/flatsService";
import { updatePayment } from "@/services/paymentService";

export default function PaymentForm() {
  const flatInputRef = useRef<HTMLInputElement>(null);

  const [flatNumber, setFlatNumber] = useState("");

  const [flat, setFlat] = useState<any>(null);

  const [form, setForm] = useState<any>(null);

  const [loading, setLoading] = useState(false);

  async function handleSearch() {
    if (!flatNumber.trim()) {
      toast.error("Please enter Flat Number.");
      flatInputRef.current?.focus();
      return;
    }

    try {
      setLoading(true);

      const data = await searchFlat(flatNumber.trim());

      setFlat(data);

      setForm({
        ...data,

        owner_name: data.owner_name ?? "",

        mobile_number: data.mobile_number ?? "",

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

        collected_by:
          data.collected_by ?? "",

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

  async function handleSave() {
    if (!form.owner_name)
      return toast.error("Owner Name is required.");

    if (!form.mobile_number)
      return toast.error("Mobile Number is required.");

    if (!form.family_members)
      return toast.error(
        "Please enter number of family members."
      );

    if (!form.subscription_amount)
      return toast.error(
        "Please enter subscription amount."
      );

    if (!form.payment_mode)
      return toast.error(
        "Please select payment mode."
      );

    if (!form.collected_by)
      return toast.error(
        "Please enter collector name."
      );

    try {
      setLoading(true);

      await updatePayment(flat.flat_number, {
        owner_name: form.owner_name,

        mobile_number: form.mobile_number,

        family_members: Number(
          form.family_members
        ),

        subscription_amount: Number(
          form.subscription_amount
        ),

        payment_mode: form.payment_mode,

        receipt_number:
          form.receipt_number,

        transaction_id:
          form.transaction_id,

        collected_by:
          form.collected_by,

        status: form.status,
      });

      toast.success(
        `₹${form.subscription_amount} collected successfully`
      );

      setFlat(form);

      setFlatNumber("");

      flatInputRef.current?.focus();
    } catch (err) {
      console.error(err);

      toast.error("Failed to save payment.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">

      <div className="bg-linear-to-r from-blue-700 to-blue-900 px-8 py-6">

        <h2 className="text-2xl font-bold text-white">
          Quick Subscription Collection
        </h2>

        <p className="text-blue-100 mt-2">
          Search a flat and collect subscription quickly.
        </p>

      </div>

      <div className="p-8">

        {/* Search */}

        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">

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
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              placeholder="Example : UG-01-01A"
              className="flex-1 border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <button
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
                      form.status === "Paid"
                        ? "bg-green-600"
                        : "bg-red-600"
                    }`}
                  >
                    {form.status}
                  </span>

                </div>

              </div>

            </div>

            <div className="grid lg:grid-cols-2 gap-6">

              <div>

                <label className="block font-semibold mb-2">
                  Owner Name *
                </label>

                <input
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Enter owner name"
                  value={form.owner_name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      owner_name:
                        e.target.value,
                    })
                  }
                />

              </div>

              <div>

                <label className="block font-semibold mb-2">
                  Mobile Number *
                </label>

                <input
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Enter mobile number"
                  value={form.mobile_number}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      mobile_number:
                        e.target.value,
                    })
                  }
                />

              </div>

              <div>

                <label className="block font-semibold mb-2">
                  Number of Family Members *
                </label>

                <input
                  type="number"
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Enter number of family members"
                  value={form.family_members}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      family_members:
                        e.target.value,
                    })
                  }
                />

              </div>

              <div>

                <label className="block font-semibold mb-2">
                  Subscription Amount (₹) *
                </label>

                <input
                  type="number"
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Enter subscription amount"
                  value={form.subscription_amount}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      subscription_amount:
                        e.target.value,
                    })
                  }
                />

              </div>
                            <div>

                <label className="block font-semibold mb-2">
                  Payment Mode *
                </label>

                <select
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={form.payment_mode}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      payment_mode: e.target.value,
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

              <div>

                <label className="block font-semibold mb-2">
                  Receipt Number
                </label>

                <input
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Enter receipt number"
                  value={form.receipt_number}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      receipt_number:
                        e.target.value,
                    })
                  }
                />

              </div>

              <div>

                <label className="block font-semibold mb-2">
                  Transaction ID
                </label>

                <input
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="UPI / Bank Transaction ID"
                  value={form.transaction_id}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      transaction_id:
                        e.target.value,
                    })
                  }
                />

              </div>

              <div>

                <label className="block font-semibold mb-2">
                  Collected By *
                </label>

                <input
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Volunteer name"
                  value={form.collected_by}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      collected_by:
                        e.target.value,
                    })
                  }
                />

              </div>

              <div className="lg:col-span-2">

                <label className="block font-semibold mb-2">
                  Payment Status
                </label>

                <select
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={form.status}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      status: e.target.value,
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

            <div className="mt-10">

              <button
                onClick={handleSave}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white text-lg font-bold py-4 rounded-xl shadow-lg transition-all disabled:bg-gray-400"
              >
                {loading
                  ? "Saving Payment..."
                  : "💰 Collect Subscription"}
              </button>

            </div>

          </div>

        )}

      </div>

    </div>
  );
}