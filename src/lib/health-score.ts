/**
 * Health Score Algorithm — DO NOT MODIFY scoring weights
 *
 * Components:
 * - Active DTC codes:       30 points
 * - Engine temperature:     25 points
 * - Days since maintenance: 20 points
 * - Battery voltage:        15 points
 * - Fuel level:             10 points
 *
 * Total: 0–100 integer, never null
 * Colors: Green >70 | Yellow 40–70 | Red <40
 */

import type { HealthStatus, HealthScoreResult } from "@/types/vehicle";

export interface HealthScoreInput {
  /** Number of active DTC (Diagnostic Trouble Code) faults */
  activeDtcCount: number;
  /** Engine temperature in °C */
  engineTemp: number;
  /** Days since last maintenance */
  daysSinceMaintenance: number;
  /** Battery voltage in volts */
  batteryVoltage: number;
  /** Fuel level as percentage 0–100 */
  fuelLevel: number;
}

export function calculateHealthScore(input: HealthScoreInput): HealthScoreResult {
  const dtcScore = calculateDtcScore(input.activeDtcCount);
  const tempScore = calculateTempScore(input.engineTemp);
  const maintenanceScore = calculateMaintenanceScore(input.daysSinceMaintenance);
  const batteryScore = calculateBatteryScore(input.batteryVoltage);
  const fuelScore = calculateFuelScore(input.fuelLevel);

  const score = Math.round(
    Math.max(0, Math.min(100, dtcScore + tempScore + maintenanceScore + batteryScore + fuelScore))
  );

  const status = getHealthStatus(score);
  const issues = collectIssues(input);
  const recommendations = collectRecommendations(input);

  return { score, status, issues, recommendations };
}

/** 0 codes = 30 | 1 = 20 | 2 = 10 | 3+ = 0 */
function calculateDtcScore(count: number): number {
  if (count === 0) return 30;
  if (count === 1) return 20;
  if (count === 2) return 10;
  return 0;
}

/** 70–95°C = 25 | 95–105 = 15 | 105–115 = 5 | >115 = 0 */
function calculateTempScore(temp: number): number {
  if (temp >= 70 && temp <= 95) return 25;
  if (temp > 95 && temp <= 105) return 15;
  if (temp > 105 && temp <= 115) return 5;
  return 0;
}

/** <30d = 20 | 30–90 = 15 | 90–180 = 10 | >180 = 0 */
function calculateMaintenanceScore(days: number): number {
  if (days < 30) return 20;
  if (days <= 90) return 15;
  if (days <= 180) return 10;
  return 0;
}

/** 12.4–14.7V = 15 | 12.0–12.4 = 8 | outside = 0 */
function calculateBatteryScore(voltage: number): number {
  if (voltage >= 12.4 && voltage <= 14.7) return 15;
  if (voltage >= 12.0 && voltage < 12.4) return 8;
  return 0;
}

/** >30% = 10 | 15–30% = 6 | <15% = 2 */
function calculateFuelScore(level: number): number {
  if (level > 30) return 10;
  if (level >= 15) return 6;
  return 2;
}

export function getHealthStatus(score: number): HealthStatus {
  if (score > 70) return "healthy";
  if (score >= 40) return "warning";
  return "critical";
}

export function getHealthColor(score: number): string {
  if (score > 70) return "#22C55E";
  if (score >= 40) return "#EAB308";
  return "#EF4444";
}

function collectIssues(input: HealthScoreInput): string[] {
  const issues: string[] = [];
  if (input.activeDtcCount > 0) issues.push(`${input.activeDtcCount} active DTC code(s)`);
  if (input.engineTemp > 105) issues.push("Engine temperature is high");
  if (input.engineTemp > 95 && input.engineTemp <= 105) issues.push("Engine temperature above normal");
  if (input.daysSinceMaintenance > 90) issues.push("Maintenance overdue");
  if (input.batteryVoltage < 12.4) issues.push("Battery voltage low");
  if (input.fuelLevel < 15) issues.push("Fuel level critical");
  else if (input.fuelLevel < 30) issues.push("Fuel level low");
  return issues;
}

function collectRecommendations(input: HealthScoreInput): string[] {
  const recs: string[] = [];
  if (input.activeDtcCount > 0) recs.push("Diagnose and clear DTC codes");
  if (input.engineTemp > 95) recs.push("Check cooling system");
  if (input.daysSinceMaintenance > 90) recs.push("Schedule maintenance immediately");
  if (input.batteryVoltage < 12.4) recs.push("Check battery and alternator");
  if (input.fuelLevel < 30) recs.push("Refuel vehicle");
  return recs;
}
