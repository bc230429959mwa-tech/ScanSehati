import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import { connectToDatabase } from "@/lib/mongodb";

// GET: fetch user profile
export async function GET(req: NextRequest) {
  await connectToDatabase();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing user id" }, { status: 400 });
  }

  const user = await User.findById(id).select("username fullName email");
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}

// POST: update profile
export async function POST(req: NextRequest) {
  await connectToDatabase();
  const { id, username, fullName } = await req.json();

  if (!id || !username || !fullName) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    // ✅ check if username already exists (for other users)
    const existingUser = await User.findOne({ username, _id: { $ne: id } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Username already taken. Please choose another." },
        { status: 400 }
      );
    }

    const user = await User.findByIdAndUpdate(
      id,
      { username, fullName },
      { new: true }
    ).select("username fullName email");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (err: any) {
    console.error("Error updating user:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
