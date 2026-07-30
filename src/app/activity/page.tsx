"use client";

import { useEffect, useState } from "react";

import AppLayout from "@/components/layout/AppLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

import { getActivities } from "@/services/activityService";

export default function ActivityPage() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getActivities();
        setActivities(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return (
      <ProtectedRoute>
        <AppLayout>
          <div className="text-xl">
            Loading Activity...
          </div>
        </AppLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="space-y-6">

          <h1 className="text-4xl font-bold">
            Activity History
          </h1>

          <div className="bg-white rounded-lg shadow overflow-hidden">

            <table className="min-w-full">

              <thead className="bg-gray-100">

                <tr>
                  <th className="p-3 text-left">Time</th>
                  <th className="p-3 text-left">Flat</th>
                  <th className="p-3 text-left">Action</th>
                  <th className="p-3 text-left">Performed By</th>
                </tr>

              </thead>

              <tbody>

                {activities.map((item) => (

                  <tr
                    key={item.id}
                    className="border-t"
                  >
                    <td className="p-3">
                      {new Date(item.created_at).toLocaleString()}
                    </td>

                    <td className="p-3 font-semibold">
                      {item.flat_number}
                    </td>

                    <td className="p-3">
                      {item.action}
                    </td>

                    <td className="p-3">
                      {item.performed_by}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}