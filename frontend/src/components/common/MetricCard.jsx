import React from 'react';

export function MetricCard({
  title,
  value,
  subtext,
  icon: Icon,
  badgeText,
  badgeType = 'neutral',
  onClick,
}) {
  const badgeStyles = {
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    primary: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  }[badgeType];

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs transition-all ${
        onClick ? 'cursor-pointer hover:border-indigo-300 hover:shadow-sm' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        {Icon && (
          <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight text-slate-900">
          {value}
        </span>
        {badgeText && (
          <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${badgeStyles}`}>
            {badgeText}
          </span>
        )}
      </div>

      {subtext && (
        <p className="mt-1 text-xs text-slate-500 font-normal truncate">
          {subtext}
        </p>
      )}
    </div>
  );
}

