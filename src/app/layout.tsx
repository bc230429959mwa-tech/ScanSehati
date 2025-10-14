import type { Metadata } from "next";
import "./globals.css";

import { Toaster } from "@/app/components/ui/toaster";
import NextAuthSessionProvider from "../SessionProvider";
import ConditionalLayout from "@/app/components/layout/ConditionalLayout"; // 👈 new import
import PageLoader from "./components/layout/PageLoader";

export const metadata: Metadata = {
  title: "ScanSehati",
  description: "AI-Powered Drug Interaction and Risk Prediction Platform",
  icons: {
    icon: '/Capture.PNG', // <-- your favicon path
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <NextAuthSessionProvider>
          <PageLoader/>
          <ConditionalLayout>{children}</ConditionalLayout>
          <Toaster />
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
