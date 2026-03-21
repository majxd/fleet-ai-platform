"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Download,
  Calendar,
  Car,
  Activity,
  BellRing,
  AlertTriangle,
  FileBarChart,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { generateWeeklyReport } from "@/lib/generate-report";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

function getStatusIcon(status: string) {
  switch (status) {
    case "ready":
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    case "generating":
      return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
    case "failed":
      return <XCircle className="h-4 w-4 text-red-500" />;
    default:
      return null;
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "ready":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200";
    case "generating":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-200";
    case "failed":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

const HEALTH_COLORS = {
  healthy: "#22c55e",
  warning: "#eab308",
  critical: "#ef4444"
};

export default function ReportsClient({
  summary,
  healthDistribution,
  alertsByType,
  topVehicles,
  recentMaintenance,
  locale,
  companyName
}: {
  summary: any;
  healthDistribution: any;
  alertsByType: any[];
  topVehicles: any[];
  recentMaintenance: any[];
  locale: string;
  companyName: string;
}) {
  const t = useTranslations("reports");
  const isRtl = locale === "ar";
  const [isGenerating, setIsGenerating] = useState(false);

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat(locale, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    }).format(new Date(dateString));
  };

  const handleGenerateWeeklyReport = async () => {
    try {
      setIsGenerating(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      generateWeeklyReport({
        locale: locale as "ar" | "en",
        companyName,
        dateRange: formatDate(new Date().toISOString()),
        // In a real app we'd pass the actual data here to jsPDF
      });
      
      window.alert(isRtl ? "تم استخراج تقرير الأسطول الأسبوعي" : "Weekly Fleet Summary generated successfully");
    } catch (error) {
      window.alert(isRtl ? "فشل إنشاء التقرير" : "Failed to generate report");
    } finally {
      setIsGenerating(false);
    }
  };

  const healthData = [
    { name: t("statuses.healthy") || "Healthy", value: healthDistribution.healthy, color: HEALTH_COLORS.healthy },
    { name: t("statuses.warning") || "Warning", value: healthDistribution.warning, color: HEALTH_COLORS.warning },
    { name: t("statuses.critical") || "Critical", value: healthDistribution.critical, color: HEALTH_COLORS.critical },
  ].filter(d => d.value > 0);

  const alertsData = alertsByType.map(a => ({
    name: a.type,
    count: a.count
  }));

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground mt-1">{t("subtitle")}</p>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("totalVehicles")}</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalVehicles}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("averageHealth")}</CardTitle>
            <Activity className="h-4 w-4 text-[#2471A3]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#2471A3]">{summary.averageHealth}%</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("alertsThisMonth") || "Alerts This Month"}</CardTitle>
            <BellRing className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.alertsThisMonth.total}</div>
            <div className="flex gap-2 mt-1">
              <span className="text-xs text-red-500">{summary.alertsThisMonth.critical} {t("statuses.critical") || "Critical"}</span>
              <span className="text-xs text-yellow-500">{summary.alertsThisMonth.warning} {t("statuses.warning") || "Warning"}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("needsAttention")}</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{summary.vehiclesNeedingAttention}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("maintenanceCost") || "Maintenance Cost"}</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalMaintenanceCost.toLocaleString()} SAR</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        {/* HEALTH DISTRIBUTION CHART */}
        <Card>
          <CardHeader>
            <CardTitle>{t("healthDistribution") || "Health Distribution"}</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {healthData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={healthData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  >
                    {healthData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                {t("noData")}
              </div>
            )}
          </CardContent>
        </Card>

        {/* ALERTS BY TYPE CHART */}
        <Card>
          <CardHeader>
            <CardTitle>{t("alertsByType") || "Alerts by Type"}</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {alertsData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={alertsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#2471A3" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                {t("noData")}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        {/* TOP 5 VEHICLES NEEDING ATTENTION */}
        <Card>
          <CardHeader>
            <CardTitle>{t("topVehiclesNeedingAttention") || "Top Vehicles Needing Attention"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-start">
                <thead className="bg-muted/50 text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium text-start">{t("vehiclePlate") || "Plate"}</th>
                    <th className="px-4 py-3 font-medium text-start">{"Model"}</th>
                    <th className="px-4 py-3 font-medium text-start">{"Score"}</th>
                    <th className="px-4 py-3 font-medium text-start">{t("activeAlerts") || "Alerts"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {topVehicles.length > 0 ? topVehicles.map(v => (
                    <tr key={v.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-3" dir="ltr">{isRtl && v.plate_number_ar ? v.plate_number_ar : v.plate_number}</td>
                      <td className="px-4 py-3">{v.model}</td>
                      <td className="px-4 py-3">
                        <span className={v.health_score < 40 ? "text-red-600 font-bold" : (v.health_score < 70 ? "text-yellow-600" : "text-green-600")}>
                          {v.health_score}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="destructive">{v.activeAlerts}</Badge>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">{t("noData") || "No data"}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* RECENT MAINTENANCE */}
        <Card>
          <CardHeader>
            <CardTitle>{t("recentMaintenance") || "Recent Maintenance"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-start">
                <thead className="bg-muted/50 text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium text-start">{t("vehicle") || "Vehicle"}</th>
                    <th className="px-4 py-3 font-medium text-start">{t("type") || "Type"}</th>
                    <th className="px-4 py-3 font-medium text-start">{t("date") || "Date"}</th>
                    <th className="px-4 py-3 font-medium text-start">{t("cost") || "Cost"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentMaintenance.length > 0 ? recentMaintenance.map(m => (
                    <tr key={m.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-3" dir="ltr">{isRtl && m.vehicles?.plate_number_ar ? m.vehicles.plate_number_ar : m.vehicles?.plate_number}</td>
                      <td className="px-4 py-3">{m.type}</td>
                      <td className="px-4 py-3" dir={isRtl ? "rtl" : "ltr"}>{formatDate(m.performed_at)}</td>
                      <td className="px-4 py-3">{m.cost} SAR</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">{t("noData") || "No data"}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 mb-4">
        <h2 className="text-xl font-bold">{t("availableReports")}</h2>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="hover:border-[#2471A3]/50 transition-colors">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-[#2471A3]/10 rounded-lg">
                  <FileBarChart className="h-6 w-6 text-[#2471A3]" />
                </div>
                <CardTitle>{t("weeklyReport")}</CardTitle>
              </div>
            </div>
            <CardDescription className="mt-2 text-sm leading-relaxed">
              {t("weeklyDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-md">
                <Calendar className="h-4 w-4" />
                <span dir="ltr">Mar 3 - Mar 9, 2026</span>
              </div>
              <Button 
                className="w-full sm:w-auto bg-[#2471A3] hover:bg-[#1a5276]"
                onClick={handleGenerateWeeklyReport}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <Loader2 className={cn("h-4 w-4 animate-spin", isRtl ? "ml-2" : "mr-2")} />
                ) : (
                  <FileText className={cn("h-4 w-4", isRtl ? "ml-2" : "mr-2")} />
                )}
                {t("generateReport")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
