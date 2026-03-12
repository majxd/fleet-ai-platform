"use client";

import { useState, use } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockVehicles } from "@/data/mock-vehicles";
import { mockAlertsData } from "@/data/mock-alerts";
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

// Mock data for recent reports
const mockRecentReports = [
  {
    id: "rep-001",
    name: "ملخص الأسطول الأسبوعي",
    nameEn: "Weekly Fleet Summary",
    type: "weekly",
    dateRange: "Mar 3 - Mar 9, 2026",
    generatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: "ready", // ready, generating, failed
  },
  {
    id: "rep-002",
    name: "ملخص الأسطول الشهري",
    nameEn: "Monthly Fleet Summary",
    type: "monthly",
    dateRange: "February 2026",
    generatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    status: "ready",
  },
  {
    id: "rep-003",
    name: "ملخص الأسطول الأسبوعي",
    nameEn: "Weekly Fleet Summary",
    type: "weekly",
    dateRange: "Feb 24 - Mar 2, 2026",
    generatedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    status: "ready",
  },
  {
    id: "rep-004",
    name: "ملخص الأسطول الأسبوعي",
    nameEn: "Weekly Fleet Summary",
    type: "weekly",
    dateRange: "Feb 17 - Feb 23, 2026",
    generatedAt: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString(),
    status: "ready",
  },
  {
    id: "rep-005",
    name: "تقرير الصيانة الشامل",
    nameEn: "Comprehensive Maintenance Report",
    type: "maintenance",
    dateRange: "Jan 1 - Mar 1, 2026",
    generatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: "failed",
  },
];

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

export default function ReportsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const t = useTranslations("reports");
  const isRtl = locale === "ar";
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Calculate summary stats
  const totalVehicles = mockVehicles.length;
  const avgHealth = Math.round(
    mockVehicles.reduce((sum, v) => sum + v.health_score, 0) / totalVehicles
  );
  const needsAttentionCount = mockVehicles.filter(v => v.health_score < 40).length;
  
  // For 'alerts this week' we just use the new mock data length as a placeholder proxy
  const newAlertsCount = mockAlertsData.filter(a => a.status === "new").length;

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
      // Simulate network wait for better UX
      await new Promise(resolve => setTimeout(resolve, 800));
      
      generateWeeklyReport({
        locale: locale as "ar" | "en",
        companyName: t("title") === "التقارير" ? "شركة الأسطول الذكي" : "Smart Fleet Company", // Fallback for demo
        dateRange: formatDate(new Date().toISOString()),
      });
      
      // Native fallback alert since shadcn toast failed fetching
      window.alert(isRtl ? "تم استخراج تقرير الأسطول الأسبوعي" : "Weekly Fleet Summary generated successfully");
    } catch (error) {
      window.alert(isRtl ? "فشل إنشاء التقرير" : "Failed to generate report");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground mt-1">{t("subtitle")}</p>
        </div>
      </div>

      {/* Fleet Summary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("totalVehicles")}
            </CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVehicles}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {isRtl ? "الأسطول بأكمله المنشط" : "Entire active fleet"}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("averageHealth")}
            </CardTitle>
            <Activity className="h-4 w-4 text-[#2471A3]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#2471A3]">{avgHealth}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {isRtl ? "متوسط تقييم حالة المركبات" : "Average vehicle condition score"}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("alertsThisWeek")}
            </CardTitle>
            <BellRing className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{newAlertsCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {isRtl ? "تنبيهات نشطة حالياً" : "Currently active alerts"}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t("needsAttention")}
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{needsAttentionCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
               {isRtl ? "مركبات حالتها حرجة (أقل من 40)" : "Critical condition vehicles (< 40)"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Report Cards Grid */}
      <h2 className="text-xl font-bold mt-8 mb-4">{t("availableReports")}</h2>
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

        <Card className="hover:border-[#2471A3]/50 transition-colors">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-[#2471A3]/10 rounded-lg">
                  <FileBarChart className="h-6 w-6 text-[#2471A3]" />
                </div>
                <CardTitle>{t("monthlyReport")}</CardTitle>
              </div>
            </div>
            <CardDescription className="mt-2 text-sm leading-relaxed">
              {t("monthlyDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-md">
                <Calendar className="h-4 w-4" />
                <span dir="ltr">February 2026</span>
              </div>
              <Button variant="outline" className="w-full sm:w-auto">
                <FileText className={cn("h-4 w-4", isRtl ? "ml-2" : "mr-2")} />
                {t("generateReport")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reports Table */}
      <h2 className="text-xl font-bold mt-10 mb-4">{t("recentReports")}</h2>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-start">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium text-start">{t("reportName")}</th>
                <th className="px-4 py-3 font-medium text-start">{t("dateRange")}</th>
                <th className="px-4 py-3 font-medium text-start">{t("generatedDate")}</th>
                <th className="px-4 py-3 font-medium text-start">{t("status")}</th>
                <th className="px-4 py-3 font-medium text-end">{t("actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockRecentReports.map((report) => (
                <tr key={report.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3 font-medium">
                    {isRtl ? report.name : report.nameEn}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground" dir="ltr">
                    <div className={cn("inline-block", isRtl && "text-right w-full")}>{report.dateRange}</div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    <span dir={isRtl ? "rtl" : "ltr"}>{formatDate(report.generatedAt)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className={cn("inline-flex items-center gap-1.5", getStatusColor(report.status))}>
                      {getStatusIcon(report.status)}
                      {t(`statuses.${report.status}`)}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-end">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      disabled={report.status !== "ready"}
                      className="h-8 text-[#2471A3] hover:text-[#1a5276] hover:bg-[#2471A3]/10"
                    >
                      <Download className="h-4 w-4" />
                      <span className="sr-only">{t("download")}</span>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
