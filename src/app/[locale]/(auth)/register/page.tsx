"use client";

import { useTranslations } from "next-intl";

export default function RegisterPage() {
  const t = useTranslations("auth");

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md rounded-lg border bg-card p-8 shadow-sm">
        <h1 className="mb-6 text-center text-2xl font-bold">
          {t("register.title")}
        </h1>
        <p className="text-center text-muted-foreground">
          {t("register.subtitle")}
        </p>
        {/* Registration form will be implemented here */}
      </div>
    </div>
  );
}
