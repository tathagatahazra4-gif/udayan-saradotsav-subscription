"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/providers/AuthProvider";
import { getLoggedInUser } from "@/services/authService";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Check custom committee login
    const committeeUser = getLoggedInUser();

    if (!loading && (!user || !committeeUser)) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  // Prevent rendering if either authentication fails
  if (!user || !getLoggedInUser()) {
    return null;
  }

  return <>{children}</>;
}