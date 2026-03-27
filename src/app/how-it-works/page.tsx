"use client";

import { useState } from "react";
import {
  Stethoscope,
  User,
  Pill,
  Shield,
  Zap,
  Brain,
  AlertTriangle,
  CheckCircle,
  Clock,
  Lock,
  Activity,
  Bell,
  FileText,
  RefreshCw,
  MessageSquare,
  Eye,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Step {
  icon: React.ElementType;
  text: string;
}

interface RoleCard {
  icon: React.ElementType;
  accentColor: string;
  gradientFrom: string;
  gradientTo: string;
  ringColor: string;
  badgeBg: string;
  badgeText: string;
  label: string;
  tagline: string;
  steps: Step[];
  benefit: string;
}



// ─── Data ─────────────────────────────────────────────────────────────────────

const roles: RoleCard[] = [
  {
    icon: Stethoscope,
    accentColor: "text-blue-600",
    gradientFrom: "from-blue-50",
    gradientTo: "to-sky-50",
    ringColor: "ring-blue-200",
    badgeBg: "bg-blue-100",
    badgeText: "text-blue-700",
    label: "For Doctors",
    tagline: "Write smarter prescriptions — AI checks every combination before you send.",
    steps: [
      { icon: Lock, text: "Access your secure Doctor Dashboard and view your patient list with full medical histories." },
      { icon: Zap, text: "Create a digital prescription in seconds — search any drug, set dosage, and attach clinical notes." },
      { icon: Brain, text: "Before sending, the AI Drug Interaction Checker automatically scans for drug-drug, drug-food, drug-supplement, and drug-condition conflicts." },
      { icon: AlertTriangle, text: "If a conflict is detected, you receive a severity-graded alert (minor / moderate / major) and suggested alternatives." },
      { icon: Activity, text: "Track patient adherence, view refill history, and monitor prescribed medication timelines — all in one dashboard." },
    ],
    benefit: "Faster clinical workflows, fewer prescription errors, and a complete interaction-checked audit trail.",
  },
  {
    icon: User,
    accentColor: "text-emerald-600",
    gradientFrom: "from-emerald-50",
    gradientTo: "to-teal-50",
    ringColor: "ring-emerald-200",
    badgeBg: "bg-emerald-100",
    badgeText: "text-emerald-700",
    label: "For Patients",
    tagline: "Every prescription, every interaction check — always in your pocket.",
    steps: [
      { icon: Bell, text: "Get instantly notified when your doctor sends a new prescription — no waiting room, no paper." },
      { icon: FileText, text: "Open any prescription to see the drug name, dosage, frequency, duration, and your doctor's notes in plain language." },
      { icon: Brain, text: "Run an AI drug interaction check yourself — add OTC medicines, supplements, or vitamins you're already taking to see if they're safe together." },
      { icon: AlertTriangle, text: "If an interaction is flagged, you'll see exactly what the risk is and a recommendation to consult your doctor before taking it." },
      { icon: RefreshCw, text: "Track refill dates, set medication reminders, and share your full prescription history with any new doctor securely." },
    ],
    benefit: "Stay informed about what you're taking, avoid dangerous combinations, and never lose a prescription again.",
  },
  {
    icon: Pill,
    accentColor: "text-violet-600",
    gradientFrom: "from-violet-50",
    gradientTo: "to-purple-50",
    ringColor: "ring-violet-200",
    badgeBg: "bg-violet-100",
    badgeText: "text-violet-700",
    label: "For Pharmacists",
    tagline: "Verify, check, and dispense — with a complete AI safety layer.",
    steps: [
      { icon: Eye, text: "View all incoming verified digital prescriptions in your Pharmacist Dashboard — each linked to a licensed doctor's profile." },
      { icon: Brain, text: "Run an independent AI interaction check at the point of dispensing to catch anything that may have been missed at the prescription stage." },
      { icon: MessageSquare, text: "Message the prescribing doctor or the patient directly through ScanSehati if any clarification is needed — no phone tag." },
      { icon: CheckCircle, text: "Mark prescriptions as 'Ready for Pickup' or 'Delivered' — the patient gets an instant notification." },
      { icon: Shield, text: "Every dispensed medication is logged in a tamper-proof record for compliance, audits, and patient safety history." },
    ],
    benefit: "Eliminate dispensing errors, reduce liability, and build a complete medication dispensing audit trail.",
  },
];





// ─── Role Section ─────────────────────────────────────────────────────────────

function RoleSection({ role }: { role: RoleCard }) {
  const Icon = role.icon;

  return (
    <article className={`rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-300`}>
      {/* Header */}
      <div className={`bg-gradient-to-r ${role.gradientFrom} ${role.gradientTo} px-6 py-5 border-b border-slate-200`}>
        <div className="flex items-start gap-4">
          <div className={`w-11 h-11 rounded-xl bg-white ring-1 ${role.ringColor} flex items-center justify-center flex-shrink-0 shadow-sm`}>
            <Icon size={20} className={role.accentColor} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 leading-tight">{role.label}</h2>
            <p className="text-sm text-slate-500 mt-0.5 leading-snug">{role.tagline}</p>
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="px-6 pt-5 pb-6">
        <ol className="space-y-0 mb-5">
          {role.steps.map((step, i) => {
            const StepIcon = step.icon;
            const isLast = i === role.steps.length - 1;
            return (
              <li key={i} className="flex gap-3">
                {/* Timeline line */}
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${role.badgeBg}`}>
                    <StepIcon size={14} className={role.accentColor} />
                  </div>
                  {!isLast && <div className="w-px flex-1 bg-slate-100 my-1" />}
                </div>
                <p className={`text-sm text-slate-600 leading-relaxed ${isLast ? "pb-0" : "pb-4"} pt-1.5`}>
                  {step.text}
                </p>
              </li>
            );
          })}
        </ol>

        {/* Benefit */}
        <div className={`flex gap-2.5 items-start rounded-xl p-3.5 ${role.badgeBg} bg-opacity-60`}>
          <CheckCircle size={15} className={`${role.accentColor} flex-shrink-0 mt-0.5`} />
          <p className="text-xs text-slate-600 leading-relaxed">
            <span className="font-semibold text-slate-800">Result: </span>
            {role.benefit}
          </p>
        </div>
      </div>
    </article>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 pb-20">

        {/* ── Page Header ── */}
        <header className="mb-10">
          <div className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-700 text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
            <Shield size={11} />
            AI-Powered Platform
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-3">
            How ScanSehati Works
          </h1>
          <p className="text-base text-slate-500 leading-relaxed max-w-xl">
            ScanSehati connects your doctor, your pharmacy, and your full prescription history — with a real-time{" "}
            <span className="text-slate-700 font-medium">AI drug interaction checker</span> at every step.
          </p>
        </header>

        {/* ── Workflow Banner ── */}
        <section aria-label="Platform workflow" className="mb-10">
          <div className="bg-slate-900 rounded-2xl px-6 py-6">
            <div className="flex flex-wrap items-center justify-center gap-2 text-center">
              {[
                { icon: "🩺", label: "Doctor prescribes", sub: "AI-checked first" },
                null,
                { icon: "📱", label: "You receive it", sub: "Instant notification" },
                null,
                { icon: "💊", label: "Pharmacist dispenses", sub: "Verified & logged" },
              ].map((item, i) =>
                item === null ? (
                  <span key={i} className="text-blue-400 text-lg font-light px-1">→</span>
                ) : (
                  <div key={i} className="px-4 py-2">
                    <div className="text-2xl mb-1">{item.icon}</div>
                    <div className="text-white text-sm font-semibold">{item.label}</div>
                    <div className="text-blue-300 text-[11px] mt-0.5">{item.sub}</div>
                  </div>
                )
              )}
            </div>
            <p className="text-center text-slate-400 text-xs mt-4">
              Every step backed by AI drug interaction analysis — catching dangerous combinations before they reach you.
            </p>
          </div>
        </section>

        {/* ── Role Cards ── */}
        <section aria-label="How each role uses ScanSehati" className="mb-12">
          <h2 className="text-xl font-bold text-slate-800 mb-5 flex items-center gap-2">
            <span className="w-1 h-5 bg-blue-500 rounded-full inline-block" />
            Your role on the platform
          </h2>
          <div className="space-y-5">
            {roles.map((role) => (
              <RoleSection key={role.label} role={role} />
            ))}
          </div>
        </section>

        {/* ── Quick Stats ── */}
        <section aria-label="Why drug interaction checking matters" className="mb-12">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { stat: "3 Types", label: "Drug-drug, drug-food, drug-condition checks" },
              { stat: "Real-time", label: "Alerts before a prescription is sent" },
              { stat: "Major / Moderate / Minor", label: "Severity grading on every alert" },
              { stat: "100%", label: "Encrypted — only your care team can see your data" },
            ].map((s) => (
              <div
                key={s.stat}
                className="bg-white rounded-xl border border-slate-200 p-4 text-center shadow-sm"
              >
                <div className="text-base font-bold text-blue-600 mb-1 leading-tight">{s.stat}</div>
                <div className="text-[11px] text-slate-500 leading-snug">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Footer note (no CTA, user is already logged in) ── */}
        <footer className="text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-3 bg-white border border-slate-200 rounded-2xl px-6 py-4 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
              <MessageSquare size={16} className="text-white" />
            </div>
            <div className="text-sm text-slate-600 text-center sm:text-left">
              Still have a question?{" "}
              <a href="/help" className="text-blue-600 font-semibold hover:underline">
                Contact Support
              </a>{" "}
              or message your doctor directly from any prescription card.
            </div>
          </div>
        </footer>

      </div>
    </main>
  );
}