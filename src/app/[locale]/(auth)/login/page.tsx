"use client";

import { useTranslations } from "next-intl";

export default function LoginPage() {
  const t = useTranslations("auth");

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md rounded-lg border bg-card p-8 shadow-sm">
        <h1 className="mb-6 text-center text-2xl font-bold">
          {t("login.title")}
        </h1>
        <p className="text-center text-muted-foreground">
          {t("login.subtitle")}
        </p>
        {/* Login form will be implemented here */}
      </div>
    </div>
  );
}
