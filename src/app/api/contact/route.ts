import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import ContactMessage from "@/models/ContactMessage";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { name, message, fromEmail } = await req.json();

    if (!name || !message || !fromEmail) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
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
