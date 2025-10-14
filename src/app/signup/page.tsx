"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
    role: "patient",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.username.length < 4 || form.username.length > 15) {
      setError("Username must be between 4 and 15 characters long.");
      return;
    }

    if (form.password.length < 8 || form.password.length > 20) {
      setError("Password must be between 8 and 20 characters long.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, register: true }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      router.push("/login");
    } else {
      setError(data.error || "Signup failed");
    }
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
          <p className="text-xl font-medium mb-2">Join our digital healthcare network</p>
          <p className="text-gray-200 max-w-md">
            Connect doctors, pharmacists & patients seamlessly — your one-stop solution for
            healthcare collaboration.
          </p>
        </div>

        {/* Signup Form */}
        <div className="flex-1 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <h2 className="text-3xl font-bold text-center text-white mb-6">
            Create Account ✨
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="text-red-400 text-center font-medium bg-white/10 rounded-md py-2">
                {error}
              </div>
            )}

            {/* Role Dropdown */}
            <div className="relative">
              <label className="text-sm text-gray-200 block mb-1">Select Role</label>
              <div className="relative">
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full appearance-none p-3 rounded-md bg-white/30 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-green-400 shadow-inner"
                  required
                >
                  <option value="patient">👤 Patient</option>
                  <option value="doctor">🩺 Doctor</option>
                  <option value="pharmacist">💊 Pharmacist</option>
                </select>
                <div className="absolute right-3 top-3 text-gray-700 pointer-events-none">▼</div>
              </div>
            </div>

            {/* Username */}
            <div>
              <input
                type="text"
                name="username"
                placeholder="Username"
                className="w-full p-3 rounded-md bg-white/20 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={form.username}
                onChange={handleChange}
                required
                minLength={4}
                maxLength={15}
              />
              <p className="text-xs text-gray-200 mt-1">
                Username must be 4–15 characters long and unique.
              </p>
            </div>

            {/* Full Name */}
            <div>
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                className="w-full p-3 rounded-md bg-white/20 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400"
                value={form.fullName}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email */}
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="w-full p-3 rounded-md bg-white/20 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password */}
            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="w-full p-3 rounded-md bg-white/20 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400"
                value={form.password}
                onChange={handleChange}
                required
                minLength={8}
                maxLength={20}
              />
              <p className="text-xs text-gray-200 mt-1">
                Password must be 8–20 characters long.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-green-500 rounded-md text-white font-bold shadow-md hover:scale-[1.02] transition-transform duration-200"
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>

            <p className="text-sm text-gray-200 text-center">
              Already have an account?{" "}
              <a href="/login" className="text-blue-300 hover:underline">
                Log in
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
