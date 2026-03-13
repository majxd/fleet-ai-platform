export type UserRole = 'owner' | 'manager' | 'technician' | 'viewer'
export type VehicleStatus = 'active' | 'maintenance' | 'inactive' | 'rented'
export type FuelType = 'gasoline' | 'diesel' | 'hybrid' | 'electric'
export type PlanType = 'starter' | 'professional' | 'enterprise'
export type AlertType = 'dtc' | 'health_score' | 'maintenance' | 'fuel' | 'battery' | 'temperature' | 'custom'
export type AlertSeverity = 'critical' | 'warning' | 'info'
export type AlertStatus = 'new' | 'acknowledged' | 'in_progress' | 'resolved' | 'dismissed'
export type MaintenanceType = 'oil_change' | 'tire_rotation' | 'brake_service' | 'battery_replacement' | 'filter_change' | 'transmission' | 'engine_repair' | 'inspection' | 'other'
export type SubscriptionStatus = 'active' | 'past_due' | 'cancelled' | 'trialing'

export interface Database {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string
          name: string
          name_ar: string | null
          email: string | null
          phone: string | null
          address: string | null
          plan: PlanType
          vehicles_limit: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          name_ar?: string | null
          email?: string | null
          phone?: string | null
          address?: string | null
          plan?: PlanType
          vehicles_limit?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          name_ar?: string | null
          email?: string | null
          phone?: string | null
          address?: string | null
          plan?: PlanType
          vehicles_limit?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          company_id: string
          email: string
          full_name: string
          full_name_ar: string | null
          phone: string | null
          role: UserRole
          avatar_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          company_id: string
          email: string
          full_name: string
          full_name_ar?: string | null
          phone?: string | null
          role?: UserRole
          avatar_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          email?: string
          full_name?: string
          full_name_ar?: string | null
          phone?: string | null
          role?: UserRole
          avatar_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      vehicles: {
        Row: {
          id: string
          company_id: string
          plate_number: string
          plate_number_ar: string | null
          make: string
          model: string
          year: number
          color: string | null
          vin: string | null
          obd_device_id: string | null
          health_score: number
          status: VehicleStatus
          last_obd_reading_at: string | null
          mileage: number | null
          fuel_type: FuelType | null
          insurance_expiry: string | null
          registration_expiry: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          plate_number: string
          plate_number_ar?: string | null
          make: string
          model: string
          year: number
          color?: string | null
          vin?: string | null
          obd_device_id?: string | null
          health_score?: number
          status?: VehicleStatus
          last_obd_reading_at?: string | null
          mileage?: number | null
          fuel_type?: FuelType | null
          insurance_expiry?: string | null
          registration_expiry?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          plate_number?: string
          plate_number_ar?: string | null
          make?: string
          model?: string
          year?: number
          color?: string | null
          vin?: string | null
          obd_device_id?: string | null
          health_score?: number
          status?: VehicleStatus
          last_obd_reading_at?: string | null
          mileage?: number | null
          fuel_type?: FuelType | null
          insurance_expiry?: string | null
          registration_expiry?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      obd_readings: {
        Row: {
          id: string
          vehicle_id: string
          company_id: string
          timestamp: string
          engine_temp: number | null
          rpm: number | null
          speed: number | null
          fuel_level: number | null
          battery_voltage: number | null
          engine_load: number | null
          coolant_temp: number | null
          throttle_position: number | null
          intake_air_temp: number | null
          maf_rate: number | null
          dtc_codes: string[] | null
          raw_data: any | null
          created_at: string
        }
        Insert: {
          id?: string
          vehicle_id: string
          company_id: string
          timestamp?: string
          engine_temp?: number | null
          rpm?: number | null
          speed?: number | null
          fuel_level?: number | null
          battery_voltage?: number | null
          engine_load?: number | null
          coolant_temp?: number | null
          throttle_position?: number | null
          intake_air_temp?: number | null
          maf_rate?: number | null
          dtc_codes?: string[] | null
          raw_data?: any | null
          created_at?: string
        }
        Update: {
          id?: string
          vehicle_id?: string
          company_id?: string
          timestamp?: string
          engine_temp?: number | null
          rpm?: number | null
          speed?: number | null
          fuel_level?: number | null
          battery_voltage?: number | null
          engine_load?: number | null
          coolant_temp?: number | null
          throttle_position?: number | null
          intake_air_temp?: number | null
          maf_rate?: number | null
          dtc_codes?: string[] | null
          raw_data?: any | null
          created_at?: string
        }
      }
      alerts: {
        Row: {
          id: string
          vehicle_id: string
          company_id: string
          type: AlertType
          severity: AlertSeverity
          title: string
          title_ar: string | null
          message: string
          message_ar: string | null
          status: AlertStatus
          assigned_to: string | null
          resolved_at: string | null
          resolved_by: string | null
          metadata: any | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          vehicle_id: string
          company_id: string
          type: AlertType
          severity: AlertSeverity
          title: string
          title_ar?: string | null
          message: string
          message_ar?: string | null
          status?: AlertStatus
          assigned_to?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          metadata?: any | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          vehicle_id?: string
          company_id?: string
          type?: AlertType
          severity?: AlertSeverity
          title?: string
          title_ar?: string | null
          message?: string
          message_ar?: string | null
          status?: AlertStatus
          assigned_to?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          metadata?: any | null
          created_at?: string
          updated_at?: string
        }
      }
      maintenance_logs: {
        Row: {
          id: string
          vehicle_id: string
          company_id: string
          type: MaintenanceType
          description: string | null
          description_ar: string | null
          cost: number | null
          mileage_at_service: number | null
          performed_by: string | null
          performed_at: string
          next_service_date: string | null
          next_service_mileage: number | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          vehicle_id: string
          company_id: string
          type: MaintenanceType
          description?: string | null
          description_ar?: string | null
          cost?: number | null
          mileage_at_service?: number | null
          performed_by?: string | null
          performed_at?: string
          next_service_date?: string | null
          next_service_mileage?: number | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          vehicle_id?: string
          company_id?: string
          type?: MaintenanceType
          description?: string | null
          description_ar?: string | null
          cost?: number | null
          mileage_at_service?: number | null
          performed_by?: string | null
          performed_at?: string
          next_service_date?: string | null
          next_service_mileage?: number | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      dtc_library: {
        Row: {
          code: string
          description_en: string
          description_ar: string
          severity: AlertSeverity
          category: string | null
          recommended_action_en: string | null
          recommended_action_ar: string | null
        }
        Insert: {
          code: string
          description_en: string
          description_ar: string
          severity?: AlertSeverity
          category?: string | null
          recommended_action_en?: string | null
          recommended_action_ar?: string | null
        }
        Update: {
          code?: string
          description_en?: string
          description_ar?: string
          severity?: AlertSeverity
          category?: string | null
          recommended_action_en?: string | null
          recommended_action_ar?: string | null
        }
      }
      subscriptions: {
        Row: {
          id: string
          company_id: string
          plan: PlanType
          status: SubscriptionStatus
          current_period_start: string | null
          current_period_end: string | null
          payment_provider: string | null
          payment_provider_id: string | null
          amount: number | null
          currency: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          plan: PlanType
          status?: SubscriptionStatus
          current_period_start?: string | null
          current_period_end?: string | null
          payment_provider?: string | null
          payment_provider_id?: string | null
          amount?: number | null
          currency?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          plan?: PlanType
          status?: SubscriptionStatus
          current_period_start?: string | null
          current_period_end?: string | null
          payment_provider?: string | null
          payment_provider_id?: string | null
          amount?: number | null
          currency?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      notification_preferences: {
        Row: {
          id: string
          user_id: string
          company_id: string
          whatsapp_enabled: boolean
          sms_enabled: boolean
          email_enabled: boolean
          critical_alerts: boolean
          warning_alerts: boolean
          info_alerts: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          company_id: string
          whatsapp_enabled?: boolean
          sms_enabled?: boolean
          email_enabled?: boolean
          critical_alerts?: boolean
          warning_alerts?: boolean
          info_alerts?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          company_id?: string
          whatsapp_enabled?: boolean
          sms_enabled?: boolean
          email_enabled?: boolean
          critical_alerts?: boolean
          warning_alerts?: boolean
          info_alerts?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_company_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type Company = Database['public']['Tables']['companies']['Row']
export type User = Database['public']['Tables']['users']['Row']
export type Vehicle = Database['public']['Tables']['vehicles']['Row']
export type OBDReading = Database['public']['Tables']['obd_readings']['Row']
export type Alert = Database['public']['Tables']['alerts']['Row']
export type MaintenanceLog = Database['public']['Tables']['maintenance_logs']['Row']
export type DTCCode = Database['public']['Tables']['dtc_library']['Row']
export type Subscription = Database['public']['Tables']['subscriptions']['Row']
export type NotificationPreference = Database['public']['Tables']['notification_preferences']['Row']
