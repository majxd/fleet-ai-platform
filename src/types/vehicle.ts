export type VehicleStatus = "active" | "maintenance" | "inactive" | "idle";

export type UserRole = "owner" | "manager" | "technician" | "viewer";

export interface Vehicle {
  id: string;
  company_id: string;
  plate_number: string;
  make: string;
  model: string;
  year: number;
  vin: string;
  color: string;
  status: VehicleStatus;
  health_score: number;
  obd_device_id: string | null;
  last_obd_reading_at: string | null;
  created_at: string;
  updated_at: string;
}
