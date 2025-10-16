import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import { connectToDatabase } from "@/lib/mongodb";
import { sanitizeInput } from "@/lib/sanitize";

export async function GET(req: NextRequest) {
  await connectToDatabase();

  try {
    const { searchParams } = new URL(req.url);
    const id = sanitizeInput(searchParams.get("id") || "");

    if (!id) {
      return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
    }

    // ✅ Validate MongoDB ObjectId format
    if (!/^[a-fA-F0-9]{24}$/.test(id)) {
      return NextResponse.json({ error: "Invalid user ID format" }, { status: 400 });
    }

    const user = await User.findById(id).select("username fullName email");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (err) {
    console.error("GET /user/profile error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await connectToDatabase();

  try {
    // 🧹 Sanitize entire incoming body
    const { id, username, fullName } = sanitizeInput(await req.json());

    if (!id || !username || !fullName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // ✅ Validate ObjectId
    if (!/^[a-fA-F0-9]{24}$/.test(id)) {
      return NextResponse.json({ error: "Invalid user ID format" }, { status: 400 });
    }

    // ✅ Prevent invalid username format
    if (!/^[a-zA-Z0-9_.-]{3,20}$/.test(username)) {
      return NextResponse.json({
        error: "Username must be 3–20 characters and contain only letters, numbers, or ._-",
      }, { status: 400 });
    }

    // ✅ Check for existing username (excluding current user)
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

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (err) {
    console.error("POST /user/profile error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
