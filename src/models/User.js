import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, // keep username globally unique
  },
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
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

// ✅ Compound unique index: same email can exist across roles, but not within the same role
UserSchema.index({ email: 1, role: 1 }, { unique: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);
