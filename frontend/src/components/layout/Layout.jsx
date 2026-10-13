import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export function Layout({
  children,
  activePage,
  onNavigate,
  pageTitle,
  pageDescription,
  backendStatus,
  onCheckBackend,
  onQuickPredict,
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <Sidebar
        activePage={activePage}
        onNavigate={onNavigate}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          pageTitle={pageTitle}
          pageDescription={pageDescription}
          onOpenMobileSidebar={() => setMobileOpen(true)}
          backendStatus={backendStatus}
          onCheckBackend={onCheckBackend}
          onQuickPredict={activePage !== 'prediction' ? onQuickPredict : null}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

