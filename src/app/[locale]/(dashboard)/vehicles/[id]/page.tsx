import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { getVehicleById } from "@/lib/queries/vehicles";
import { getLatestOBDReading, getOBDHistory } from "@/lib/queries/obd";
import { getActiveDTCCodes } from "@/lib/queries/dtc";
import { getMaintenanceLogs } from "@/lib/queries/maintenance";
import VehicleDetailHeader from "@/components/fleet/VehicleDetailHeader";
import OBDMetricsGrid from "@/components/fleet/OBDMetricsGrid";
import HealthHistoryChart from "@/components/fleet/HealthHistoryChart";
import DTCCodesTable, { DTCFaultDisplay } from "@/components/fleet/DTCCodesTable";
import MaintenanceTimeline from "@/components/fleet/MaintenanceTimeline";
import type { HealthHistoryPoint } from "@/types/vehicle";

export default async function VehicleDetailPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id: vehicleId, locale } = await params;

  const t = await getTranslations({
    locale,
    namespace: "common",
  });

  // IMPORTANT: evaluate cookies before Promise.all
  const supabase = await createClient();
  await supabase.auth.getUser();

  // Fetch all concurrent data
  const [vehicle, obdReading, obdHistory, dtcCodes, maintenanceLogs] = await Promise.all([
    getVehicleById(vehicleId),
    getLatestOBDReading(vehicleId),
    getOBDHistory(vehicleId, 30), // Get 30 days of history
    getActiveDTCCodes(vehicleId),
    getMaintenanceLogs(vehicleId),
  ]);

  if (!vehicle) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">404</h1>
          <p className="text-muted-foreground">{t("error")}</p>
        </div>
      </div>
    );
  }

  // Transform OBD history into HealthHistoryPoint shape for the chart
  const healthHistory: HealthHistoryPoint[] = obdHistory
    .map(reading => ({
      date: new Date(reading.created_at).toISOString().split('T')[0],
      score: 100 - ((reading.engine_temp ?? 0) > 95 ? 10 : 0) - (reading.dtc_codes && reading.dtc_codes.length > 0 ? 20 : 0) // rough proxy for score historically since we don't store historical score explicitly
    }))
    .reverse(); // oldest first for the chart

  const OBDTimestamp = (obdReading as { timestamp?: string } | null)?.timestamp;
  // Map DTCCodes to DTCFaultDisplay to allow passing the matched detected_at from latest OBD reading
  const mappedDtcCodes: DTCFaultDisplay[] = dtcCodes.map(code => ({
    ...code,
    detected_at: OBDTimestamp 
      ? new Date(OBDTimestamp).toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US")
      : undefined
  }));

  return (
    <div className="space-y-6">
      {/* Section 1: Header */}
      <VehicleDetailHeader vehicle={vehicle} />

      {/* Section 2: Live OBD Data */}
      <OBDMetricsGrid obdReading={obdReading} />

      {/* Section 3: Health History Chart */}
      <HealthHistoryChart data={healthHistory} />

      {/* Section 4: DTC Fault Codes */}
      <DTCCodesTable faults={mappedDtcCodes} />

      {/* Section 5: Maintenance Timeline */}
      <MaintenanceTimeline events={maintenanceLogs} />
    </div>
  );
}
