import React from 'react';
import { MetricCard } from '../components/common/MetricCard';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import {
  AlertTriangle,
  Award,
  CheckCircle2,
  FileText,
  Info,
  Scale,
  Sliders,
  ShieldCheck,
  TrendingDown,
  Layers,
} from 'lucide-react';

export function ModelPerformancePage() {
  // Offline test-set evaluation metrics from project
  const metrics = [
    { name: 'Accuracy', value: 96.35, color: '#3b82f6', description: 'Overall correct classifications' },
    { name: 'Recall (Failure)', value: 67.65, color: '#10b981', description: 'True positives identified (46 / 68)' },
    { name: 'F1-Score (Failure)', value: 55.76, color: '#6366f1', description: 'Harmonic mean of precision & recall' },
    { name: 'Precision (Failure)', value: 47.42, color: '#f59e0b', description: 'True failure rate of alarms (46 / 97)' },
  ];

  return (
    <div className="space-y-6">
      {/* Important Offline Evaluation Badge / Header */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-slate-100 gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                Offline Test-Set Evaluation
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Model: Extra Trees Classifier
              </span>
            </div>
            <h2 className="text-base font-bold text-slate-900">
              Verified Model Validation & Benchmark Metrics
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg shrink-0">
            <span>Decision Threshold: <strong className="text-slate-900 font-mono">0.45</strong></span>
          </div>
        </div>

        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
          These metrics represent verified offline holdout evaluation on <strong>2,000 independent test samples</strong> derived from the AI4I 2020 dataset. These figures reflect offline benchmark evaluation, not dynamic production inference metrics.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Holdout Accuracy"
          value="96.35%"
          subtext="1,927 / 2,000 total correct"
          icon={Award}
          badgeText="High Baseline"
          badgeType="neutral"
        />
        <MetricCard
          title="Failure Recall"
          value="67.65%"
          subtext="46 / 68 actual failures caught"
          icon={CheckCircle2}
          badgeText="Target Metric"
          badgeType="success"
        />
        <MetricCard
          title="Failure Precision"
          value="47.42%"
          subtext="46 / 97 alarms were actual failures"
          icon={Scale}
          badgeText="Trade-off"
          badgeType="warning"
        />
        <MetricCard
          title="Failure F1-Score"
          value="55.76%"
          subtext="Balanced harmonic score"
          icon={Sliders}
          badgeText="Threshold 0.45"
          badgeType="primary"
        />
      </div>

      {/* Confusion Matrix & Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Confusion Matrix Visualization */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Holdout Confusion Matrix (N = 2,000)
                </h3>
                <p className="text-xs text-slate-500">
                  Actual vs Predicted breakdown at decision cutoff 0.45
                </p>
              </div>
            </div>

            {/* Matrix Visual Table */}
            <div className="mt-5">
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                {/* Header row */}
                <div></div>
                <div className="py-2 bg-slate-100 rounded-t-lg font-semibold text-slate-700">
                  Predicted NO FAILURE
                </div>
                <div className="py-2 bg-slate-100 rounded-t-lg font-semibold text-slate-700">
                  Predicted FAILURE RISK
                </div>

                {/* Actual No Row */}
                <div className="flex items-center justify-center font-semibold text-slate-700 bg-slate-100 rounded-l-lg p-2">
                  Actual NO FAILURE (1,932)
                </div>
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 flex flex-col items-center justify-center">
                  <span className="text-xl font-black text-emerald-700">1,881</span>
                  <span className="text-[11px] font-medium text-emerald-800 mt-0.5">Correct Rejections (TN)</span>
                </div>
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 flex flex-col items-center justify-center">
                  <span className="text-xl font-black text-amber-700">51</span>
                  <span className="text-[11px] font-medium text-amber-800 mt-0.5">False Alarms (FP)</span>
                </div>

                {/* Actual Yes Row */}
                <div className="flex items-center justify-center font-semibold text-slate-700 bg-slate-100 rounded-l-lg p-2">
                  Actual FAILURE (68)
                </div>
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg text-rose-900 flex flex-col items-center justify-center">
                  <span className="text-xl font-black text-rose-700">22</span>
                  <span className="text-[11px] font-medium text-rose-800 mt-0.5">Missed Failures (FN)</span>
                </div>
                <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg text-indigo-900 flex flex-col items-center justify-center">
                  <span className="text-xl font-black text-indigo-700">46</span>
                  <span className="text-[11px] font-medium text-indigo-800 mt-0.5">Detected Failures (TP)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Total actual failures: <strong>68</strong> (3.4% prevalence)</span>
            <span>Detected proportion: <strong>46 / 68 (67.65%)</strong></span>
          </div>
        </div>

        {/* Evaluation Metrics Bar Chart */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="pb-3 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-900">
                Core Performance Metrics (%)
              </h3>
              <p className="text-xs text-slate-500">
                Comparison of accuracy, precision, recall, and harmonic F1
              </p>
            </div>

            <div className="h-56 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={metrics}
                  layout="vertical"
                  margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" domain={[0, 100]} unit="%" tick={{ fontSize: 11 }} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={110} />
                  <Tooltip
                    formatter={(val) => [`${val}%`, 'Score']}
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '0.5rem',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {metrics.map((entry, index) => (
                      <Cell key={`bar-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Correct Non-Failures</span>
              <strong className="text-slate-800">1,881 / 1,932 (97.4%)</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Detected Failures</span>
              <strong className="text-slate-800">46 / 68 (67.65%)</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Critical Technical Analysis on Class Imbalance as strictly required */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Crucial Engineering Note: Class Imbalance & The Accuracy Paradox
            </h3>
            <p className="text-xs text-slate-500">
              Why 96.35% overall accuracy is deceptive in predictive maintenance
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
          <div>
            <h4 className="font-semibold text-slate-800 mb-1">
              Severe Class Imbalance in Industrial Maintenance:
            </h4>
            <p>
              In real-world manufacturing operations and the AI4I dataset, machine breakdowns are rare events occurring in only ~3.4% of operating cycles (68 failures out of 2,000 test observations). A naive null model that continuously predicts "NO FAILURE" would trivially attain <strong>96.6% accuracy</strong> while failing to catch a single breakdown.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-800 mb-1">
              Strategic Decision Threshold Tuning (0.45):
            </h4>
            <p>
              To prioritize failure detection (recall), the classification threshold was tuned from the default 0.50 down to <strong>0.45</strong>. This deliberately trades precision (47.42%) and incurs 51 false alarms in order to detect 46 critical breakdowns. Crucially, <strong>22 failures were still missed (false negatives)</strong>, representing an important operational limitation requiring secondary safety guards.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

