'use client';

import { useSession, signIn } from "next-auth/react";
import { PatientDashboard } from '@/app/components/patient-dashboard';
import { Loader2 } from "lucide-react";

export default function Home() {
  const { data: session, status } = useSession();

  // Still loading session
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  // Not authenticated → redirect to login
  if (!session) {
    if (typeof window !== "undefined") signIn(); // Redirects to /api/auth/signin
    return null;
  }

  // Authenticated → show patient dashboard
  return (
    <main className="flex-1 p-4 md:p-8">
      <PatientDashboard />
    </main>
  );
}
