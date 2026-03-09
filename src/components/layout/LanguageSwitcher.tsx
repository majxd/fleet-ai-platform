"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { Globe } from "lucide-react";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations("common");
  const router = useRouter();
  const pathname = usePathname();

  const toggleLocale = () => {
    const newLocale = locale === "ar" ? "en" : "ar";
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  return (
    <button
      type="button"
      onClick={toggleLocale}
      className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent"
      aria-label={t("switchLanguage")}
    >
      <Globe className="h-4 w-4" />
      <span>{locale === "ar" ? "English" : "العربية"}</span>
    </button>
  );
}
