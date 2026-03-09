"use client";

import { useTranslations } from "next-intl";

export default function AlertsPage() {
  const t = useTranslations("alerts");

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">{t("title")}</h1>
      <p className="text-muted-foreground">{t("subtitle")}</p>
      {/* Alerts system + WhatsApp notifications will be implemented here */}
    </div>
  );
}
