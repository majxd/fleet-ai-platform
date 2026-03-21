-- Function: auto-create alert when health_score changes
CREATE OR REPLACE FUNCTION create_health_alert()
RETURNS TRIGGER AS $$
BEGIN
  -- Only trigger if health_score actually changed
  IF OLD.health_score IS DISTINCT FROM NEW.health_score THEN
    -- Critical alert (score < 40)
    IF NEW.health_score < 40 AND (OLD.health_score >= 40 OR OLD.health_score IS NULL) THEN
      INSERT INTO alerts (vehicle_id, company_id, type, severity, title, title_ar, message, message_ar, status)
      VALUES (
        NEW.id, NEW.company_id, 'health_score', 'critical',
        'Critical health score', 'مستوى صحة حرج',
        'Vehicle health dropped below 40 - immediate attention required',
        'صحة المركبة انخفضت تحت 40 - تحتاج اهتمام فوري',
        'new'
      );
    -- Warning alert (score < 70)
    ELSIF NEW.health_score < 70 AND (OLD.health_score >= 70 OR OLD.health_score IS NULL) THEN
      INSERT INTO alerts (vehicle_id, company_id, type, severity, title, title_ar, message, message_ar, status)
      VALUES (
        NEW.id, NEW.company_id, 'health_score', 'warning',
        'Health score warning', 'تحذير مستوى الصحة',
        'Vehicle health dropped below 70 - schedule maintenance soon',
        'صحة المركبة انخفضت تحت 70 - جدول صيانة قريبا',
        'new'
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger on vehicles table
DROP TRIGGER IF EXISTS health_score_alert_trigger ON vehicles;
CREATE TRIGGER health_score_alert_trigger
  AFTER UPDATE OF health_score ON vehicles
  FOR EACH ROW
  EXECUTE FUNCTION create_health_alert();
