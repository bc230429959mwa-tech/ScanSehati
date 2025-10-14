'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card';
import RoleProtectedRoute from '../components/(auth)/RoleProtectedRoute';

interface Medication {
  id: number;
  name: string;
  rxNumber: string;
  doctor: string;
  pills: number;
  dosage: string;
  frequency: string;
  form: string;
}

export default function ForPatientsPage() {
  const { data: session } = useSession();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMedications = async () => {
      if (!session?.user?.email) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/patient/${encodeURIComponent(session.user.email)}`);
        if (res.ok) {
          const data = await res.json();
          setMedications(data.patient.medications || []);
        }
      } catch (err) {
        console.error('Failed to fetch medications:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMedications();
  }, [session?.user?.email]);

  return (
    <RoleProtectedRoute allowedRoles={["patient"]}>
      <main className="flex-1 p-4 md:p-8">
        <div className="space-y-8">
          <header className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight font-headline">
              For Patients
            </h1>
            <p className="text-xl text-muted-foreground">
              Empowering you to take control of your medication safety.
            </p>
          </header>

          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
            <Card>
              <CardHeader>
                <CardTitle>Easy-to-Understand Explanations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-muted-foreground">
                  We break down complex medical jargon into simple terms, so you
                  can understand the risks and discuss them confidently with
                  your doctor.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    • Clear risk levels (Low, Moderate, High)
                  </li>
                  <li className="flex items-center gap-2">
                    • Plain-language descriptions of interactions
                  </li>
                  <li className="flex items-center gap-2">
                    • Actionable advice and questions to ask your doctor
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Medication List */}
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
            <Card>
              <CardHeader>
                <CardTitle>My Medications</CardTitle>
                <CardDescription>
                  A list of your current medications.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {medications.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    You have no medications saved.
                  </div>
                )}
                {medications.map((med) => (
                  <Card key={med.id} className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-bold text-lg truncate" title={med.name}>
                          {med.name}
                        </span>
                      </div>
                      {/* No interaction badge */}
                    </div>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm text-muted-foreground">
                        {med.dosage} - {med.frequency} - {med.form}
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground pt-2">
                      <strong>RX Number:</strong> {med.rxNumber} | <strong>Prescribed by:</strong> {med.doctor} | <strong>Pill Count:</strong> {med.pills}
                    </div>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </RoleProtectedRoute>
  );
}
