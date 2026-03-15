import { createClient } from '@/lib/supabase/server';

export async function getMaintenanceLogs(vehicleId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('maintenance_logs')
    .select('*')
    .eq('vehicle_id', vehicleId)
    .order('performed_at', { ascending: false });

  if (error) {
    console.error('Error fetching maintenance logs:', error);
    return [];
  }

  return data;
}
