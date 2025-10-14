// src/models/Prescription.ts
import mongoose, { Schema, model, models } from 'mongoose';

const PrescriptionSchema = new Schema(
  {
    uuid: { type: String, required: true, unique: true }, // unique prescription ID

    // Relationships
    username: { type: String},          // link to patient (userId)
    patientName: { type: String },
    doctorId: { type: String, required: false },           // link to doctor (userId)
    doctorName: { type: String },
    pharmacyId: { type: String },                         // link to pharmacy (optional)

    // Prescription details
    drug: { type: String, required: true },
    dosage: { type: String },
    pills: { type: Number },
    frequency: { type: String },
    form: { type: String },                               // tablet, capsule, liquid
    refills: { type: Number, default: 0 },
    rxNumber: { type: String, required: true, unique: true },

    // Workflow status
    status: {
      type: String,
      enum: ['Draft', 'Issued', 'Sent', 'Ready', 'PickedUp', 'Dispensed', 'Cancelled'],
      default: 'Draft',
    },

    // Optional extra fields
    noteForPharmacist: { type: String },
    noteForPatient: { type: String },
  },
  { timestamps: true }
);

export default models.Prescription || model('Prescription', PrescriptionSchema);
