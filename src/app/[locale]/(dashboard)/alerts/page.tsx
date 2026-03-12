"use client";

import { useState, use } from "react";
import { useTranslations } from "next-intl";
import { mockAlertsData } from "@/data/mock-alerts";
import { mockVehicles } from "@/data/mock-vehicles";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, Clock, CheckCircle2, User, Car } from "lucide-react";
import type { AlertSeverity, AlertStatus } from "@/types/alert";

function getSeverityColor(severity: string) {
  switch (severity) {
    case "critical":
      return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-800";
    case "warning":
      return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-800";
    case "info":
      return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-800";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "new":
      return "bg-blue-100 text-blue-800";
    case "in_progress":
      return "bg-yellow-100 text-yellow-800";
    case "resolved":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export default function AlertsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const t = useTranslations("alerts");
  const isRtl = locale === "ar";
  
  const [alerts, setAlerts] = useState(mockAlertsData);
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredAlerts = alerts.filter(alert => {
    if (severityFilter !== "all" && alert.severity !== severityFilter) return false;
    if (statusFilter !== "all" && alert.status !== statusFilter) return false;
    return true;
  });

  const handleMarkResolved = (id: string) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, status: "resolved", resolved_at: new Date().toISOString() } : a));
  };

  // Helper to get vehicle plate
  const getVehiclePlate = (vehicleId: string) => {
    return mockVehicles.find(v => v.id === vehicleId)?.plate_number || vehicleId;
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(locale, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="w-full sm:w-[200px]">
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger>
              <SelectValue placeholder={t("filterBySeverity")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allSeverities")}</SelectItem>
              <SelectItem value="critical">{t("severity.critical")}</SelectItem>
              <SelectItem value="warning">{t("severity.warning")}</SelectItem>
              <SelectItem value="info">{t("severity.info")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full sm:w-[200px]">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder={t("filterByStatus")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allStatuses")}</SelectItem>
              <SelectItem value="new">{t("status.new")}</SelectItem>
              <SelectItem value="in_progress">{t("status.in_progress")}</SelectItem>
              <SelectItem value="resolved">{t("status.resolved")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-start">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium text-start">{t("vehiclePlate")}</th>
                <th className="px-4 py-3 font-medium text-start">{t("alertType")}</th>
                <th className="px-4 py-3 font-medium text-start">{t("severityLevel")}</th>
                <th className="px-4 py-3 font-medium text-start">{t("time")}</th>
                <th className="px-4 py-3 font-medium text-start">{t("statusLabel")}</th>
                <th className="px-4 py-3 font-medium text-start">{t("assignedTo")}</th>
                <th className="px-4 py-3 font-medium text-end">{t("actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredAlerts.length > 0 ? (
                filteredAlerts.map((alert) => (
                  <tr key={alert.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Car className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium" dir="ltr">{getVehiclePlate(alert.vehicle_id)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">
                          {isRtl ? alert.title_ar : alert.title_en}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {isRtl ? alert.description_ar : alert.description_en}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={getSeverityColor(alert.severity)}>
                        {t(`severity.${alert.severity}`)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        <span dir={isRtl ? "rtl" : "ltr"}>{getRelativeTime(alert.created_at)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="secondary" className={getStatusColor(alert.status)}>
                        {t(`status.${alert.status}`)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {alert.assigned_to ? alert.assigned_to : t("unassigned")}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-end">
                      {alert.status !== "resolved" ? (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleMarkResolved(alert.id)}
                          className="h-8 inline-flex gap-1"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>{t("markResolved")}</span>
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground inline-flex items-center gap-1 justify-end">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span dir={isRtl ? "rtl" : "ltr"}>{getRelativeTime(alert.resolved_at || alert.updated_at)}</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <AlertCircle className="h-8 w-8 text-muted-foreground/50" />
                      <p>{t("emptyState")}</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
