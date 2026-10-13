import React, { useState } from 'react';
import { SensorInputForm } from '../components/forms/SensorInputForm';
import { RiskGauge } from '../components/common/RiskGauge';
import { RiskBadge, MachineTypeBadge } from '../components/common/StatusBadge';
import { predictFailure } from '../services/api';
import { formatPercentage, formatTempK, formatScore } from '../utils/formatters';
import {
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  ServerCrash,
  RefreshCw,
  Info,
  Layers,
  Thermometer,
  RotateCw,
  Gauge,
  Wrench,
} from 'lucide-react';

export function PredictionPage({
  onPredictionComplete,
  prefillValues,
  backendStatus,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastResult, setLastResult] = useState(null);
  const [lastInput, setLastInput] = useState(null);

  const handlePredict = async (formData) => {
    setLoading(true);
    setError(null);
    setLastInput(formData);

    try {
      const response = await predictFailure(formData);
      setLastResult(response);

      // Save to parent state and session history
      if (onPredictionComplete) {
        onPredictionComplete({
          input: formData,
          result: response,
        });
      }
    } catch (err) {
      console.error('Prediction API Error:', err);
      setError({
        message: err.message || 'An unexpected error occurred during prediction.',
        status: err.status,
        isNetworkError: err.isNetworkError,
      });
      setLastResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Description */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Real-time Machine Failure Risk Prediction
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Input physical operational parameters below. Readings are dispatched directly to the active FastAPI endpoint running the trained Extra Trees classification pipeline.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg shrink-0">
          <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
          <span>Decision Threshold: <strong className="text-slate-800">0.45</strong></span>
        </div>
      </div>

      {/* Sensor Input Form */}
      <SensorInputForm
        onSubmit={handlePredict}
        loading={loading}
        initialValues={prefillValues}
        backendOnline={backendStatus?.isOnline}
      />

      {/* Error State Banner */}
      {error && (
        <div className="bg-rose-50 border border-rose-200/80 rounded-xl p-5 text-rose-900 shadow-xs animate-in fade-in duration-200">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-700 shrink-0">
              <ServerCrash className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-rose-950">
                Prediction Request Failed {error.status ? `(HTTP ${error.status})` : ''}
              </h4>
              <p className="text-xs text-rose-800 mt-1 leading-relaxed">
                {error.message}
              </p>
              {error.isNetworkError && (
                <div className="mt-3 p-3 bg-white/70 rounded-lg border border-rose-200 text-xs text-rose-900 space-y-1">
                  <p className="font-semibold">Troubleshooting Steps:</p>
                  <p>1. Ensure your FastAPI server is running: <code className="bg-rose-100 px-1 py-0.5 rounded font-mono">python -m uvicorn backend.main:app --reload</code></p>
                  <p>2. Verify backend URL is accessible at <code className="bg-rose-100 px-1 py-0.5 rounded font-mono">http://127.0.0.1:8000</code></p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Prediction Results Section */}
      {lastResult && lastInput && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {/* Main Result Card */}
          <div
            className={`rounded-xl border p-6 shadow-sm transition-all ${
              lastResult.failure_risk_detected
                ? 'bg-rose-50/40 border-rose-300'
                : 'bg-emerald-50/40 border-emerald-300'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/60">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                    lastResult.failure_risk_detected
                      ? 'bg-rose-600 text-white'
                      : 'bg-emerald-600 text-white'
                  }`}
                >
                  {lastResult.failure_risk_detected ? (
                    <ShieldAlert className="w-6 h-6" />
                  ) : (
                    <CheckCircle2 className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Model Inference Result
                  </div>
                  <h3
                    className={`text-xl font-extrabold tracking-tight mt-0.5 ${
                      lastResult.failure_risk_detected
                        ? 'text-rose-900'
                        : 'text-emerald-950'
                    }`}
                  >
                    {lastResult.prediction}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <RiskBadge
                  isRisk={lastResult.failure_risk_detected}
                  size="lg"
                />
              </div>
            </div>

            {/* Explanation & Action Recommendation */}
            <div className="mt-4 pt-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-white border border-slate-200/80 text-xs text-slate-700 space-y-1.5 shadow-xs">
                <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-indigo-500" />
                  <span>Diagnostic Summary</span>
                </div>
                <p className="leading-relaxed">
                  {lastResult.failure_risk_detected ? (
                    <>
                      The telemetry indicates abnormal operational stress exceeding the safety threshold of <strong>{lastResult.threshold}</strong>. Prompt maintenance scheduling, inspection of tool wear, and torque load verification are recommended to mitigate catastrophic machine breakdown.
                    </>
                  ) : (
                    <>
                      All six sensor parameters evaluate well below the <strong>{lastResult.threshold}</strong> failure threshold. The equipment exhibits standard operational stability with no immediate maintenance intervention flagged.
                    </>
                  )}
                </p>
              </div>

              {/* Submitted Parameters Recap */}
              <div className="p-4 rounded-lg bg-white border border-slate-200/80 text-xs text-slate-700 shadow-xs">
                <div className="font-semibold text-slate-900 mb-2 flex items-center justify-between">
                  <span>Evaluated Sensor Parameters</span>
                  <MachineTypeBadge type={lastInput.machine_type} />
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-400">Air Temp:</span>{' '}
                    <strong className="text-slate-800">{lastInput.air_temperature} K</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Process Temp:</span>{' '}
                    <strong className="text-slate-800">{lastInput.process_temperature} K</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Rotational Speed:</span>{' '}
                    <strong className="text-slate-800">{lastInput.rotational_speed} rpm</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Torque:</span>{' '}
                    <strong className="text-slate-800">{lastInput.torque} Nm</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Tool Wear:</span>{' '}
                    <strong className="text-slate-800">{lastInput.tool_wear} min</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">ΔT (Proc - Air):</span>{' '}
                    <strong className="text-slate-800">
                      {(parseFloat(lastInput.process_temperature) - parseFloat(lastInput.air_temperature)).toFixed(1)} K
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Risk Gauge */}
          <RiskGauge
            score={lastResult.failure_probability}
            threshold={lastResult.threshold}
            isRisk={lastResult.failure_risk_detected}
          />
        </div>
      )}
    </div>
  );
}

