"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  LayoutDashboard,
  Car,
  Bell,
  FileText,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  key: "dashboard" | "vehicles" | "alerts" | "reports" | "settings";
  href: string;
  icon: typeof LayoutDashboard;
  badgeCount?: number;
}

const navItems: NavItem[] = [
  { key: "dashboard", href: "/dashboard", icon: LayoutDashboard },
  { key: "vehicles", href: "/vehicles", icon: Car },
  { key: "alerts", href: "/alerts", icon: Bell, badgeCount: 3 },
  { key: "reports", href: "/reports", icon: FileText },
  { key: "settings", href: "/settings", icon: Settings },
];

import { mockAlertsData } from "@/data/mock-alerts";
import { useAuth } from "@/hooks/useAuth";

interface SidebarProps {
  // props can be added here if needed
}

export default function Sidebar(_props: SidebarProps) {
  const { company } = useAuth();
  const unreadAlertsCount = mockAlertsData.filter(alert => alert.status === "new").length;
  const t = useTranslations("nav");
  const pathname = usePathname();
  const params = useParams();
  const locale = params.locale as string;
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string): boolean => {
    return pathname.includes(href);
  };

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-border/50 px-6">
        <div className="flex shrink-0 h-9 w-9 items-center justify-center rounded-lg bg-[#2471A3] text-white font-bold text-sm">
          FA
        </div>
        <span className="text-xl font-bold truncate" style={{ color: "#2471A3" }}>
          {company?.name || t("title")}
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          const showBadge = item.key === "alerts" && unreadAlertsCount > 0;

          return (
            <Link
              key={item.key}
              href={`/${locale}${item.href}`}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                active
                  ? "bg-[#2471A3]/10 text-[#2471A3]"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5", active && "text-[#2471A3]")} />
              <span className="flex-1">{t(item.key)}</span>
              {showBadge && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#EF4444] px-1.5 text-[10px] font-bold text-white">
                  {unreadAlertsCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border/50 p-4">
        <div className="rounded-lg bg-[#2471A3]/5 p-3">
          <p className="text-xs font-medium text-[#2471A3]">{t("title")}</p>
          <p className="mt-0.5 text-[10px] text-muted-foreground">v0.1.0 — MVP</p>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 start-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-md lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={cn(
          "fixed inset-y-0 start-0 z-50 w-72 transform bg-white shadow-2xl transition-transform duration-300 lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full rtl:translate-x-full"
        )}
      >
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 end-4 rounded-lg p-1.5 hover:bg-accent"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="flex h-full flex-col pt-2">
          {sidebarContent}
        </div>
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex h-screen w-72 flex-col border-e border-border/50 bg-white">
        {sidebarContent}
      </aside>
    </>
  );
}
