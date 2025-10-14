
'use client';

import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  HeartPulse,
  Users,
  MessageCircle,
} from 'lucide-react';

const menuItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/chatbot', label: 'AI Chatbot', icon: MessageCircle },
  { href: '/for-professionals', label: 'For Professionals', icon: HeartPulse },
  { href: '/for-patients', label: 'For Patients', icon: Users },
];

interface TopNavProps {
    className?: string;
    isMobile?: boolean;
}

export function TopNav({ className, isMobile = false }: TopNavProps) {
  const pathname = usePathname();

  return (
    <nav className={cn('flex items-center space-x-2 lg:space-x-4', className, isMobile && "flex-col space-x-0 space-y-2 items-start w-full")}>
      {menuItems.map((item) => (
        <a
          key={item.href}
          href={item.href}
          className={cn(
            'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
            pathname === item.href
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:bg-transparent hover:text-foreground',
            isMobile && 'w-full'
          )}
        >
          <item.icon className="h-4 w-4" />
          <span>{item.label}</span>
        </a>
      ))}
    </nav>
  );
}
