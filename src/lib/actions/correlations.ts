'use server';

import { createClient } from '@/lib/supabase/server';
import type { CorrelationPattern } from '../dtc-correlation-engine';

export async function fetchCorrelationPatterns(): Promise<CorrelationPattern[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('dtc_correlations')
    .select('*')
    .order('risk_level', { ascending: true });

  if (error) {
    console.error('Server: Error fetching correlations:', error);
    return [];
  }
  return (data ?? []) as any as CorrelationPattern[];
}
