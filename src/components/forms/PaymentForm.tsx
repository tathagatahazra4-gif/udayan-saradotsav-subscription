"use client";

import { useState } from "react";
import { searchFlat } from "@/services/flatsService";
import { updatePayment } from "@/services/paymentService";

export default function PaymentForm() {
 const [flatNumber, setFlatNumber] = useState("");
const [flat, setFlat] = useState<any>(null);
const [form, setForm] = useState<any>(null);
const [loading, setLoading] = useState(false);

async function handleSearch() {
  try {
    setLoading(true);

    const data = await searchFlat(flatNumber);

   setFlat(data);
setForm(data);

  } catch (err) {
    alert("Flat not found");
    setFlat(null);
  } finally {
    setLoading(false);
  }
}
async function handleSave() {
  try {
    setLoading(true);

    await updatePayment(flat.flat_number, {
      owner_name: form.owner_name,
      mobile_number: form.mobile_number,
      family_members: Number(form.family_members),
      subscription_amount: Number(form.subscription_amount),
      payment_mode: form.payment_mode,
      receipt_number: form.receipt_number,
      transaction_id: form.transaction_id,
      collected_by: form.collected_by,
      status: form.status,
    });

    alert("Payment saved successfully!");

    setFlat(form);

  } catch (err) {
    console.error(err);
    alert("Failed to save payment.");
  } finally {
    setLoading(false);
  }
}
  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-5">

      <div>
        <label className="block font-semibold mb-2">
          Flat Number
        </label>

        <input
          value={flatNumber}
          onChange={(e) => setFlatNumber(e.target.value)}
          placeholder="UG-01-01A"
          className="w-full border rounded p-3"
        />
      </div>

      <button
  onClick={handleSearch}
  className="bg-blue-600 text-white px-6 py-3 rounded"
>
  {loading ? "Searching..." : "Search Flat"}
</button>

{flat && form && (
  <div className="mt-8 border rounded-lg p-5 space-y-3">

    <h2 className="text-xl font-bold">
      Flat Details
    </h2>

    <p><b>Flat:</b> {flat.flat_number}</p>

    <div className="space-y-4">

  <input
    className="w-full border rounded p-2"
    placeholder="Owner Name"
    value={form.owner_name}
    onChange={(e) =>
      setForm({ ...form, owner_name: e.target.value })
    }
  />

  <input
    className="w-full border rounded p-2"
    placeholder="Mobile Number"
    value={form.mobile_number}
    onChange={(e) =>
      setForm({ ...form, mobile_number: e.target.value })
    }
  />

  <input
    type="number"
    className="w-full border rounded p-2"
    placeholder="Family Members"
    value={form.family_members}
    onChange={(e) =>
      setForm({ ...form, family_members: e.target.value })
    }
  />

  <input
    type="number"
    className="w-full border rounded p-2"
    placeholder="Subscription Amount"
    value={form.subscription_amount}
    onChange={(e) =>
      setForm({ ...form, subscription_amount: e.target.value })
    }
  />

  <select
    className="w-full border rounded p-2"
    value={form.payment_mode}
    onChange={(e) =>
      setForm({ ...form, payment_mode: e.target.value })
    }
  >
    <option value="">Select Payment Mode</option>
    <option>Cash</option>
    <option>UPI</option>
    <option>Bank Transfer</option>
  </select>

  <input
    className="w-full border rounded p-2"
    placeholder="Receipt Number"
    value={form.receipt_number}
    onChange={(e) =>
      setForm({ ...form, receipt_number: e.target.value })
    }
  />

  <input
    className="w-full border rounded p-2"
    placeholder="Transaction ID"
    value={form.transaction_id}
    onChange={(e) =>
      setForm({ ...form, transaction_id: e.target.value })
    }
  />

  <input
    className="w-full border rounded p-2"
    placeholder="Collected By"
    value={form.collected_by}
    onChange={(e) =>
      setForm({ ...form, collected_by: e.target.value })
    }
  />

  <select
    className="w-full border rounded p-2"
    value={form.status}
    onChange={(e) =>
      setForm({ ...form, status: e.target.value })
    }
  >
    <option>Pending</option>
    <option>Paid</option>
  </select>

  <button
  onClick={handleSave}
  disabled={loading}
  className="w-full bg-green-600 text-white p-3 rounded disabled:bg-gray-400"
>
  {loading ? "Saving..." : "Save Payment"}
</button>

</div>

  </div>
)}
    </div>
  );
}