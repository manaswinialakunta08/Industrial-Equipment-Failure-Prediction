import React from 'react';
import { AlertCircle, ShieldAlert, CheckCircle } from 'lucide-react';
import { formatPercentage, formatScore } from '../../utils/formatters';

export function RiskGauge({ score = 0, threshold = 0.45, isRisk = false }) {
  const percentage = Math.min(100, Math.max(0, score * 100));
  const thresholdPct = threshold * 100;

  return (
    <div className="w-full bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">
            Failure Risk Assessment
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Model output score compared against tuned classification threshold
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500">Threshold:</span>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            {thresholdPct.toFixed(0)}% ({threshold.toFixed(2)})
          </span>
        </div>
      </div>

      {/* Primary Score Display */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="text-xs text-slate-500 font-medium">Model Failure Probability Score</div>
          <div className="flex items-baseline gap-3 mt-1">
            <span
              className={`text-4xl font-extrabold tracking-tight ${
                isRisk ? 'text-rose-600' : 'text-emerald-600'
              }`}
            >
              {formatPercentage(score)}
            </span>
            <span className="text-sm text-slate-400 font-mono">
              (raw: {formatScore(score)})
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isRisk ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-sm font-semibold">
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Above Risk Threshold</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Within Safe Operating Range</span>
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar / Gauge */}
      <div className="space-y-2">
        <div className="relative w-full h-5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
          {/* Threshold zone line */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-slate-400 z-20"
            style={{ left: `${thresholdPct}%` }}
            title={`Threshold: ${thresholdPct}%`}
          />

          {/* Progress fill */}
          <div
            className={`h-full transition-all duration-700 ease-out rounded-full ${
              isRisk
                ? 'bg-gradient-to-r from-amber-500 via-rose-500 to-rose-600'
                : 'bg-gradient-to-r from-emerald-400 to-emerald-500'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Gauge labels & marker */}
        <div className="relative flex justify-between text-[11px] font-medium text-slate-500 px-0.5">
          <span>0% (Safe)</span>
          <div
            className="absolute -translate-x-1/2 flex flex-col items-center"
            style={{ left: `${thresholdPct}%` }}
          >
            <span className="text-slate-700 font-semibold text-[11px]">▲ Cutoff: {thresholdPct}%</span>
          </div>
          <span>100% (High Risk)</span>
        </div>
      </div>

      {/* Technical Disclaimer Notice as required */}
      <div className="mt-5 p-3 rounded-lg bg-slate-50 border border-slate-200/80 text-xs text-slate-600 flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-700">Notice:</strong> This score represents an Extra Trees machine learning statistical estimate, not a guaranteed physical diagnosis or guarantee of machine safety. The score is not a calibrated real-world failure probability. Physical inspection and regular maintenance schedules remain mandatory.
        </p>
      </div>
    </div>
  );
}

