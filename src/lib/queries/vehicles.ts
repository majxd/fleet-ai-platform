import { createClient } from '@/lib/supabase/server';
import { Database } from '@/types/database';

export type VehicleStats = {
  total: number;
  healthy: number;
  warning: number;
  critical: number;
};

export async function getVehicles(companyId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('company_id', companyId)
    .order('health_score', { ascending: true }); // Lowest score first

  if (error) {
    console.error('Error fetching vehicles:', error);
    return [];
  }

  return data;
}

export async function getVehicleById(vehicleId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('id', vehicleId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching vehicle by ID:', error);
    return null;
  }

  return data;
}

export async function getVehicleStats(companyId: string): Promise<VehicleStats> {
  const supabase = await createClient();
  const stats: VehicleStats = { total: 0, healthy: 0, warning: 0, critical: 0 };

  const { data, error } = await supabase
    .from('vehicles')
    .select('health_score')
    .eq('company_id', companyId);

  if (error || !data) {
    console.error('Error fetching vehicle stats:', error);
    return stats;
  }

  const vehicles = data as { health_score: number }[];
  stats.total = vehicles.length;

  vehicles.forEach((vehicle) => {
    if (vehicle.health_score > 70) {
      stats.healthy++;
    } else if (vehicle.health_score >= 40) {
      stats.warning++;
    } else {
      stats.critical++;
    }
  });

  return stats;
}
