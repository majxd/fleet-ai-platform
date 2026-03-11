"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Vehicle, HealthStatus } from "@/types/vehicle";
import HealthGauge from "./HealthGauge";

interface VehicleCardProps {
  vehicle: Vehicle;
}

function getStatusBadgeVariant(status: HealthStatus): "default" | "secondary" | "destructive" {
  switch (status) {
    case "healthy":
      return "default";
    case "warning":
      return "secondary";
    case "critical":
      return "destructive";
  }
}

function getStatusColor(status: HealthStatus): string {
  switch (status) {
    case "healthy":
      return "#22C55E";
    case "warning":
      return "#EAB308";
    case "critical":
      return "#EF4444";
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

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  const t = useTranslations("dashboard");
  const params = useParams();
  const locale = params.locale as string;
  const [relativeTime, setRelativeTime] = useState("—");

  useEffect(() => {
    const computeTime = () => {
      if (!vehicle.last_obd_reading_at) {
        setRelativeTime(t("noData"));
        return;
      }
      setRelativeTime(
        locale === "ar"
          ? getRelativeTimeAr(vehicle.last_obd_reading_at)
          : getRelativeTimeEn(vehicle.last_obd_reading_at)
      );
    };
    computeTime();
  }, [vehicle.last_obd_reading_at, locale, t]);

  const statusKey = vehicle.health_status;
  const statusColor = getStatusColor(statusKey);

  return (
    <Link href={`/${locale}/vehicles/${vehicle.id}`}>
      <div className="group rounded-xl bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-lg hover:scale-[1.02] cursor-pointer">
        {/* Top row: plate + gauge */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-foreground tracking-wide">
              {vehicle.plate_number}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {vehicle.make} {vehicle.model} — {vehicle.year}
            </p>
          </div>
          <HealthGauge score={vehicle.health_score} size={56} />
        </div>

        {/* Bottom row: status badge + last updated */}
        <div className="mt-4 flex items-center justify-between">
          <Badge
            variant={getStatusBadgeVariant(statusKey)}
            className="text-xs font-semibold"
            style={{
              backgroundColor: `${statusColor}15`,
              color: statusColor,
              borderColor: `${statusColor}30`,
            }}
          >
            {t(`statuses.${statusKey}`)}
          </Badge>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>{relativeTime}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
