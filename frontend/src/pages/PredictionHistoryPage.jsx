import React, { useState, useMemo } from 'react';
import { RiskBadge, MachineTypeBadge } from '../components/common/StatusBadge';
import { Modal } from '../components/common/Modal';
import { formatPercentage, formatDateTime, formatScore } from '../utils/formatters';
import {
  Search,
  Filter,
  ArrowUpDown,
  Trash2,
  Download,
  AlertTriangle,
  History,
  Zap,
  ArrowRight,
} from 'lucide-react';

export function PredictionHistoryPage({
  history = [],
  onClearHistory,
  onNavigateToPrediction,
  onPrefillAndPredict,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'risk' | 'normal'
  const [machineFilter, setMachineFilter] = useState('all'); // 'all' | 'L' | 'M' | 'H'
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'oldest' | 'highestScore' | 'lowestScore'
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

  // Filtered & Sorted list
  const filteredList = useMemo(() => {
    let result = [...history];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.input.machine_type.toLowerCase().includes(q) ||
          item.result.prediction.toLowerCase().includes(q) ||
          String(item.input.rotational_speed).includes(q) ||
          String(item.input.torque).includes(q)
      );
    }

    // Status filter
    if (statusFilter === 'risk') {
      result = result.filter((item) => item.result.failure_risk_detected);
    } else if (statusFilter === 'normal') {
      result = result.filter((item) => !item.result.failure_risk_detected);
    }

    // Machine filter
    if (machineFilter !== 'all') {
      result = result.filter((item) => item.input.machine_type === machineFilter);
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.timestamp) - new Date(a.timestamp);
      if (sortBy === 'oldest') return new Date(a.timestamp) - new Date(b.timestamp);
      if (sortBy === 'highestScore')
        return b.result.failure_probability - a.result.failure_probability;
      if (sortBy === 'lowestScore')
        return a.result.failure_probability - b.result.failure_probability;
      return 0;
    });

    return result;
  }, [history, searchQuery, statusFilter, machineFilter, sortBy]);

  // Export to CSV
  const handleExportCSV = () => {
    if (filteredList.length === 0) return;

    const headers = [
      'Timestamp',
      'Machine Type',
      'Air Temperature [K]',
      'Process Temperature [K]',
      'Rotational Speed [rpm]',
      'Torque [Nm]',
      'Tool Wear [min]',
      'Failure Probability',
      'Threshold',
      'Prediction Result',
      'Risk Detected',
    ];

    const rows = filteredList.map((item) => [
      item.timestamp,
      item.input.machine_type,
      item.input.air_temperature,
      item.input.process_temperature,
      item.input.rotational_speed,
      item.input.torque,
      item.input.tool_wear,
      item.result.failure_probability,
      item.result.threshold,
      `"${item.result.prediction}"`,
      item.result.failure_risk_detected,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `session_predictions_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Header */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Session Prediction History
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Historical records collected in the active browser tab ({history.length} total entries)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              disabled={filteredList.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => setIsClearModalOpen(true)}
              disabled={history.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-rose-200 text-rose-700 hover:bg-rose-50 disabled:opacity-50 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Toolbars */}
        <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by type, label, speed..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-400 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 px-2.5 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:border-indigo-500 font-medium"
            >
              <option value="all">All Predictions</option>
              <option value="risk">Failure Risk Only</option>
              <option value="normal">Normal Only</option>
            </select>
          </div>

          {/* Machine Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-400 font-medium">Type:</span>
            <select
              value={machineFilter}
              onChange={(e) => setMachineFilter(e.target.value)}
              className="flex-1 px-2.5 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:border-indigo-500 font-medium"
            >
              <option value="all">All Variants (L, M, H)</option>
              <option value="L">Type L (Light Duty)</option>
              <option value="M">Type M (Standard)</option>
              <option value="H">Type H (Heavy Duty)</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-400 font-medium">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 px-2.5 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:border-indigo-500 font-medium"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highestScore">Highest Score First</option>
              <option value="lowestScore">Lowest Score First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        {filteredList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Variant</th>
                  <th className="py-3 px-4">Air Temp [K]</th>
                  <th className="py-3 px-4">Process Temp [K]</th>
                  <th className="py-3 px-4">Speed [rpm]</th>
                  <th className="py-3 px-4">Torque [Nm]</th>
                  <th className="py-3 px-4">Wear [min]</th>
                  <th className="py-3 px-4">Failure Score</th>
                  <th className="py-3 px-4">Prediction</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-500 whitespace-nowrap">
                      {formatDateTime(item.timestamp)}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <MachineTypeBadge type={item.input.machine_type} />
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap font-medium">
                      {item.input.air_temperature}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap font-medium">
                      {item.input.process_temperature}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {item.input.rotational_speed}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {item.input.torque}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {item.input.tool_wear}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap font-mono font-bold">
                      {formatPercentage(item.result.failure_probability)}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <RiskBadge
                        isRisk={item.result.failure_risk_detected}
                        size="sm"
                      />
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => onPrefillAndPredict(item.input)}
                        title="Prefill this sample into failure prediction form"
                        className="px-2 py-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded transition-colors cursor-pointer"
                      >
                        Re-evaluate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center text-slate-400 p-6">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
              <History className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-semibold text-slate-800">
              {history.length === 0
                ? 'No Session Predictions Recorded'
                : 'No Results Matching Current Filter'}
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              {history.length === 0
                ? 'Predictions made during this browser session will be tracked here with complete input telemetry.'
                : 'Try adjusting your search query, machine type, or risk status filter.'}
            </p>
            {history.length === 0 && (
              <button
                onClick={onNavigateToPrediction}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer"
              >
                Go to Prediction Form
              </button>
            )}
          </div>
        )}
      </div>

      {/* Confirmation Modal for Clearing History */}
      <Modal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        title="Clear Session History?"
        confirmLabel="Yes, Clear History"
        onConfirm={onClearHistory}
        confirmVariant="danger"
      >
        Are you sure you want to erase all <strong>{history.length}</strong> prediction records from this browser session? This action cannot be undone.
      </Modal>
    </div>
  );
}

