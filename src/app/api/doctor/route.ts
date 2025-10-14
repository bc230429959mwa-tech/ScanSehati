// src/app/api/doctor/route.ts (frontend helper functions)
import { connectToDatabase } from '@/lib/mongodb';
import { Prescription } from '@/types/prescription';
import { NextRequest, NextResponse } from 'next/server';
import User from "@/models/User";


// ✅ use relative URLs because Next.js API routes run on the same domain
export async function fetchPrescriptions(): Promise<Prescription[]> {
  const res = await fetch('/api/prescriptions', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch prescriptions');
  return res.json();
}

export async function createPrescription(
  newRx: Partial<Prescription>
): Promise<Prescription> {
  const res = await fetch('/api/prescriptions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newRx),
  });
  if (!res.ok) throw new Error('Failed to create prescription');
  return res.json();
}

export async function fetchPatient(id: string) {
  const res = await fetch(`/api/patients/${id}`);
  if (!res.ok) throw new Error('Failed to fetch patient');
  return res.json();
}
