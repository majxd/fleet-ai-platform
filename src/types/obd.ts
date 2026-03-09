export interface OBDDevice {
  id: string;
  company_id: string;
  serial_number: string;
  vehicle_id: string | null;
  is_active: boolean;
  last_ping_at: string | null;
  created_at: string;
}

export interface OBDReading {
  id: string;
  device_id: string;
  vehicle_id: string;
  company_id: string;
  engine_temp: number;
  battery_voltage: number;
  fuel_level: number;
  speed: number;
  rpm: number;
  dtc_codes: string[];
  latitude: number | null;
  longitude: number | null;
  recorded_at: string;
}

export interface DTCCode {
  code: string;
  description_ar: string;
  description_en: string;
  severity: "critical" | "warning" | "info";
}
