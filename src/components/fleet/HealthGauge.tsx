"use client";

import { cn } from "@/lib/utils";

interface HealthGaugeProps {
  score: number;
}

function getHealthColor(score: number): string {
  if (score > 70) return "text-green-500";
  if (score >= 40) return "text-yellow-500";
  return "text-red-500";
}

function getHealthBg(score: number): string {
  if (score > 70) return "bg-green-500/10";
  if (score >= 40) return "bg-yellow-500/10";
  return "bg-red-500/10";
}

export default function HealthGauge({ score }: HealthGaugeProps) {
  return (
    <div
      className={cn(
        "flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold",
        getHealthColor(score),
        getHealthBg(score)
      )}
      role="meter"
      aria-valuenow={score}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Health score: ${score}`}
    >
      {score}
    </div>
  );
}
