"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
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
import { AlertCircle, Clock, CheckCircle2, User, Car, Activity, Loader2 } from "lucide-react";
import type { Alert } from "@/types/alert";
import { updateAlertStatusAction } from "./actions";
import { toast } from "sonner";
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription";

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

export default function AlertsClient({
  initialAlerts,
  initialStats,
  locale
}: {
  initialAlerts: Alert[];
  initialStats: {
    total: number;
    new: number;
    inProgress: number;
    resolved: number;
    critical: number;
    warning: number;
    info: number;
  };
  locale: string;
}) {
  const t = useTranslations("alerts");
  const isRtl = locale === "ar";
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [updatingAction, setUpdatingAction] = useState<"in_progress" | "resolved" | null>(null);

  useRealtimeSubscription(['alerts'], () => {
    router.refresh();
    toast.success(t("dataUpdated"));
  });

  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredAlerts = initialAlerts.filter((alert) => {
    if (severityFilter !== "all" && alert.severity !== severityFilter) return false;
    if (statusFilter !== "all" && alert.status !== statusFilter) return false;
    return true;
  });

  const handleUpdateStatus = async (id: string, status: "in_progress" | "resolved") => {
    setUpdatingId(id);
    setUpdatingAction(status);
    try {
      const result = await updateAlertStatusAction(id, status);
      if (result.success) {
        toast.success(t("successUpdate"));
      } else {
        toast.error(`${t("errorUpdate")}: ${result.error}`);
      }
    } catch {
      toast.error(t("errorUpdate"));
    } finally {
      setUpdatingId(null);
      setUpdatingAction(null);
    }
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 flex flex-col items-center justify-center">
          <span className="text-sm text-muted-foreground">{t("allStatuses")}</span>
          <span className="text-2xl font-bold">{initialStats.total}</span>
        </Card>
        <Card className="p-4 flex flex-col items-center justify-center bg-blue-50/50 dark:bg-blue-900/10">
          <span className="text-sm text-blue-600 dark:text-blue-400">{t("status.new")}</span>
          <span className="text-2xl font-bold text-blue-700 dark:text-blue-300">{initialStats.new}</span>
        </Card>
        <Card className="p-4 flex flex-col items-center justify-center bg-yellow-50/50 dark:bg-yellow-900/10">
          <span className="text-sm text-yellow-600 dark:text-yellow-400">{t("status.in_progress")}</span>
          <span className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{initialStats.inProgress}</span>
        </Card>
        <Card className="p-4 flex flex-col items-center justify-center bg-green-50/50 dark:bg-green-900/10">
          <span className="text-sm text-green-600 dark:text-green-400">{t("status.resolved")}</span>
          <span className="text-2xl font-bold text-green-700 dark:text-green-300">{initialStats.resolved}</span>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6" dir={isRtl ? "rtl" : "ltr"}>
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

      <Card className={"overflow-hidden" + (isPending ? " opacity-50 pointer-events-none" : "")}>
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
                        <span className="font-medium" dir="ltr">
                          {isRtl && alert.vehicles?.plate_number_ar
                            ? alert.vehicles.plate_number_ar
                            : alert.vehicles?.plate_number || "---"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">
                          {isRtl ? alert.title_ar : alert.title}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {isRtl ? alert.message_ar : alert.message}
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
                        <span dir={isRtl ? "rtl" : "ltr"}>
                          {getRelativeTime(alert.created_at)}
                        </span>
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
                    <td className="px-4 py-3 text-end flex gap-2 justify-end">
                      {alert.status === "new" && (
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={updatingId === alert.id || isPending}
                          onClick={() => handleUpdateStatus(alert.id, "in_progress")}
                          className="h-8 inline-flex gap-1"
                        >
                          {updatingId === alert.id && updatingAction === "in_progress" ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Activity className="h-3.5 w-3.5" />
                          )}
                          <span>{t("markInProgress")}</span>
                        </Button>
                      )}
                      {alert.status !== "resolved" ? (
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={updatingId === alert.id || isPending}
                          onClick={() => handleUpdateStatus(alert.id, "resolved")}
                          className="h-8 inline-flex gap-1"
                        >
                          {updatingId === alert.id && updatingAction === "resolved" ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          )}
                          <span>{t("markResolved")}</span>
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground inline-flex items-center gap-1 justify-end">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span dir={isRtl ? "rtl" : "ltr"}>
                            {getRelativeTime(alert.resolved_at || alert.updated_at)}
                          </span>
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
