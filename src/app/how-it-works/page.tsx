"use client";

import { Stethoscope, User, Pill } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/app/components/ui/card";

export default function HowItWorksPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-12">
      {/* Page Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">How It Works</h1>
        <p className="text-lg text-muted-foreground">
          ScanSehati connects doctors, patients, and pharmacists in one seamless,
          AI-powered platform for safer prescriptions and smarter healthcare decisions.
        </p>
      </div>

      {/* Doctor Section */}
      <Card className="shadow-lg border">
        <CardHeader className="flex items-center gap-3">
          <Stethoscope className="text-blue-600" size={30} />
          <CardTitle>For Doctors</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-muted-foreground">
          <ul className="list-disc pl-6 space-y-2">
            <li>Log in through the secure <strong>Doctor Dashboard</strong>.</li>
            <li>
              Create and send digital prescriptions instantly to your patient’s account.
            </li>
            <li>
              Access complete patient medical history to make informed decisions.
            </li>
            <li>
              Use built-in <strong>AI Drug Interaction Checker</strong> to ensure medication safety.
            </li>
            <li>
              Track prescribed medications and monitor adherence over time.
            </li>
          </ul>
          <p className="text-sm text-gray-500 mt-3">
            <strong>Benefit:</strong> Faster workflows, reduced prescription errors, and improved patient trust.
          </p>
        </CardContent>
      </Card>

      {/* Patient Section */}
      <Card className="shadow-lg border">
        <CardHeader className="flex items-center gap-3">
          <User className="text-green-600" size={30} />
          <CardTitle>For Patients</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-muted-foreground">
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Log in securely to your <strong>Patient Dashboard</strong> to access all prescriptions.
            </li>
            <li>
              Receive new prescriptions automatically from your doctor — no paper needed.
            </li>
            <li>
              View dosage details, refill dates, and AI-driven safety alerts.
            </li>
            <li>
              Check drug interactions instantly before taking new medications.
            </li>
            <li>
              Share your medical data with trusted doctors and pharmacists easily.
            </li>
          </ul>
          <p className="text-sm text-gray-500 mt-3">
            <strong>Benefit:</strong> Stay informed, reduce medication risks, and enjoy a fully digital healthcare experience.
          </p>
        </CardContent>
      </Card>

      {/* Pharmacist Section */}
      <Card className="shadow-lg border">
        <CardHeader className="flex items-center gap-3">
          <Pill className="text-purple-600" size={30} />
          <CardTitle>For Pharmacists</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-muted-foreground">
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Log in using your <strong>Pharmacist Dashboard</strong> to view incoming prescriptions.
            </li>
            <li>
              Verify the doctor’s prescription digitally and check for drug interactions.
            </li>
            <li>
              Update status — mark prescriptions as <strong>“Ready”</strong> or <strong>“Delivered”</strong>.
            </li>
            <li>
              Maintain a verified record of all dispensed medications.
            </li>
            <li>
              Communicate safely with patients or doctors if clarification is needed.
            </li>
          </ul>
          <p className="text-sm text-gray-500 mt-3">
            <strong>Benefit:</strong> Reduce dispensing errors, improve coordination, and enhance patient safety.
          </p>
        </CardContent>
      </Card>

      {/* Summary Section */}
      <div className="text-center text-muted-foreground pt-10 pb-4">
        <p className="text-lg font-medium">
          👩‍⚕️ Doctor Prescribes → 👨‍🦰 Patient Receives → 💊 Pharmacist Delivers  
        </p>
        <p className="mt-2 text-gray-500">
          Every step backed by AI-powered drug interaction analysis for maximum safety and trust.
        </p>
      </div>
    </div>
  );
}
