import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import ContactMessage from "@/models/ContactMessage";
import { v4 as uuidv4 } from "uuid";
import { sanitizeInput } from "@/lib/sanitize";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { name, message, fromEmail } = sanitizeInput(body);

    // Field validation
    if (!name || !message || !fromEmail) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Optional: Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(fromEmail)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    const newMessage = new ContactMessage({
      _id: uuidv4(),
      name,
      message,
      fromEmail,
    });

    await newMessage.save();

    return NextResponse.json({ success: true, message: "Message saved!" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to save message" }, { status: 500 });
  }
}
