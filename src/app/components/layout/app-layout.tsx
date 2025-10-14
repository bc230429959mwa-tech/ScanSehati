'use client';

import * as React from "react";
import { Sidebar, SidebarInset, SidebarProvider, SidebarTrigger } from "@/app/components/ui/sidebar";
import { AppSidebarNav } from "@/app/components/layout/sidebar-nav";
import { Menu } from "lucide-react";
import { useIsMobile } from "@/app/hooks/use-mobile";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        {/* Sidebar: slides in on mobile, always visible on desktop */}
        <Sidebar collapsible="offcanvas">
          <AppSidebarNav />
        </Sidebar>

        {/* Main content */}
        <SidebarInset className="flex flex-1 flex-col">
          {/* Mobile header with hamburger */}
          {isMobile && (
            <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between border-b border-gray-400 bg-white px-4 py-3 text-black md:hidden">
              <h1 className="text-lg font-bold">
                <span className="text-blue-400">Scan</span>
                <span className="text-green-400">Sehati</span>
              </h1>

              {/* Hamburger button triggers mobile sidebar */}
              <SidebarTrigger>
                <Menu size={22} />
              </SidebarTrigger>
            </header>
          )}

          {/* Adjust spacing for mobile header */}
          <main className={`flex-1 overflow-y-auto ${isMobile ? "mt-14" : ""}`}>
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
