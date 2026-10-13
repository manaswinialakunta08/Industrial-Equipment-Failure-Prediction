import React from 'react';
import { Menu, RefreshCw, Zap, ExternalLink } from 'lucide-react';
import { BackendStatusBadge } from '../common/StatusBadge';
import { API_BASE_URL } from '../../services/api';

export function Topbar({
  pageTitle,
  pageDescription,
  onOpenMobileSidebar,
  backendStatus,
  onCheckBackend,
  onQuickPredict,
}) {
  return (
    <header className="sticky top-0 z-20 h-16 bg-white/95 backdrop-blur-xs border-b border-slate-200/90 px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          onClick={onOpenMobileSidebar}
          className="md:hidden p-2 -ml-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
            {pageTitle}
          </h2>
          {pageDescription && (
            <p className="hidden sm:block text-xs text-slate-500 font-normal">
              {pageDescription}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Backend health status badge */}
        <BackendStatusBadge
          isOnline={backendStatus.isOnline}
          checking={backendStatus.checking}
          onRefresh={onCheckBackend}
        />

        {/* Quick run prediction button if not already on prediction page */}
        {onQuickPredict && (
          <button
            onClick={onQuickPredict}
            className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs transition-colors cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>New Prediction</span>
          </button>
        )}

        {/* Link to FastAPI Docs */}
        <a
          href={`${API_BASE_URL}/docs`}
          target="_blank"
          rel="noreferrer"
          title="Open FastAPI Swagger Documentation"
          className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
        >
          <span>API Docs</span>
          <ExternalLink className="w-3 h-3 text-slate-400" />
        </a>
      </div>
    </header>
  );
}

