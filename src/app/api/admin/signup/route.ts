import { NextRequest, NextResponse } from 'next/server';
import Admin from '@/models/Admin';
import { connectToDatabase } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  await connectToDatabase();
  const { username, email, password } = await req.json();
  if (!username || !email || !password) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  const existing = await Admin.findOne({ email });
  if (existing) {
    return NextResponse.json({ error: 'Admin already exists' }, { status: 409 });
  }
  const hashed = await bcrypt.hash(password, 10);
  const admin = new Admin({ username, email, password: hashed });
  await admin.save();
  return NextResponse.json({ success: true });
}
