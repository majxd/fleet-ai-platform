import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { getVehicles } from "@/lib/queries/vehicles";
import VehiclesClient from "@/app/[locale]/(dashboard)/vehicles/VehiclesClient";
import type { Vehicle } from "@/types/database";

export default async function VehiclesPage() {
  const t = await getTranslations("vehicles");
  const authSupabase = await createClient();

  const { data: userData } = await authSupabase.auth.getUser();
  if (!userData.user) {
    return null;
  }

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

  const vehicles = await getVehicles(companyId);

  return (
    <div className="space-y-6">
      <VehiclesClient initialVehicles={vehicles as unknown as Vehicle[]} />
    </div>
  );
}
