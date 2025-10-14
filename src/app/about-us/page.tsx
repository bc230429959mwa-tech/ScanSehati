'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Github, Linkedin, Twitter } from 'lucide-react';
import Image from 'next/image';

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 text-gray-800 dark:text-gray-200">
      {/* Hero Section */}
      <section className="relative py-24 px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-bold mb-4"
        >
          About <span className="text-blue-600">Us</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg max-w-2xl mx-auto text-gray-600 dark:text-gray-400"
        >
          We’re on a mission to revolutionize digital healthcare — connecting patients and doctors through technology that feels human.
        </motion.p>
      </section>

      {/* Company Mission */}
      <section className="max-w-5xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Our Mission
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
            At our core, we believe healthcare should be simple, transparent, and empowering. 
            Our platform bridges communication between patients and doctors, turning complex medical journeys into smoother experiences.
          </p>
          <p className="mt-4 text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
            We combine innovation with empathy to deliver a platform that not only works — but makes a difference.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center"
        >
          <Image
            src="/company.jpg" // replace with your image
            alt="Mission illustration"
            width={450}
            height={300}
            className="rounded-2xl shadow-lg object-cover"
          />
        </motion.div>
      </section>

      {/* Values Section */}
      <section className="bg-white dark:bg-gray-900 py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold mb-12">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Innovation',
                desc: 'We never stop improving. Each feature is built to move healthcare forward.',
              },
              {
                title: 'Empathy',
                desc: 'Every decision starts with understanding the needs of patients and doctors.',
              },
              {
                title: 'Integrity',
                desc: 'Trust is our foundation — in our code, data, and communication.',
              },
            ].map((v, i) => (
              <Card
                key={i}
                className="shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800"
              >
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3 text-blue-600 dark:text-blue-400">
                    {v.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">{v.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CEO / Team Section */}
     <section className="py-20 px-6 max-w-3xl mx-auto text-center">
  <motion.h2
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="text-4xl font-semibold mb-10 tracking-tight"
  >
    Meet Our Founder
  </motion.h2>

  <div className="flex flex-col items-center text-center space-y-6">
    <div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        Dr. Noha
      </h3>
      <p className="text-gray-500 dark:text-gray-400 text-lg">
        Founder & Chief Executive Officer
      </p>
    </div>

    <p className="text-gray-600 dark:text-gray-300 max-w-xl leading-relaxed">
      Passionate about bridging technology and healthcare. Leading with empathy,
      driven by innovation, and focused on creating real-world impact that
      empowers better patient outcomes through intelligent digital solutions.
    </p>

    {/* Social Links */}
   
  </div>
</section>


      {/* Footer */}
      <footer className="py-10 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} ScanSehati — All rights reserved.
      </footer>
    </div>
  );
}
