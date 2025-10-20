import type { Metadata } from "next";
import { Inter } from "next/font/google"; // ✅ built-in safe loader
import "./globals.css";

import { Toaster } from "@/app/components/ui/toaster";
import NextAuthSessionProvider from "../SessionProvider";
import ConditionalLayout from "@/app/components/layout/ConditionalLayout";
import PageLoader from "./components/layout/PageLoader";

// ✅ Load Inter safely (Next.js hosts it locally)
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ScanSehati",
  description: "AI-Powered Drug Interaction and Risk Prediction Platform",
  icons: {
    icon: '/Capture.PNG',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} font-body antialiased`}>
        <NextAuthSessionProvider>
          <PageLoader />
          <ConditionalLayout>{children}</ConditionalLayout>
          <Toaster />
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
