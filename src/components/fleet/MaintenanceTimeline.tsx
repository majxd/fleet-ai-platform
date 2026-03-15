"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import {
  Droplets,
  RotateCw,
  Disc,
  Filter,
  BatteryCharging,
  ClipboardCheck,
  Calendar,
  MapPin,
  Banknote,
  Wrench,
  Search,
  MoreHorizontal
} from "lucide-react";
import type { MaintenanceLog } from "@/types/database";

interface MaintenanceTimelineProps {
  events: MaintenanceLog[];
}

const typeIcons: Record<string, React.ReactNode> = {
  oil_change: <Droplets className="h-4 w-4" />,
  tire_rotation: <RotateCw className="h-4 w-4" />,
  brake_service: <Disc className="h-4 w-4" />,
  filter_change: <Filter className="h-4 w-4" />,
  battery_replacement: <BatteryCharging className="h-4 w-4" />,
  inspection: <ClipboardCheck className="h-4 w-4" />,
  transmission: <RotateCw className="h-4 w-4" />,
  engine_repair: <Wrench className="h-4 w-4" />,
  other: <MoreHorizontal className="h-4 w-4" />
};

export default function MaintenanceTimeline({
  events,
}: MaintenanceTimelineProps) {
  const t = useTranslations("vehicleDetail.maintenance");
  const params = useParams();
  const locale = params.locale as string;

  if (events.length === 0) {
    return (
      <div className="rounded-xl bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-bold text-foreground mb-4">
          {t("title")}
        </h2>
        <div className="flex items-center justify-center py-10">
          <p className="text-muted-foreground">{t("empty")}</p>
        </div>
      </div>
    );
  }

  // Sort by date descending (most recent first)
  const sortedEvents = [...events].sort(
    (a, b) => new Date(b.performed_at).getTime() - new Date(a.performed_at).getTime()
  );

  return (
    <div className="rounded-xl bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-lg font-bold text-foreground mb-5">{t("title")}</h2>

      <div className="relative">
        <div className="absolute top-0 bottom-0 start-[15px] w-0.5 bg-gray-200" />

        <div className="space-y-6">
          {sortedEvents.map((event, index) => {
            const icon = typeIcons[event.type] || <Wrench className="h-4 w-4" />;
            
            // Format date strictly without hydration mismatches by keeping it Simple (done on server ideal, but here minimal string split)
            const dateStr = new Date(event.performed_at).toISOString().split('T')[0];

            return (
              <div key={event.id} className="relative flex gap-4 ps-0">
                <div className="relative z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 ring-4 ring-white">
                  {icon}
                </div>

                <div className="flex-1 min-w-0 pb-1">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="text-sm font-semibold text-foreground">
                      {/* Fallback to original enum string if missing translation */}
                      {t(`types.${event.type}` as any) === `vehicleDetail.maintenance.types.${event.type}` ? event.type.replace('_', ' ') : t(`types.${event.type}` as any)}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{dateStr}</span>
                    </div>
                  </div>

                  <div className="mt-1.5 flex flex-wrap gap-3 text-xs text-muted-foreground">
                    {event.mileage_at_service != null && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {event.mileage_at_service.toLocaleString()} {t("km")}
                      </span>
                    )}
                    {event.cost != null && (
                      <span className="flex items-center gap-1">
                        <Banknote className="h-3 w-3" />
                        {event.cost.toLocaleString()} {t("sar")}
                      </span>
                    )}
                  </div>

                  {(event.notes || event.description) && (
                    <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                      {locale === "ar" ? (event.description_ar || event.notes || event.description) : (event.description || event.notes)}
                    </p>
                  )}

                  {index < sortedEvents.length - 1 && (
                    <div className="mt-4 border-b border-dashed border-gray-100" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
