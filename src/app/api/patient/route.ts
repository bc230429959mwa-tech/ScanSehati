import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

const projection = "username fullName email dob role";

export async function GET(request: NextRequest) {
  await connectToDatabase();

  try {
    const searchParams = request.nextUrl.searchParams;
    const username = searchParams.get("username");

    const baseQuery: any = { role: "patient" };

    if (username) baseQuery.username = username;

    const users = await User.find(baseQuery, projection).lean();

    // ✅ Single patient request (used in patient details)
    if (username) {
      const patient = users[0];
      if (!patient)
        return NextResponse.json({ message: "Patient not found" }, { status: 404 });

      const formattedPatient = {
        username: patient.username,
        name: patient.fullName || patient.username,
        email: patient.email || "",
        dob: patient.dob || null,
        role: patient.role,
      };

      return NextResponse.json({ patient: formattedPatient }, { status: 200 });
    }

    // ✅ All patients (used in dashboards, etc.)
    const formattedList = users.map((p: any) => ({
      username: p.username,
      name: p.fullName || p.username,
      email: p.email || "",
      dob: p.dob || null,
    }));

    return NextResponse.json({ patients: formattedList }, { status: 200 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
