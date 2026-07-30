"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/supabase/client";
import { getCurrentProfile } from "@/services/profileService";

export default function Navbar() {
  const router = useRouter();

  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getCurrentProfile();
        setProfile(data);
      } catch (err) {
        console.error(err);
      }
    }

    loadProfile();
  }, []);

  async function handleLogout() {
    const confirmLogout = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmLogout) return;

    await supabase.auth.signOut();

    router.replace("/login");
  }

  return (
    <header className="bg-white shadow px-6 py-4 flex justify-between items-center">

      <div>
        <h1 className="text-2xl font-bold text-blue-900">
          UDAYAN SARADOTSAV SAMITY
        </h1>

        <p className="text-sm text-gray-500">
          Subscription Collection System
        </p>
      </div>

      <div className="flex items-center gap-8">

        <div className="text-right">

          <p className="font-bold text-blue-900">
            {profile?.full_name ?? "Loading..."}
          </p>

          <p className="text-sm text-gray-600">
            {profile?.role}
          </p>

          <p className="text-xs text-gray-400">
            {profile?.email}
          </p>

        </div>

        <div className="text-right">

          <p className="font-semibold">
            Puja Year
          </p>

          <p>
            2026
          </p>

        </div>

        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
        >
          Logout
        </button>

      </div>

    </header>
  );
}