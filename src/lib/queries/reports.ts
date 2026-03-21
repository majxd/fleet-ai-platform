import { createClient } from "@/lib/supabase/server";

export async function getReportSummary(companyId: string) {
  const supabase = await createClient();
  
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  
  const [vehiclesResult, alertsResult, maintenanceResult] = await Promise.all([
    supabase.from("vehicles").select("health_score").eq("company_id", companyId),
    supabase.from("alerts").select("severity").eq("company_id", companyId).gte("created_at", startOfMonth),
    supabase.from("maintenance_logs").select("cost").eq("company_id", companyId).gte("created_at", startOfMonth)
  ]);
  
  const vehicles = (vehiclesResult.data as any as { health_score: number }[]) || [];
  const alerts = (alertsResult.data as any as { severity: string }[]) || [];
  const maintenance = (maintenanceResult.data as any as { cost: number }[]) || [];
  
  const totalVehicles = vehicles.length;
  const averageHealth = totalVehicles > 0 
    ? Math.round(vehicles.reduce((sum, v) => sum + v.health_score, 0) / totalVehicles)
    : 0;
    
  const vehiclesNeedingAttention = vehicles.filter((v) => v.health_score < 40).length;
  
  const totalAlerts = alerts.length;
  const criticalAlerts = alerts.filter((a) => a.severity === "critical").length;
  const warningAlerts = alerts.filter((a) => a.severity === "warning").length;
  const infoAlerts = alerts.filter((a) => a.severity === "info").length;
  
  const totalMaintenanceCost = maintenance.reduce((sum, log) => sum + Number(log.cost || 0), 0);
  
  return {
    totalVehicles,
    averageHealth,
    vehiclesNeedingAttention,
    alertsThisMonth: {
      total: totalAlerts,
      critical: criticalAlerts,
      warning: warningAlerts,
      info: infoAlerts
    },
    totalMaintenanceCost
  };
}

export async function getHealthDistribution(companyId: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("vehicles")
    .select("health_score")
    .eq("company_id", companyId);
    
  if (error || !data) return { healthy: 0, warning: 0, critical: 0 };
  const typedData = (data as any as { health_score: number }[]) || [];
  
  return {
    healthy: typedData.filter((v) => v.health_score >= 70).length,
    warning: typedData.filter((v) => v.health_score >= 40 && v.health_score < 70).length,
    critical: typedData.filter((v) => v.health_score < 40).length,
  };
}

export async function getAlertsByType(companyId: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("alerts")
    .select("type")
    .eq("company_id", companyId);
    
  if (error || !data) return [];
  
  const typedData = (data as any as { type: string }[]) || [];
  
  const counts: Record<string, number> = {};
  typedData.forEach((alert) => {
    counts[alert.type] = (counts[alert.type] || 0) + 1;
  });
  
  return Object.entries(counts).map(([type, count]) => ({
    type,
    count
  }));
}

export async function getTopVehiclesNeedingAttention(companyId: string, limit: number = 5) {
  const supabase = await createClient();
  
  const { data: vehicles, error } = await supabase
    .from("vehicles")
    .select("id, plate_number, plate_number_ar, model, health_score")
    .eq("company_id", companyId)
    .order("health_score", { ascending: true })
    .limit(limit);
    
  if (error || !vehicles) return [];
  
  // For each vehicle, fetch active alerts count
  const typedVehicles = (vehicles as any as { id: string, plate_number: string, plate_number_ar: string, model: string, health_score: number }[]) || [];
  
  const vehiclesWithAlerts = await Promise.all(
    typedVehicles.map(async (v) => {
      const { count } = await supabase
        .from("alerts")
        .select("*", { count: "exact", head: true })
        .eq("vehicle_id", v.id)
        .neq("status", "resolved");
        
      return {
        ...v,
        activeAlerts: count || 0
      };
    })
  );
  
  return vehiclesWithAlerts;
}

export async function getRecentMaintenance(companyId: string, limit: number = 10) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("maintenance_logs")
    .select("*, vehicles(plate_number, plate_number_ar, model)")
    .eq("company_id", companyId)
    .order("performed_at", { ascending: false })
    .limit(limit);
    
  if (error || !data) return [];
  
  return data;
}
