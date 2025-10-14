import { NextRequest, NextResponse } from "next/server";
import {connectToDatabase} from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(req: NextRequest) {
  await connectToDatabase();

  try {
    const doctors = await User.find({ role: "doctor" }).select("username fullName");
    return NextResponse.json(doctors);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch doctors" }, { status: 500 });
  }
}
