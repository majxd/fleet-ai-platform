"use client";

import { useTranslations } from "next-intl";
import type { Vehicle } from "@/types/vehicle";
import HealthGauge from "./HealthGauge";

interface VehicleCardProps {
  vehicle: Vehicle;
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  const t = useTranslations("vehicles");

  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold">{vehicle.plate_number}</h3>
          <p className="text-sm text-muted-foreground">
            {vehicle.make} {vehicle.model} — {vehicle.year}
          </p>
        </div>
        <HealthGauge score={vehicle.health_score} />
      </div>
      <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
        <span>{t("status")}: {t(`statuses.${vehicle.status}`)}</span>
      </div>
    </div>
  );
}
