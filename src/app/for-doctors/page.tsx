
'use client';

import DoctorDashboard from '@/app/components/doctor-dashboard';
import RoleProtectedRoute from '../components/(auth)/RoleProtectedRoute';


export default function ForDoctorsPage() {
  return (
    <RoleProtectedRoute allowedRoles={["doctor"]}>
    <main className="flex-1 p-4 md:p-8">
      <div className="space-y-8">
        <header className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight font-headline">
            For Healthcare Professionals
          </h1>
          <p className="text-xl text-muted-foreground">
            Clinical decision support tool for patient medication management.
          </p>
        </header>
        <DoctorDashboard />
      </div>
    </main>
</RoleProtectedRoute>
  );
}