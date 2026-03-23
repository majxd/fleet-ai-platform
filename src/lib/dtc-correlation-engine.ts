// lib/dtc-correlation-engine.ts
// FleetAI Level 2: Smart Diagnosis — Correlation Engine
// Takes a list of active DTC codes + sensor data → returns root cause diagnosis

import type { SupabaseClient } from '@supabase/supabase-js';

// ============================================================
// TYPES
// ============================================================

export interface SensorData {
  engine_temp?: number | null;
  battery_voltage?: number | null;
  fuel_level?: number | null;
  rpm?: number | null;
  days_since_maintenance?: number | null;
}

export interface CorrelationPattern {
  id: string;
  code_pattern: string[];
  root_cause_ar: string;
  root_cause_en: string;
  diagnosis_ar: string;
  diagnosis_en: string;
  fix_order: string;
  fix_order_en: string;
  individual_cost: string;
  individual_cost_en: string;
  smart_cost: string;
  smart_cost_en: string;
  risk_level: 'critical' | 'high' | 'medium' | 'low';
  risk_description_ar: string;
  risk_description_en: string;
  sensor_conditions: Record<string, { min?: number; max?: number; note?: string }>;
  sensor_conditions_en: Record<string, { min?: number; max?: number; note?: string }>;
  vehicle_categories: string[];
}

export interface SmartDiagnosis {
  pattern: CorrelationPattern;
  matched_codes: string[];
  unmatched_codes: string[];
  sensor_warnings: SensorWarning[];
  savings_potential: boolean;
  confidence: 'high' | 'medium' | 'low';
}

export interface SensorWarning {
  sensor: string;
  current_value: number;
  condition: { min?: number; max?: number; note?: string };
  message_ar: string;
  message_en: string;
}

export interface DiagnosisResult {
  has_correlations: boolean;
  diagnoses: SmartDiagnosis[];
  uncorrelated_codes: string[];
  overall_risk: 'critical' | 'high' | 'medium' | 'low' | 'none';
  total_potential_savings_ar: string;
}

// ============================================================
// SENSOR LABELS (for warnings)
// ============================================================

const SENSOR_LABELS: Record<string, { ar: string; en: string; unit: string }> = {
  engine_temp: { ar: 'درجة حرارة المحرك', en: 'Engine Temperature', unit: '°C' },
  battery_voltage: { ar: 'جهد البطارية', en: 'Battery Voltage', unit: 'V' },
  fuel_level: { ar: 'مستوى الوقود', en: 'Fuel Level', unit: '%' },
  rpm: { ar: 'دورات المحرك', en: 'Engine RPM', unit: 'RPM' },
  days_since_maintenance: { ar: 'أيام منذ آخر صيانة', en: 'Days Since Maintenance', unit: '' },
};

// ============================================================
// RISK PRIORITY ORDER
// ============================================================

const RISK_PRIORITY: Record<string, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
  none: 0,
};

// ============================================================
// MAIN ENGINE
// ============================================================

export async function analyzeCorrelations(
  supabase: SupabaseClient,
  activeCodes: string[],
  sensorData: SensorData = {},
  locale: 'ar' | 'en' = 'ar'
): Promise<DiagnosisResult> {
  if (activeCodes.length === 0) {
    return {
      has_correlations: false,
      diagnoses: [],
      uncorrelated_codes: [],
      overall_risk: 'none',
      total_potential_savings_ar: '',
    };
  }

  if (activeCodes.length === 1) {
    return {
      has_correlations: false,
      diagnoses: [],
      uncorrelated_codes: activeCodes,
      overall_risk: 'none',
      total_potential_savings_ar: locale === 'ar' ? 'كود واحد فقط — راجع التشخيص الفردي في المستوى الأول' : 'Only one code — check individual diagnosis',
    };
  }

  const normalizedCodes = activeCodes.map((code) => code.trim().toUpperCase());

  const patterns = await fetchCorrelationPatterns(supabase);

  if (patterns.length === 0) {
    return {
      has_correlations: false,
      diagnoses: [],
      uncorrelated_codes: normalizedCodes,
      overall_risk: 'none',
      total_potential_savings_ar: '',
    };
  }

  const diagnoses = matchPatterns(patterns, normalizedCodes, sensorData, locale);

  const matchedCodesSet = new Set<string>();
  for (const diagnosis of diagnoses) {
    for (const code of diagnosis.matched_codes) {
      matchedCodesSet.add(code);
    }
  }
  const uncorrelatedCodes = normalizedCodes.filter(
    (code) => !matchedCodesSet.has(code)
  );

  const overallRisk = diagnoses.length > 0
    ? diagnoses.reduce((highest, d) => {
        return RISK_PRIORITY[d.pattern.risk_level] > RISK_PRIORITY[highest]
          ? d.pattern.risk_level
          : highest;
      }, 'low' as 'critical' | 'high' | 'medium' | 'low')
    : 'none' as const;

  diagnoses.sort(
    (a, b) =>
      RISK_PRIORITY[b.pattern.risk_level] - RISK_PRIORITY[a.pattern.risk_level]
  );

  return {
    has_correlations: diagnoses.length > 0,
    diagnoses,
    uncorrelated_codes: uncorrelatedCodes,
    overall_risk: overallRisk,
    total_potential_savings_ar: calculateTotalSavings(diagnoses, locale),
  };
}

// ============================================================
// PATTERN FETCHING
// ============================================================

async function fetchCorrelationPatterns(
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

// ============================================================
// PATTERN MATCHING
// ============================================================

function matchPatterns(
  patterns: CorrelationPattern[],
  activeCodes: string[],
  sensorData: SensorData,
  locale: 'ar' | 'en'
): SmartDiagnosis[] {
  const diagnoses: SmartDiagnosis[] = [];
  const activeCodesSet = new Set(activeCodes);

  for (const pattern of patterns) {
    const matchedCodes = pattern.code_pattern.filter((code) =>
      activeCodesSet.has(code)
    );

    const matchRatio = matchedCodes.length / pattern.code_pattern.length;
    const isFullMatch = matchRatio === 1;
    const isPartialMatch = matchedCodes.length >= 2 && matchRatio >= 0.6;

    if (!isFullMatch && !isPartialMatch) {
      continue;
    }

    const sensorWarnings = checkSensorConditions(
      pattern.sensor_conditions,
      pattern.sensor_conditions_en,
      sensorData
    );

    const confidence: 'high' | 'medium' | 'low' = isFullMatch
      ? 'high'
      : sensorWarnings.length > 0
        ? 'medium'
        : 'low';

    const unmatchedCodes = pattern.code_pattern.filter(
      (code) => !activeCodesSet.has(code)
    );

    diagnoses.push({
      pattern,
      matched_codes: matchedCodes,
      unmatched_codes: unmatchedCodes,
      sensor_warnings: sensorWarnings,
      savings_potential: pattern.individual_cost !== pattern.smart_cost,
      confidence,
    });
  }

  return diagnoses;
}

// ============================================================
// SENSOR CONDITION CHECKING
// ============================================================

function checkSensorConditions(
  conditionsAr: Record<string, { min?: number; max?: number; note?: string }>,
  conditionsEn: Record<string, { min?: number; max?: number; note?: string }>,
  sensorData: SensorData
): SensorWarning[] {
  const warnings: SensorWarning[] = [];
  const baseConditions = conditionsAr || {};

  for (const [sensorKey, condition] of Object.entries(baseConditions)) {
    const value = sensorData[sensorKey as keyof SensorData];

    if (value === null || value === undefined) {
      continue;
    }

    const numValue = Number(value);
    let triggered = false;

    if (condition.min !== undefined && numValue >= condition.min) {
      triggered = true;
    }
    if (condition.max !== undefined && numValue <= condition.max) {
      triggered = true;
    }

    if (triggered) {
      const label = SENSOR_LABELS[sensorKey] ?? {
        ar: sensorKey,
        en: sensorKey,
        unit: '',
      };

      const noteAr = condition.note ?? 'يؤكد التشخيص';
      const noteEn = conditionsEn?.[sensorKey]?.note ?? 'Confirms diagnosis';

      warnings.push({
        sensor: sensorKey,
        current_value: numValue,
        condition,
        message_ar: `${label.ar}: ${numValue}${label.unit} — ${noteAr}`,
        message_en: `${label.en}: ${numValue}${label.unit} — ${noteEn}`,
      });
    }
  }

  return warnings;
}

// ============================================================
// SAVINGS CALCULATION
// ============================================================

function calculateTotalSavings(diagnoses: SmartDiagnosis[], locale: 'ar' | 'en'): string {
  if (diagnoses.length === 0) return '';

  const savingsDescriptions = diagnoses
    .filter((d) => d.savings_potential)
    .map(
      (d) => locale === 'ar' 
        ? `التكلفة العادية: ${d.pattern.individual_cost} ← التكلفة الذكية: ${d.pattern.smart_cost}`
        : `Normal Cost: ${d.pattern.individual_cost_en || d.pattern.individual_cost} ← Smart Cost: ${d.pattern.smart_cost_en || d.pattern.smart_cost}`
    );

  if (savingsDescriptions.length === 0) return '';

  return savingsDescriptions.length === 1
    ? savingsDescriptions[0]
    : locale === 'ar'
      ? `${diagnoses.length} أنماط مكتشفة — تحقق من التفاصيل لمعرفة التوفير المحتمل`
      : `${diagnoses.length} patterns detected — check details for potential savings`;
}
