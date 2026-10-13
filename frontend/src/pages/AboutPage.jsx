import React from 'react';
import {
  Layers,
  Cpu,
  Server,
  ArrowRight,
  Database,
  Code2,
  AlertCircle,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Workflow,
  Sparkles,
} from 'lucide-react';

export function AboutPage() {
  const stack = [
    { category: 'Machine Learning', items: ['Python 3.11', 'PyCaret', 'scikit-learn', 'Extra Trees Classifier', 'pandas', 'NumPy'] },
    { category: 'Backend & API', items: ['FastAPI', 'Uvicorn', 'Pydantic v2', 'CORS Middleware', 'REST API'] },
    { category: 'Frontend Architecture', items: ['React 19', 'JavaScript (ES Modules)', 'Tailwind CSS', 'Vite 8', 'Lucide React', 'Recharts'] },
  ];

  const pipelineSteps = [
    {
      step: '1',
      title: 'Sensor Input Telemetry',
      desc: 'Machine Type, Air & Process Temps, Rotational Speed, Torque, Tool Wear',
      icon: Layers,
      color: 'bg-blue-500',
    },
    {
      step: '2',
      title: 'React 19 Dashboard',
      desc: 'Form validation (e.g. Process Temp ≥ Air Temp), UI state management & JSON serialization',
      icon: Code2,
      color: 'bg-indigo-500',
    },
    {
      step: '3',
      title: 'FastAPI REST Endpoint',
      desc: 'Pydantic payload schema validation, HTTP error handling, DataFrame synthesis',
      icon: Server,
      color: 'bg-violet-500',
    },
    {
      step: '4',
      title: 'Extra Trees Pipeline',
      desc: 'Preprocessing transformer + ensemble decision trees inference with raw failure score',
      icon: Cpu,
      color: 'bg-purple-500',
    },
    {
      step: '5',
      title: 'Decision & Diagnostics',
      desc: 'Threshold 0.45 evaluation, classification response, gauge display, and session history logging',
      icon: ShieldCheck,
      color: 'bg-emerald-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Card */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
        <div className="max-w-3xl">
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 inline-block mb-3">
            Technical Architecture & Project Overview
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Industrial Equipment Failure Prediction System
          </h2>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            An end-to-end predictive maintenance solution designed to identify critical equipment breakdown risks before catastrophic failure occurs. Integrating an optimized Extra Trees machine learning pipeline with a high-performance FastAPI backend and a modern React dashboard.
          </p>
        </div>
      </div>

      {/* Visual Pipeline Architecture Flow */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs">
        <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
              <Workflow className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                End-to-End System Architecture Flow
              </h3>
              <p className="text-xs text-slate-500">
                Data progression from physical telemetry input to inference response
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-3 relative">
          {pipelineSteps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 relative flex flex-col justify-between group hover:border-indigo-300 hover:bg-indigo-50/20 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center">
                      {s.step}
                    </span>
                    <div className={`w-7 h-7 rounded-lg ${s.color} text-white flex items-center justify-center shadow-xs`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 leading-tight">
                    {s.title}
                  </h4>
                  <p className="mt-1.5 text-[11px] text-slate-500 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dataset & Machine Learning Model Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Database className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">
              AI4I 2020 Predictive Maintenance Dataset
            </h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            The system is trained on the synthetic <strong>AI4I 2020 Predictive Maintenance Dataset</strong>, reflecting realistic manufacturing milling machine operations. It encompasses 10,000 observations with:
          </p>
          <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
            <li><strong>Type:</strong> Variant L (50%), M (30%), H (20%)</li>
            <li><strong>Thermal features:</strong> Air temperature and Process temperature [K]</li>
            <li><strong>Mechanical load:</strong> Rotational speed [rpm] and Torque [Nm]</li>
            <li><strong>Tool wear:</strong> Cumulative machining duration [min]</li>
            <li><strong>Failure modes modeled:</strong> Tool Wear Failure (TWF), Heat Dissipation Failure (HDF), Power Failure (PWF), and Overstrain Failure (OSF).</li>
          </ul>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Cpu className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Extra Trees (Extremely Randomized Trees) Model
            </h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            An ensemble classifier utilizing randomized splits for individual decision trees, offering higher variance reduction and resilience against noisy industrial telemetry compared to standard Random Forest:
          </p>
          <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
            <li><strong>Tuned Decision Threshold:</strong> Set to <strong>0.45</strong> (optimized on validation F1-score to boost minority class recall).</li>
            <li><strong>Holdout Recall:</strong> 67.65% (catches 46 of 68 actual failures in holdout set).</li>
            <li><strong>Holdout Precision:</strong> 47.42% (incurring acceptable false alarms to safeguard critical equipment).</li>
            <li><strong>Serialization:</strong> Saved with scikit-learn / PyCaret pipelines as <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px] font-mono">models/final_extra_trees_threshold_045.pkl</code>.</li>
          </ul>
        </div>
      </div>

      {/* Technology Stack Breakdown */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
          Complete Technology Stack
        </h3>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stack.map((group) => (
            <div key={group.category} className="p-4 rounded-lg bg-slate-50 border border-slate-200/70">
              <h4 className="text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2">
                {group.category}
              </h4>
              <ul className="space-y-1">
                {group.items.map((it) => (
                  <li key={it} className="text-xs text-slate-600 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Known Limitations & Industrial Readiness */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <AlertCircle className="w-4 h-4 text-amber-600" />
          <h3 className="text-sm font-bold text-slate-900">
            Known Limitations & Production Deployment Considerations
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600 leading-relaxed pt-1">
          <div className="p-3 bg-amber-50/50 rounded-lg border border-amber-200/60">
            <strong className="text-amber-950 block mb-1">Lack of Live Streaming Telemetry:</strong>
            Currently operates on manual entry and sample testing. Real factory floor implementation requires MQTT/OPC-UA edge brokers and time-series streaming.
          </div>
          <div className="p-3 bg-amber-50/50 rounded-lg border border-amber-200/60">
            <strong className="text-amber-950 block mb-1">Probability Calibration:</strong>
            Raw tree ensemble voting scores are uncalibrated and should be treated as relative risk indices rather than true Bayesian failure likelihoods.
          </div>
          <div className="p-3 bg-amber-50/50 rounded-lg border border-amber-200/60">
            <strong className="text-amber-950 block mb-1">Missed Failures (FN Risk):</strong>
            The model misses ~32% of failures (22 in holdout). It is intended as an early warning advisory layer to supplement, not replace, regular physical maintenance.
          </div>
        </div>
      </div>
    </div>
  );
}

