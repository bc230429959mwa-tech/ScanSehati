"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/app/components/ui/accordion';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { CheckCircle2, ChevronDown, XCircle } from "lucide-react";

  interface FAQ {
  q: string;
  a: string;
  tag: string;
  tagColor: string;
}

export default function HelpPage() {
  // state for form
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  // state for alert
  const [status, setStatus] = useState<null | "success" | "error">(null);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus(null); // reset alert at the start

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          fromEmail: form.email,
          message: form.message,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Something went wrong!");
      } else {
        setStatus("success");
        setMessage(data.message);
        // clear form
        setForm({ name: "", email: "", message: "" });
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
      setMessage("Network error");
    } finally {
      setLoading(false);
    }
  }



// Post-login FAQs: practical usage questions from existing logged-in users
const faqs: FAQ[] = [
  {
    q: "How do I run a drug interaction check on my current prescriptions?",
    a: "Go to your dashboard and tap 'Check Interactions' on any prescription card. You can also add extra medications — like OTC drugs or vitamins you take — and the AI will check all of them together at once. Results are graded as minor, moderate, or major.",
    tag: "Using the Checker",
    tagColor: "bg-blue-50 text-blue-700",
  },
  {
    q: "I got a drug interaction alert — what should I do next?",
    a: "Don't panic. Read the alert detail — it will tell you the severity level and what the specific risk is. For minor alerts, your doctor may have already accounted for it. For moderate or major alerts, use the 'Message Doctor' button on the alert screen to contact your prescribing doctor directly through ScanSehati before taking the medication.",
    tag: "Interaction Alerts",
    tagColor: "bg-amber-50 text-amber-700",
  },
  {
    q: "Can I add my own vitamins and supplements to the interaction checker?",
    a: "Yes. In the interaction checker, tap '+ Add Medication' and search for any supplement — vitamin D, magnesium, fish oil, St. John's Wort, melatonin, and hundreds more are in our database. The AI checks them against all your current prescriptions.",
    tag: "Supplements & OTC",
    tagColor: "bg-emerald-50 text-emerald-700",
  },
  {
    q: "My doctor sent a new prescription — where do I find it?",
    a: "You'll get a push notification and an in-app notification instantly. It also appears at the top of your 'Active Prescriptions' list on your dashboard. Tap it to see full details including dosage, duration, and your doctor's instructions.",
    tag: "Prescriptions",
    tagColor: "bg-violet-50 text-violet-700",
  },
  {
    q: "How do I share my prescription history with a new doctor?",
    a: "Go to Profile → Medical Records → Share Records. You can generate a secure, time-limited share link or send it directly to a doctor's ScanSehati account. You control exactly which prescriptions and records are included.",
    tag: "Sharing Records",
    tagColor: "bg-blue-50 text-blue-700",
  },
  {
    q: "Can the pharmacist see my prescription without me showing anything?",
    a: "Yes — once your doctor sends a prescription, your connected pharmacy receives it automatically. Your pharmacist can view and verify it on their dashboard. You don't need to print or carry anything. You'll be notified when they mark it 'Ready for Pickup'.",
    tag: "Pharmacy",
    tagColor: "bg-emerald-50 text-emerald-700",
  },
  {
    q: "I take 5+ medications daily. Will the checker handle all of them at once?",
    a: "Absolutely — this is one of ScanSehati's core strengths. The AI checks all your medications simultaneously against each other, not just pairs. This is especially important for polypharmacy patients. Add every drug, supplement, and OTC medicine you take for the most complete safety picture.",
    tag: "Polypharmacy",
    tagColor: "bg-amber-50 text-amber-700",
  },
  {
    q: "How do I set a reminder to take my medication?",
    a: "Open any active prescription and tap 'Set Reminder'. You can set custom times, multiple reminders per day, and choose between push notifications or SMS. Reminders can be paused or edited anytime from the Reminders section in your dashboard.",
    tag: "Reminders",
    tagColor: "bg-violet-50 text-violet-700",
  },
  {
    q: "Can I message my doctor or pharmacist directly through ScanSehati?",
    a: "Yes. Every prescription card has a 'Message' button. You can send a message directly to the prescribing doctor or your linked pharmacist. All messages are stored securely in the conversation thread attached to that prescription.",
    tag: "Messaging",
    tagColor: "bg-blue-50 text-blue-700",
  },
  {
    q: "Is my medical data safe? Who can see my prescriptions?",
    a: "Your data is end-to-end encrypted. Only doctors and pharmacists you have explicitly authorized can view your prescriptions. You can review and revoke access at any time from Profile → Privacy & Access. ScanSehati never sells or shares your health data.",
    tag: "Privacy & Security",
    tagColor: "bg-emerald-50 text-emerald-700",
  },
];

// ─── FAQ Item ─────────────────────────────────────────────────────────────────

function FAQItem({ faq, index }: { faq: FAQ; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-slate-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full flex items-start justify-between gap-4 py-5 text-left group"
      >
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <span
            className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold mt-0.5 transition-all duration-200 ${
              open
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600"
            }`}
          >
            {index + 1}
          </span>
          <span
            className={`text-[15px] font-medium leading-snug transition-colors duration-200 ${
              open ? "text-blue-700" : "text-slate-800 group-hover:text-blue-600"
            }`}
          >
            {faq.q}
          </span>
        </div>
        <ChevronDown 
          size={17}
          className={`flex-shrink-0 mt-0.5 text-slate-400 transition-transform duration-300 ${
            open ? "rotate-180 text-blue-500" : ""
          }`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="pb-5 pl-9">
          <p className="text-sm text-slate-600 leading-relaxed mb-3">{faq.a}</p>
          <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold ${faq.tagColor}`}>
            {faq.tag}
          </span>
        </div>
      </div>
    </div>
  );
}

  return (
    <main className="flex-1 p-4 md:p-8 text-left">
      <div className="space-y-8">
        <header className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight font-headline">Help & Support</h1>
          <p className="text-xl text-muted-foreground">
            Find answers to your questions and get in touch with us.
          </p>
        </header>

        <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
          {/* FAQ section */}
           {/* ── FAQ Section ── */}
        <section aria-label="Frequently asked questions" className="mb-12">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-800 mb-1 flex items-center gap-2">
              <span className="w-1 h-5 bg-emerald-500 rounded-full inline-block" />
              FAQs
            </h2>
            <p className="text-sm text-slate-500 ml-3">
              Practical answers for everything you'll need.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-5 sm:px-6 divide-y-0">
            {faqs.map((faq, i) => (
              <FAQItem key={i} faq={faq} index={i} />
            ))}
          </div>
        </section>

          {/* Contact Support Form */}
          {/* ── Contact Section (FAQ Style) ── */}
<section aria-label="Contact support">
  <div className="mb-6">
    <h2 className="text-xl font-bold text-slate-800 mb-1 flex items-center gap-2">
      <span className="w-1 h-5 bg-blue-500 rounded-full inline-block" />
      Contact Support
    </h2>
    <p className="text-sm text-slate-500 ml-3">
      Can't find an answer? Send us a message.
    </p>
  </div>

  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-5 sm:px-6 py-6">
    <form className="space-y-5" onSubmit={handleSubmit}>
      
      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          placeholder="Your Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="h-10"
          required
        />
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="your@email.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="h-10"
          required
        />
      </div>

      {/* Message */}
      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          placeholder="How can we help you?"
          rows={5}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="resize-none"
          required
          maxLength={300}
        />
        <p className="text-xs text-slate-400 text-right">
          {form.message.length}/300
        </p>
      </div>

      {/* Button */}
      <Button
        type="submit"
        disabled={loading}
        className="w-full h-10 text-sm font-semibold"
      >
        {loading ? "Sending..." : "Send Message"}
      </Button>

      {/* Alerts */}
      {status === "success" && (
        <div className="mt-4 flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-emerald-700">
              Message Sent
            </p>
            <p className="text-sm text-emerald-600">{message}</p>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="mt-4 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3">
          <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-700">
              Error
            </p>
            <p className="text-sm text-red-600">{message}</p>
          </div>
        </div>
      )}
    </form>
  </div>
</section>
        </div>
      </div>
    </main>
  );
}
