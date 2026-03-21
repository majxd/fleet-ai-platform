export type AlertType =
  | 'health_critical'
  | 'health_warning'
  | 'dtc_fault'
  | 'maintenance_overdue'
  | 'battery_low'
  | 'temperature_high';

export type AlertSeverity = 'critical' | 'warning' | 'info';

export type AlertStatus = 'new' | 'in_progress' | 'resolved';

export interface Alert {
  id: string;
  company_id: string;
  vehicle_id: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  title_ar: string;
  message: string | null;
  message_ar: string | null;
  status: AlertStatus;
  assigned_to: string | null;
  resolved_at: string | null;
  resolved_by: string | null;
  metadata: any | null;
  created_at: string;
  updated_at: string;
  vehicles?: {
    plate_number: string;
    plate_number_ar?: string;
  };
}
