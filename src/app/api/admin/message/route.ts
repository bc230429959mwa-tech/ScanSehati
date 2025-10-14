// app/api/admin/messages/route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import ContactMessage from "@/models/ContactMessage";

export async function GET() {
  try {
    await connectToDatabase();
    const rawMessages = await ContactMessage.find().sort({ createdAt: -1 });

    const messages = rawMessages.map((m) => ({
      _id: m._id.toString(),
      message: m.message,
      fromEmail: m.fromEmail,
      createdAt: m.createdAt,
    }));

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}
