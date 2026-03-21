import { createBrowserClient } from "@supabase/ssr";
import { AlertStatus } from "@/types/alert";

export async function updateAlertStatus(
  alertId: string,
  status: AlertStatus,
  resolvedBy?: string
) {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const updates: any = {
    status,
    updated_at: new Date().toISOString(),
  };

  if (status === 'resolved') {
    updates.resolved_at = new Date().toISOString();
    if (resolvedBy) updates.resolved_by = resolvedBy;
  }

  const { data, error } = await supabase
    .from('alerts')
    .update(updates)
    .eq('id', alertId)
    .select()
    .single();

  if (error) {
    console.error('Error updating alert status:', error);
    throw error;
  }

  return data;
}
