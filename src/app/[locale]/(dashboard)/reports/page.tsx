"use client";

import { useTranslations } from "next-intl";

export default function ReportsPage() {
  const t = useTranslations("reports");

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">{t("title")}</h1>
      <p className="text-muted-foreground">{t("subtitle")}</p>
      {/* PDF weekly summary reports will be implemented here */}
    </div>
  );
}
