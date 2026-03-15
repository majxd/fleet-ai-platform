import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { getVehicles, getVehicleStats } from "@/lib/queries/vehicles";
import { getRecentAlerts } from "@/lib/queries/alerts";
import FleetStats from "@/components/fleet/FleetStats";
import VehicleCard from "@/components/fleet/VehicleCard";
import RecentAlerts from "@/components/fleet/RecentAlerts";
import type { Vehicle } from "@/types/database";

export default async function DashboardPage() {
  const t = await getTranslations("dashboard");
  const authSupabase = await createClient();

  const { data: userData } = await authSupabase.auth.getUser();
  if (!userData.user) {
    return null; // Handle unauthenticated state if needed
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

  // Fetch all necessary data via server components
  // Utilizing Promise.all for concurrent requests
  const [vehicles, stats, alerts] = await Promise.all([
    getVehicles(companyId),
    getVehicleStats(companyId),
    getRecentAlerts(companyId, 5),
  ]);

  // Map the new vehicles from Database schema mapping to expected by VehicleCard
  const mappedVehicles = vehicles as unknown as Vehicle[];

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
