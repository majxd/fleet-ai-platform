"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle } from "lucide-react";
import type { DTCFault } from "@/types/vehicle";

interface DTCCodesTableProps {
  faults: DTCFault[];
}

const severityStyles: Record<
  "critical" | "warning",
  { bg: string; text: string; border: string }
> = {
  critical: { bg: "#EF444415", text: "#EF4444", border: "#EF444430" },
  warning: { bg: "#EAB30815", text: "#EAB308", border: "#EAB30830" },
};

export default function DTCCodesTable({ faults }: DTCCodesTableProps) {
  const t = useTranslations("vehicleDetail.dtc");
  const params = useParams();
  const locale = params.locale as string;

  // Empty state
  if (faults.length === 0) {
    return (
      <div className="rounded-xl bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-bold text-foreground mb-4">
          {t("title")}
        </h2>
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <CheckCircle className="h-12 w-12 text-emerald-400 mb-3" />
          <p className="text-muted-foreground">{t("empty")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-amber-500" />
        <h2 className="text-lg font-bold text-foreground">{t("title")}</h2>
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="pb-3 text-start font-semibold text-muted-foreground">
                {t("code")}
              </th>
              <th className="pb-3 text-start font-semibold text-muted-foreground">
                {t("description")}
              </th>
              <th className="pb-3 text-start font-semibold text-muted-foreground">
                {t("severity")}
              </th>
              <th className="pb-3 text-start font-semibold text-muted-foreground">
                {t("date")}
              </th>
            </tr>
          </thead>
          <tbody>
            {faults.map((fault) => {
              const style = severityStyles[fault.severity];
              return (
                <tr
                  key={fault.code}
                  className="border-b border-gray-50 last:border-0"
                >
                  <td className="py-3 font-mono font-bold text-foreground">
                    {fault.code}
                  </td>
                  <td className="py-3 text-muted-foreground">
                    {locale === "ar"
                      ? fault.description_ar
                      : fault.description_en}
                  </td>
                  <td className="py-3">
                    <Badge
                      className="text-xs font-semibold"
                      style={{
                        backgroundColor: style.bg,
                        color: style.text,
                        borderColor: style.border,
                      }}
                    >
                      {t(fault.severity)}
                    </Badge>
                  </td>
                  <td className="py-3 text-muted-foreground">
                    {fault.detected_at}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden space-y-3">
        {faults.map((fault) => {
          const style = severityStyles[fault.severity];
          return (
            <div
              key={fault.code}
              className="rounded-lg border border-gray-100 p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono font-bold text-foreground text-lg">
                  {fault.code}
                </span>
                <Badge
                  className="text-xs font-semibold"
                  style={{
                    backgroundColor: style.bg,
                    color: style.text,
                    borderColor: style.border,
                  }}
                >
                  {t(fault.severity)}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-1">
                {locale === "ar"
                  ? fault.description_ar
                  : fault.description_en}
              </p>
              <p className="text-xs text-muted-foreground">
                {t("date")}: {fault.detected_at}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
