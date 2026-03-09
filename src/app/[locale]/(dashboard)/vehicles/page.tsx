"use client";

import { useTranslations } from "next-intl";

export default function VehiclesPage() {
  const t = useTranslations("vehicles");

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">{t("title")}</h1>
      <p className="text-muted-foreground">{t("subtitle")}</p>
      {/* Vehicle list + OBD data will be implemented here */}
    </div>
  );
}
