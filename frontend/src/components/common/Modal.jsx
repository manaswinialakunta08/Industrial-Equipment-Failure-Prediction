import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

export function Modal({ isOpen, onClose, title, children, confirmLabel, onConfirm, confirmVariant = 'danger' }) {
  if (!isOpen) return null;

  const btnVariants = {
    danger: 'bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-500',
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500',
  }[confirmVariant];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 text-sm text-slate-600 leading-relaxed">
          {children}
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          {onConfirm && (
            <button
              type="button"
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`px-4 py-2 text-sm font-medium rounded-lg shadow-xs transition-colors focus:outline-hidden focus:ring-2 focus:ring-offset-2 ${btnVariants}`}
            >
              {confirmLabel || 'Confirm'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

