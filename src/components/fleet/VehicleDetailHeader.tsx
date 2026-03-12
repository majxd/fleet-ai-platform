"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import HealthGauge from "./HealthGauge";
import type { Vehicle, HealthStatus } from "@/types/vehicle";

interface VehicleDetailHeaderProps {
  vehicle: Vehicle;
}

function getStatusStyle(status: HealthStatus): {
  bg: string;
  text: string;
  border: string;
} {
  switch (status) {
    case "healthy":
      return { bg: "#22C55E15", text: "#22C55E", border: "#22C55E30" };
    case "warning":
      return { bg: "#EAB30815", text: "#EAB308", border: "#EAB30830" };
    case "critical":
      return { bg: "#EF444415", text: "#EF4444", border: "#EF444430" };
  }
}

export default function VehicleDetailHeader({
  vehicle,
}: VehicleDetailHeaderProps) {
  const t = useTranslations("vehicleDetail");
  const params = useParams();
  const locale = params.locale as string;
  const isRtl = locale === "ar";

  const statusStyle = getStatusStyle(vehicle.health_status);
  const BackArrow = isRtl ? ArrowRight : ArrowLeft;

  return (
    <div className="rounded-xl bg-white p-5 shadow-sm sm:p-6">
      {/* Back button */}
      <Link
        href={`/${locale}/vehicles`}
        className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <BackArrow className="h-4 w-4" />
        <span>{t("backToVehicles")}</span>
      </Link>

      {/* Main header content */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        {/* Left: Vehicle info */}
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            {vehicle.plate_number}
          </h1>
          <p className="mt-1 text-base text-muted-foreground">
            {vehicle.make} {vehicle.model} — {vehicle.year}
          </p>

          {/* Status badge */}
          <div className="mt-3">
            <Badge
              className="px-3 py-1 text-sm font-semibold"
              style={{
                backgroundColor: statusStyle.bg,
                color: statusStyle.text,
                borderColor: statusStyle.border,
              }}
            >
              {t(`statusBadge.${vehicle.health_status}`)}
            </Badge>
          </div>
        </div>

        {/* Right: Large health gauge */}
        <div className="flex items-center justify-center sm:justify-end">
          <HealthGauge score={vehicle.health_score} size={120} />
        </div>
      </div>
    </div>
  );
}
