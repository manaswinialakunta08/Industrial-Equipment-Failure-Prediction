import React from 'react';
import { MetricCard } from '../components/common/MetricCard';
import { RiskBadge, MachineTypeBadge } from '../components/common/StatusBadge';
import { formatPercentage, formatDateTime, formatScore } from '../utils/formatters';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Zap,
  Clock,
  Layers,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Cpu,
  BarChart2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

export function OverviewPage({
  history = [],
  onNavigateToPrediction,
  onPrefillAndPredict,
}) {
  const totalPredictions = history.length;
  const failureCount = history.filter((item) => item.result.failure_risk_detected).length;
  const normalCount = totalPredictions - failureCount;
  const failureRate = totalPredictions > 0 ? (failureCount / totalPredictions) * 100 : 0;
  const latestPrediction = history.length > 0 ? history[0] : null;

  // Chart data for distribution
  const pieData = [
    { name: 'Normal Operating', value: normalCount, color: '#10b981' },
    { name: 'Failure Risk Flagged', value: failureCount, color: '#f43f5e' },
  ];

  // Recent predictions (last 5)
  const recentItems = history.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Session Notice Banner */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 leading-tight">
              Session Telemetry & Predictive Inference Summary
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Metrics calculated strictly from inference requests executed during this active browser session.
            </p>
          </div>
        </div>

        <button
          onClick={onNavigateToPrediction}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors shrink-0 cursor-pointer"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Run Failure Prediction</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Session Inferences"
          value={totalPredictions}
          subtext="Total evaluations executed"
          icon={Activity}
          badgeText="Session Scope"
          badgeType="neutral"
        />
        <MetricCard
          title="Normal Equipment"
          value={normalCount}
          subtext={totalPredictions > 0 ? `${((normalCount / totalPredictions) * 100).toFixed(0)}% of evaluations` : 'Awaiting predictions'}
          icon={CheckCircle2}
          badgeText="Safe State"
          badgeType="success"
        />
        <MetricCard
          title="Failure Risks Flagged"
          value={failureCount}
          subtext={totalPredictions > 0 ? `${failureRate.toFixed(1)}% risk rate` : '0 flagged'}
          icon={AlertTriangle}
          badgeText={failureCount > 0 ? 'Action Req.' : 'Zero Risk'}
          badgeType={failureCount > 0 ? 'danger' : 'neutral'}
        />
        <MetricCard
          title="Model Threshold"
          value="0.45"
          subtext="Decision cutoff (tuned on F1)"
          icon={TrendingUp}
          badgeText="Extra Trees"
          badgeType="primary"
        />
      </div>

      {/* Latest Prediction Highlight & Session Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Latest Prediction Card */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Latest Evaluation Result
              </h3>
              <p className="text-xs text-slate-500">
                Most recent telemetry evaluation processed by the backend
              </p>
            </div>
            {latestPrediction && (
              <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                <Clock className="w-3 h-3" />
                {formatDateTime(latestPrediction.timestamp)}
              </span>
            )}
          </div>

          {latestPrediction ? (
            <div className="mt-4 space-y-4">
              <div
                className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  latestPrediction.result.failure_risk_detected
                    ? 'bg-rose-50/50 border-rose-200 text-rose-950'
                    : 'bg-emerald-50/50 border-emerald-200 text-emerald-950'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <MachineTypeBadge type={latestPrediction.input.machine_type} />
                    <RiskBadge
                      isRisk={latestPrediction.result.failure_risk_detected}
                      size="sm"
                    />
                  </div>
                  <h4 className="text-lg font-bold">
                    {latestPrediction.result.prediction}
                  </h4>
                </div>

                <div className="text-left sm:text-right">
                  <div className="text-xs text-slate-500 font-medium">Failure Probability</div>
                  <div className="text-2xl font-black text-slate-900">
                    {formatPercentage(latestPrediction.result.failure_probability)}
                  </div>
                </div>
              </div>

              {/* Sensor stats row */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-[11px] text-slate-400 block font-medium">Air Temp</span>
                  <span className="text-xs font-bold text-slate-800">
                    {latestPrediction.input.air_temperature} K
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-[11px] text-slate-400 block font-medium">Process Temp</span>
                  <span className="text-xs font-bold text-slate-800">
                    {latestPrediction.input.process_temperature} K
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-[11px] text-slate-400 block font-medium">Speed</span>
                  <span className="text-xs font-bold text-slate-800">
                    {latestPrediction.input.rotational_speed} rpm
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-[11px] text-slate-400 block font-medium">Torque</span>
                  <span className="text-xs font-bold text-slate-800">
                    {latestPrediction.input.torque} Nm
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-[11px] text-slate-400 block font-medium">Tool Wear</span>
                  <span className="text-xs font-bold text-slate-800">
                    {latestPrediction.input.tool_wear} min
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-center">
                  <button
                    onClick={() => onPrefillAndPredict(latestPrediction.input)}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Re-evaluate</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-500">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
                <Activity className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-semibold text-slate-800">No Predictions Yet This Session</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Trigger a failure risk prediction using the form to see real-time inference telemetry here.
              </p>
              <button
                onClick={onNavigateToPrediction}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer"
              >
                Run First Prediction
              </button>
            </div>
          )}
        </div>

        {/* Session Distribution Chart */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="pb-3 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-900">
                Session Risk Ratio
              </h3>
              <p className="text-xs text-slate-500">
                Normal vs Risk classification ratio
              </p>
            </div>

            {totalPredictions > 0 ? (
              <div className="h-44 flex items-center justify-center mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={3}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val, name) => [`${val} runs`, name]}
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '0.5rem',
                        fontSize: '12px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-44 flex items-center justify-center text-xs text-slate-400">
                Chart activates after first prediction
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span>Normal Operating</span>
              </span>
              <span className="font-bold text-slate-900">{normalCount}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                <span>Failure Risk Flagged</span>
              </span>
              <span className="font-bold text-slate-900">{failureCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Predictions Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Recent Session Inferences
            </h3>
            <p className="text-xs text-slate-500">
              Last {recentItems.length} prediction runs executed in current tab
            </p>
          </div>
          {history.length > 5 && (
            <button
              onClick={() => onNavigateToPrediction('history')}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>View Full History ({history.length})</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>

        {recentItems.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-semibold">
                  <th className="py-3 px-4">Time</th>
                  <th className="py-3 px-4">Machine</th>
                  <th className="py-3 px-4">Air / Process Temp</th>
                  <th className="py-3 px-4">Speed</th>
                  <th className="py-3 px-4">Torque</th>
                  <th className="py-3 px-4">Tool Wear</th>
                  <th className="py-3 px-4">Failure Score</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-normal">
                {recentItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-500">
                      {formatDateTime(item.timestamp)}
                    </td>
                    <td className="py-3 px-4">
                      <MachineTypeBadge type={item.input.machine_type} />
                    </td>
                    <td className="py-3 px-4 font-medium">
                      {item.input.air_temperature} K / {item.input.process_temperature} K
                    </td>
                    <td className="py-3 px-4">{item.input.rotational_speed} rpm</td>
                    <td className="py-3 px-4">{item.input.torque} Nm</td>
                    <td className="py-3 px-4">{item.input.tool_wear} min</td>
                    <td className="py-3 px-4 font-mono font-bold">
                      {formatPercentage(item.result.failure_probability)}
                    </td>
                    <td className="py-3 px-4">
                      <RiskBadge
                        isRisk={item.result.failure_risk_detected}
                        size="sm"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-slate-400 text-xs">
            No session activity recorded yet. Run a prediction to populate this table.
          </div>
        )}
      </div>
    </div>
  );
}

