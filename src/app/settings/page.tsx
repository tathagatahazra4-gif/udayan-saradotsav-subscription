"use client";

import { useState } from "react";

import AppLayout from "@/components/layout/AppLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

import { exportDatabase } from "@/services/backupService";
import { restoreDatabase } from "@/services/restoreService";

export default function SettingsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleBackup() {
    try {
      setLoading(true);

      await exportDatabase();

      alert("Database backup downloaded successfully.");
    } catch (err) {
      console.error(err);
      alert("Backup failed.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRestore() {
    if (!file) {
      alert("Please choose a backup file.");
      return;
    }

    const confirmed = window.confirm(
      "This will restore the database from the selected backup. Continue?"
    );

    if (!confirmed) return;

    try {
      setLoading(true);

      await restoreDatabase(file);

      alert("Database restored successfully.");
    } catch (err) {
      console.error(err);
      alert("Restore failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ProtectedRoute>
      <AppLayout>

        <div className="max-w-5xl mx-auto space-y-8">

          <h1 className="text-4xl font-bold">
            Settings
          </h1>

          {/* Backup */}

          <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-2xl font-bold mb-3">
              Backup Database
            </h2>

            <p className="text-gray-600 mb-6">
              Download a complete backup of all flats and payment information.
            </p>

            <button
              onClick={handleBackup}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
            >
              Download Backup
            </button>

          </div>

          {/* Restore */}

          <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-2xl font-bold mb-3">
              Restore Database
            </h2>

            <p className="text-gray-600 mb-6">
              Select a previously exported backup file.
            </p>

            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) =>
                setFile(e.target.files?.[0] ?? null)
              }
              className="border rounded-lg p-3 w-full"
            />

            <button
              onClick={handleRestore}
              disabled={loading}
              className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
            >
              Restore Database
            </button>

          </div>

        </div>

      </AppLayout>
    </ProtectedRoute>
  );
}