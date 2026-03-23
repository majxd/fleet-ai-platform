// components/fleet/SmartDiagnosis.tsx
// FleetAI Level 2: Smart Diagnosis UI Component

'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  AlertTriangle,
  Brain,
  ChevronDown,
  ChevronUp,
  CircleDollarSign,
  Shield,
  Wrench,
  Zap,
  ThermometerSun,
  Battery,
  Fuel,
  Clock,
  CheckCircle2,
  XCircle,
  Info,
} from 'lucide-react';
import { fetchCorrelationPatterns } from '@/lib/actions/correlations';
import {
  analyzeCorrelations,
  type DiagnosisResult,
  type SmartDiagnosis as SmartDiagnosisType,
  type SensorData,
} from '../../lib/dtc-correlation-engine';

// ============================================================
// PROPS
// ============================================================

interface SmartDiagnosisProps {
  activeDtcCodes: string[];
  sensorData: SensorData;
  vehicleModel?: string;
  locale: 'ar' | 'en';
}

// ============================================================
// RISK LEVEL CONFIG
// ============================================================

const RISK_CONFIG = {
  critical: {
    color: 'bg-red-500/10 border-red-500/30 text-red-400',
    badge: 'bg-red-500/20 text-red-400 border-red-500/40',
    icon: AlertTriangle,
    label_ar: 'حرج',
    label_en: 'Critical',
  },
  high: {
    color: 'bg-orange-500/10 border-orange-500/30 text-orange-400',
    badge: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
    icon: Zap,
    label_ar: 'عالي',
    label_en: 'High',
  },
  medium: {
    color: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
    badge: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
    icon: Info,
    label_ar: 'متوسط',
    label_en: 'Medium',
  },
  low: {
    color: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
    badge: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
    icon: Shield,
    label_ar: 'منخفض',
    label_en: 'Low',
  },
} as const;

const CONFIDENCE_CONFIG = {
  high: { label_ar: 'ثقة عالية', label_en: 'High Confidence', color: 'text-green-400' },
  medium: { label_ar: 'ثقة متوسطة', label_en: 'Medium Confidence', color: 'text-yellow-400' },
  low: { label_ar: 'ثقة منخفضة', label_en: 'Low Confidence', color: 'text-orange-400' },
} as const;

const SENSOR_ICONS: Record<string, typeof ThermometerSun> = {
  engine_temp: ThermometerSun,
  battery_voltage: Battery,
  fuel_level: Fuel,
  days_since_maintenance: Clock,
};

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function SmartDiagnosis({
  activeDtcCodes,
  sensorData,
  vehicleModel,
  locale,
}: SmartDiagnosisProps) {
  const t = useTranslations('smartDiagnosis');
  const isAr = locale === 'ar';

  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function runAnalysis() {
      try {
        setLoading(true);
        setError(null);
        const patterns = await fetchCorrelationPatterns();
        const diagnosis = analyzeCorrelations(
          patterns,
          activeDtcCodes,
          sensorData,
          locale
        );
        setResult(diagnosis);
      } catch (err) {
        console.error('Smart diagnosis error:', err);
        setError(isAr ? 'حدث خطأ في التحليل' : 'Analysis error occurred');
      } finally {
        setLoading(false);
      }
    }

    if (activeDtcCodes.length > 0) {
      runAnalysis();
    } else {
      setLoading(false);
      setResult(null);
    }
  }, [activeDtcCodes, sensorData, isAr]);

  // Loading State
  if (loading) {
    return (
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
        <div className="flex items-center gap-3">
          <Brain className="h-5 w-5 animate-pulse text-blue-400" />
          <span className="text-sm text-zinc-400">
            {t('analyzing')}
          </span>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-6">
        <div className="flex items-center gap-3">
          <XCircle className="h-5 w-5 text-red-400" />
          <span className="text-sm text-red-400">{error}</span>
        </div>
      </div>
    );
  }

  // No Active Codes
  if (!result || activeDtcCodes.length === 0) {
    return null;
  }

  // No Correlations Found
  if (!result.has_correlations) {
    if (activeDtcCodes.length < 2) return null;
    return (
      <div className="rounded-lg border border-gray-100 bg-gray-50/50 p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-gray-400" />
          <span className="text-sm text-gray-500 font-medium">
            {t('noCorrelations')}
          </span>
        </div>
      </div>
    );
  }

  // Main View — Correlations Found
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2471A3]/10">
            <Brain className="h-5 w-5 text-[#2471A3]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-foreground">
                {t('title')}
              </h3>
              <span className="rounded-full bg-[#2471A3]/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#2471A3]">
                {t('level2')}
              </span>
            </div>
          </div>
        </div>
        {result.overall_risk !== 'none' && (
          <RiskBadge riskLevel={result.overall_risk} locale={locale} />
        )}
      </div>

      {/* Diagnosis Cards */}
      <div className="space-y-3">
        {result.diagnoses.map((diagnosis, index) => (
          <DiagnosisCard
            key={diagnosis.pattern.id}
            diagnosis={diagnosis}
            locale={locale}
            index={index}
          />
        ))}
      </div>

      {/* Uncorrelated Codes Notice */}
      {result.uncorrelated_codes.length > 0 && (
        <div className="rounded-lg border border-gray-100 bg-gray-50/50 p-4 shadow-sm">
          <p className="text-xs text-muted-foreground flex items-center gap-2">
            <Info className="h-4 w-4" />
            <span>
              <span className="font-semibold">{t('uncorrelatedCodes')}</span>{' '}
              <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-gray-100">
                {result.uncorrelated_codes.join(', ')}
              </span>
              {' — '}
              {t('checkIndividual')}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}

// ============================================================
// DIAGNOSIS CARD COMPONENT
// ============================================================

function DiagnosisCard({
  diagnosis,
  locale,
  index,
}: {
  diagnosis: SmartDiagnosisType;
  locale: 'ar' | 'en';
  index: number;
}) {
  const t = useTranslations('smartDiagnosis');
  const isAr = locale === 'ar';
  const [expanded, setExpanded] = useState(index === 0);

  const { pattern, matched_codes, sensor_warnings, confidence } = diagnosis;
  const riskConfig = RISK_CONFIG[pattern.risk_level];
  const confidenceConfig = CONFIDENCE_CONFIG[confidence];
  const RiskIcon = riskConfig.icon;
  
  // Custom styling adapted to light theme
  const getRiskBorderClass = (level: string) => {
    switch (level) {
      case 'critical': return 'border-red-200';
      case 'high': return 'border-orange-200';
      case 'medium': return 'border-yellow-200';
      case 'low': return 'border-blue-200';
      default: return 'border-gray-200';
    }
  };

  const borderClass = getRiskBorderClass(pattern.risk_level);

  return (
    <div className={`rounded-xl border bg-white shadow-sm overflow-hidden transition-all ${borderClass} ${expanded ? 'ring-1 ring-black/5 shadow-md' : 'hover:border-gray-300 hover:shadow-md'}`}>
      {/* Card Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className={`flex w-full items-start justify-between p-4 text-start transition-colors ${expanded ? 'bg-slate-50/50' : 'bg-white'}`}
      >
        <div className="flex-1 space-y-2.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <RiskIcon className={`h-4 w-4 shrink-0 ${riskConfig.color.split(' ')[2]}`} />
            <div className="flex flex-wrap gap-1.5">
              {matched_codes.map((code) => (
                <span
                  key={code}
                  className="rounded-md bg-white border border-gray-200 px-2 py-0.5 font-mono text-xs font-bold text-slate-700 shadow-sm"
                >
                  {code}
                </span>
              ))}
            </div>
            
            <div className="h-3 w-px bg-gray-200 rounded"></div>
            
            <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 ${confidenceConfig.color}`}>
              {isAr ? confidenceConfig.label_ar : confidenceConfig.label_en}
            </span>
          </div>

          <p className="text-sm font-bold text-foreground pe-4">
            {isAr ? pattern.root_cause_ar : pattern.root_cause_en}
          </p>

          {diagnosis.savings_potential && !expanded && (
            <div className="flex items-center gap-2 text-xs font-medium">
              <CircleDollarSign className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-muted-foreground line-through">
                {isAr ? pattern.individual_cost : (pattern.individual_cost_en || pattern.individual_cost)}
              </span>
              <span className="text-emerald-600 font-bold">
                ← {isAr ? pattern.smart_cost : (pattern.smart_cost_en || pattern.smart_cost)}
              </span>
            </div>
          )}
        </div>

        <div className="shrink-0 ps-3 pt-1">
          {expanded ? (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">
              <ChevronUp className="h-4 w-4 text-slate-500" />
            </div>
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-100 transition-colors">
              <ChevronDown className="h-4 w-4 text-slate-500" />
            </div>
          )}
        </div>
      </button>

      {/* Card Body — expanded */}
      {expanded && (
        <div className="border-t border-gray-100 p-5 space-y-5 bg-white">
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#2471A3] flex items-center gap-1.5">
              <Info className="h-3.5 w-3.5" />
              {t('diagnosis')}
            </h4>
            <p className="text-sm leading-relaxed text-slate-700 bg-slate-50 p-3 rounded-md border border-slate-100">
              {isAr ? pattern.diagnosis_ar : pattern.diagnosis_en}
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#2471A3] flex items-center gap-1.5">
              <Wrench className="h-3.5 w-3.5" />
              {t('fixOrder')}
            </h4>
            <div className="text-sm leading-relaxed text-slate-700 whitespace-pre-line bg-slate-50 p-3 rounded-md border border-slate-100">
              {isAr ? pattern.fix_order : (pattern.fix_order_en || pattern.fix_order)}
            </div>
          </div>

          <div className={`rounded-md border p-3 flex items-start gap-2.5 ${
            pattern.risk_level === 'critical' ? 'bg-red-50 border-red-100 text-red-800' :
            pattern.risk_level === 'high' ? 'bg-orange-50 border-orange-100 text-orange-800' :
            pattern.risk_level === 'medium' ? 'bg-yellow-50 border-yellow-100 text-yellow-800' :
            'bg-blue-50 border-blue-100 text-blue-800'
          }`}>
            <RiskIcon className="mt-0.5 shrink-0 h-4 w-4" />
            <p className="text-sm font-medium leading-relaxed">
              {isAr ? pattern.risk_description_ar : pattern.risk_description_en}
            </p>
          </div>

          {sensor_warnings.length > 0 && (
            <div className="space-y-2.5 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#2471A3]">
                {t('sensorConfirmation')}
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {sensor_warnings.map((warning) => {
                  const SensorIcon = SENSOR_ICONS[warning.sensor] ?? ThermometerSun;
                  return (
                    <div
                      key={warning.sensor}
                      className="flex items-center gap-3 rounded-md bg-amber-50 border border-amber-100 px-3 py-2.5 text-sm font-medium text-amber-800"
                    >
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                        <SensorIcon className="h-3.5 w-3.5" />
                      </div>
                      <span>
                        {isAr ? warning.message_ar : warning.message_en}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {diagnosis.savings_potential && (
            <div className="rounded-lg bg-emerald-50 border border-emerald-100 p-4 space-y-2 mt-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-slate-600">{t('normalCost')}</span>
                <span className="text-slate-500 line-through font-mono">
                  {isAr ? pattern.individual_cost : (pattern.individual_cost_en || pattern.individual_cost)}
                </span>
              </div>
              <div className="flex items-center justify-between text-base font-bold text-emerald-700">
                <div className="flex items-center gap-1.5">
                  <CircleDollarSign className="h-5 w-5" />
                  <span>{t('smartCost')}</span>
                </div>
                <span className="font-mono">{isAr ? pattern.smart_cost : (pattern.smart_cost_en || pattern.smart_cost)}</span>
              </div>
            </div>
          )}

          {pattern.vehicle_categories.length > 0 &&
            pattern.vehicle_categories[0] !== 'جميع السيارات' && (
              <div className="pt-2">
                <p className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5" />
                  {t('commonIn')}{' '}
                  <span className="text-slate-700">{pattern.vehicle_categories.join(', ')}</span>
                </p>
              </div>
            )}
        </div>
      )}
    </div>
  );
}

// ============================================================
// RISK BADGE COMPONENT
// ============================================================

function RiskBadge({
  riskLevel,
  locale,
}: {
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
  locale: 'ar' | 'en';
}) {
  const config = RISK_CONFIG[riskLevel];
  const RiskIcon = config.icon;
  const label = locale === 'ar' ? config.label_ar : config.label_en;
  
  const getLightBadgeObj = (level: string) => {
    switch(level) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold uppercase tracking-wider ${getLightBadgeObj(riskLevel)} shadow-sm`}
    >
      <RiskIcon className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}
