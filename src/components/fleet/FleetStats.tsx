"use client";

import { useTranslations } from "next-intl";
import { Car, AlertTriangle, Activity } from "lucide-react";

interface FleetStatsProps {
  totalVehicles: number;
  activeAlerts: number;
  averageHealth: number;
}

export default function FleetStats({
  totalVehicles,
  activeAlerts,
  averageHealth,
}: FleetStatsProps) {
  const t = useTranslations("dashboard");

  const stats = [
    {
      label: t("stats.totalVehicles"),
      value: totalVehicles,
      icon: Car,
    },
    {
      label: t("stats.activeAlerts"),
      value: activeAlerts,
      icon: AlertTriangle,
    },
    {
      label: t("stats.averageHealth"),
      value: averageHealth,
      icon: Activity,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="rounded-lg border bg-card p-6 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <Icon className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {stat.label}
              </span>
            </div>
            <p className="mt-2 text-3xl font-bold">{stat.value}</p>
          </div>
        );
      })}
    </div>
  );
}
