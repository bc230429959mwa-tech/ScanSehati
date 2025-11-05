// src/app/api/doctorPharmaMessage/route.ts - POST fix
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Message from "@/models/Message";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  await connectToDatabase();

  try {
    const data = await req.json();

    // Lookups are fine (using $regex: /^role$/i for case-insensitivity)
    const sender = await User.findOne({
      username: data.senderUsername,
      role: { $regex: /^doctor$/i },
    });

    const recipient = await User.findOne({
      username: data.recipientUsername,
      role: { $regex: /^pharmacist$/i },
    });

    if (!sender || !recipient) {
      return NextResponse.json(
        { message: "Invalid sender or recipient" },
        { status: 400 }
      );
    }

    // 🐛 FIX 1: Change "Doctor" to "doctor" and "Pharmacist" to "pharmacist"
    // to match the Mongoose Message schema enum (lowercase only)
    const message = await Message.create({
      senderUsername: sender.username,
      senderName: sender.fullName,
      senderRole: "doctor", // ✅ CORRECTED to lowercase
      recipientUsername: recipient.username,
      recipientName: recipient.fullName,
      recipientRole: "pharmacist", // ✅ CORRECTED to lowercase
      content: data.content,
    });

    return NextResponse.json({ success: true, message }, { status: 201 });
  } catch (err: any) {
    console.error("Error in /api/doctorPharmaMessage:", err);
    // Add specific check for Mongoose Validation Error (enum failure)
    if (err.name === 'ValidationError') {
        return NextResponse.json(
            { message: "Validation failed: Role value mismatch in schema", error: err.message },
            { status: 400 }
        );
    }
    return NextResponse.json(
      { message: "Failed to send message", error: err.message || "Server Error" },
      { status: 500 }
    );
  }
}
// ... GET function follows (see next section)
export async function GET(req: NextRequest) {
  await connectToDatabase();
  const { searchParams } = new URL(req.url);
  const recipientUsername = searchParams.get("recipientUsername");

  if (!recipientUsername) {
    return NextResponse.json({ message: "Missing recipientUsername" }, { status: 400 });
  }

  // 🐛 FIX 2: recipientRole must be "doctor" (lowercase) to match schema/db
  const messages = await Message.find({
    recipientUsername,
    recipientRole: "pharmacist", // ✅ CORRECTED to lowercase
  }).sort({ createdAt: -1 });

  return NextResponse.json({ messages }, { status: 200 });
}

