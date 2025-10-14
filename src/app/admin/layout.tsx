"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname() ?? ""; // ✅ Fix: fallback to empty string
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/admin/verify", { method: "GET" });
        const data = await res.json();

        if (data.authenticated) {
          // ✅ Already logged in → prevent visiting login/signup
          if (pathname === "/admin/login" || pathname === "/admin/signup") {
            router.replace("/admin/dashboard");
            return;
          }
        } else {
          // ❌ Not logged in → prevent accessing dashboard or other admin routes
          if (!pathname.startsWith("/admin/login") && !pathname.startsWith("/admin/signup")) {
            router.replace("/admin/login");
            return;
          }
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        router.replace("/admin/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Checking authentication...</p>
      </div>
    );
  }

  return <>{children}</>;
}
