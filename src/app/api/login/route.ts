import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { connectToDatabase } from "@/lib/mongodb";
import { sanitizeInput } from "@/lib/sanitize";

// Allowed roles (for validation)
const VALID_ROLES = ["doctor", "pharmacist", "patient"] as const;

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    // 🧹 Sanitize all user input
    const body = sanitizeInput(await req.json());
    const { username, email, password, fullName, role, register } = body;

    // 🧠 Registration flow
    if (register) {
      if (!username || !email || !password || !fullName || !role) {
        return NextResponse.json(
          { error: "All fields (username, email, password, fullName, role) are required." },
          { status: 400 }
        );
      }

      // ✅ Validate role
      if (!VALID_ROLES.includes(role)) {
        return NextResponse.json({ error: "Invalid role selected." }, { status: 400 });
      }

      // ✅ Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json({ error: "Invalid email format." }, { status: 400 });
      }

      // ✅ Prevent duplicate usernames or emails
      const existing = await User.findOne({
        $or: [{ email }, { username }],
      });

      if (existing) {
        return NextResponse.json({ error: "User already exists." }, { status: 409 });
      }

      // ✅ Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // ✅ Save user securely
      const user = await User.create({
        username,
        email,
        password: hashedPassword,
        fullName,
        role,
      });

      const userData = user.toObject();
      delete userData.password;

      return NextResponse.json({
        message: "User registered successfully",
        user: userData,
      });
    }

    // 🧠 Login flow
    if (!username || !password) {
      return NextResponse.json({ error: "Missing username or password" }, { status: 400 });
    }

    // Allow login by either username OR email
    const user = await User.findOne({
      $or: [{ username }, { email: username }],
    }).select("+password");

    if (!user) {
      return NextResponse.json({ error: "Invalid username or email" }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // ✅ Remove password before returning
    const { password: _, ...userWithoutPassword } = user.toObject();

    return NextResponse.json({
      message: "Login successful",
      user: userWithoutPassword,
    });
  } catch (error: any) {
    console.error("Auth API error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
