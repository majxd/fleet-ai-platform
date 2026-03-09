export type AlertSeverity = "critical" | "warning" | "info";
export type AlertStatus = "active" | "acknowledged" | "resolved";
export type NotificationChannel = "whatsapp" | "sms" | "email" | "in_app";

export interface Alert {
  id: string;
  company_id: string;
  vehicle_id: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  status: AlertStatus;
  notification_channels: NotificationChannel[];
  created_at: string;
  resolved_at: string | null;
}
