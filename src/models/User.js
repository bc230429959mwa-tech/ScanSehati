import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, // globally unique
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

  // 🔹 Common optional unique userId (future extension)
  userId: {
    type: String,
    unique: true,
    sparse: true,
  },

  // 🔹 Patient-specific
  dob: {
    type: Date,
  },
  confirmInfo: {
    type: Boolean,
  },

  // 🔹 Doctor / Pharmacist fields
  licenseNumber: {
    type: String,
  },
  qualification: {
    type: String,
  },
  workplace: {
    type: String,
  },
  verificationDoc: {
    type: String, // store filename or URL
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// ✅ Email can repeat across roles, but not within same role
UserSchema.index({ email: 1, role: 1 }, { unique: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);
