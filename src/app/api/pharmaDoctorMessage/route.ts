import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Message from "@/models/Message";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  await connectToDatabase();

  try {
    const data = await req.json();

    const sender = await User.findOne({
      username: data.senderUsername,
      role: { $regex: /^pharmacist$/i },
    });

    const recipient = await User.findOne({
      username: data.recipientUsername,
      role: { $regex: /^doctor$/i },
    });

    if (!sender || !recipient) {
      return NextResponse.json(
        { message: "Invalid sender or recipient" },
        { status: 400 }
      );
    }

    const message = await Message.create({
      senderUsername: sender.username,
      senderName: sender.fullName,
      senderRole: "pharmacist",
      recipientUsername: recipient.username,
      recipientName: recipient.fullName,
      recipientRole: "doctor",
      content: data.content,
    });

    return NextResponse.json({ success: true, message }, { status: 201 });
  } catch (err: any) {
    console.error("Error in /api/pharmaDoctorMessage:", err);
    return NextResponse.json(
      { message: "Failed to send message", error: err.message || "Server Error" },
      { status: 500 }
    );
  }
}

// 🟢 GET doctor’s inbox messages
export async function GET(req: NextRequest) {
  await connectToDatabase();
  const { searchParams } = new URL(req.url);
  const recipientUsername = searchParams.get("recipientUsername");

  if (!recipientUsername) {
    return NextResponse.json(
      { message: "Missing recipientUsername" },
      { status: 400 }
    );
  }

  // ✅ FIX: doctors should get messages where recipientRole === "doctor"
  const messages = await Message.find({
    recipientUsername,
    recipientRole: "doctor",
  }).sort({ createdAt: -1 });

  return NextResponse.json({ messages }, { status: 200 });
}
