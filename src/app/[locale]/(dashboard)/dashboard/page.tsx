import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { getVehicles, getVehicleStats } from "@/lib/queries/vehicles";
import { getRecentAlerts } from "@/lib/queries/alerts";
import { getLatestOBDTimestampsForVehicles } from "@/lib/queries/obd";
import FleetStats from "@/components/fleet/FleetStats";
import VehicleCard from "@/components/fleet/VehicleCard";
import RecentAlerts from "@/components/fleet/RecentAlerts";
import type { Vehicle } from "@/types/database";
import DashboardRealtime from "./DashboardRealtime";

export default async function DashboardPage() {
  const t = await getTranslations("dashboard");
  const authSupabase = await createClient();

  const { data: userData } = await authSupabase.auth.getUser();
  if (!userData.user) {
    return null;
  }

  // Get user's company ID
  const { data: userProfile } = await authSupabase
    .from("users")
    .select("company_id")
    .eq("id", userData.user.id)
    .single();

  const userProfileData = userProfile as { company_id: string } | null;
  const companyId = userProfileData?.company_id;

  if (!companyId) {
    return <div>Error loading user data</div>;
  }

  // Fetch all necessary data concurrently
  const [vehicles, stats, alerts] = await Promise.all([
    getVehicles(companyId),
    getVehicleStats(companyId),
    getRecentAlerts(companyId, 5),
  ]);

  // Fetch latest OBD timestamps for all vehicles in a single query (fixes "لا توجد بيانات")
  const vehicleIds = (vehicles as unknown as Vehicle[]).map((v) => v.id);
  const obdTimestamps = await getLatestOBDTimestampsForVehicles(vehicleIds);

  // Merge OBD timestamps into vehicles — backfills last_obd_reading_at if DB column is null
  const mappedVehicles: Vehicle[] = (vehicles as unknown as Vehicle[]).map((v) => ({
    ...v,
    last_obd_reading_at: obdTimestamps[v.id] ?? v.last_obd_reading_at,
  }));

  return (
    <div className="space-y-6">
      <DashboardRealtime />
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground lg:text-3xl">
          {t("title")}
        </h1>
        <p className="mt-1 text-muted-foreground">{t("subtitle")}</p>
      </div>

      {/* Section 1: Stats row */}
      <FleetStats vehicles={mappedVehicles} />

      {/* Section 2 + 3: Grid and Alerts side by side on desktop */}
      <div className="grid gap-6 xl:grid-cols-3">
        {/* Fleet grid — takes 2/3 */}
        <div className="xl:col-span-2">
          {mappedVehicles.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {mappedVehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle as any} />
              ))}
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-xl bg-white border border-dashed border-gray-200 text-muted-foreground">
              {t("noVehicles")}
            </div>
          )}
        </div>

        {/* Recent alerts — takes 1/3 */}
        <div className="xl:col-span-1">
          <RecentAlerts alerts={alerts as any} />
        </div>
      </div>
    </div>
  );
}
