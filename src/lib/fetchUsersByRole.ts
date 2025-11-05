import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

export async function fetchUsersByRole(role: string) {
  await connectToDatabase();
  return await User.find({ role }).select("username fullName");
}
