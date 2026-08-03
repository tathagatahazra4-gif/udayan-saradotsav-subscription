"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { login } from "@/services/authService";
import { logLogin } from "@/services/activityService";
import { useAuth } from "@/components/providers/AuthProvider";

export default function LoginPage() {
  const router = useRouter();

  const { refreshUser } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      console.log("Calling login...");

      const user = await login(
        username.trim(),
        password
      );

      console.log("Login success:", user);

      await logLogin(user.username);

      console.log("Activity logged");

      refreshUser();

      // allow React context to update
      await new Promise((resolve) =>
        setTimeout(resolve, 50)
      );

      router.replace("/dashboard");
    } catch (err: any) {
      console.error(err);

      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-blue-900">
          UDAYAN SARADOTSAV SAMITY
        </h1>

        <p className="text-center text-gray-500 mt-2 mb-8">
          Committee Login
        </p>

        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >
          <input
            type="text"
            placeholder="Username"
            className="w-full border rounded p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border rounded p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          {error && (
            <p className="text-red-600 text-sm">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-700 hover:bg-blue-800 disabled:bg-gray-400 text-white rounded p-3 font-semibold transition"
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}