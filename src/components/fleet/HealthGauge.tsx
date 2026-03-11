"use client";

import { getHealthColor } from "@/lib/health-score";

interface HealthGaugeProps {
  score: number;
  size?: number;
}

export default function HealthGauge({ score, size = 64 }: HealthGaugeProps) {
  const color = getHealthColor(score);
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const center = size / 2;
  const strokeWidth = 4;
  const fontSize = size >= 64 ? 16 : 12;
  const fontWeight = 700;

  return (
    <div
      className="relative flex-shrink-0"
      role="meter"
      aria-valuenow={score}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Health score: ${score}`}
    >
      <svg width={size} height={size} className="-rotate-90">
        {/* Background track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gray-100"
        />
        {/* Progress arc */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      {/* Score text centered */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ color, fontSize, fontWeight }}
      >
        {score}
      </div>
    </div>
  );
}
