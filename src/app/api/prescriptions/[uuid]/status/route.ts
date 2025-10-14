import { NextResponse } from "next/server";
import Prescription from "@/models/Prescription";
import { connectToDatabase } from "@/lib/mongodb";

// PATCH /api/prescriptions/[uuid]/status
export async function PATCH(
  req: Request,
  context: { params: Promise<{ uuid: string }> }
) {
  const { uuid } = await context.params; // 👈 await params here
  await connectToDatabase();

  const { status, pharmacyId } = await req.json();

  if (!status) {
    return NextResponse.json({ error: "status is required" }, { status: 400 });
  }

  const updated = await Prescription.findOneAndUpdate(
    { uuid },
    { status, ...(pharmacyId ? { pharmacyId } : {}) },
    { new: true }
  );

  if (!updated)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(updated);
}
