import { NextResponse } from "next/server";
import Prescription from "@/models/Prescription";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET(
  req: Request,
  context: { params: Promise<{ uuid: string }> }
) {
  const { uuid } = await context.params; // 👈 await params
  await connectToDatabase();
  const rx = await Prescription.findOne({ uuid });
  if (!rx) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(rx);
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ uuid: string }> }
) {
  const { uuid } = await context.params; // 👈 await params
  await connectToDatabase();
  const updates = await req.json();
  const updated = await Prescription.findOneAndUpdate(
    { uuid },
    updates,
    { new: true }
  );
  if (!updated)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ uuid: string }> }
) {
  const { uuid } = await context.params; // 👈 await params
  await connectToDatabase();
  const deleted = await Prescription.findOneAndDelete({ uuid });
  if (!deleted)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true, deletedUuid: uuid });
}
