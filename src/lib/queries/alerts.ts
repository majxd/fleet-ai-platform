import { createClient } from '@/lib/supabase/server';
import { Alert, AlertSeverity, AlertStatus } from '@/types/alert';

export async function getRecentAlerts(companyId: string, limit: number = 5) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('alerts')
    .select('*, vehicles(plate_number, plate_number_ar)')
    .eq('company_id', companyId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching recent alerts:', error);
    return [];
  }

  return data;
}

export async function getAllAlerts(
  companyId: string,
  filters?: {
    severity?: string;
    status?: string;
  }
): Promise<Alert[]> {
  const supabase = await createClient();

  let query = supabase
    .from('alerts')
    .select('*, vehicles(plate_number, plate_number_ar)')
    .eq('company_id', companyId)
    .order('created_at', { ascending: false });

  if (filters?.severity && filters.severity !== 'all') {
    query = query.eq('severity', filters.severity);
  }

  if (filters?.status && filters.status !== 'all') {
    query = query.eq('status', filters.status);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching all alerts:', JSON.stringify(error, null, 2));
    return [];
  }

  return data as any as Alert[];
}



export async function getAlertStats(companyId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('alerts')
    .select('status, severity')
    .eq('company_id', companyId);

  if (error) {
    console.error('Error fetching alert stats:', error);
    return {
      total: 0,
      new: 0,
      inProgress: 0,
      resolved: 0,
      critical: 0,
      warning: 0,
      info: 0,
    };
  }

  const typedData = data as any as { status: string; severity: string }[] || [];

  const stats = {
    total: typedData.length,
    new: typedData.filter((a) => a.status === 'new').length,
    inProgress: typedData.filter((a) => a.status === 'in_progress').length,
    resolved: typedData.filter((a) => a.status === 'resolved').length,
    critical: typedData.filter((a) => a.severity === 'critical').length,
    warning: typedData.filter((a) => a.severity === 'warning').length,
    info: typedData.filter((a) => a.severity === 'info').length,
  };

  return stats;
}
