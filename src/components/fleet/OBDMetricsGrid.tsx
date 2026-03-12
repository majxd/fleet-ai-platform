"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Thermometer,
  Gauge,
  Fuel,
  BatteryMedium,
  Clock,
} from "lucide-react";
import type { Vehicle } from "@/types/vehicle";

type MetricStatus = "normal" | "warning" | "critical";

interface OBDMetric {
  key: string;
  icon: React.ReactNode;
  labelKey: string;
  value: number;
  unitKey: string;
  status: MetricStatus;
}

interface OBDMetricsGridProps {
  vehicle: Vehicle;
  rpm: number;
}

function getEngineStatus(temp: number): MetricStatus {
  if (temp >= 70 && temp <= 95) return "normal";
  if (temp > 95 && temp <= 105) return "warning";
  return "critical";
}

function getRpmStatus(rpm: number): MetricStatus {
  if (rpm < 3000) return "normal";
  if (rpm <= 5000) return "warning";
  return "critical";
}

function getFuelStatus(fuel: number): MetricStatus {
  if (fuel > 30) return "normal";
  if (fuel >= 15) return "warning";
  return "critical";
}

function getBatteryStatus(voltage: number): MetricStatus {
  if (voltage >= 12.4 && voltage <= 14.7) return "normal";
  if (voltage >= 12 && voltage < 12.4) return "warning";
  return "critical";
}

const statusColors: Record<MetricStatus, { bg: string; text: string; dot: string }> = {
  normal: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
  },
  warning: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-500",
  },
  critical: {
    bg: "bg-red-50",
    text: "text-red-700",
    dot: "bg-red-500",
  },
};

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

export default function OBDMetricsGrid({ vehicle, rpm }: OBDMetricsGridProps) {
  const t = useTranslations("vehicleDetail.obd");
  const params = useParams();
  const locale = params.locale as string;
  const [relativeTime, setRelativeTime] = useState("—");

  useEffect(() => {
    if (!vehicle.last_obd_reading_at) {
      setRelativeTime("—");
      return;
    }
    setRelativeTime(
      locale === "ar"
        ? getRelativeTimeAr(vehicle.last_obd_reading_at)
        : getRelativeTimeEn(vehicle.last_obd_reading_at)
    );
  }, [vehicle.last_obd_reading_at, locale]);

  const metrics: OBDMetric[] = [
    {
      key: "engineTemp",
      icon: <Thermometer className="h-5 w-5" />,
      labelKey: "engineTemp",
      value: vehicle.engine_temp,
      unitKey: "unitCelsius",
      status: getEngineStatus(vehicle.engine_temp),
    },
    {
      key: "rpm",
      icon: <Gauge className="h-5 w-5" />,
      labelKey: "rpm",
      value: rpm,
      unitKey: "unitRpm",
      status: getRpmStatus(rpm),
    },
    {
      key: "fuelLevel",
      icon: <Fuel className="h-5 w-5" />,
      labelKey: "fuelLevel",
      value: vehicle.fuel_level,
      unitKey: "unitPercent",
      status: getFuelStatus(vehicle.fuel_level),
    },
    {
      key: "battery",
      icon: <BatteryMedium className="h-5 w-5" />,
      labelKey: "battery",
      value: vehicle.battery_voltage,
      unitKey: "unitVolt",
      status: getBatteryStatus(vehicle.battery_voltage),
    },
  ];

  return (
    <div className="rounded-xl bg-white p-5 shadow-sm sm:p-6">
      {/* Section header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">{t("title")}</h2>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          <span>
            {t("lastUpdate")}: {relativeTime}
          </span>
        </div>
      </div>

      {/* Metric cards grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => {
          const colors = statusColors[metric.status];
          return (
            <div
              key={metric.key}
              className={`rounded-lg p-4 ${colors.bg} transition-all`}
            >
              {/* Icon + label */}
              <div className="flex items-center gap-2 mb-3">
                <span className={colors.text}>{metric.icon}</span>
                <span className="text-sm font-medium text-muted-foreground">
                  {t(metric.labelKey)}
                </span>
              </div>

              {/* Value */}
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold text-foreground">
                  {metric.value}
                </span>
                <span className="text-sm text-muted-foreground">
                  {t(metric.unitKey)}
                </span>
              </div>

              {/* Status indicator */}
              <div className="mt-2 flex items-center gap-1.5">
                <span
                  className={`inline-block h-2 w-2 rounded-full ${colors.dot}`}
                />
                <span className={`text-xs font-medium ${colors.text}`}>
                  {t(metric.status)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
