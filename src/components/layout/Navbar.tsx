"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Bell, User, LogOut, ChevronDown } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import { mockAlertsData } from "@/data/mock-alerts";
import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
  const t = useTranslations("nav");
  const { profile, company, signOut } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const unreadAlertsCount = mockAlertsData.filter(alert => alert.status === "new").length;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex h-16 items-center justify-between border-b border-border/50 bg-white px-4 lg:px-6">
      {/* Company name — visible on desktop, hidden on mobile for space */}
      <div className="hidden lg:block">
        <h1 className="text-lg font-bold text-foreground">
          {company?.name || t("companyName")}
        </h1>
      </div>
      {/* Spacer for mobile (push items to end) */}
      <div className="lg:hidden" />

      {/* Actions */}
      <div className="flex items-center gap-2">
        <LanguageSwitcher />

        {/* Notification bell */}
        <button
          type="button"
          className="relative rounded-lg p-2 transition-colors hover:bg-accent"
          aria-label={t("notifications")}
        >
          <Bell className="h-5 w-5 text-muted-foreground" />
          {unreadAlertsCount > 0 && (
            <span className="absolute -top-0.5 -end-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#EF4444] px-1 text-[9px] font-bold text-white">
              {unreadAlertsCount}
            </span>
          )}
        </button>

        {/* User dropdown */}
        <div ref={menuRef} className="relative">
          <button
            type="button"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 rounded-lg p-2 transition-colors hover:bg-accent"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2471A3] text-xs font-bold text-white uppercase">
              {profile?.full_name?.charAt(0) || "U"}
            </div>
            <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${userMenuOpen ? "rotate-180" : ""}`} />
          </button>

          {/* Dropdown menu */}
          {userMenuOpen && (
            <div className="absolute end-0 top-full mt-2 w-48 rounded-lg border border-border/50 bg-white py-1 shadow-lg">
              <button
                type="button"
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-accent"
                onClick={() => setUserMenuOpen(false)}
              >
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{t("profile")}</span>
              </button>
              <div className="mx-3 my-1 border-t border-border/50" />
              <button
                type="button"
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-[#EF4444] transition-colors hover:bg-red-50"
                onClick={() => {
                  setUserMenuOpen(false);
                  signOut();
                }}
              >
                <LogOut className="h-4 w-4" />
                <span>{t("logout")}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
