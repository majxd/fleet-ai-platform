"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Search, Plus, Clock, Car } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { mockVehicles } from "@/data/mock-vehicles";
import HealthGauge from "@/components/fleet/HealthGauge";
import type { Vehicle, HealthStatus, VehicleStatus } from "@/types/vehicle";

function getStatusBadgeStyle(status: HealthStatus): {
  bg: string;
  text: string;
  border: string;
} {
  switch (status) {
    case "healthy":
      return { bg: "#22C55E15", text: "#22C55E", border: "#22C55E30" };
    case "warning":
      return { bg: "#EAB30815", text: "#EAB308", border: "#EAB30830" };
    case "critical":
      return { bg: "#EF444415", text: "#EF4444", border: "#EF444430" };
  }
}

function getVehicleStatusStyle(status: VehicleStatus): {
  bg: string;
  text: string;
  border: string;
} {
  switch (status) {
    case "active":
      return { bg: "#3B82F615", text: "#3B82F6", border: "#3B82F630" };
    case "maintenance":
      return { bg: "#F59E0B15", text: "#F59E0B", border: "#F59E0B30" };
    case "inactive":
      return { bg: "#6B728015", text: "#6B7280", border: "#6B728030" };
    case "idle":
      return { bg: "#8B5CF615", text: "#8B5CF6", border: "#8B5CF630" };
  }
}

function getRelativeTimeAr(dateString: string): string {
  const diff = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  if (minutes < 1) return "الآن";
  if (minutes < 60) return `منذ ${minutes} دقائق`;
  if (hours < 24) return `منذ ${hours} ساعات`;
  return `منذ ${Math.floor(hours / 24)} أيام`;
}

function getRelativeTimeEn(dateString: string): string {
  const diff = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function VehiclesPage() {
  const t = useTranslations("vehicles");
  const tDash = useTranslations("dashboard");
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter vehicles by plate number or model
  const filteredVehicles = useMemo(() => {
    if (!searchQuery.trim()) return mockVehicles;
    const q = searchQuery.toLowerCase();
    return mockVehicles.filter(
      (v) =>
        v.plate_number.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        v.make.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const getRelativeTime = (dateString: string | null): string => {
    if (!dateString) return "—";
    if (!mounted) return "—";
    return locale === "ar"
      ? getRelativeTimeAr(dateString)
      : getRelativeTimeEn(dateString);
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground lg:text-3xl">
            {t("title")}
          </h1>
          <p className="mt-1 text-muted-foreground">{t("subtitle")}</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 active:bg-blue-800 self-start sm:self-auto">
          <Plus className="h-4 w-4" />
          {t("addVehicle")}
        </button>
      </div>

      {/* Search bar + count */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="w-full rounded-lg border border-gray-200 bg-white py-2.5 ps-10 pe-4 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <p className="text-sm text-muted-foreground">
          {t("totalVehicles", { count: filteredVehicles.length })}
        </p>
      </div>

      {/* No results */}
      {filteredVehicles.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl bg-white shadow-sm">
          <Car className="h-12 w-12 text-gray-300 mb-3" />
          <p className="text-muted-foreground">{t("noResults")}</p>
        </div>
      )}

      {filteredVehicles.length > 0 && (
        <>
          {/* Desktop table */}
          <div className="hidden md:block rounded-xl bg-white shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60">
                  <th className="px-5 py-3.5 text-start font-semibold text-muted-foreground">
                    {t("plateNumber")}
                  </th>
                  <th className="px-5 py-3.5 text-start font-semibold text-muted-foreground">
                    {t("model")}
                  </th>
                  <th className="px-5 py-3.5 text-start font-semibold text-muted-foreground">
                    {t("year")}
                  </th>
                  <th className="px-5 py-3.5 text-start font-semibold text-muted-foreground">
                    {t("healthScore")}
                  </th>
                  <th className="px-5 py-3.5 text-start font-semibold text-muted-foreground">
                    {t("status")}
                  </th>
                  <th className="px-5 py-3.5 text-start font-semibold text-muted-foreground">
                    {t("lastUpdated")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredVehicles.map((vehicle) => {
                  const healthStyle = getStatusBadgeStyle(
                    vehicle.health_status
                  );
                  const vehicleStatusStyle = getVehicleStatusStyle(
                    vehicle.status
                  );
                  return (
                      <tr
                        key={vehicle.id}
                        onClick={() => router.push(`/${locale}/vehicles/${vehicle.id}`)}
                        className="border-b border-gray-50 last:border-0 cursor-pointer transition-colors hover:bg-blue-50/40"
                      >
                        <td className="px-5 py-4 font-bold text-foreground">
                          {vehicle.plate_number}
                        </td>
                        <td className="px-5 py-4 text-muted-foreground">
                          {vehicle.make} {vehicle.model}
                        </td>
                        <td className="px-5 py-4 text-muted-foreground">
                          {vehicle.year}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2.5">
                            <HealthGauge
                              score={vehicle.health_score}
                              size={36}
                            />
                            <Badge
                              className="text-xs font-semibold"
                              style={{
                                backgroundColor: healthStyle.bg,
                                color: healthStyle.text,
                                borderColor: healthStyle.border,
                              }}
                            >
                              {tDash(`statuses.${vehicle.health_status}`)}
                            </Badge>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <Badge
                            className="text-xs font-semibold"
                            style={{
                              backgroundColor: vehicleStatusStyle.bg,
                              color: vehicleStatusStyle.text,
                              borderColor: vehicleStatusStyle.border,
                            }}
                          >
                            {t(`statuses.${vehicle.status}`)}
                          </Badge>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Clock className="h-3.5 w-3.5" />
                            <span>
                              {getRelativeTime(vehicle.last_obd_reading_at)}
                            </span>
                          </div>
                        </td>
                      </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden grid gap-3">
            {filteredVehicles.map((vehicle) => {
              const healthStyle = getStatusBadgeStyle(vehicle.health_status);
              const vehicleStatusStyle = getVehicleStatusStyle(vehicle.status);
              return (
                <Link
                  key={vehicle.id}
                  href={`/${locale}/vehicles/${vehicle.id}`}
                >
                  <div className="rounded-xl bg-white p-4 shadow-sm transition-all hover:shadow-md active:scale-[0.99]">
                    {/* Top: plate + gauge */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold text-foreground">
                          {vehicle.plate_number}
                        </h3>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                          {vehicle.make} {vehicle.model} — {vehicle.year}
                        </p>
                      </div>
                      <HealthGauge score={vehicle.health_score} size={48} />
                    </div>

                    {/* Bottom: badges + time */}
                    <div className="mt-3 flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <Badge
                          className="text-xs font-semibold"
                          style={{
                            backgroundColor: healthStyle.bg,
                            color: healthStyle.text,
                            borderColor: healthStyle.border,
                          }}
                        >
                          {tDash(`statuses.${vehicle.health_status}`)}
                        </Badge>
                        <Badge
                          className="text-xs font-semibold"
                          style={{
                            backgroundColor: vehicleStatusStyle.bg,
                            color: vehicleStatusStyle.text,
                            borderColor: vehicleStatusStyle.border,
                          }}
                        >
                          {t(`statuses.${vehicle.status}`)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>
                          {getRelativeTime(vehicle.last_obd_reading_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
