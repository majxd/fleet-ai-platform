"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceArea,
} from "recharts";
import type { HealthHistoryPoint } from "@/types/vehicle";

interface HealthHistoryChartProps {
  data: HealthHistoryPoint[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
  scoreLabel: string;
  dateLabel: string;
}

function CustomTooltip({
  active,
  payload,
  label,
  scoreLabel,
  dateLabel,
}: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;

  const score = payload[0].value;
  const color =
    score > 70 ? "#22C55E" : score >= 40 ? "#EAB308" : "#EF4444";

  return (
    <div className="rounded-lg bg-white px-3 py-2 shadow-lg border border-gray-100">
      <p className="text-xs text-muted-foreground">
        {dateLabel}: {label}
      </p>
      <p className="mt-1 text-sm font-bold" style={{ color }}>
        {scoreLabel}: {score}
      </p>
    </div>
  );
}

export default function HealthHistoryChart({ data }: HealthHistoryChartProps) {
  const t = useTranslations("vehicleDetail.healthHistory");
  const params = useParams();
  const locale = params.locale as string;

  // Format date labels based on locale
  const chartData = data.map((point) => {
    const date = new Date(point.date);
    const label =
      locale === "ar"
        ? `${date.getDate()}/${date.getMonth() + 1}`
        : `${date.getMonth() + 1}/${date.getDate()}`;
    return { ...point, label };
  });

  return (
    <div className="rounded-xl bg-white p-5 shadow-sm sm:p-6">
      {/* Section header */}
      <div className="mb-4">
        <h2 className="text-lg font-bold text-foreground">{t("title")}</h2>
        <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>

      {/* Chart */}
      <div className="h-[200px] sm:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            {/* Green zone: 70-100 */}
            <ReferenceArea
              y1={70}
              y2={100}
              fill="#22C55E"
              fillOpacity={0.06}
            />
            {/* Yellow zone: 40-70 */}
            <ReferenceArea
              y1={40}
              y2={70}
              fill="#EAB308"
              fillOpacity={0.06}
            />
            {/* Red zone: 0-40 */}
            <ReferenceArea
              y1={0}
              y2={40}
              fill="#EF4444"
              fillOpacity={0.06}
            />

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#E5E7EB"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "#9CA3AF" }}
              tickLine={false}
              axisLine={{ stroke: "#E5E7EB" }}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 11, fill: "#9CA3AF" }}
              tickLine={false}
              axisLine={false}
              ticks={[0, 20, 40, 60, 80, 100]}
            />
            <Tooltip
              content={
                <CustomTooltip
                  scoreLabel={t("score")}
                  dateLabel={t("date")}
                />
              }
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#3B82F6"
              strokeWidth={2.5}
              dot={false}
              activeDot={{
                r: 5,
                fill: "#3B82F6",
                stroke: "#fff",
                strokeWidth: 2,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
