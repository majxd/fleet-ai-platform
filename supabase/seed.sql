-- 1. Demo Company
INSERT INTO public.companies (id, name, name_ar, plan, vehicles_limit)
VALUES ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Al-Rajhi Car Rental', 'الراجحي لتأجير السيارات', 'professional', 50)
ON CONFLICT (id) DO NOTHING;

-- 2. User (Commented out)
-- INSERT INTO public.users (id, company_id, email, full_name, full_name_ar, role)
-- VALUES ('<supabase_auth_id>', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'admin@example.com', 'Admin User', 'مدير النظام', 'owner')
-- ON CONFLICT (id) DO NOTHING;

-- 3. Vehicles
INSERT INTO public.vehicles (company_id, plate_number, make, model, year, health_score, status) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'ABC-1234', 'Toyota', 'Camry', 2022, 92, 'active'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'DEF-5678', 'Hyundai', 'Accent', 2021, 78, 'active'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'GHI-9012', 'Nissan', 'Altima', 2023, 45, 'maintenance'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'JKL-3456', 'Toyota', 'Hilux', 2020, 88, 'active'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'MNO-7890', 'Kia', 'Cerato', 2022, 35, 'inactive'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'PQR-1234', 'Hyundai', 'Tucson', 2023, 95, 'active'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'STU-5678', 'Toyota', 'Yaris', 2021, 82, 'active'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'VWX-9012', 'Nissan', 'Patrol', 2020, 28, 'maintenance'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'YZA-3456', 'Kia', 'Sportage', 2022, 71, 'active'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'BCD-7890', 'Toyota', 'Land Cruiser', 2021, 65, 'active'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'EFG-1234', 'Hyundai', 'Elantra', 2023, 98, 'active'),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'HIJ-5678', 'Nissan', 'Sunny', 2022, 55, 'active')
ON CONFLICT (company_id, plate_number) DO NOTHING;

-- 4. 12 Common DTC Codes
INSERT INTO public.dtc_library (code, description_en, description_ar, severity, category) VALUES
('P0300', 'Random/Multiple Cylinder Misfire Detected', 'اكتشاف خلل في إشعال أسطوانات متعددة/عشوائية', 'critical', 'Engine'),
('P0301', 'Cylinder 1 Misfire Detected', 'اكتشاف خلل في إشعال الأسطوانة رقم 1', 'critical', 'Engine'),
('P0420', 'Catalyst System Efficiency Below Threshold', 'كفاءة نظام المحول الحفاز أقل من الحد المطلوب', 'warning', 'Exhaust'),
('P0171', 'System Too Lean (Bank 1)', 'خليط الوقود فقير جداً (الضفة 1)', 'warning', 'Fuel System'),
('P0128', 'Coolant Thermostat (Coolant Temperature Below Thermostat Regulating Temperature)', 'ترموستات سائل التبريد (درجة حرارة منخفضة)', 'info', 'Cooling System'),
('P0455', 'Evaporative Emission System Leak Detected (Gross Leak/No Flow)', 'تسرب كبير في نظام انبعاثات التبخر', 'warning', 'Emissions'),
('P0500', 'Vehicle Speed Sensor "A" Malfunction', 'عطل في حساس سرعة المركبة "أ"', 'critical', 'Transmission'),
('P0700', 'Transmission Control System (MIL Request)', 'نظام التحكم في ناقل الحركة', 'critical', 'Transmission'),
('P0440', 'Evaporative Emission Control System Malfunction', 'عطل في نظام التحكم بانبعاثات التبخر', 'warning', 'Emissions'),
('P0442', 'Evaporative Emission Control System Leak Detected (Small Leak)', 'تسرب صغير في نظام التحكم بانبعاثات التبخر', 'info', 'Emissions'),
('P0401', 'Exhaust Gas Recirculation Flow Insufficient Detected', 'تدفق غير كافٍ في نظام إعادة تدوير غاز العادم', 'warning', 'Emissions'),
('P0340', 'Camshaft Position Sensor "A" Circuit', 'عطل في دائرة حساس موضع عمود الكامات', 'critical', 'Engine')
ON CONFLICT (code) DO NOTHING;
