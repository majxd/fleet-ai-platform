import { getSupabaseBrowserClient } from '@/lib/supabase-browser';

export async function updateAlertStatus(
  alertId: string,
  status: 'new' | 'in_progress' | 'resolved'
) {
  const supabase = getSupabaseBrowserClient()
  
  const updateData: { status: string; resolved_at?: string | null } = { status }
  if (status === 'resolved') {
    updateData.resolved_at = new Date().toISOString()
  } else {
    updateData.resolved_at = null
  }
  
  const { error } = await supabase
    .from('alerts')
    // @ts-expect-error - bypass overzealous supabase type inferences
    .update(updateData as any)
    .eq('id', alertId)
  
  if (error) throw error
}
