"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { AlertTriangle, XCircle, Info, ArrowLeft, ArrowRight, Clock } from "lucide-react";
import type { Alert, AlertSeverity } from "@/types/alert";

interface RecentAlertsProps {
  alerts: Alert[];
}

function getSeverityIcon(severity: AlertSeverity) {
  switch (severity) {
    case "critical":
      return XCircle;
    case "warning":
      return AlertTriangle;
    case "info":
      return Info;
  }
}

function getSeverityColor(severity: AlertSeverity): string {
  switch (severity) {
    case "critical":
      return "#EF4444";
    case "warning":
      return "#EAB308";
    case "info":
      return "#2471A3";
  }
}

function getRelativeTimeAr(dateString: string): string {
  const now = Date.now();
  const diff = now - new Date(dateString).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);

  if (minutes < 1) return "الآن";
  if (minutes < 60) return `منذ ${minutes} دقائق`;
  if (hours < 24) return `منذ ${hours} ساعات`;
  return `منذ ${Math.floor(hours / 24)} أيام`;
}

function getRelativeTimeEn(dateString: string): string {
  const now = Date.now();
  const diff = now - new Date(dateString).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function RecentAlerts({ alerts }: RecentAlertsProps) {
  const t = useTranslations("dashboard");
  const params = useParams();
  const locale = params.locale as string;
  const isRtl = locale === "ar";
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className="rounded-xl bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-foreground">
          {t("recentAlerts")}
        </h2>
        <Link
          href={`/${locale}/alerts`}
          className="flex items-center gap-1 text-sm font-medium text-[#2471A3] transition-colors hover:text-[#1a5276]"
        >
          <span>{t("viewAll")}</span>
          <ArrowIcon className="h-4 w-4" />
        </Link>
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => {
          const Icon = getSeverityIcon(alert.severity);
          const color = getSeverityColor(alert.severity);
          const relativeTime = isRtl
            ? getRelativeTimeAr(alert.created_at)
            : getRelativeTimeEn(alert.created_at);

          return (
            <div
              key={alert.id}
              className="flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-gray-50"
            >
              <div
                className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${color}12` }}
              >
                <Icon className="h-4 w-4" style={{ color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {alert.message}
                </p>
                <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-medium">{alert.vehicle_plate}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{relativeTime}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
