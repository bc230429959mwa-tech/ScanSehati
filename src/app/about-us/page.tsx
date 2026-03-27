'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Shield, Brain, Heart, Users } from 'lucide-react';

export default function AboutUs() {
  return (
    <main className="min-h-screen bg-white text-slate-800">
      
      {/* ── HERO ── */}
      <section className="relative py-24 px-6 text-center overflow-hidden">
        {/* background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:48px_48px] opacity-50" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-5">
            <Shield size={12} />
            AI Drug Safety Platform
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold mb-5 leading-tight">
             <span className="text-blue-600">About ScanSehati</span>
          </h1>

          <p className="text-lg text-slate-600 leading-relaxed">
            ScanSehati is an <strong>AI-powered drug interaction checker</strong> and 
            <strong> digital prescription platform</strong> designed to prevent medication errors, 
            improve patient safety, and connect doctors, pharmacists, and patients.
          </p>

          <div className="flex justify-center gap-3 mt-6 flex-wrap">
            {['Drug Interaction Checker', 'e-Prescribing', 'Medication Safety'].map((tag) => (
              <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs rounded-full border">
                {tag}
              </span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── MISSION ── */}
      <section className="max-w-5xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
        
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
        >
          <h2 className="text-2xl font-bold mb-4">
            Our Mission
          </h2>

          <p className="text-slate-600 leading-relaxed mb-4">
            We believe healthcare should be <strong>simple, safe, and connected</strong>. 
            ScanSehati eliminates prescription errors, detects dangerous drug interactions, 
            and ensures every patient receives the right medication.
          </p>

          <p className="text-slate-600 leading-relaxed">
            By combining <strong>AI-powered clinical decision support</strong> with modern design, 
            we are building a future where medication mistakes are no longer a risk.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          className="relative"
        >
          <Image
            src="/company.jpg"
            alt="ScanSehati healthcare platform"
            width={500}
            height={320}
            className="rounded-2xl shadow-lg object-cover"
          />

          {/* overlay badge */}
          <div className="absolute bottom-4 left-4 bg-white rounded-xl shadow-md px-4 py-2 text-sm border">
            AI Interaction Engine
          </div>
        </motion.div>
      </section>

      {/* ── VALUES ── */}
      <section className="bg-slate-50 py-20 border-y">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-10">
            What we stand for
          </h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { icon: Brain, title: 'AI Safety', desc: 'Smart interaction checks in real-time.' },
              { icon: Heart, title: 'Patient First', desc: 'Every feature improves patient safety.' },
              { icon: Shield, title: 'Trust', desc: 'Secure and reliable healthcare data.' },
              { icon: Users, title: 'Connected Care', desc: 'Doctors, pharmacists & patients together.' },
            ].map((v, i) => {
              const Icon = v.icon;
              return (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="bg-white border rounded-xl p-5 hover:shadow-md transition"
                >
                  <Icon className="text-blue-600 mb-3" size={20} />
                  <h3 className="font-semibold mb-1">{v.title}</h3>
                  <p className="text-sm text-slate-500">{v.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FOUNDER ── */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold mb-6">Meet Our Founder</h2>

        <div className="bg-white border rounded-2xl p-8 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900">
            Dr. Noha
          </h3>
          <p className="text-slate-500 mb-4">
            Founder & CEO
          </p>

          <p className="text-slate-600 leading-relaxed max-w-xl mx-auto">
            A healthcare professional who witnessed how preventable medication errors harm patients.
            Built ScanSehati to bring <strong>AI-powered drug interaction checking</strong> into everyday healthcare.
          </p>
        </div>
      </section>

      {/* ── SEO LINKS ── */}
      <section className="bg-slate-50 py-10 text-center text-sm">
        <div className="flex justify-center gap-6 flex-wrap">
          <Link href="/interaction-check" className="text-slate-500 hover:text-blue-600">
            Drug Interaction Checker
          </Link>
          <Link href="/help" className="text-slate-500 hover:text-blue-600">
            Contact
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="text-center py-6 text-xs text-slate-400 border-t">
        © {new Date().getFullYear()} ScanSehati — All rights reserved.
      </footer>
    </main>
  );
}