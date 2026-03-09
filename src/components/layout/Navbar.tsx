"use client";

import { useTranslations } from "next-intl";
import { Bell, User } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
  const t = useTranslations("nav");

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6">
      <div>
        <h1 className="text-lg font-semibold">{t("title")}</h1>
      </div>
      <div className="flex items-center gap-4">
        <LanguageSwitcher />
        <button
          type="button"
          className="rounded-md p-2 transition-colors hover:bg-accent"
          aria-label={t("notifications")}
        >
          <Bell className="h-5 w-5" />
        </button>
        <button
          type="button"
          className="rounded-md p-2 transition-colors hover:bg-accent"
          aria-label={t("profile")}
        >
          <User className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
