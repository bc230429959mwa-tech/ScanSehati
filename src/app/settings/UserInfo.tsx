"use client";
import { LogOutIcon } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";

export default function UserInfo() {
  const { data: session, update } = useSession();
  const user = session?.user;

  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Fetch user data from DB
  useEffect(() => {
    if (!user?.id) return;

    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/settings?id=${user.id}`);
        if (res.ok) {
          const data = await res.json();
          setUsername(data.username || "");
          setFullName(data.fullName || "");
          setEmail(data.email || "");
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [user?.id]);

  // Save changes
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess("");
    setError("");

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user?.id, username, fullName }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess("Profile updated!");
        update &&
          update({
            ...session,
            user: { ...user, username, fullName },
          });
      } else {
        setError(data.error || "Failed to update profile");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading profile...</div>;

  return (
    <form onSubmit={handleSave} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block mb-1 font-medium">Username</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Full Name</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>
      </div>

      <div>
        <label className="block mb-1 font-medium">Email</label>
        <input
          type="email"
          className="w-full border rounded px-3 py-2 bg-gray-100"
          value={email}
          readOnly
        />
      </div>

      {success && <div className="text-green-600">{success}</div>}
      {error && <div className="text-red-600">{error}</div>}
<div className="flex items-center justify-between">
      <button
        type="submit"
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        disabled={saving}
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
      <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
    >
     <LogOutIcon className="inline-block mr-2" />
      Logout
    </button>
    </div>
    </form>
  );
}
