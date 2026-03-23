"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, ChevronDown, ChevronUp, Copy, Check, Wrench, DollarSign, Zap, Tag } from "lucide-react";
import type { DTCCode } from "@/types/database";
import { useState, Fragment } from "react";
import { cn } from "@/lib/utils";

export interface DTCFaultDisplay extends DTCCode {
  detected_at?: string;
}

interface DTCCodesTableProps {
  faults: DTCFaultDisplay[];
}

const severityStyles: Record<
  string, // DB returns "critical" | "warning" | "info"
  { bg: string; text: string; border: string }
> = {
  critical: { bg: "#EF444415", text: "#EF4444", border: "#EF444430" },
  warning: { bg: "#EAB30815", text: "#EAB308", border: "#EAB30830" },
  info: { bg: "#3B82F615", text: "#3B82F6", border: "#3B82F630" },
};

const urgencyStyles: Record<string, { bg: string; text: string }> = {
  high: { bg: "bg-red-100", text: "text-red-700" },
  medium: { bg: "bg-amber-100", text: "text-amber-700" },
  low: { bg: "bg-emerald-100", text: "text-emerald-700" },
};

const categoryColors: Record<string, string> = {
  engine: "bg-orange-100 text-orange-700",
  fuel: "bg-yellow-100 text-yellow-700",
  transmission: "bg-purple-100 text-purple-700",
  cooling: "bg-cyan-100 text-cyan-700",
  electrical: "bg-blue-100 text-blue-700",
  emissions: "bg-green-100 text-green-700",
  brakes: "bg-red-100 text-red-700",
  ac: "bg-teal-100 text-teal-700",
  safety: "bg-rose-100 text-rose-700",
};

export default function DTCCodesTable({ faults }: DTCCodesTableProps) {
  const t = useTranslations("vehicleDetail.dtc");
  const params = useParams();
  const locale = params.locale as string;
  const isRtl = locale === "ar";
  
  const [expandedCodes, setExpandedCodes] = useState<Record<string, boolean>>({});
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const toggleRow = (code: string) => {
    setExpandedCodes(prev => ({ ...prev, [code]: !prev[code] }));
  };

  const handleCopy = async (code: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  const formatRecommendation = (text: string) => {
    if (!text) return "";
    // If it already has line breaks, just split by them.
    // If it doesn't, try to insert line breaks before "الخطوة" or "Step"
    let formatted = text;
    if (!formatted.includes('\n')) {
      formatted = formatted.replace(/(الخطوة \d+:)/g, '\n$1');
      formatted = formatted.replace(/(Step \d+:)/ig, '\n$1');
      // In case it's just "الخطوة" without a number or colon
      formatted = formatted.replace(/(الخطوة)/g, '\n$1');
    }
    
    return formatted.split('\n').filter(line => line.trim().length > 0).map((line, i) => (
      <p key={i} className="mb-1 last:mb-0">{line.trim()}</p>
    ));
  };
  
  const getRecommendationText = (fault: DTCFaultDisplay) => {
    return locale === "ar" ? fault.recommended_action_ar : fault.recommended_action_en;
  };

  // Empty state
  if (faults.length === 0) {
    return (
      <div className="rounded-xl bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-bold text-foreground mb-4">
          {t("title")}
        </h2>
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <CheckCircle className="h-12 w-12 text-emerald-400 mb-3" />
          <p className="text-muted-foreground">{t("empty")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-amber-500" />
        <h2 className="text-lg font-bold text-foreground">{t("title")}</h2>
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="pb-3 text-start font-semibold text-muted-foreground w-10"></th>
              <th className="pb-3 text-start font-semibold text-muted-foreground">
                {t("code")}
              </th>
              <th className="pb-3 text-start font-semibold text-muted-foreground">
                {t("description")}
              </th>
              <th className="pb-3 text-start font-semibold text-muted-foreground">
                {t("severity")}
              </th>
              <th className="pb-3 text-start font-semibold text-muted-foreground">
                {t("date")}
              </th>
            </tr>
          </thead>
          <tbody>
            {faults.map((fault) => {
              const style = severityStyles[fault.severity] || severityStyles.info;
              const isExpanded = !!expandedCodes[fault.code];
              const recText = getRecommendationText(fault);
              const hasRecommendation = !!recText;
              
              const urgencyLevel = fault.urgency?.toLowerCase() || 'low';
              const urgencyConfig = urgencyStyles[urgencyLevel] || urgencyStyles.low;
              
              const categoryKey = fault.category?.toLowerCase() || '';
              const categoryColorClasses = categoryColors[categoryKey] || "bg-gray-100 text-gray-700";
              const categoryTranslationKey = categoryKey ? `category${categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1)}` : "";

              return (
                <Fragment key={`row-${fault.code}`}>
                  <tr
                    className={cn(
                      "border-b border-gray-50 cursor-pointer hover:bg-gray-50/50 transition-colors",
                      isExpanded ? "bg-gray-50/30" : ""
                    )}
                    onClick={() => toggleRow(fault.code)}
                  >
                    <td className="py-3 px-2">
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </td>
                    <td className="py-3 font-mono font-bold text-foreground">
                      {fault.code}
                    </td>
                    <td className="py-3 text-muted-foreground">
                      {locale === "ar"
                        ? fault.description_ar
                        : fault.description_en}
                    </td>
                    <td className="py-3">
                      <Badge
                        className="text-xs font-semibold"
                        style={{
                          backgroundColor: style.bg,
                          color: style.text,
                          borderColor: style.border,
                        }}
                      >
                        {t(fault.severity)}
                      </Badge>
                    </td>
                    <td className="py-3 text-muted-foreground">
                      {fault.detected_at}
                    </td>
                  </tr>
                  
                  {isExpanded && (
                    <tr className="border-b border-gray-100 bg-slate-50/50">
                      <td colSpan={5} className="p-0">
                        <div className={cn(
                          "px-6 py-4 border-l-4",
                          isRtl ? "border-l-0 border-r-4 border-r-[#2471A3]" : "border-l-[#2471A3]"
                        )}>
                          {!hasRecommendation ? (
                            <div className="text-muted-foreground italic text-sm py-2">
                              {t("noRecommendation")}
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <h4 className="font-semibold flex items-center gap-2 text-[#2471A3]">
                                  <Wrench className="h-4 w-4" />
                                  {t("repairRecommendation")}
                                </h4>
                                
                                <div className="flex gap-2">
                                  {fault.category && t.has(categoryTranslationKey as any) && (
                                    <Badge className={cn("flex items-center gap-1 shadow-none font-medium", categoryColorClasses)}>
                                      <Tag className="h-3 w-3" />
                                      {t(categoryTranslationKey as any)}
                                    </Badge>
                                  )}
                                  
                                  {fault.urgency && (
                                    <Badge className={cn("flex items-center gap-1 shadow-none font-medium", urgencyConfig.bg, urgencyConfig.text)}>
                                      <Zap className="h-3 w-3" />
                                      {t("urgency")}: {t(`urgency${urgencyLevel.charAt(0).toUpperCase() + urgencyLevel.slice(1)}` as any)}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              
                              <div className="text-sm text-slate-700 leading-relaxed bg-white p-4 rounded-md border border-slate-100 shadow-sm">
                                {formatRecommendation(recText)}
                              </div>
                              
                              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                                <div className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                                  <DollarSign className="h-4 w-4 text-emerald-600" />
                                  <span>{t("estimatedCost")}:</span>
                                  <span className="text-slate-900">{fault.estimated_cost_sar || "—"}</span>
                                </div>
                                
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCopy(fault.code, recText);
                                  }}
                                  className="flex items-center gap-1.5 text-xs font-medium text-[#2471A3] bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md transition-colors"
                                >
                                  {copiedCode === fault.code ? (
                                    <>
                                      <Check className="h-3.5 w-3.5" />
                                      {t("copied")}
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="h-3.5 w-3.5" />
                                      {t("copyRecommendation")}
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden space-y-3">
        {faults.map((fault) => {
          const style = severityStyles[fault.severity] || severityStyles.info;
          const isExpanded = !!expandedCodes[fault.code];
          const recText = getRecommendationText(fault);
          const hasRecommendation = !!recText;
          
          const urgencyLevel = fault.urgency?.toLowerCase() || 'low';
          const urgencyConfig = urgencyStyles[urgencyLevel] || urgencyStyles.low;
          
          const categoryKey = fault.category?.toLowerCase() || '';
          const categoryColorClasses = categoryColors[categoryKey] || "bg-gray-100 text-gray-700";
          const categoryTranslationKey = categoryKey ? `category${categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1)}` : "";

          return (
            <div
              key={fault.code}
              className={cn(
                "rounded-lg border transition-colors overflow-hidden",
                isExpanded ? "border-[#2471A3]/30 shadow-sm" : "border-gray-100"
              )}
            >
              <div 
                className={cn(
                  "p-4 cursor-pointer",
                  isExpanded ? "bg-slate-50/50" : ""
                )}
                onClick={() => toggleRow(fault.code)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="font-mono font-bold text-foreground text-lg">
                      {fault.code}
                    </span>
                  </div>
                  <Badge
                    className="text-xs font-semibold"
                    style={{
                      backgroundColor: style.bg,
                      color: style.text,
                      borderColor: style.border,
                    }}
                  >
                    {t(fault.severity)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-1 pl-6 rtl:pl-0 rtl:pr-6">
                  {locale === "ar"
                    ? fault.description_ar
                    : fault.description_en}
                </p>
                <p className="text-xs text-muted-foreground pl-6 rtl:pl-0 rtl:pr-6">
                  {t("date")}: {fault.detected_at}
                </p>
              </div>
              
              {isExpanded && (
                <div className={cn(
                  "bg-slate-50 border-t border-slate-100 p-4",
                  isRtl ? "border-r-4 border-r-[#2471A3]" : "border-l-4 border-l-[#2471A3]"
                )}>
                  {!hasRecommendation ? (
                    <div className="text-muted-foreground italic text-sm text-center py-2">
                      {t("noRecommendation")}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex flex-col gap-3">
                        <h4 className="font-semibold text-sm flex items-center gap-1.5 text-[#2471A3]">
                          <Wrench className="h-4 w-4" />
                          {t("repairRecommendation")}
                        </h4>
                        
                        <div className="flex flex-wrap gap-2">
                          {fault.category && t.has(categoryTranslationKey as any) && (
                            <Badge className={cn("flex items-center gap-1 shadow-none font-medium", categoryColorClasses)}>
                              <Tag className="h-3 w-3" />
                              {t(categoryTranslationKey as any)}
                            </Badge>
                          )}
                          
                          {fault.urgency && (
                            <Badge className={cn("flex items-center gap-1 shadow-none font-medium", urgencyConfig.bg, urgencyConfig.text)}>
                              <Zap className="h-3 w-3" />
                              {t("urgency")}: {t(`urgency${urgencyLevel.charAt(0).toUpperCase() + urgencyLevel.slice(1)}` as any)}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-sm text-slate-700 leading-relaxed bg-white p-3 rounded-md border border-slate-100 shadow-sm">
                        {formatRecommendation(recText)}
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
                        <div className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                          <DollarSign className="h-4 w-4 text-emerald-600" />
                          <span>{t("estimatedCost")}:</span>
                          <span className="text-slate-900">{fault.estimated_cost_sar || "—"}</span>
                        </div>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopy(fault.code, recText);
                          }}
                          className="flex items-center justify-center gap-1.5 text-xs font-medium text-[#2471A3] bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-md transition-colors w-full sm:w-auto"
                        >
                          {copiedCode === fault.code ? (
                            <>
                              <Check className="h-3.5 w-3.5" />
                              {t("copied")}
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5" />
                              {t("copyRecommendation")}
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
