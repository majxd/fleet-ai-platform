import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { getAllAlerts, getAlertStats } from "@/lib/queries/alerts";
import AlertsClient from "./AlertsClient";

export default async function AlertsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations("alerts");
  
  const authSupabase = await createClient();
  const { data: userData } = await authSupabase.auth.getUser();

  if (!userData.user) {
    return null; // The middleware should handle redirecting unauthorized users
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

  const [alerts, stats] = await Promise.all([
    getAllAlerts(companyId),
    getAlertStats(companyId)
  ]);

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>
      </div>

      <AlertsClient initialAlerts={alerts} initialStats={stats} locale={locale} />
    </div>
  );
}
