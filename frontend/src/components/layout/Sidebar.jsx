import React from 'react';
import {
  LayoutDashboard,
  ShieldAlert,
  Activity,
  History,
  BarChart3,
  Info,
  ChevronLeft,
  ChevronRight,
  Factory,
  CheckCircle2,
} from 'lucide-react';

export const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'prediction', label: 'Failure Prediction', icon: ShieldAlert },
  { id: 'monitoring', label: 'Machine Monitoring', icon: Activity },
  { id: 'history', label: 'Prediction History', icon: History },
  { id: 'performance', label: 'Model Performance', icon: BarChart3 },
  { id: 'about', label: 'About Project', icon: Info },
];

export function Sidebar({
  activePage,
  onNavigate,
  isCollapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}) {
  const content = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-200 border-r border-slate-800">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-slate-800/80">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-sm shadow-indigo-500/20">
            <Factory className="w-5 h-5" />
          </div>
          {!isCollapsed && (
            <div className="truncate">
              <h1 className="text-sm font-semibold text-white tracking-tight leading-tight">
                Industrial PM
              </h1>
              <p className="text-[11px] text-slate-400 font-mono tracking-wide">
                Failure Prediction v1.0
              </p>
            </div>
          )}
        </div>
        <button
          onClick={onToggleCollapse}
          className="hidden md:flex p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-2.5 py-4 space-y-1.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                if (mobileOpen) onCloseMobile();
              }}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-transform ${
                  isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                }`}
              />
              {!isCollapsed && <span className="truncate">{item.label}</span>}
              {!isCollapsed && isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-300" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Info */}
      {!isCollapsed && (
        <div className="p-3.5 m-2.5 rounded-xl bg-slate-800/60 border border-slate-750 text-xs">
          <div className="flex items-center gap-2 text-slate-300 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Extra Trees Engine</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-400 leading-snug">
            Tuned threshold: <span className="text-white font-mono font-medium">0.45</span>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:block transition-all duration-300 ease-in-out shrink-0 z-30 ${
          isCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        <div className="fixed top-0 bottom-0 left-0 transition-all duration-300 ease-in-out">
          <div className={isCollapsed ? 'w-16 h-full' : 'w-64 h-full'}>
            {content}
          </div>
        </div>
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs md:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 md:hidden transform transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {content}
      </div>
    </>
  );
}

