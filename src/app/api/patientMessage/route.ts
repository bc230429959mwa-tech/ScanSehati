import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import PatientMessage from "@/models/PatientMessage";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  await connectToDatabase();

  try {
    const { patientUsername, doctorUsername, content } = await req.json();

    if (!patientUsername || !doctorUsername || !content) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    const patient = await User.findOne({ username: patientUsername, role: "patient" });
    const doctor = await User.findOne({ username: doctorUsername, role: "doctor" });

    if (!patient || !doctor) {
      return NextResponse.json({ error: "Patient or Doctor not found." }, { status: 404 });
    }

    const newMessage = await PatientMessage.create({
      patientUsername: patient.username,
      patientName: patient.fullName,
      doctorUsername: doctor.username,
      doctorName: doctor.fullName,
      content,
      status: "Unread",
    });

    return NextResponse.json(newMessage, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  await connectToDatabase();

  try {
    const { searchParams } = new URL(req.url);
    const doctorUsername = searchParams.get("doctorUsername");

    if (!doctorUsername) {
      return NextResponse.json({ error: "doctorUsername is required" }, { status: 400 });
    }

    const messages = await PatientMessage.find({ doctorUsername }).sort({ createdAt: -1 });
    return NextResponse.json(messages);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ✅ DELETE a message
export async function DELETE(req: NextRequest) {
  await connectToDatabase();
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Message ID is required" }, { status: 400 });

    await PatientMessage.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ✅ PATCH: mark message as read
export async function PATCH(req: NextRequest) {
  await connectToDatabase();
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "Message ID is required" }, { status: 400 });

    const msg = await PatientMessage.findByIdAndUpdate(
      id,
      { status: "Replied" },
      { new: true }
    );

    return NextResponse.json(msg);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
