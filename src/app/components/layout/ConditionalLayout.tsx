"use client";

import { usePathname } from "next/navigation";
import { AppLayout } from "@/app/components/layout/app-layout";

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() ?? "";

  // ❌ Routes that should NOT use AppLayout
  const noLayoutRoutes = [
    "/login",
    "/signup",
    "/admin/login",
    "/admin/dashboard",
    "/admin/add-admin",
    "/404",
    "/not-found",
    "/error",
  ];

  // ✅ Hide layout for any route that starts with these
  const isNoLayoutRoute = noLayoutRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isNoLayoutRoute) {
    return <div className="min-h-screen">{children}</div>;
  }

  return <AppLayout>{children}</AppLayout>;
}
