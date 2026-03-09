"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  LayoutDashboard,
  Car,
  Bell,
  FileText,
  Settings,
} from "lucide-react";

interface SidebarProps {
  locale: string;
}

const navItems = [
  { key: "dashboard", href: "/dashboard", icon: LayoutDashboard },
  { key: "vehicles", href: "/vehicles", icon: Car },
  { key: "alerts", href: "/alerts", icon: Bell },
  { key: "reports", href: "/reports", icon: FileText },
  { key: "settings", href: "/settings", icon: Settings },
] as const;

export default function Sidebar({ locale }: SidebarProps) {
  const t = useTranslations("nav");

  return (
    <aside className="flex h-screen w-64 flex-col border-e bg-sidebar text-sidebar-foreground">
      <div className="flex h-16 items-center border-b px-6">
        <h2 className="text-xl font-bold">FleetAI</h2>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.key}
              href={`/${locale}${item.href}`}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <Icon className="h-5 w-5" />
              <span>{t(item.key)}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
