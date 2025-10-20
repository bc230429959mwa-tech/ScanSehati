import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { connectToDatabase } from "@/lib/mongodb";
import { sanitizeInput } from "@/lib/sanitize";

const VALID_ROLES = ["doctor", "pharmacist", "patient"] as const;

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

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

      if (!VALID_ROLES.includes(role)) {
        return NextResponse.json({ error: "Invalid role selected." }, { status: 400 });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json({ error: "Invalid email format." }, { status: 400 });
      }

      // ✅ Prevent duplicate username across all roles
      const existingUsername = await User.findOne({ username });
      if (existingUsername) {
        return NextResponse.json({ error: "Username already exists." }, { status: 409 });
      }

      // ✅ Prevent duplicate email only for the same role
      const existingEmailSameRole = await User.findOne({ email, role });
      if (existingEmailSameRole) {
        return NextResponse.json(
          { error: `User with this email already exists under role "${role}".` },
          { status: 409 }
        );
      }

      // ✅ Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

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

    // 🧠 Login flow (username-only)
    if (!username || !password) {
      return NextResponse.json({ error: "Missing username or password" }, { status: 400 });
    }

    // ✅ Login only with username (no email allowed)
    const user = await User.findOne({ username }).select("+password");

    if (!user) {
      return NextResponse.json({ error: "Invalid username" }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

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
