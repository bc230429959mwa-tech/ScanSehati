// models/User.ts
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  role: {
    type: String,
    enum: ["doctor", "pharmacist", "patient"],
    required: true,
  },
  userId: {
    type: String, // patientId or doctorId (custom id)
    unique: true,
  },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
