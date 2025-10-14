"use client";

import { usePathname } from "next/navigation";
import { AppLayout } from "@/app/components/layout/app-layout";

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ✅ Safely handle potential `null` pathname
  const pathname = usePathname() ?? "";

  // ❌ Routes that should NOT use AppLayout
  const noLayoutRoutes = [
    "/login",
    "/signup",
    "/admin/login",
    "/admin/dashboard",
  ];

  const isNoLayoutRoute = noLayoutRoutes.includes(pathname);

  if (isNoLayoutRoute) {
    // ✅ Render children directly (no sidebar/layout)
    return <div className="min-h-screen">{children}</div>;
  }

  // ✅ Default: wrap all other routes with AppLayout
  return <AppLayout>{children}</AppLayout>;
}
