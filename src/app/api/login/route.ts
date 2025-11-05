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
    const {
      username,
      email,
      password,
      fullName,
      role,
      register,
      dob,
      confirmInfo,
      licenseNumber,
      qualification,
      workplace,
      verificationDoc,
    } = body;

    // 🧠 Registration
    if (register) {
      // ---- Common field validation ----
      if (!username || !email || !password || !fullName || !role) {
        return NextResponse.json(
          { error: "All required fields must be provided." },
          { status: 400 }
        );
      }

      if (!VALID_ROLES.includes(role)) {
        return NextResponse.json({ error: "Invalid role." }, { status: 400 });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json({ error: "Invalid email format." }, { status: 400 });
      }

      // ---- Unique checks ----
      const existingUsername = await User.findOne({ username });
      if (existingUsername) {
        return NextResponse.json({ error: "Username already exists." }, { status: 409 });
      }

      const existingEmailSameRole = await User.findOne({ email, role });
      if (existingEmailSameRole) {
        return NextResponse.json(
          { error: `Email already registered under role "${role}".` },
          { status: 409 }
        );
      }

      // ---- Role-specific validation ----
      if (role === "patient") {
        if (!dob) {
          return NextResponse.json({ error: "Date of birth is required for patients." }, { status: 400 });
        }
        if (!confirmInfo) {
          return NextResponse.json(
            { error: "Please confirm that your information is true." },
            { status: 400 }
          );
        }
      }

      if (role === "doctor" || role === "pharmacist") {
        if (!licenseNumber || !qualification) {
          return NextResponse.json(
            { error: "License number and qualification are required for professionals." },
            { status: 400 }
          );
        }
        if (!verificationDoc) {
          return NextResponse.json(
            { error: "Please upload a verification document." },
            { status: 400 }
          );
        }
      }

      // ✅ Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // ✅ Parse & validate DOB safely
      let parsedDob: Date | undefined = undefined;
      if (dob) {
        const d = new Date(dob);
        if (isNaN(d.getTime())) {
          return NextResponse.json(
            { error: "Invalid date format. Please use YYYY-MM-DD." },
            { status: 400 }
          );
        }
        parsedDob = d;
      }

      // ---- Create user ----
      const user = await User.create({
        username,
        email,
        password: hashedPassword,
        fullName,
        role,
        dob: parsedDob, // ✅ Correct handling
        confirmInfo: !!confirmInfo,
        licenseNumber,
        qualification,
        workplace,
        verificationDoc,
      });

    const userData = user.toObject();
delete userData.password;

// ✅ Format dob for response (remove time)
if (userData.dob) {
  userData.dob = userData.dob.toISOString().split("T")[0];
}

return NextResponse.json({
  message: "User registered successfully.",
  user: userData,
});

    }

    // 🧠 Login flow
    if (!username || !password) {
      return NextResponse.json({ error: "Missing username or password" }, { status: 400 });
    }

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
