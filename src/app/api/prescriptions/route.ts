import { NextResponse } from "next/server";
import Prescription from "@/models/Prescription";
import { connectToDatabase } from "@/lib/mongodb";
import crypto from "crypto";

// ✅ GET /api/prescriptions?username=xxx&doctorId=xxx&pharmacyId=xxx&includeUnassigned=true
export async function GET(req: Request) {
  await connectToDatabase();
  const { searchParams } = new URL(req.url);

  const username = searchParams.get("username");
  const doctorId = searchParams.get("doctorId");
  const pharmacyId = searchParams.get("pharmacyId");
  const includeUnassigned = searchParams.get("includeUnassigned") === "true";

  const query: any = {};

  // 🔹 Support username filtering
  if (username) query.username = username;
  if (doctorId) query.doctorId = doctorId;
  
  // 🔹 Handle pharmacyId filtering
  if (pharmacyId) {
    if (pharmacyId === "null") {
      // Fetch prescriptions with no pharmacyId assigned
      query.$or = [
        { pharmacyId: { $exists: false } },
        { pharmacyId: null },
        { pharmacyId: "" }
      ];
    } else {
      query.pharmacyId = pharmacyId;
    }
  } else if (includeUnassigned) {
    // If no pharmacyId specified but includeUnassigned is true, fetch all
    // This allows pharmacists to see all prescriptions
  }

  const prescriptions = await Prescription.find(query).sort({ createdAt: -1 });
  return NextResponse.json(prescriptions);
}

// ✅ POST /api/prescriptions → Doctor creates a prescription
export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();

    const {
      username,        // 👈 patient username
      patientName,
      doctorId,
      doctorName,
      drug,
      dosage,
      pills,
      frequency,
      form,
      refills,
      noteForPharmacist,
      pharmacyId,
    } = body;

    if (!username || !patientName) {
      return NextResponse.json(
        { error: "username and patientName required" },
        { status: 400 }
      );
    }

    const newPrescription = await Prescription.create({
      uuid: crypto.randomUUID(),
      username,
      patientName,
      doctorId,
      doctorName,
      drug,
      dosage,
      pills,
      frequency,
      form,
      refills: refills || 0,
      noteForPharmacist,
      pharmacyId: pharmacyId || "pharmacy-001",
      rxNumber: `RX-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      status: "Sent",
    });

    return NextResponse.json(newPrescription);
  } catch (err: any) {
    console.error("❌ Prescription POST error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
