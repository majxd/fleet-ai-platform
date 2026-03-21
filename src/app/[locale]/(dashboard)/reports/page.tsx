import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { 
  getReportSummary, 
  getHealthDistribution, 
  getAlertsByType, 
  getTopVehiclesNeedingAttention, 
  getRecentMaintenance 
} from "@/lib/queries/reports";
import ReportsClient from "./ReportsClient";

export default async function ReportsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations("reports");

  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) return null;

  const { data: userProfile } = await supabase
    .from("users")
    .select("company_id")
    .eq("id", userData.user.id)
    .single();

  const userProfileData = userProfile as { company_id: string } | null;
  const companyId = userProfileData?.company_id;

  if (!companyId) {
    return <div>Error loading user data</div>;
  }

  const { data: companyData } = await supabase
    .from("companies")
    .select("name, name_ar")
    .eq("id", companyId)
    .single();

  const [
    summary,
    healthDistribution,
    alertsByType,
    topVehicles,
    recentMaintenance
  ] = await Promise.all([
    getReportSummary(companyId),
    getHealthDistribution(companyId),
    getAlertsByType(companyId),
    getTopVehiclesNeedingAttention(companyId, 5),
    getRecentMaintenance(companyId, 10)
  ]);

  const typedCompanyData = companyData as { name: string; name_ar: string } | null;

  const companyName = locale === "ar" 
    ? (typedCompanyData?.name_ar || typedCompanyData?.name || "شركة منصة الأسطول") 
    : (typedCompanyData?.name || typedCompanyData?.name_ar || "Fleet Platform Company");

  return (
    <ReportsClient 
      summary={summary}
      healthDistribution={healthDistribution}
      alertsByType={alertsByType}
      topVehicles={topVehicles}
      recentMaintenance={recentMaintenance}
      locale={locale}
      companyName={companyName}
    />
  );
}
