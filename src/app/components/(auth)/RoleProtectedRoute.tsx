"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface Props {
  allowedRoles: string[];
  children: React.ReactNode;
}

export default function RoleProtectedRoute({ allowedRoles, children }: Props) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // wait for session
    if (!session?.user) {
      router.push("/login");
    } else if (!allowedRoles.includes(session.user.role)) {
      router.push("/unauthorized"); // 👈 you can create a simple "Unauthorized" page
    }
  }, [session, status, router, allowedRoles]);

  if (status === "loading") return <p>Loading...</p>;

  return <>{children}</>;
}
