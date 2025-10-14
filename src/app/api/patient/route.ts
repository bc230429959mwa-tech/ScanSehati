import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  await connectToDatabase();

  // Fetch all users (or filter by role if your User model includes it)
  const patients = await User.find({}, "username fullName email").lean();

  const formatted = patients.map((p: any) => ({
    username: p.username,
    name: p.fullName || p.username,
    email: p.email || "",
  }));

  return new Response(JSON.stringify({ patients: formatted }), { status: 200 });
}
