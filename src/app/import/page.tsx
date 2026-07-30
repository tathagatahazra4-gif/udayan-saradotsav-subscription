"use client";

import { useState } from "react";

import AppLayout from "@/components/layout/AppLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

import { importFlats } from "@/services/importService";

export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState<any>(null);

  async function handleImport() {
    if (!file) {
      alert("Please choose an Excel file.");
      return;
    }

    try {
      setLoading(true);

      const res = await importFlats(file);

      setResult(res);

      alert("Import completed successfully.");
    } catch (err) {
      console.error(err);
      alert("Import failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ProtectedRoute>
      <AppLayout>

        <div className="max-w-3xl mx-auto">

          <div className="bg-white rounded-xl shadow-lg p-8">

            <h1 className="text-3xl font-bold mb-2">
              Import Flats from Excel
            </h1>

            <p className="text-gray-500 mb-8">
              Upload an Excel (.xlsx) file to add or update flat records.
            </p>

            <div className="space-y-6">

              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={(e) =>
                  setFile(e.target.files?.[0] || null)
                }
                className="block w-full border rounded-lg p-3"
              />

              {file && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p>
                    <b>Selected File:</b> {file.name}
                  </p>

                  <p>
                    <b>Size:</b>{" "}
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              )}

              <button
                onClick={handleImport}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 rounded-lg"
              >
                {loading
                  ? "Importing..."
                  : "Import Excel"}
              </button>

            </div>

          </div>

          {result && (

            <div className="mt-8 bg-white rounded-xl shadow-lg p-6">

              <h2 className="text-2xl font-bold mb-5">
                Import Summary
              </h2>

              <div className="grid grid-cols-3 gap-5">

                <div className="bg-green-100 rounded-lg p-5 text-center">

                  <h3 className="text-lg font-bold">
                    Imported
                  </h3>

                  <p className="text-4xl font-bold text-green-700 mt-2">
                    {result.imported}
                  </p>

                </div>

                <div className="bg-blue-100 rounded-lg p-5 text-center">

                  <h3 className="text-lg font-bold">
                    Updated
                  </h3>

                  <p className="text-4xl font-bold text-blue-700 mt-2">
                    {result.updated}
                  </p>

                </div>

                <div className="bg-red-100 rounded-lg p-5 text-center">

                  <h3 className="text-lg font-bold">
                    Failed
                  </h3>

                  <p className="text-4xl font-bold text-red-700 mt-2">
                    {result.failed}
                  </p>

                </div>

              </div>

            </div>

          )}

        </div>

      </AppLayout>
    </ProtectedRoute>
  );
}