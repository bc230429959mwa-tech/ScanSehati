'use client';
import PharmacistPage from '@/app/components/pharmacists-dashboard';
import RoleProtectedRoute from '../components/(auth)/RoleProtectedRoute';

export default function ForPharmacistsPage() {
  return (
    <RoleProtectedRoute allowedRoles={["pharmacist"]}>
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="space-y-8">
          <header className="space-y-2 text-center sm:text-left">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-snug break-words">
              For Healthcare Professionals
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground break-words">
              Clinical decision support tool for patient medication management.
            </p>
          </header>
          <PharmacistPage />
        </div>
      </main>
    </RoleProtectedRoute>
  );
}
