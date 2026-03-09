"use client";

import { useTranslations } from "next-intl";

export default function SettingsPage() {
  const t = useTranslations("settings");

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">{t("title")}</h1>
      <p className="text-muted-foreground">{t("subtitle")}</p>
      {/* Company + team management settings will be implemented here */}
    </div>
  );
}
