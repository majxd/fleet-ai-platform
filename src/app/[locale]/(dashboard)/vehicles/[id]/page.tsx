"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { getVehicleDetail } from "@/data/mock-vehicle-detail";
import VehicleDetailHeader from "@/components/fleet/VehicleDetailHeader";
import OBDMetricsGrid from "@/components/fleet/OBDMetricsGrid";
import HealthHistoryChart from "@/components/fleet/HealthHistoryChart";
import DTCCodesTable from "@/components/fleet/DTCCodesTable";
import MaintenanceTimeline from "@/components/fleet/MaintenanceTimeline";

export default function VehicleDetailPage() {
  const params = useParams();
  const t = useTranslations("common");
  const vehicleId = params.id as string;

  const detail = getVehicleDetail(vehicleId);

  // Vehicle not found
  if (!detail) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">404</h1>
          <p className="text-muted-foreground">{t("error")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Section 1: Header */}
      <VehicleDetailHeader vehicle={detail.vehicle} />

      {/* Section 2: Live OBD Data */}
      <OBDMetricsGrid vehicle={detail.vehicle} rpm={detail.rpm} />

      {/* Section 3: Health History Chart */}
      <HealthHistoryChart data={detail.healthHistory} />

      {/* Section 4: DTC Fault Codes */}
      <DTCCodesTable faults={detail.dtcFaults} />

      {/* Section 5: Maintenance Timeline */}
      <MaintenanceTimeline events={detail.maintenanceHistory} />
    </div>
  );
}
