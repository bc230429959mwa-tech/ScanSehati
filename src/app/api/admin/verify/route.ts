import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("admin_token")?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false });
    }

    // Verify the token
    jwt.verify(token, process.env.ADMIN_JWT_SECRET!);
    return NextResponse.json({ authenticated: true });
  } catch (error) {
    return NextResponse.json({ authenticated: false });
  }
}
