import { createClient } from "@/lib/supabase/client";
import { AlertStatus } from "@/types/alert";
import { Database } from "@/types/database";

export async function updateAlertStatus(
  alertId: string,
  status: AlertStatus,
  resolvedBy?: string
) {
  const supabase = createClient();

  const { data: { session } } = await supabase.auth.getSession();
  const companyId = session?.user?.user_metadata?.company_id;

  if (!companyId) {
    throw new Error("No active session or company ID found");
  }

  const updates: Database['public']['Tables']['alerts']['Update'] = {
    status,
    updated_at: new Date().toISOString(),
  };

  if (status === 'resolved') {
    updates.resolved_at = new Date().toISOString();
    if (resolvedBy) updates.resolved_by = resolvedBy;
    else if (session?.user?.id) updates.resolved_by = session.user.id;
  }

  const { data, error } = await supabase
    .from('alerts')
    // @ts-expect-error - bypass overzealous supabase type inferences
    .update(updates as any)
    .eq('id', alertId)
    .eq('company_id', companyId)
    .select()
    .single();

  if (error) {
    console.error('Update error:', JSON.stringify(error));
    throw error;
  }

  return data;
}
