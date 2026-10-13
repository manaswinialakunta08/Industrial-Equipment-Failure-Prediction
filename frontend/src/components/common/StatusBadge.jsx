import React from 'react';
import { AlertTriangle, CheckCircle2, ShieldCheck, Activity } from 'lucide-react';

export function RiskBadge({ isRisk, size = 'md' }) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-semibold',
  }[size];

  if (isRisk) {
    return (
      <span
        className={`inline-flex items-center rounded-full bg-rose-50 text-rose-700 border border-rose-200/80 shadow-xs ${sizeClasses}`}
      >
        <AlertTriangle className={size === 'lg' ? 'w-4 h-4 text-rose-600' : 'w-3.5 h-3.5 text-rose-600'} />
        <span>FAILURE RISK DETECTED</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-xs ${sizeClasses}`}
    >
      <CheckCircle2 className={size === 'lg' ? 'w-4 h-4 text-emerald-600' : 'w-3.5 h-3.5 text-emerald-600'} />
      <span>NO FAILURE FLAGGED</span>
    </span>
  );
}

export function MachineTypeBadge({ type }) {
  const colors = {
    L: 'bg-blue-50 text-blue-700 border-blue-200',
    M: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    H: 'bg-purple-50 text-purple-700 border-purple-200',
  }[type] || 'bg-slate-100 text-slate-700 border-slate-200';

  const label = {
    L: 'Type L (Low)',
    M: 'Type M (Medium)',
    H: 'Type H (High)',
  }[type] || `Type ${type}`;

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${colors}`}>
      {label}
    </span>
  );
}

export function BackendStatusBadge({ isOnline, checking, onRefresh }) {
  return (
    <button
      onClick={onRefresh}
      title="Click to re-check backend connection"
      className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium transition-all bg-white border border-slate-200 hover:border-slate-300 shadow-xs hover:bg-slate-50 cursor-pointer"
    >
      <span className="relative flex h-2 w-2">
        {isOnline && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        )}
        <span
          className={`relative inline-flex rounded-full h-2 w-2 ${
            checking
              ? 'bg-amber-400'
              : isOnline
              ? 'bg-emerald-500'
              : 'bg-rose-500'
          }`}
        ></span>
      </span>
      <span className="text-slate-600">
        {checking
          ? 'Checking API...'
          : isOnline
          ? 'Backend Online (Port 8000)'
          : 'Backend Offline'}
      </span>
    </button>
  );
}

