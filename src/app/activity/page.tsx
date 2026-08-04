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

          <div className="bg-white rounded-lg shadow overflow-x-auto">

            <table className="min-w-[750px] w-full">

              <thead className="bg-gray-100">

                <tr>
                  <th className="p-3 text-left whitespace-nowrap">
                    Time
                  </th>

                  <th className="p-3 text-left whitespace-nowrap">
                    Flat
                  </th>

                  <th className="p-3 text-left whitespace-nowrap">
                    Action
                  </th>

                  <th className="p-3 text-left whitespace-nowrap">
                    Performed By
                  </th>
                </tr>

              </thead>

              <tbody>

                {activities.length === 0 ? (

                  <tr>
                    <td
                      colSpan={4}
                      className="text-center py-10 text-gray-500"
                    >
                      No activity found.
                    </td>
                  </tr>

                ) : (

                  activities.map((item) => (

                    <tr
                      key={item.id}
                      className="border-t hover:bg-gray-50"
                    >
                      <td className="p-3 whitespace-nowrap">
                        {new Date(
                          item.created_at
                        ).toLocaleString()}
                      </td>

                      <td className="p-3 font-semibold whitespace-nowrap">
                        {item.flat_number || "-"}
                      </td>

                      <td className="p-3 whitespace-nowrap">
                        {item.action || "-"}
                      </td>

                      <td className="p-3 whitespace-nowrap">
                        {item.performed_by || "-"}
                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}