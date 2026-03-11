"use client";

import { useTranslations } from "next-intl";
import FleetStats from "@/components/fleet/FleetStats";
import VehicleCard from "@/components/fleet/VehicleCard";
import RecentAlerts from "@/components/fleet/RecentAlerts";
import { mockVehicles, mockAlerts } from "@/data/mock-vehicles";

export default function DashboardPage() {
  const t = useTranslations("dashboard");

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground lg:text-3xl">
          {t("title")}
        </h1>
        <p className="mt-1 text-muted-foreground">{t("subtitle")}</p>
      </div>

      {/* Section 1: Stats row */}
      <FleetStats vehicles={mockVehicles} />

      {/* Section 2 + 3: Grid and Alerts side by side on desktop */}
      <div className="grid gap-6 xl:grid-cols-3">
        {/* Fleet grid — takes 2/3 */}
        <div className="xl:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mockVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        </div>

        {/* Recent alerts — takes 1/3 */}
        <div className="xl:col-span-1">
          <RecentAlerts alerts={mockAlerts} />
        </div>
      </div>
    </div>
  );
}
