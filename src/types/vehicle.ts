export type VehicleStatus = "active" | "maintenance" | "inactive" | "idle";
export type HealthStatus = "healthy" | "warning" | "critical";
export type UserRole = "owner" | "manager" | "technician" | "viewer";

export interface Vehicle {
  id: string;
  company_id: string;
  plate_number: string;
  plate_letters: string;
  make: string;
  model: string;
  year: number;
  vin: string;
  color: string;
  status: VehicleStatus;
  health_score: number;
  health_status: HealthStatus;
  obd_device_id: string | null;
  last_obd_reading_at: string | null;
  engine_temp: number;
  battery_voltage: number;
  fuel_level: number;
  active_dtcs: string[];
  days_since_maintenance: number;
  created_at: string;
  updated_at: string;
}

export interface HealthScoreResult {
  score: number;
  status: HealthStatus;
  issues: string[];
  recommendations: string[];
}
