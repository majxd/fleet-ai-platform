CREATE OR REPLACE FUNCTION public.get_user_company_id()
RETURNS UUID AS $$
  SELECT company_id FROM public.users WHERE id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.users WHERE id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ENABLE RLS
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.obd_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dtc_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

-- 1. COMPANIES POLICIES
CREATE POLICY "Users can view their own company" ON public.companies
  FOR SELECT USING (id = public.get_user_company_id());

CREATE POLICY "Only owners can update company" ON public.companies
  FOR UPDATE USING (id = public.get_user_company_id() AND public.get_user_role() = 'owner');

-- 2. USERS POLICIES
CREATE POLICY "Users can view team members" ON public.users
  FOR SELECT USING (company_id = public.get_user_company_id());

CREATE POLICY "Users can insert themselves on signup" ON public.users
  FOR INSERT WITH CHECK (id = auth.uid());

CREATE POLICY "Users can update own profile, Owners/Managers can update team" ON public.users
  FOR UPDATE USING (
    company_id = public.get_user_company_id() AND (
      id = auth.uid() OR
      public.get_user_role() IN ('owner', 'manager')
    )
  );

CREATE POLICY "Only owners can delete users" ON public.users
  FOR DELETE USING (company_id = public.get_user_company_id() AND public.get_user_role() = 'owner');

-- 3. VEHICLES POLICIES
CREATE POLICY "Users can view company vehicles" ON public.vehicles
  FOR SELECT USING (company_id = public.get_user_company_id());

CREATE POLICY "Owners and Managers can create vehicles" ON public.vehicles
  FOR INSERT WITH CHECK (company_id = public.get_user_company_id() AND public.get_user_role() IN ('owner', 'manager'));

CREATE POLICY "Owners and Managers can update vehicles" ON public.vehicles
  FOR UPDATE USING (company_id = public.get_user_company_id() AND public.get_user_role() IN ('owner', 'manager'));

CREATE POLICY "Owners and Managers can delete vehicles" ON public.vehicles
  FOR DELETE USING (company_id = public.get_user_company_id() AND public.get_user_role() IN ('owner', 'manager'));

-- 4. OBD READINGS POLICIES
CREATE POLICY "Users can view company OBD readings" ON public.obd_readings
  FOR SELECT USING (company_id = public.get_user_company_id());

CREATE POLICY "Users can insert OBD readings" ON public.obd_readings
  FOR INSERT WITH CHECK (company_id = public.get_user_company_id());

-- 5. ALERTS POLICIES
CREATE POLICY "Users can view company alerts" ON public.alerts
  FOR SELECT USING (company_id = public.get_user_company_id());

CREATE POLICY "Owners and Managers can create alerts" ON public.alerts
  FOR INSERT WITH CHECK (company_id = public.get_user_company_id() AND public.get_user_role() IN ('owner', 'manager'));

CREATE POLICY "Users can update company alerts" ON public.alerts
  FOR UPDATE USING (company_id = public.get_user_company_id());

CREATE POLICY "Owners and Managers can delete alerts" ON public.alerts
  FOR DELETE USING (company_id = public.get_user_company_id() AND public.get_user_role() IN ('owner', 'manager'));

-- 6. MAINTENANCE LOGS POLICIES
CREATE POLICY "Users can view company maintenance logs" ON public.maintenance_logs
  FOR SELECT USING (company_id = public.get_user_company_id());

CREATE POLICY "Owners, Managers, and Technicians can create maintenance logs" ON public.maintenance_logs
  FOR INSERT WITH CHECK (company_id = public.get_user_company_id() AND public.get_user_role() IN ('owner', 'manager', 'technician'));

CREATE POLICY "Owners, Managers, and Technicians can update maintenance logs" ON public.maintenance_logs
  FOR UPDATE USING (company_id = public.get_user_company_id() AND public.get_user_role() IN ('owner', 'manager', 'technician'));

CREATE POLICY "Owners and Managers can delete maintenance logs" ON public.maintenance_logs
  FOR DELETE USING (company_id = public.get_user_company_id() AND public.get_user_role() IN ('owner', 'manager'));

-- 7. DTC LIBRARY POLICIES
CREATE POLICY "Anyone can view DTC library" ON public.dtc_library
  FOR SELECT USING (true);

-- 8. SUBSCRIPTIONS POLICIES
CREATE POLICY "Owners can view company subscriptions" ON public.subscriptions
  FOR SELECT USING (company_id = public.get_user_company_id() AND public.get_user_role() = 'owner');

-- 9. NOTIFICATION PREFERENCES POLICIES
CREATE POLICY "Users can view own notification preferences" ON public.notification_preferences
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own notification preferences" ON public.notification_preferences
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own notification preferences" ON public.notification_preferences
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own notification preferences" ON public.notification_preferences
  FOR DELETE USING (user_id = auth.uid());
