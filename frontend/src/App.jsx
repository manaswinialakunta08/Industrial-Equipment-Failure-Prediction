import React, { useState, useEffect, useCallback } from 'react';
import { Layout } from './components/layout/Layout';
import { OverviewPage } from './pages/OverviewPage';
import { PredictionPage } from './pages/PredictionPage';
import { MachineMonitoringPage } from './pages/MachineMonitoringPage';
import { PredictionHistoryPage } from './pages/PredictionHistoryPage';
import { ModelPerformancePage } from './pages/ModelPerformancePage';
import { AboutPage } from './pages/AboutPage';
import { checkBackendHealth } from './services/api';
import {
  getSessionHistory,
  addPredictionToHistory,
  clearSessionHistory,
} from './utils/storage';

const PAGE_METADATA = {
  overview: {
    title: 'Equipment Health Overview',
    description: 'Current session inference metrics, health status, and recent activity.',
  },
  prediction: {
    title: 'Failure Risk Prediction',
    description: 'Interactive telemetry input with live Extra Trees ML inference.',
  },
  monitoring: {
    title: 'Machine Profiles & Monitoring',
    description: 'Equipment variant benchmarks and manual telemetry inspection.',
  },
  history: {
    title: 'Prediction Session History',
    description: 'Complete log of telemetry submissions and model scores for this browser session.',
  },
  performance: {
    title: 'Model Validation Performance',
    description: 'Verified offline holdout test-set results and confusion matrix analysis.',
  },
  about: {
    title: 'About the System',
    description: 'System architecture, AI4I dataset, model selection, and production readiness.',
  },
};

export default function App() {
  const [activePage, setActivePage] = useState('overview');
  const [history, setHistory] = useState([]);
  const [prefillValues, setPrefillValues] = useState(null);
  const [backendStatus, setBackendStatus] = useState({
    isOnline: false,
    checking: true,
    error: null,
  });

  // Load session history on mount
  useEffect(() => {
    const stored = getSessionHistory();
    setHistory(stored);
  }, []);

  // Check backend connectivity
  const verifyBackend = useCallback(async () => {
    setBackendStatus((prev) => ({ ...prev, checking: true }));
    const result = await checkBackendHealth();
    setBackendStatus({
      isOnline: result.ok,
      checking: false,
      error: result.error || null,
    });
  }, []);

  useEffect(() => {
    verifyBackend();
    // Re-check periodically every 30 seconds
    const interval = setInterval(verifyBackend, 30000);
    return () => clearInterval(interval);
  }, [verifyBackend]);

  // Handle successful prediction from PredictionPage
  const handlePredictionComplete = (entry) => {
    const updated = addPredictionToHistory(entry);
    setHistory(updated);
  };

  // Prefill and route to prediction page
  const handlePrefillAndPredict = (values) => {
    setPrefillValues(values);
    setActivePage('prediction');
  };

  // Clear history
  const handleClearHistory = () => {
    clearSessionHistory();
    setHistory([]);
  };

  const meta = PAGE_METADATA[activePage] || PAGE_METADATA.overview;

  return (
    <Layout
      activePage={activePage}
      onNavigate={(pageId) => {
        setActivePage(pageId);
      }}
      pageTitle={meta.title}
      pageDescription={meta.description}
      backendStatus={backendStatus}
      onCheckBackend={verifyBackend}
      onQuickPredict={() => {
        setPrefillValues(null);
        setActivePage('prediction');
      }}
    >
      {activePage === 'overview' && (
        <OverviewPage
          history={history}
          onNavigateToPrediction={() => setActivePage('prediction')}
          onPrefillAndPredict={handlePrefillAndPredict}
        />
      )}

      {activePage === 'prediction' && (
        <PredictionPage
          onPredictionComplete={handlePredictionComplete}
          prefillValues={prefillValues}
          backendStatus={backendStatus}
        />
      )}

      {activePage === 'monitoring' && (
        <MachineMonitoringPage
          history={history}
          onPrefillAndPredict={handlePrefillAndPredict}
        />
      )}

      {activePage === 'history' && (
        <PredictionHistoryPage
          history={history}
          onClearHistory={handleClearHistory}
          onNavigateToPrediction={() => setActivePage('prediction')}
          onPrefillAndPredict={handlePrefillAndPredict}
        />
      )}

      {activePage === 'performance' && <ModelPerformancePage />}

      {activePage === 'about' && <AboutPage />}
    </Layout>
  );
}
