"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (!res?.ok) {
      setError(res?.error || "Invalid credentials");
      setLoading(false);
      return;
    }

    await new Promise((r) => setTimeout(r, 300));
    const sessionRes = await fetch("/api/auth/session");
    const session = await sessionRes.json();
    const role = session?.user?.role;

    if (role === "doctor") router.push("/for-doctors");
    else if (role === "pharmacist") router.push("/for-pharmacists");
    else router.push("/");

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-green-700 font-[Poppins] flex items-center justify-center relative overflow-hidden">
      {/* Floating Shapes */}
      <div className="absolute w-32 h-32 bg-blue-400/30 rounded-full blur-3xl top-10 left-10"></div>
      <div className="absolute w-24 h-24 bg-green-400/30 rounded-full blur-2xl bottom-10 right-10"></div>

      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-6xl px-6 z-10">
        {/* Branding Section */}
        <div className="flex-1 text-white mb-10 md:mb-0 md:pr-10">
          <h1 className="text-6xl font-extrabold mb-4">
            <span className="text-blue-400">Scan</span>
            <span className="text-green-400">Sehati</span>
          </h1>
          <p className="text-xl font-medium mb-2">
            Welcome back to your digital healthcare space
          </p>
          <p className="text-gray-200 max-w-md">
            Log in to manage appointments, prescriptions, and connect with doctors or patients — all in one place.
          </p>
        </div>

        {/* Login Form */}
        <div className="flex-1 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <h2 className="text-3xl font-bold text-center text-white mb-6">
            Welcome Back 👋
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="text-red-400 text-center font-medium bg-white/10 rounded-md py-2">
                {error}
              </div>
            )}

            {/* Username or Email */}
            <div>
              <input
                type="text"
                placeholder="Username or Email"
                className="w-full p-3 rounded-md bg-white/20 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div>
              <input
                type="password"
                placeholder="Password"
                className="w-full p-3 rounded-md bg-white/20 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-green-500 rounded-md text-white font-bold shadow-md hover:scale-[1.02] transition-transform duration-200"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            {/* Signup Link */}
            <p className="text-sm text-gray-200 text-center">
              Don’t have an account?{" "}
              <a href="/signup" className="text-blue-300 hover:underline">
                Sign up
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
