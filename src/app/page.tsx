'use client';

import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Zap,
  Shield,
  Brain,
  Leaf,
  FileText,
  User,
  Stethoscope,
  Bell,
  ChevronDown,
  Pill,
  Activity,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface FaqItem {
  q: string;
  a: string;
}

interface Feature {
  icon: React.ReactNode;
  bg: string;
  title: string;
  desc: string;
}

interface Stat {
  icon: React.ReactNode;
  value: string;
  label: string;
}

interface Testimonial {
  initials: string;
  gradient: string;
  name: string;
  role: string;
  quote: string;
}

interface ComparisonRow {
  label: string;
  traditional: 'yes' | 'no' | 'partial';
  ai: 'yes';
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const STATS: Stat[] = [
  { icon: <Pill className="w-7 h-7" />, value: '2M+', label: 'Drug checks run monthly' },
  { icon: <Activity className="w-7 h-7" />, value: '97%', label: 'Accuracy on known interactions' },
  { icon: <Brain className="w-7 h-7" />, value: '25K+', label: 'Medications in database' },
  { icon: <Zap className="w-7 h-7" />, value: '<3s', label: 'Average AI analysis time' },
];

const STEPS = [
  {
    n: '01',
    title: 'Enter Your Medications',
    desc: 'Type prescriptions, OTC drugs, herbal supplements, or vitamins. Smart autocomplete from 25,000+ entries.',
  },
  {
    n: '02',
    title: 'AI Analyzes Interactions',
    desc: 'Our AI cross-references FDA databases, pharmacokinetic models, and peer-reviewed literature in under 3 seconds.',
  },
  {
    n: '03',
    title: 'Get Your Safety Report',
    desc: 'Receive a color-coded report — safe, moderate, or high-risk — with plain-English explanations and next steps.',
  },
];

const FEATURES: Feature[] = [
  {
    icon: <Brain className="w-6 h-6 text-blue-600" />,
    bg: 'bg-blue-50',
    title: 'AI-Powered Detection',
    desc: 'Fine-tuned on pharmacology data to detect known interactions and predict novel ones based on drug class and mechanism.',
  },
  {
    icon: <Leaf className="w-6 h-6 text-teal-600" />,
    bg: 'bg-teal-50',
    title: 'Supplement & Herbal Checks',
    desc: 'Covers St. John\'s Wort, ginseng, turmeric, fish oil, and 800+ other supplements alongside medications.',
  },
  {
    icon: <FileText className="w-6 h-6 text-amber-600" />,
    bg: 'bg-amber-50',
    title: 'Plain-Language Reports',
    desc: 'No medical jargon. Every result is explained in everyday English so you understand the risk and what to do.',
  },
  {
    icon: <User className="w-6 h-6 text-purple-600" />,
    bg: 'bg-purple-50',
    title: 'Personalized Profiles',
    desc: 'Save your medication list and re-check instantly when adding a new prescription. Share reports with your doctor.',
  },
  {
    icon: <Stethoscope className="w-6 h-6 text-rose-600" />,
    bg: 'bg-rose-50',
    title: 'Doctor & Pharmacist Mode',
    desc: 'Bulk patient checks, clinical references, and PDF export for medical records — built for healthcare pros.',
  },
  {
    icon: <Bell className="w-6 h-6 text-green-600" />,
    bg: 'bg-green-50',
    title: 'Refill Interaction Alerts',
    desc: 'Get notified before refills when new interactions are discovered for your medication combination.',
  },
];

const COMPARISON: ComparisonRow[] = [
  { label: 'Prescription drug checks', traditional: 'yes', ai: 'yes' },
  { label: 'Herb-drug interactions', traditional: 'partial', ai: 'yes' },
  { label: 'Plain-English explanations', traditional: 'no', ai: 'yes' },
  { label: 'Full-profile risk analysis', traditional: 'no', ai: 'yes' },
  { label: 'Real-time FDA sync', traditional: 'no', ai: 'yes' },
  { label: 'Shareable PDF reports', traditional: 'no', ai: 'yes' },
  { label: 'Natural language drug search', traditional: 'no', ai: 'yes' },
];

const TESTIMONIALS: Testimonial[] = [
  {
    initials: 'SR',
    gradient: 'from-violet-500 to-purple-700',
    name: 'Sara R.',
    role: 'Patient — Chronic condition management',
    quote:
      '"ScanSehati AI caught a potentially dangerous combination my own pharmacist had missed. This tool is a genuine lifesaver."',
  },
  {
    initials: 'DK',
    gradient: 'from-sky-400 to-blue-600',
    name: 'Dr. David K.',
    role: 'General Practitioner, Family Medicine',
    quote:
      '"The AI catches herb-drug interactions that traditional systems don\'t flag. The comparison reports are excellent for patient education."',
  },
  {
    initials: 'AM',
    gradient: 'from-emerald-400 to-teal-600',
    name: 'Aisha M.',
    role: 'Clinical Pharmacist, Hospital Setting',
    quote:
      '"The plain-English explanations mean patients actually understand the risks — not just nod along. I recommend it to everyone."',
  },
];

const FAQS: FaqItem[] = [
  {
    q: 'What is a medication interaction checker and why do I need one?',
    a: "A medication interaction checker identifies potentially dangerous combinations of drugs. Drug-drug interactions range from minor (reduced effectiveness) to life-threatening (internal bleeding, cardiac events). ScanSehati is a free AI-powered checker that analyzes your full prescription list and flags risks before they become emergencies.",
  },
  {
    q: 'Is ScanSehati free? Do I need a subscription?',
    a: "Basic medication interaction checks are completely free — no credit card required. Create a free account to save your profile, access history, and share reports. A Pro plan unlocks bulk checks, PDF export, and priority alerts for healthcare professionals.",
  },
  {
    q: 'How accurate is AI for checking drug interactions?',
    a: "ScanSehati achieves 97%+ accuracy on known drug-drug interactions by cross-referencing the FDA Adverse Event Reporting System, RxNorm, DrugBank, and peer-reviewed pharmacology literature. It is informational and does not replace advice from your pharmacist or physician.",
  },
  {
    q: 'Can I check interactions between supplements and prescription drugs?',
    a: "Yes — and this is one of ScanSehati's key advantages. We cover 800+ herbal supplements, vitamins, and nutraceuticals including fish oil, St. John's Wort, ginkgo biloba, melatonin, and vitamin K alongside all major prescription and OTC medications.",
  },
  {
    q: 'How is this different from Drugs.com or Medscape interaction checker?',
    a: "Traditional tools use static rule-based systems — checking pairs from a fixed database. ScanSehati's AI uses a trained model that understands drug mechanisms, performs contextual risk assessment across your full medication list, explains results in plain English, and syncs with real-time FDA safety updates.",
  },
];

const RESOURCES = [
  { label: 'FDA: Drug Interactions Guide', href: 'https://www.fda.gov/drugs/drug-interactions-labeling/drug-interactions-what-you-should-know' },
  { label: 'PubMed: DDI Overview', href: 'https://www.ncbi.nlm.nih.gov/books/NBK592395/' },
  { label: 'WHO: Medicine Safety', href: 'https://www.who.int/medicines/areas/quality_safety/safety_efficacy/drug_interactions/en/' },
  { label: 'MedlinePlus Drug Info', href: 'https://medlineplus.gov/druginformation.html' },
  { label: 'DrugBank Database', href: 'https://go.drugbank.com/' },
  { label: 'RxList Interaction Checker', href: 'https://www.rxlist.com/drug-interaction-checker.htm' },
  { label: 'APhA Patient Safety', href: 'https://www.pharmacist.com/patient-safety' },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block text-[0.7rem] font-bold tracking-[0.18em] uppercase text-blue-600 bg-blue-50 border border-blue-100 rounded-full px-3 py-1 mb-4">
      {children}
    </span>
  );
}

function FadeUp({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function CompareIcon({ val }: { val: 'yes' | 'no' | 'partial' }) {
  if (val === 'yes') return <CheckCircle2 className="w-5 h-5 text-teal-400 mx-auto" />;
  if (val === 'no') return <XCircle className="w-5 h-5 text-rose-400/70 mx-auto" />;
  return <AlertTriangle className="w-4 h-4 text-amber-400 mx-auto" />;
}

// ─── Hero Card ────────────────────────────────────────────────────────────────

function HeroCard() {
  const meds = [
    { label: 'Warfarin 5mg', color: 'bg-blue-400' },
    { label: 'Aspirin 81mg', color: 'bg-teal-400' },
    { label: 'Ibuprofen 400mg', color: 'bg-amber-400' },
    { label: 'Metformin 500mg', color: 'bg-purple-400' },
  ];

  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      className="w-full max-w-[420px] bg-white/[0.06] backdrop-blur-xl border border-white/10 rounded-2xl p-7 shadow-2xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <span className="font-bold text-white text-sm font-['Syne',sans-serif]">AI Interaction Analysis</span>
        <span className="text-[0.65rem] font-bold tracking-wide text-teal-300 bg-teal-300/10 border border-teal-300/20 rounded-full px-3 py-1 uppercase">
          Live Demo
        </span>
      </div>

      {/* Med Pills */}
      <div className="flex flex-wrap gap-2 mb-5">
        {meds.map((m) => (
          <span key={m.label} className="flex items-center gap-2 bg-white/7 border border-white/10 rounded-lg px-3 py-2 text-xs text-white/80 font-medium">
            <span className={`w-2 h-2 rounded-full ${m.color} flex-shrink-0`} />
            {m.label}
          </span>
        ))}
      </div>

      {/* Scan Bars */}
      <div className="space-y-3 mb-4">
        {[
          { label: 'AI Confidence Score', width: 'w-[92%]', from: 'from-blue-500', to: 'to-teal-400' },
          { label: 'Database Coverage', width: 'w-[97%]', from: 'from-green-500', to: 'to-teal-300' },
        ].map((bar) => (
          <div key={bar.label} className="bg-white/5 rounded-lg px-4 py-3 border border-white/7">
            <p className="text-[0.65rem] uppercase tracking-widest text-slate-500 font-semibold mb-2">{bar.label}</p>
            <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full bg-gradient-to-r ${bar.from} ${bar.to}`}
                initial={{ width: 0 }}
                animate={{ width: bar.width }}
                transition={{ duration: 1.4, ease: 'easeOut', delay: 0.5 }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Results */}
      <div className="space-y-2">
        {[
          {
            type: 'danger',
            icon: '⚠️',
            iconBg: 'bg-rose-500/10',
            border: 'border-rose-500/20',
            bg: 'bg-rose-500/8',
            label: 'HIGH RISK: Warfarin + Ibuprofen',
            labelColor: 'text-rose-400',
            desc: 'Increased bleeding risk — consult your pharmacist',
          },
          {
            type: 'warn',
            icon: '🔶',
            iconBg: 'bg-amber-400/10',
            border: 'border-amber-400/20',
            bg: 'bg-amber-400/8',
            label: 'MODERATE: Warfarin + Aspirin',
            labelColor: 'text-amber-400',
            desc: 'Antiplatelet effect enhancement — monitor closely',
          },
          {
            type: 'safe',
            icon: '✅',
            iconBg: 'bg-green-400/10',
            border: 'border-green-400/20',
            bg: 'bg-green-400/8',
            label: 'SAFE: Metformin (no conflict)',
            labelColor: 'text-green-400',
            desc: 'No significant interactions detected',
          },
        ].map((r) => (
          <div key={r.type} className={`flex items-start gap-3 rounded-xl p-3 border ${r.bg} ${r.border}`}>
            <div className={`w-8 h-8 flex-shrink-0 rounded-lg flex items-center justify-center text-sm ${r.iconBg}`}>
              {r.icon}
            </div>
            <div>
              <p className={`text-[0.72rem] font-bold font-['Syne',sans-serif] ${r.labelColor}`}>{r.label}</p>
              <p className="text-[0.68rem] text-white/40 mt-0.5 font-light">{r.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── FAQ Item ─────────────────────────────────────────────────────────────────

function FAQItem({ faq, index }: { faq: FaqItem; index: number }) {
  const [open, setOpen] = useState(index === 0);
  return (
    <div className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${open ? 'border-blue-200 shadow-md shadow-blue-50' : 'border-slate-100'}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-6 py-5 text-left gap-4 cursor-pointer"
        aria-expanded={open}
      >
        <span className="text-[0.92rem] font-semibold text-slate-800 font-['DM_Sans',sans-serif]">{faq.q}</span>
        <span className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300 ${open ? 'bg-blue-600 text-white rotate-180' : 'bg-slate-100 text-slate-400'}`}>
          <ChevronDown className="w-4 h-4" />
        </span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-hidden"
      >
        <p className="px-6 pb-5 text-[0.88rem] text-slate-500 leading-relaxed font-light">{faq.a}</p>
      </motion.div>
    </div>
  );
}

// ─── Structured Data (JSON-LD) ────────────────────────────────────────────────

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

const appSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'ScanSehati',
  operatingSystem: 'Web',
  applicationCategory: 'HealthApplication',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'AI-powered medication interaction checker that identifies dangerous drug combinations in real time.',
  aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', reviewCount: '12400' },
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* ── SEO HEAD ── */}
      <Head>
        <title>AI Medication Interaction Checker | Free Drug Interaction Tool | ScanSehati</title>
        <meta
          name="description"
          content="Check dangerous drug interactions instantly with AI. ScanSehati analyzes hundreds of medications in seconds — free, accurate, and trusted by patients and doctors. Try the #1 AI medication interaction checker today."
        />
        <meta
          name="keywords"
          content="medication interaction checker, drug interaction checker, AI drug interactions, check drug interactions online, medication safety checker, medicine interaction tool, prescription drug interactions, free medication checker, AI health tool"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.scansehati.com/" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="AI Medication Interaction Checker — Instant & Free | ScanSehati" />
        <meta property="og:description" content="Instantly check if your medications are safe together. Our AI engine cross-references thousands of drug combinations in real time." />
        <meta property="og:url" content="https://www.scansehati.com/" />
        <meta property="og:site_name" content="ScanSehati" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AI Medication Interaction Checker | ScanSehati" />
        <meta name="twitter:description" content="Check drug interactions in seconds with AI precision. Free, instant, trusted." />

        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap" rel="stylesheet" />

        {/* JSON-LD */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      </Head>

      <div className="font-['DM_Sans',sans-serif] text-slate-900 bg-white overflow-x-hidden">

        {/* ════════════════ NAVBAR ════════════════ */}
        <header
          className={`sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-100 px-[5vw] h-[70px] flex items-center justify-between transition-shadow duration-300 ${scrolled ? 'shadow-lg shadow-slate-100' : ''}`}
        >
          <Link href="/" className="flex items-center gap-2.5 no-underline group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center text-base shadow-md shadow-blue-200">
              <img src="/capture.png" alt="ScanSehati Logo" className="w-5 h-5" />
            </div>
            <span className="font-['Syne',sans-serif] font-extrabold text-xl tracking-tight text-slate-900">
              ScanSehati
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {['Features', 'How It Works', 'FAQ', 'Resources'].map((item) => (
              <Link
                key={item}
                href={`#${item.toLowerCase().replace(/ /g, '-')}`}
                className="text-[0.88rem] font-medium text-slate-500 hover:text-slate-900 transition-colors no-underline"
              >
                {item}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            <Link href="/login" className="hidden sm:inline-flex items-center px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:border-blue-300 hover:text-blue-600 transition-all no-underline">
              Log In
            </Link>
            <Link href="/signup" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm font-semibold shadow-md shadow-blue-200 hover:shadow-blue-300 hover:-translate-y-0.5 transition-all no-underline">
              Start Free Check <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </header>

        {/* ════════════════ HERO ════════════════ */}
        <section
          className="relative min-h-[calc(100vh-70px)] bg-[#0B1628] flex items-center overflow-hidden px-[5vw] py-16"
          aria-labelledby="hero-headline"
        >
          {/* Grid background */}
          <div
            className="absolute inset-0 opacity-100"
            style={{
              backgroundImage:
                'linear-gradient(rgba(26,110,219,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(26,110,219,0.07) 1px, transparent 1px)',
              backgroundSize: '50px 50px',
            }}
          />

          {/* Glows */}
          <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-[500px] h-[500px] bg-teal-500/15 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 w-full max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">

            {/* Left */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-teal-300/10 border border-teal-300/20 rounded-full px-4 py-1.5 mb-7">
                <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
                <span className="text-[0.72rem] font-bold tracking-widest uppercase text-teal-300">
                  AI-Powered · Clinically Referenced · Free
                </span>
              </div>

              <h1
                id="hero-headline"
                className="font-['Syne',sans-serif] font-extrabold text-[clamp(2.2rem,4.5vw,3.8rem)] leading-[1.1] tracking-tight text-white mb-6"
              >
                Check Drug Interactions<br />
                with{' '}
                <span className="bg-gradient-to-r from-blue-400 to-teal-300 bg-clip-text text-transparent">
                  AI Precision
                </span>
                <br />
                — Before It's Too Late
              </h1>

              <p className="text-slate-300/70 text-[1rem] leading-[1.8] font-light max-w-[520px] mb-9">
                The most advanced free medication interaction checker online. Powered by AI and trained on FDA drug
                databases — enter your prescriptions and get an instant safety report in seconds.
              </p>

              <div className="flex flex-wrap gap-3 mb-10">
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 px-7 py-4 rounded-xl bg-gradient-to-r from-teal-500 to-teal-400 text-white font-semibold text-[0.95rem] shadow-xl shadow-teal-500/25 hover:shadow-teal-500/40 hover:-translate-y-0.5 transition-all no-underline"
                >
                  Check My Medications Free <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center px-7 py-4 rounded-xl border border-white/15 text-white/80 font-medium text-[0.95rem] hover:border-white/30 hover:text-white transition-all no-underline"
                >
                  Sign In
                </Link>
              </div>

              {/* Trust row */}
              <div className="flex items-center gap-4 pt-6 border-t border-white/8">
                <div className="flex">
                  {[
                    { i: 'JR', g: 'from-violet-500 to-purple-700' },
                    { i: 'SM', g: 'from-pink-400 to-rose-600' },
                    { i: 'AL', g: 'from-sky-400 to-blue-600' },
                    { i: 'PK', g: 'from-emerald-400 to-teal-600' },
                  ].map((a, idx) => (
                    <div
                      key={a.i}
                      className={`w-8 h-8 rounded-full bg-gradient-to-br ${a.g} border-2 border-[#0B1628] flex items-center justify-center text-[0.6rem] font-bold text-white ${idx !== 0 ? '-ml-2' : ''}`}
                    >
                      {a.i}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="text-amber-400 text-xs mb-0.5">★★★★★</div>
                  <p className="text-[0.78rem] text-white/40 font-light">
                    <strong className="text-white/80 font-semibold">50,000+ users</strong> trust ScanSehati monthly
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Right — Demo Card */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="flex justify-center lg:justify-end"
            >
              <HeroCard />
            </motion.div>
          </div>
        </section>

        {/* ════════════════ TRUSTED BY ════════════════ */}
        <div className="bg-slate-50 py-8 px-[5vw] border-b border-slate-100">
          <p className="text-center text-[0.72rem] uppercase tracking-[0.2em] text-slate-400 font-semibold mb-5">
            Referenced &amp; Trusted By
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-3">
            {['FDA Drug Database', 'PubMed Clinical Research', 'WHO Medicines', 'RxNorm API', 'DrugBank Pro', 'ClinicalKey Pharmacology'].map((logo) => (
              <span key={logo} className="font-['Syne',sans-serif] font-bold text-[0.85rem] text-slate-300 hover:text-slate-400 transition-colors cursor-default">
                {logo}
              </span>
            ))}
          </div>
        </div>

        {/* ════════════════ STATS ════════════════ */}
        <section className="py-16 px-[5vw] bg-white" aria-label="Platform statistics">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-px bg-slate-100 rounded-2xl overflow-hidden shadow-lg shadow-slate-100">
            {STATS.map((s, i) => (
              <FadeUp key={s.label} delay={i * 0.1} className="bg-white p-8 text-center hover:bg-slate-50 transition-colors">
                <div className="text-blue-500 flex justify-center mb-3">{s.icon}</div>
                <div className="font-['Syne',sans-serif] font-extrabold text-[2.2rem] tracking-tight text-slate-900 leading-none mb-1.5">
                  {s.value.includes('%') || s.value.includes('+') || s.value.includes('<') ? (
                    <>
                      <span className="text-blue-600">{s.value}</span>
                    </>
                  ) : (
                    s.value
                  )}
                </div>
                <p className="text-[0.78rem] text-slate-400 leading-snug">{s.label}</p>
              </FadeUp>
            ))}
          </div>
        </section>

        {/* ════════════════ HOW IT WORKS ════════════════ */}
        <section id="how-it-works" className="py-20 px-[5vw] bg-slate-50" aria-labelledby="how-title">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <SectionLabel>How It Works</SectionLabel>
              <h2 id="how-title" className="font-['Syne',sans-serif] font-extrabold text-[clamp(1.8rem,3vw,2.6rem)] tracking-tight text-slate-900 mb-3">
                Check Drug Interactions in 3 Simple Steps
              </h2>
              <p className="text-slate-400 font-light max-w-lg mx-auto leading-relaxed text-[0.95rem]">
                No medical degree required. Built for patients, caregivers, and healthcare professionals alike.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
              {/* Connector line */}
              <div className="hidden md:block absolute top-11 left-[calc(16.66%+24px)] right-[calc(16.66%+24px)] h-px bg-gradient-to-r from-blue-300 to-teal-300 opacity-40" />

              {STEPS.map((s, i) => (
                <FadeUp key={s.n} delay={i * 0.15}>
                  <div className="bg-white rounded-2xl p-7 border border-slate-100 shadow-sm hover:-translate-y-1.5 hover:shadow-xl hover:shadow-blue-50 hover:border-blue-100 transition-all duration-300 relative z-10">
                    <div className="w-11 h-11 rounded-[10px] bg-gradient-to-br from-blue-600 to-teal-500 text-white font-['Syne',sans-serif] font-bold text-base flex items-center justify-center mb-5 shadow-md shadow-blue-200">
                      {s.n}
                    </div>
                    <h3 className="font-['Syne',sans-serif] font-bold text-slate-900 text-[1rem] mb-2.5">{s.title}</h3>
                    <p className="text-slate-400 text-[0.86rem] leading-relaxed font-light">{s.desc}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════ FEATURES ════════════════ */}
        <section id="features" className="py-20 px-[5vw] bg-white" aria-labelledby="features-title">
          <div className="max-w-[1200px] mx-auto">
            <div className="text-center mb-14">
              <SectionLabel>Platform Features</SectionLabel>
              <h2 id="features-title" className="font-['Syne',sans-serif] font-extrabold text-[clamp(1.8rem,3vw,2.6rem)] tracking-tight text-slate-900 mb-3">
                Everything You Need for Medication Safety
              </h2>
              <p className="text-slate-400 font-light max-w-lg mx-auto leading-relaxed text-[0.95rem]">
                More intelligent, more comprehensive, and more actionable than any traditional drug interaction checker.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {FEATURES.map((f, i) => (
                <FadeUp key={f.title} delay={i * 0.08}>
                  <div className="group border border-slate-100 rounded-2xl p-7 hover:border-transparent hover:shadow-xl hover:shadow-blue-50 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                    {/* Top accent bar */}
                    <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-600 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl" />
                    <div className={`w-12 h-12 rounded-[12px] ${f.bg} flex items-center justify-center mb-5`}>{f.icon}</div>
                    <h3 className="font-['Syne',sans-serif] font-bold text-slate-900 text-[0.97rem] mb-2">{f.title}</h3>
                    <p className="text-slate-400 text-[0.85rem] leading-relaxed font-light">{f.desc}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════ WHY AI ════════════════ */}
        <section className="py-20 px-[5vw] bg-[#0B1628] relative overflow-hidden" aria-labelledby="why-ai-title">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[700px] h-[400px] bg-blue-600/10 rounded-full blur-[120px]" />
          </div>

          <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
            {/* Left */}
            <FadeUp>
              <span className="inline-block text-[0.7rem] font-bold tracking-[0.18em] uppercase text-teal-300 bg-teal-300/10 border border-teal-300/20 rounded-full px-3 py-1 mb-4">
                Why AI Changes Everything
              </span>
              <h2 id="why-ai-title" className="font-['Syne',sans-serif] font-extrabold text-[clamp(1.8rem,3vw,2.4rem)] tracking-tight text-white mb-4">
                Smarter Than Traditional Drug Checkers
              </h2>
              <p className="text-white/40 font-light leading-relaxed text-[0.95rem] mb-8 max-w-lg">
                Traditional tools check a static list. ScanSehati reasons about interactions like a clinical
                pharmacologist — understanding mechanism, severity context, and patient-specific risk.
              </p>

              <ul className="space-y-5">
                {[
                  { title: 'Contextual Severity Assessment', desc: 'AI weighs your full medication profile together — not just pairs in isolation — so you see the real-world risk level.' },
                  { title: 'Continuously Updated Knowledge', desc: 'New drug interactions are published weekly. Our model syncs with FDA safety announcements and post-market surveillance data.' },
                  { title: 'Natural Language Input', desc: 'Type brand names, generic names, or describe what the medication looks like — our AI figures out exactly what you mean.' },
                ].map((item) => (
                  <li key={item.title} className="flex gap-4 items-start">
                    <div className="w-6 h-6 flex-shrink-0 mt-0.5 rounded-md bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center">
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-[0.9rem] mb-0.5">{item.title}</p>
                      <p className="text-white/35 text-[0.82rem] font-light leading-relaxed">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </FadeUp>

            {/* Right — Comparison Table */}
            <FadeUp delay={0.15}>
              <div className="bg-white/4 border border-white/8 rounded-2xl overflow-hidden" role="table" aria-label="AI vs Traditional checker comparison">
                <div className="grid grid-cols-[2fr_1fr_1fr] px-5 py-3.5 bg-white/5 border-b border-white/6" role="row">
                  <span className="text-[0.68rem] font-bold uppercase tracking-widest text-slate-500">Capability</span>
                  <span className="text-[0.68rem] font-bold uppercase tracking-widest text-slate-500 text-center">Traditional</span>
                  <span className="text-[0.68rem] font-bold uppercase tracking-widest text-teal-400 text-center">ScanSehati</span>
                </div>
                {COMPARISON.map((row) => (
                  <div key={row.label} className="grid grid-cols-[2fr_1fr_1fr] px-5 py-3.5 border-b border-white/4 last:border-b-0 hover:bg-white/3 transition-colors items-center" role="row">
                    <span className="text-[0.84rem] text-white/55 font-light">{row.label}</span>
                    <CompareIcon val={row.traditional} />
                    <CompareIcon val={row.ai} />
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>
        </section>

        {/* ════════════════ TESTIMONIALS ════════════════ */}
        <section className="py-20 px-[5vw] bg-white" aria-labelledby="testi-title">
          <div className="max-w-[1100px] mx-auto">
            <div className="text-center mb-14">
              <SectionLabel>User Reviews</SectionLabel>
              <h2 id="testi-title" className="font-['Syne',sans-serif] font-extrabold text-[clamp(1.8rem,3vw,2.6rem)] tracking-tight text-slate-900">
                Trusted by Patients &amp; Professionals
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {TESTIMONIALS.map((t, i) => (
                <FadeUp key={t.name} delay={i * 0.1}>
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-7 hover:border-blue-100 hover:shadow-xl hover:shadow-blue-50 hover:-translate-y-1 transition-all duration-300">
                    <div className="text-amber-400 text-sm mb-4">★★★★★</div>
                    <p className="text-[0.88rem] text-slate-600 italic leading-relaxed font-light mb-6">{t.quote}</p>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-[0.85rem] font-bold text-white flex-shrink-0`}>
                        {t.initials}
                      </div>
                      <div>
                        <p className="text-[0.85rem] font-bold text-slate-900">{t.name}</p>
                        <p className="text-[0.74rem] text-slate-400 mt-0.5">{t.role}</p>
                      </div>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════ FAQ ════════════════ */}
        <section id="faq" className="py-20 px-[5vw] bg-slate-50" aria-labelledby="faq-title">
          <div className="max-w-[780px] mx-auto">
            <div className="text-center mb-12">
              <SectionLabel>Common Questions</SectionLabel>
              <h2 id="faq-title" className="font-['Syne',sans-serif] font-extrabold text-[clamp(1.8rem,3vw,2.4rem)] tracking-tight text-slate-900 mb-3">
                Medication Interaction FAQ
              </h2>
              <p className="text-slate-400 font-light text-[0.95rem]">
                Everything patients and caregivers ask about checking drug interactions online.
              </p>
            </div>
            <div className="space-y-3">
              {FAQS.map((faq, i) => (
                <FAQItem key={faq.q} faq={faq} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════ SEO RESOURCES / BACKLINKS ════════════════ */}
        <section id="resources" className="py-12 px-[5vw] bg-white border-t border-slate-100" aria-label="Trusted medication safety resources">
          <div className="max-w-[900px] mx-auto text-center">
            <h4 className="text-[0.72rem] uppercase tracking-[0.2em] text-slate-400 font-semibold mb-5">
              Trusted External Resources on Drug Safety
            </h4>
            <div className="flex flex-wrap justify-center gap-2.5">
              {RESOURCES.map((r) => (
                <a
                  key={r.label}
                  href={r.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[0.78rem] font-medium text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-all no-underline"
                >
                  {r.label}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════ CTA ════════════════ */}
        <section className="py-20 px-[5vw] bg-[#0B1628] relative overflow-hidden text-center" aria-labelledby="cta-title">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[800px] h-[400px] bg-teal-500/10 rounded-full blur-[120px]" />
          </div>
          <div className="relative z-10 max-w-[640px] mx-auto">
            <div className="inline-flex items-center gap-2 bg-teal-300/10 border border-teal-300/20 rounded-full px-4 py-1.5 mb-7">
              <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
              <span className="text-[0.72rem] font-bold tracking-widest uppercase text-teal-300">Free · No Credit Card Required</span>
            </div>
            <h2 id="cta-title" className="font-['Syne',sans-serif] font-extrabold text-[clamp(1.8rem,3.5vw,2.8rem)] tracking-tight text-white mb-4">
              Start Checking Your Medications Now
            </h2>
            <p className="text-white/45 text-[0.95rem] font-light leading-relaxed mb-9 max-w-lg mx-auto">
              Join 50,000+ patients and professionals who use ScanSehati AI to stay safe. Your medication safety check
              takes under 3 minutes and costs nothing.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-teal-500 to-teal-400 text-white font-semibold shadow-xl shadow-teal-500/25 hover:shadow-teal-500/40 hover:-translate-y-0.5 transition-all no-underline"
              >
                Create Free Account <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center px-8 py-4 rounded-xl border border-white/15 text-white/70 font-medium hover:border-white/30 hover:text-white transition-all no-underline"
              >
                Already have an account
              </Link>
            </div>
            <p className="mt-6 text-[0.73rem] text-white/25">
              By using ScanSehati you agree to our{' '}
              <Link href="/terms" className="text-white/40 underline hover:text-white/60">Terms</Link>.
              {' '}This tool is informational and does not replace professional medical advice.
            </p>
          </div>
        </section>

        {/* ════════════════ FOOTER ════════════════ */}
        <footer className="bg-[#0B1628] border-t border-white/6 px-[5vw] pt-14 pb-8">
          <div className="max-w-[1200px] mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-white/6 mb-8">
              <div>
                <Link href="/" className="flex items-center gap-2.5 no-underline mb-4">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center text-base"><img src="/capture.png" alt="ScanSehati Logo" className="w-5 h-5" /></div>
                  <span className="font-['Syne',sans-serif] font-extrabold text-xl text-white tracking-tight">
                    ScanSehati
                  </span>
                </Link>
                <p className="text-[0.82rem] text-white/30 font-light leading-relaxed max-w-[260px]">
                  The most accurate AI-powered medication interaction checker online. Free for patients, powerful for professionals.
                </p>
              </div>
              {[
                {
                  title: 'Product',
                  links: [
                    { label: 'Features', href: '#features' },
                    { label: 'How It Works', href: '#how-it-works' },
                    { label: 'Pricing', href: '/pricing' },
                    { label: 'API Access', href: '/api' },
                  ],
                },
                {
                  title: 'Learn',
                  links: [
                    { label: 'Drug Interaction Guide', href: '/blog/drug-interaction-guide' },
                    { label: 'Common Interactions', href: '/blog/common-interactions' },
                    { label: 'Supplement Safety', href: '/blog/supplement-safety' },
                    { label: 'FAQ', href: '#faq' },
                  ],
                },
                {
                  title: 'Company',
                  links: [
                    { label: 'About', href: '/about' },
                    { label: 'Contact', href: '/contact' },
                    { label: 'Privacy', href: '/privacy' },
                    { label: 'Terms', href: '/terms' },
                  ],
                },
              ].map((col) => (
                <div key={col.title}>
                  <h5 className="font-['Syne',sans-serif] text-[0.72rem] font-bold uppercase tracking-[0.18em] text-white/40 mb-4">{col.title}</h5>
                  <ul className="space-y-2.5">
                    {col.links.map((l) => (
                      <li key={l.label}>
                        <Link href={l.href} className="text-[0.83rem] text-white/30 hover:text-white/70 transition-colors no-underline font-light">
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-[0.75rem] text-white/20">
                © {new Date().getFullYear()} ScanSehati. Not a substitute for professional medical advice.
              </p>
              <div className="flex gap-5">
                {['Sitemap', 'Privacy Policy', 'Terms of Use', 'Accessibility'].map((l) => (
                  <Link key={l} href={`/${l.toLowerCase().replace(/ /g, '-')}`} className="text-[0.74rem] text-white/20 hover:text-white/50 transition-colors no-underline">
                    {l}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}