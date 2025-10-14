"use client";

import { motion } from "framer-motion";
import { HeartPulse } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function PageLoader() {
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  // Simulate loader for route transitions
  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 800); // Adjust timing
    return () => clearTimeout(timeout);
  }, [pathname]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-gray-900">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <HeartPulse className="w-14 h-14 text-blue-600 dark:text-blue-400" />
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-6 text-lg font-medium text-gray-700 dark:text-gray-300"
      >
        Loading Scan<span className="text-blue-600">Sehati</span>...
      </motion.p>
    </div>
  );
}
