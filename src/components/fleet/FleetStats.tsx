"use client";

import { useTranslations } from "next-intl";
import { Car, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import type { Vehicle } from "@/types/vehicle";

interface StatCardConfig {
  labelKey: string;
  value: number;
  percentage: number;
  icon: typeof Car;
  color: string;
  bgColor: string;
}

interface FleetStatsProps {
  vehicles: Vehicle[];
}

export default function FleetStats({ vehicles }: FleetStatsProps) {
  const t = useTranslations("dashboard");

  const total = vehicles.length;
  const healthy = vehicles.filter((v) => v.health_score > 70).length;
  const warning = vehicles.filter((v) => v.health_score >= 40 && v.health_score <= 70).length;
  const critical = vehicles.filter((v) => v.health_score < 40).length;

  const stats: StatCardConfig[] = [
    {
      labelKey: "stats.totalVehicles",
      value: total,
      percentage: 100,
      icon: Car,
      color: "#2471A3",
      bgColor: "rgba(36, 113, 163, 0.08)",
    },
    {
      labelKey: "stats.healthy",
      value: healthy,
      percentage: total > 0 ? Math.round((healthy / total) * 100) : 0,
      icon: CheckCircle,
      color: "#22C55E",
      bgColor: "rgba(34, 197, 94, 0.08)",
    },
    {
      labelKey: "stats.warning",
      value: warning,
      percentage: total > 0 ? Math.round((warning / total) * 100) : 0,
      icon: AlertTriangle,
      color: "#EAB308",
      bgColor: "rgba(234, 179, 8, 0.08)",
    },
    {
      labelKey: "stats.critical",
      value: critical,
      percentage: total > 0 ? Math.round((critical / total) * 100) : 0,
      icon: XCircle,
      color: "#EF4444",
      bgColor: "rgba(239, 68, 68, 0.08)",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.labelKey}
            className="rounded-xl bg-white p-5 shadow-sm transition-shadow duration-200 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg"
                style={{ backgroundColor: stat.bgColor }}
              >
                <Icon className="h-5 w-5" style={{ color: stat.color }} />
              </div>
              <span
                className="text-xs font-semibold rounded-full px-2 py-0.5"
                style={{
                  color: stat.color,
                  backgroundColor: stat.bgColor,
                }}
              >
                {stat.percentage}%
              </span>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {t(stat.labelKey)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
