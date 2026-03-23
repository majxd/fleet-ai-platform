// lib/queries/correlations.ts
// FleetAI Level 2: Database queries for dtc_correlations table

import type { SupabaseClient } from '@supabase/supabase-js';
import type { CorrelationPattern } from '../dtc-correlation-engine';

export async function getAllCorrelationPatterns(
  supabase: SupabaseClient
): Promise<CorrelationPattern[]> {
  const { data, error } = await supabase
    .from('dtc_correlations')
    .select('*')
    .order('risk_level', { ascending: true });

  if (error) {
    console.error('Error fetching correlation patterns:', error);
    return [];
  }

  return (data ?? []) as CorrelationPattern[];
}

export async function getPatternsByRiskLevel(
  supabase: SupabaseClient,
  riskLevel: 'critical' | 'high' | 'medium' | 'low'
): Promise<CorrelationPattern[]> {
  const { data, error } = await supabase
    .from('dtc_correlations')
    .select('*')
    .eq('risk_level', riskLevel);

  if (error) {
    console.error('Error fetching patterns by risk level:', error);
    return [];
  }

  return (data ?? []) as CorrelationPattern[];
}

export async function getPatternsByCode(
  supabase: SupabaseClient,
  dtcCode: string
): Promise<CorrelationPattern[]> {
  const { data, error } = await supabase
    .from('dtc_correlations')
    .select('*')
    .contains('code_pattern', [dtcCode.trim().toUpperCase()]);

  if (error) {
    console.error('Error fetching patterns by code:', error);
    return [];
  }

  return (data ?? []) as CorrelationPattern[];
}

export async function getCorrelationById(
  supabase: SupabaseClient,
  id: string
): Promise<CorrelationPattern | null> {
  const { data, error } = await supabase
    .from('dtc_correlations')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching correlation by id:', error);
    return null;
  }

  return data as CorrelationPattern;
}

export async function getCorrelationPatternCount(
  supabase: SupabaseClient
): Promise<number> {
  const { count, error } = await supabase
    .from('dtc_correlations')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error('Error counting patterns:', error);
    return 0;
  }

  return count ?? 0;
}

export async function findPatternsForCodes(
  supabase: SupabaseClient,
  dtcCodes: string[]
): Promise<CorrelationPattern[]> {
  if (dtcCodes.length === 0) return [];

  const normalizedCodes = dtcCodes.map((c) => c.trim().toUpperCase());

  const { data, error } = await supabase
    .from('dtc_correlations')
    .select('*')
    .overlaps('code_pattern', normalizedCodes);

  if (error) {
    console.error('Error finding patterns for codes:', error);
    return [];
  }

  return (data ?? []) as CorrelationPattern[];
}
