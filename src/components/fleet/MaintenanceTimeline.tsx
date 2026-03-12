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
} from "lucide-react";
import type { MaintenanceEvent, MaintenanceType } from "@/types/vehicle";

interface MaintenanceTimelineProps {
  events: MaintenanceEvent[];
}

const typeIcons: Record<MaintenanceType, React.ReactNode> = {
  oil_change: <Droplets className="h-4 w-4" />,
  tire_rotation: <RotateCw className="h-4 w-4" />,
  brake_inspection: <Disc className="h-4 w-4" />,
  filter_replacement: <Filter className="h-4 w-4" />,
  battery_replacement: <BatteryCharging className="h-4 w-4" />,
  general_inspection: <ClipboardCheck className="h-4 w-4" />,
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
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="rounded-xl bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-lg font-bold text-foreground mb-5">{t("title")}</h2>

      <div className="relative">
        {/* Vertical line — right side in RTL, left side in LTR */}
        <div className="absolute top-0 bottom-0 start-[15px] w-0.5 bg-gray-200" />

        <div className="space-y-6">
          {sortedEvents.map((event, index) => {
            const icon = typeIcons[event.type];

            return (
              <div key={event.id} className="relative flex gap-4 ps-0">
                {/* Timeline dot with icon */}
                <div className="relative z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 ring-4 ring-white">
                  {icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pb-1">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="text-sm font-semibold text-foreground">
                      {t(`types.${event.type}`)}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{event.date}</span>
                    </div>
                  </div>

                  {/* Meta info */}
                  <div className="mt-1.5 flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {event.mileage.toLocaleString()} {t("km")}
                    </span>
                    <span className="flex items-center gap-1">
                      <Banknote className="h-3 w-3" />
                      {event.cost.toLocaleString()} {t("sar")}
                    </span>
                  </div>

                  {/* Notes */}
                  <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                    {locale === "ar" ? event.notes_ar : event.notes_en}
                  </p>

                  {/* Subtle divider (except last) */}
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
