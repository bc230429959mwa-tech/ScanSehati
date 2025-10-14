export interface Prescription {
  uuid: string;
  patientId: string;       // ✅ from DB
  patientName: string;     // ✅ from DB
  doctorId?: string;       // ✅ optional
  doctorName: string;      // ✅ from DB
  rxNumber: string;
  drug: string;
  dosage: string;
  pills: number;
  frequency: string;
  form: string;
  refills: number;
  status: "Draft" | "Issued" | "Cancelled";
}
