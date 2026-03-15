import { createClient } from '@/lib/supabase/server';

export async function getLatestOBDReading(vehicleId: string) {
  const supabase = await createClient();

  // OBD readings table has 'vehicle_id'. Ordered by timestamp or created_at DESC.
  const { data, error } = await supabase
    .from('obd_readings')
    .select('*')
    .eq('vehicle_id', vehicleId)
    .order('timestamp', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('Error fetching latest OBD reading:', error);
    return null;
  }

  return data as import('@/types/database').OBDReading | null;
}

export async function getLatestOBDReadingsForVehicles(vehicleIds: string[]) {
  const supabase = await createClient();

  if (vehicleIds.length === 0) return [];

  // Note: For a real scale production app, we might use a rpc function or view.
  // For MVP, we can fetch all and group, or fetch latest.
  // We'll fetch the most recent ones for the vehicles.
  // Supabase/PostgREST doesn't have a simple DISTINCT ON natively via JS client without RPC.
  // Since we only have 12 seed vehicles, we'll fetch them individually or all readings and filter.
  // Let's use individual queries natively or a stored procedure.
  // For simplicity and matching Mock data performance for 12 items:
  const promises = vehicleIds.map(id => getLatestOBDReading(id));
  const results = await Promise.all(promises);
  return results.filter(Boolean);
}

export async function getOBDHistory(vehicleId: string, days: number) {
  const supabase = await createClient();
  const dateLimit = new Date();
  dateLimit.setDate(dateLimit.getDate() - days);

  const { data, error } = await supabase
    .from('obd_readings')
    .select('*')
    .eq('vehicle_id', vehicleId)
    .gte('timestamp', dateLimit.toISOString())
    .order('timestamp', { ascending: true }); // Oldest to newest for charts

  if (error) {
    console.error('Error fetching OBD history:', error);
    return [];
  }

  return data as import('@/types/database').OBDReading[];
}
