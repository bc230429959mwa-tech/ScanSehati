'use client';

import * as React from "react";
import {
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
} from '@/app/components/ui/sidebar';
import { Logo } from '@/app/components/logo';
import {
  LayoutDashboard,
  HeartPulse,
  Users,
  Settings,
  LifeBuoy,
  MessageCircle,
  Stethoscope,
  Info,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { LanguageSwitcher } from '../language-switcher';
import { useSession } from 'next-auth/react';

export function AppSidebarNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = session?.user?.role;

  const commonItems = [
    { href: '/chatbot', label: 'AI Chatbot', icon: MessageCircle },
    { href: '/how-it-works', label: 'How It Works', icon: Users },
    { href: '/about-us', label: 'About Us', icon: Info },
  ];

  const roleBasedItems: Record<string, { href: string; label: string; icon: any }[]> = {
    doctor: [{ href: '/for-doctors', label: 'Doctor Dashboard', icon: Stethoscope }],
    pharmacist: [{ href: '/for-pharmacists', label: 'Pharmacist Dashboard', icon: Stethoscope }],
    patient: [
      { href: '/', label: 'Patient Dashboard', icon: LayoutDashboard },
      { href: '/for-patients', label: 'Patient Overview', icon: Users },
      { href: '/interaction-check', label: 'Interaction Check', icon: HeartPulse },
    ],
  };

  const menuItems = [
    ...(role && roleBasedItems[role] ? roleBasedItems[role] : []),
    ...commonItems,
  ];

  const bottomMenuItems = [
    { href: '/settings', label: 'Settings', icon: Settings },
    { href: '/help', label: 'Help & Support', icon: LifeBuoy },
  ];

  return (
    <div className="flex flex-col h-full">
      <SidebarHeader className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between">
          <Logo />
          <LanguageSwitcher />
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2 flex-1 overflow-y-auto">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton href={item.href} isActive={pathname === item.href} asChild>
                <a href={item.href} className="flex items-center gap-2">
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-2 border-t border-border">
        <SidebarMenu>
          {bottomMenuItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton href={item.href} isActive={pathname === item.href} asChild>
                <a href={item.href} className="flex items-center gap-2">
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>
    </div>
  );
}
