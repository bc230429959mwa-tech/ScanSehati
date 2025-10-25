'use client';

import { useSession, signIn } from "next-auth/react";
import { PatientDashboard } from '@/app/components/patient-dashboard';
import { Loader2 } from "lucide-react";

export default function ForPatientsPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) {
    if (typeof window !== "undefined") signIn();
    return null;
  }

  return (
    <main className="flex-1 p-4 md:p-8">
      <PatientDashboard />
    </main>
  );
}
