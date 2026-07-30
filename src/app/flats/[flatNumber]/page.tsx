"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import AppLayout from "@/components/layout/AppLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

import { searchFlat } from "@/services/flatsService";
import { updatePayment } from "@/services/paymentService";
import { addActivity } from "@/services/activityService";
import { getCurrentUserName } from "@/services/profileService";

export default function EditFlatPage() {
  const { flatNumber } = useParams();
  const router = useRouter();

  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadFlat() {
      try {
        const data = await searchFlat(flatNumber as string);
        setForm(data);
      } catch (err) {
        console.error(err);
        alert("Flat not found");
        router.push("/flats");
      } finally {
        setLoading(false);
      }
    }

    loadFlat();
  }, [flatNumber, router]);

  async function handleSave() {
    try {
      setSaving(true);

      await updatePayment(form.flat_number, {
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

      const userName = await getCurrentUserName();

      await addActivity(
        form.flat_number,
        "Payment Updated",
        userName
      );

      alert("Payment updated successfully.");

      router.push("/flats");
    } catch (err) {
      console.error(err);
      alert("Failed to update.");
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

  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="max-w-3xl mx-auto bg-white shadow rounded-lg p-8">

          <h1 className="text-3xl font-bold mb-8">
            Edit Flat
          </h1>

          <div className="space-y-5">

            <div>
              <label className="font-semibold block mb-2">
                Flat Number
              </label>

              <input
                value={form.flat_number}
                disabled
                className="w-full border rounded p-3 bg-gray-100"
              />
            </div>

            <div>
              <label className="font-semibold block mb-2">
                Owner Name
              </label>

              <input
                value={form.owner_name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    owner_name: e.target.value,
                  })
                }
                className="w-full border rounded p-3"
              />
            </div>

            <div>
              <label className="font-semibold block mb-2">
                Mobile Number
              </label>

              <input
                value={form.mobile_number}
                onChange={(e) =>
                  setForm({
                    ...form,
                    mobile_number: e.target.value,
                  })
                }
                className="w-full border rounded p-3"
              />
            </div>

            <div>
              <label className="font-semibold block mb-2">
                Family Members
              </label>

              <input
                type="number"
                value={form.family_members}
                onChange={(e) =>
                  setForm({
                    ...form,
                    family_members: e.target.value,
                  })
                }
                className="w-full border rounded p-3"
              />
            </div>

            <div>
              <label className="font-semibold block mb-2">
                Subscription Amount
              </label>

              <input
                type="number"
                value={form.subscription_amount}
                onChange={(e) =>
                  setForm({
                    ...form,
                    subscription_amount: e.target.value,
                  })
                }
                className="w-full border rounded p-3"
              />
            </div>

            <div>
              <label className="font-semibold block mb-2">
                Payment Mode
              </label>

              <select
                value={form.payment_mode}
                onChange={(e) =>
                  setForm({
                    ...form,
                    payment_mode: e.target.value,
                  })
                }
                className="w-full border rounded p-3"
              >
                <option value="">Select</option>
                <option>Cash</option>
                <option>UPI</option>
                <option>Bank Transfer</option>
              </select>
            </div>

            <div>
              <label className="font-semibold block mb-2">
                Receipt Number
              </label>

              <input
                value={form.receipt_number}
                onChange={(e) =>
                  setForm({
                    ...form,
                    receipt_number: e.target.value,
                  })
                }
                className="w-full border rounded p-3"
              />
            </div>

            <div>
              <label className="font-semibold block mb-2">
                Transaction ID
              </label>

              <input
                value={form.transaction_id}
                onChange={(e) =>
                  setForm({
                    ...form,
                    transaction_id: e.target.value,
                  })
                }
                className="w-full border rounded p-3"
              />
            </div>

            <div>
              <label className="font-semibold block mb-2">
                Collected By
              </label>

              <input
                value={form.collected_by}
                onChange={(e) =>
                  setForm({
                    ...form,
                    collected_by: e.target.value,
                  })
                }
                className="w-full border rounded p-3"
              />
            </div>

            <div>
              <label className="font-semibold block mb-2">
                Status
              </label>

              <select
                value={form.status}
                onChange={(e) =>
                  setForm({
                    ...form,
                    status: e.target.value,
                  })
                }
                className="w-full border rounded p-3"
              >
                <option>Pending</option>
                <option>Paid</option>
              </select>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

          </div>

        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}