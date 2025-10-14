import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Admin from "@/models/Admin";
import { connectToDatabase } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  await connectToDatabase();
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const admin = await Admin.findOne({ email });
  if (!admin) {
    return NextResponse.json({ error: "Admin not found" }, { status: 404 });
  }

  const isValid = await bcrypt.compare(password, admin.password);
  if (!isValid) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  // ✅ Generate JWT
  const token = jwt.sign(
    { id: admin._id, email: admin.email },
    process.env.ADMIN_JWT_SECRET!,
    { expiresIn: "1h" }
  );

  // ✅ Set HttpOnly cookie (consistent name)
  const res = NextResponse.json({ success: true, message: "Login successful" });
  res.cookies.set("admin_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60, // 1 hour
  });

  return res;
}
