/**
 * Health Score Algorithm
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

interface HealthScoreInput {
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

export function calculateHealthScore(input: HealthScoreInput): number {
  const dtcScore = calculateDtcScore(input.activeDtcCount);
  const tempScore = calculateTempScore(input.engineTemp);
  const maintenanceScore = calculateMaintenanceScore(input.daysSinceMaintenance);
  const batteryScore = calculateBatteryScore(input.batteryVoltage);
  const fuelScore = calculateFuelScore(input.fuelLevel);

  const total = dtcScore + tempScore + maintenanceScore + batteryScore + fuelScore;

  return Math.round(Math.max(0, Math.min(100, total)));
}

/** DTC codes: 0 faults = 30, 1 = 20, 2 = 10, 3+ = 0 */
function calculateDtcScore(count: number): number {
  if (count === 0) return 30;
  if (count === 1) return 20;
  if (count === 2) return 10;
  return 0;
}

/** Engine temp: 70–105°C = 25 (optimal), degrade outside range */
function calculateTempScore(temp: number): number {
  if (temp >= 70 && temp <= 105) return 25;
  if (temp < 70) return Math.max(0, 25 - (70 - temp));
  // temp > 105
  return Math.max(0, 25 - (temp - 105) * 2);
}

/** Days since maintenance: ≤30 = 20, ≤90 = 15, ≤180 = 10, >180 = 0 */
function calculateMaintenanceScore(days: number): number {
  if (days <= 30) return 20;
  if (days <= 90) return 15;
  if (days <= 180) return 10;
  return 0;
}

/** Battery: 12.4–12.8V = 15 (optimal), degrade outside range */
function calculateBatteryScore(voltage: number): number {
  if (voltage >= 12.4 && voltage <= 12.8) return 15;
  if (voltage >= 12.0 && voltage < 12.4) return 10;
  if (voltage > 12.8 && voltage <= 13.2) return 12;
  return 5;
}

/** Fuel: percentage mapped to 10 points */
function calculateFuelScore(level: number): number {
  if (level >= 50) return 10;
  if (level >= 25) return 7;
  if (level >= 10) return 4;
  return 0;
}

export type HealthColor = "green" | "yellow" | "red";

export function getHealthColor(score: number): HealthColor {
  if (score > 70) return "green";
  if (score >= 40) return "yellow";
  return "red";
}
