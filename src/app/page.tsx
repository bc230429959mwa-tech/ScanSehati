'use client';

import { Button } from '@/app/components/ui/button';
import { ArrowRight, Stethoscope, Brain, ShieldCheck, Users, HeartPulse } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function HomePage() {
  const primaryColor = 'text-blue-500';
  const secondaryColor = 'text-green-500';
  const gradientClass = 'bg-gradient-to-br from-gray-900 to-blue-950';

  return (
    <div className={`min-h-screen ${gradientClass} text-white font-[Poppins] overflow-hidden`}>

      {/* ===== NAVBAR (No changes) ===== */}
      <header className="flex items-center justify-between px-4 md:px-20 py-5 bg-gradient-to-r from-blue-900 to-green-800 border-b border-white backdrop-blur-lg sticky top-0 z-50 border-b border-white/10 shadow-lg">
        <h1 className="text-xl md:text-3xl font-extrabold tracking-wide">
          <span className="text-white">Scan</span>
          <span className="text-green-400">Sehati</span>
        </h1>

        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" className="text-white hover:bg-white/15 h-9 px-3 md:h-10 md:px-5 flex items-center border border-white/20 text-sm md:text-base">
              Log In
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="bg-green-500 hover:bg-green-600 text-white h-9 px-3 md:h-10 md:px-5 flex items-center shadow-lg hover:shadow-green-500/50 transition duration-300 text-sm md:text-base">
              Sign Up
            </Button>
          </Link>
        </div>
      </header>

      {/* ===== HERO SECTION (No changes) ===== */}
      <section
        className="flex flex-col-reverse md:flex-row items-start md:items-center justify-between px-6 md:px-20 py-16 md:py-32 relative min-h-[85vh] 
                   bg-gradient-to-r from-blue-900 to-green-800 border-t border-white/20 gap-12 lg:gap-24"
      >

        {/* Abstract shape for background depth/focus */}
        <div className="absolute top-1/4 left-1/4 h-32 w-32 md:h-64 md:w-64 bg-green-500/20 rounded-full filter blur-3xl opacity-40 animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 h-32 w-32 md:h-64 md:w-64 bg-blue-500/20 rounded-full filter blur-3xl opacity-40 animate-pulse-slow delay-500"></div>

        <motion.div
          className="max-w-full md:max-w-xl z-10 text-center md:text-left"
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9 }}
        >
          <h2 className="text-4xl md:text-6xl font-extrabold leading-snug md:leading-tight mb-4 md:mb-6 drop-shadow-md">
            Revolutionize Your Health with{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-400">AI Precision</span>
          </h2>
          <p className="text-base md:text-lg text-gray-200 mb-8 md:mb-10 leading-relaxed">
            ScanSehati connects patients, doctors, and pharmacists through cutting-edge AI —
            delivering safer, smarter, and more personalized healthcare experiences.
          </p>

          <div className="flex gap-4 justify-center md:justify-start">
            <Link href="/signup">
              <Button className="bg-green-500 hover:bg-green-600 text-white text-base md:text-lg px-6 md:px-8 py-2 md:py-3 rounded-full font-semibold shadow-lg hover:shadow-green-500/20 transition duration-300">
                Get Started <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" className="border-white/40 text-black hover:bg-white/15 text-base md:text-lg px-6 md:px-8 py-2 md:py-3 rounded-full font-semibold">
                Learn More
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="mt-10 md:mt-0 z-10 w-full flex justify-center"
        >
          <Image
            src="/Healthcare-AI.png"
            alt="AI Healthcare Illustration"
            width={550}
            height={550}
            className="drop-shadow-[0_0_40px_rgba(34,197,94,0.4)] border-radius rounded-lg w-full max-w-xs md:max-w-md xl:max-w-lg"
          />
        </motion.div>
      </section>

      

      {/* ===== STATS SECTION (No changes needed here) ===== */}
      <section className="py-12 md:py-20 bg-gradient-to-r from-blue-700 to-green-800 border-t border-white/20 text-center border-t border-white/10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto px-6">
          {[
            { icon: <Users className="h-8 w-8 md:h-10 md:w-10 text-green-400 mx-auto mb-3" />, label: "Active Users", value: "50K+" },
            { icon: <HeartPulse className="h-8 w-8 md:h-10 md:w-10 text-blue-400 mx-auto mb-3" />, label: "Scans Processed", value: "2M+" },
            { icon: <Brain className="h-8 w-8 md:h-10 md:w-10 text-green-300 mx-auto mb-3" />, label: "AI Models", value: "25+" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{
                opacity: 1,
                y: 0,
                transition: { delay: i * 0.2, duration: 0.6 }
              }}
              viewport={{ once: true }}

              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 30px rgba(59, 130, 246, 0.4)",
                transition: { duration: 0.3 }
              }}

              className="p-6 md:p-8 bg-white/5 rounded-xl md:rounded-2xl hover:bg-white/10 shadow-xl border border-white/10 transition-all duration-500 backdrop-blur-sm cursor-pointer"
            >
              {stat.icon}
              <h4 className="text-3xl md:text-4xl font-extrabold text-white">{stat.value}</h4>
              <p className="text-gray-400 mt-1 md:mt-2 text-xs md:text-sm uppercase tracking-wider">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      

      {/* ===== FEATURES - FIX APPLIED HERE: transition MOVED INTO whileInView object ===== */}
      <section
        id="features"
        className="py-16 md:py-28 text-center bg-gradient-to-b from-blue-900 to-green-900 transition-all duration-1000"
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.h3
            className="text-3xl md:text-5xl font-extrabold mb-10 md:mb-16 text-white"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Powerful <span className={primaryColor}>Healthcare</span> Tools
          </motion.h3>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
            {[
              {
                icon: <Stethoscope className={`h-10 w-10 md:h-12 md:w-12 ${secondaryColor}`} />,
                title: 'Smart Diagnosis',
                desc: 'AI-assisted scans help detect diseases faster and with greater accuracy.',
              },
              {
                icon: <Brain className={`h-10 w-10 md:h-12 md:w-12 ${primaryColor}`} />,
                title: 'Predictive Insights',
                desc: 'Predict potential health risks using data-driven machine learning models.',
              },
              {
                icon: <ShieldCheck className={`h-10 w-10 md:h-12 md:w-12 ${secondaryColor}`} />,
                title: 'Secure Data',
                desc: 'End-to-end encryption ensures your medical information stays safe.',
              },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                // FIX: Transition is now correctly nested inside whileInView
                whileInView={{ opacity: 1, y: 0, transition: { delay: i * 0.2, duration: 0.6 } }}
                viewport={{ once: true }}

                // === HOVER ANIMATION ===
                whileHover={{
                  scale: 1.05,
                  y: -5,
                  boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2), 0 0 15px rgba(34, 197, 94, 0.5)"
                }}
                transition={{ duration: 0.3 }}
                // =======================

                className="p-8 md:p-10 bg-white rounded-2xl shadow-xl hover:shadow-2xl border border-gray-100 transition-all duration-300 text-left cursor-pointer"
              >
                <div className="flex justify-start mb-4 md:mb-5">{f.icon}</div>
                <h4 className="text-xl md:text-2xl font-bold mb-2 md:mb-3 text-gray-900">{f.title}</h4>
                <p className="text-sm md:text-base text-gray-600">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      

      {/* ===== CTA SECTION (No changes) ===== */}
      <section className="py-16 md:py-24 text-center bg-gradient-to-r from-blue-900 to-green-800 border-t border-white/20 px-6">
        <motion.h3
          className="text-3xl md:text-5xl font-extrabold mb-4 md:mb-6 drop-shadow-md"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          Join the Future of AI Healthcare
        </motion.h3>
        <p className="text-gray-200 mb-8 md:mb-12 max-w-2xl mx-auto text-base md:text-lg">
          Empower your health journey with intelligent insights and cutting-edge AI tools —
          built for patients, doctors, and innovators alike.
        </p>
        <Link href="/signup">
          <Button className="bg-white text-blue-800 hover:bg-gray-100 text-lg md:text-xl px-8 md:px-10 py-4 md:py-5 rounded-full font-bold shadow-2xl shadow-white/40 hover:shadow-white/60 transition duration-300 transform hover:scale-105">
            Get Started Today <ArrowRight className="ml-2 h-5 w-5 md:h-6 md:w-6" />
          </Button>
        </Link>
      </section>


      {/* ===== FOOTER (No changes) ===== */}
      <footer className="bg-black py-8 md:py-10 text-center text-gray-400 text-xs md:text-sm border-t border-gray-800">
        <p>
          © {new Date().getFullYear()} <span className="text-green-400 font-semibold">ScanSehati</span> —
          Empowering AI-driven Healthcare Solutions.
        </p>
        <p className="mt-1 md:mt-2">Built with ❤️ and precision.</p>
      </footer>
    </div>
  );
}