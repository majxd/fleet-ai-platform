import { createClient } from '@/lib/supabase/server';

export async function getRecentAlerts(companyId: string, limit: number = 5) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('alerts')
    .select('*')
    .eq('company_id', companyId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching recent alerts:', error);
    return [];
  }

  return data;
}
