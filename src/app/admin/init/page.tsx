"use client";

import { useState } from "react";
import { generateFlats } from "@/lib/generateFlats";
import { uploadFlats } from "@/services/supabase";

export default function InitPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleGenerate() {
    try {
      setLoading(true);

      const flats = generateFlats();

      await uploadFlats(flats);

      setMessage(`Successfully uploaded ${flats.length} flats.`);
    } catch (err) {
      console.error(err);
      setMessage("Error uploading flats.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6">
      <h1 className="text-3xl font-bold mb-6">
        Initialize Database
      </h1>

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-3 rounded"
      >
        {loading ? "Uploading..." : "Generate 890 Flats"}
      </button>

      {message && (
        <p className="mt-6 text-lg">
          {message}
        </p>
      )}
    </div>
  );
}