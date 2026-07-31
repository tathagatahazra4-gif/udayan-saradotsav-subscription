"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { FaBars } from "react-icons/fa";

import { supabase } from "@/supabase/client";
import { getCurrentProfile } from "@/services/profileService";

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({
  onMenuClick,
}: NavbarProps) {
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
    <header className="bg-white shadow px-4 md:px-6 py-3 md:py-4">

      <div className="flex items-center justify-between">

        {/* Left */}

        <div className="flex items-center gap-3">

          {/* Mobile Hamburger */}

          <button
            onClick={onMenuClick}
            className="md:hidden text-2xl text-blue-900"
          >
            <FaBars />
          </button>

          <div>

            <h1 className="text-lg md:text-2xl font-bold text-blue-900">
              UDAYAN SARADOTSAV SAMITY
            </h1>

            <p className="hidden md:block text-sm text-gray-500">
              Subscription Collection System
            </p>

          </div>

        </div>

        {/* Right */}

        <div className="flex items-center gap-4 md:gap-8">

          {/* Hide extra info on phones */}

          <div className="hidden md:block text-right">

            <p className="font-bold text-blue-900">
              {profile?.full_name ?? ""}
            </p>

            <p className="text-sm text-gray-600">
              {profile?.role}
            </p>

            <p className="text-xs text-gray-400">
              {profile?.email}
            </p>

          </div>

          <div className="hidden lg:block text-right">

            <p className="font-semibold">
              Puja Year
            </p>

            <p>
              2026
            </p>

          </div>

          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-3 md:px-4 py-2 rounded-lg text-sm md:text-base"
          >
            Logout
          </button>

        </div>

      </div>

    </header>
  );
}