/**
 * Utility formatters for sensor data and model outputs
 */

export function formatPercentage(ratio) {
  if (ratio === null || ratio === undefined || isNaN(ratio)) return '0.0%';
  return `${(Number(ratio) * 100).toFixed(1)}%`;
}

export function formatScore(ratio) {
  if (ratio === null || ratio === undefined || isNaN(ratio)) return '0.0000';
  return Number(ratio).toFixed(4);
}

export function formatTempK(tempK) {
  if (tempK === null || tempK === undefined || isNaN(tempK)) return '--';
  const c = (tempK - 273.15).toFixed(1);
  return `${tempK} K (${c} °C)`;
}

export function formatDateTime(isoOrDate) {
  if (!isoOrDate) return '--';
  const d = new Date(isoOrDate);
  if (isNaN(d.getTime())) return String(isoOrDate);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) +
    ' · ' +
    d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export function getMachineTypeName(type) {
  switch (type) {
    case 'L':
      return 'Low (50% of production / Light Duty)';
    case 'M':
      return 'Medium (30% of production / Standard Duty)';
    case 'H':
      return 'High (20% of production / Heavy Duty)';
    default:
      return type;
  }
}

