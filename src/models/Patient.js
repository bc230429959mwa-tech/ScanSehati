import { stat } from 'fs';
import mongoose, { Schema, model, models } from 'mongoose';

const MedicationSchema = new Schema({
  uuid: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  id: { type: String },
  PatientName: String,
  name: String,
  rxNumber: String,
  doctor: String,
  pills: Number,
  dosage: String,
  frequency: String,
  form: String,
  status: { type: String, enum: ['Draft', 'Sent', 'Delivered'], default: 'Draft' },
});

const PatientSchema = new Schema({
  // This ties the Patient to the NextAuth user
  userId: { type: String, required: true, unique: true },
  name: String,
  medications: [MedicationSchema],
});

export default models.Patient || model('Patient', PatientSchema);
