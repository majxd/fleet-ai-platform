-- migrations/xxxx_create_alerts.sql

CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL,
  vehicle_id UUID NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('health_critical', 'health_warning', 'dtc_fault', 'maintenance_overdue', 'battery_low', 'temperature_high')),
  severity TEXT NOT NULL CHECK (severity IN ('critical', 'warning', 'info')),
  title_ar TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description_ar TEXT,
  description_en TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved')),
  assigned_to UUID REFERENCES auth.users(id),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

-- Create policy for users to see only alerts matching their company_id
-- We assume the user's company_id is available in their jwt claims or via a function.
-- Supposing a standard supabase check `auth.uid() IN (SELECT user_id FROM ...)` but per rule #1 every table has company_id and we usually do:
CREATE POLICY "Users can view alerts for their company"
  ON alerts FOR SELECT
  USING (
    company_id IN (
      SELECT company_id 
      FROM users 
      WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can insert alerts for their company"
  ON alerts FOR INSERT
  WITH CHECK (
    company_id IN (
      SELECT company_id 
      FROM users 
      WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update alerts for their company"
  ON alerts FOR UPDATE
  USING (
    company_id IN (
      SELECT company_id 
      FROM users 
      WHERE id = auth.uid()
    )
  );

-- Trigger to update 'updated_at' on row update
CREATE OR REPLACE FUNCTION update_alerts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_alerts_updated_at_trigger
BEFORE UPDATE ON alerts
FOR EACH ROW
EXECUTE FUNCTION update_alerts_updated_at();
