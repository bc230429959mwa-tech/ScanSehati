// app/api/admin/add/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import bcrypt from 'bcryptjs';
import Admin from '@/models/Admin';
import { connectToDatabase } from '@/lib/mongodb';
import { authOptions } from '@/lib/auth'; // <-- make sure you have this

export async function POST(req: NextRequest) {
  await connectToDatabase();
  const session = await getServerSession(authOptions);


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
