"use client";

import { usePathname } from "next/navigation";
import { AppLayout } from "@/app/components/layout/app-layout";

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() ?? "";

  // Routes that should NOT use AppLayout (no sidebar)
  const noLayoutRoutes = [
    "/",
    "/login",
    "/signup",
    "/admin/dashboard",
    "/admin/login",
    "/admin/add-admin",
    "/404",
    "/not-found",
    "/error",
  ];

  const isNoLayoutRoute = noLayoutRoutes.some((route) =>
    route === "/" ? pathname === "/" : pathname.startsWith(route)
  );

  if (isNoLayoutRoute) {
    return <div className="min-h-screen">{children}</div>;
  }

  return <AppLayout>{children}</AppLayout>;
}
