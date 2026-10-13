/**
 * Session storage management for prediction history
 * Scoped strictly to the current browser session.
 */

const STORAGE_KEY = 'industrial_pm_session_history';

export function getSessionHistory() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Failed to read session history:', err);
    return [];
  }
}

export function saveSessionHistory(history) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (err) {
    console.error('Failed to save session history:', err);
  }
}

export function addPredictionToHistory(entry) {
  const current = getSessionHistory();
  const updated = [
    {
      id: 'pred-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
      timestamp: new Date().toISOString(),
      ...entry,
    },
    ...current,
  ];
  saveSessionHistory(updated);
  return updated;
}

export function clearSessionHistory() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear session history:', err);
  }
  return [];
}

