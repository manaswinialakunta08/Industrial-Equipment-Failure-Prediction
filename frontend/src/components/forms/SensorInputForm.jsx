import React, { useState, useEffect } from 'react';
import {
  RotateCcw,
  Sparkles,
  AlertTriangle,
  Play,
  Layers,
  Thermometer,
  RotateCw,
  Wrench,
  Gauge,
  HelpCircle,
} from 'lucide-react';

const PRESETS = {
  defaultNormal: {
    label: 'Standard Normal (Preset)',
    data: {
      machine_type: 'M',
      air_temperature: 300.0,
      process_temperature: 310.0,
      rotational_speed: 1500,
      torque: 40.0,
      tool_wear: 120,
    },
  },
  failureRisk: {
    label: 'High Risk Test (Preset)',
    data: {
      machine_type: 'L',
      air_temperature: 303.0,
      process_temperature: 313.0,
      rotational_speed: 1400,
      torque: 55.0,
      tool_wear: 240,
    },
  },
};

export function SensorInputForm({
  onSubmit,
  loading,
  initialValues,
  backendOnline,
}) {
  const [formData, setFormData] = useState({
    machine_type: 'M',
    air_temperature: 300.0,
    process_temperature: 310.0,
    rotational_speed: 1500,
    torque: 40.0,
    tool_wear: 120,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialValues) {
      setFormData({
        machine_type: initialValues.machine_type || 'M',
        air_temperature: initialValues.air_temperature ?? 300.0,
        process_temperature: initialValues.process_temperature ?? 310.0,
        rotational_speed: initialValues.rotational_speed ?? 1500,
        torque: initialValues.torque ?? 40.0,
        tool_wear: initialValues.tool_wear ?? 120,
      });
    }
  }, [initialValues]);

  const validate = () => {
    const errs = {};
    const air = parseFloat(formData.air_temperature);
    const proc = parseFloat(formData.process_temperature);
    const speed = parseInt(formData.rotational_speed, 10);
    const torque = parseFloat(formData.torque);
    const wear = parseInt(formData.tool_wear, 10);

    if (!['L', 'M', 'H'].includes(formData.machine_type)) {
      errs.machine_type = 'Must be L, M, or H';
    }

    if (isNaN(air) || air < 250 || air > 350) {
      errs.air_temperature = 'Must be between 250 K and 350 K';
    }

    if (isNaN(proc) || proc < 250 || proc > 400) {
      errs.process_temperature = 'Must be between 250 K and 400 K';
    } else if (!isNaN(air) && proc < air) {
      errs.process_temperature = 'Process temperature must be ≥ air temperature';
    }

    if (isNaN(speed) || speed <= 0 || speed > 10000) {
      errs.rotational_speed = 'Must be between 1 and 10,000 rpm';
    }

    if (isNaN(torque) || torque < 0 || torque > 200) {
      errs.torque = 'Must be between 0 and 200 Nm';
    }

    if (isNaN(wear) || wear < 0 || wear > 300) {
      errs.tool_wear = 'Must be between 0 and 300 minutes';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (field, val) => {
    setFormData((prev) => ({
      ...prev,
      [field]: val,
    }));
    // Clear error for field
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleApplyPreset = (presetKey) => {
    const preset = PRESETS[presetKey];
    if (preset) {
      setFormData(preset.data);
      setErrors({});
    }
  };

  const handleReset = () => {
    setFormData(PRESETS.defaultNormal.data);
    setErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            Sensor Reading Input Form
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Provide the 6 telemetry features required by the Extra Trees inference model.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-400 font-medium mr-1">Quick Load:</span>
          <button
            type="button"
            onClick={() => handleApplyPreset('defaultNormal')}
            className="px-2.5 py-1 text-xs font-medium rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/80 transition-colors cursor-pointer"
          >
            Normal Sample
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset('failureRisk')}
            className="px-2.5 py-1 text-xs font-medium rounded-md bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
          >
            Risk Sample
          </button>
          <button
            type="button"
            onClick={handleReset}
            title="Reset to default values"
            className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* 1. Machine Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-500" />
              <span>Machine Type</span>
              <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.machine_type}
              onChange={(e) => handleChange('machine_type', e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
            >
              <option value="L">L — Low Variant (Light Duty, 50% dataset)</option>
              <option value="M">M — Medium Variant (Standard Duty, 30% dataset)</option>
              <option value="H">H — High Variant (Heavy Duty, 20% dataset)</option>
            </select>
            <p className="mt-1 text-[11px] text-slate-400">
              Product variant category (Type L / M / H)
            </p>
            {errors.machine_type && (
              <p className="mt-1 text-xs text-rose-600">{errors.machine_type}</p>
            )}
          </div>

          {/* 2. Air Temperature */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Thermometer className="w-3.5 h-3.5 text-blue-500" />
                <span>Air Temperature</span>
                <span className="text-rose-500">*</span>
              </span>
              <span className="text-[11px] text-slate-400 font-mono">Kelvin [K]</span>
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                min="250"
                max="350"
                value={formData.air_temperature}
                onChange={(e) => handleChange('air_temperature', e.target.value)}
                className={`w-full px-3 py-2 text-sm bg-white border rounded-lg text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 transition-all ${
                  errors.air_temperature
                    ? 'border-rose-400 focus:border-rose-500'
                    : 'border-slate-200 focus:border-indigo-500'
                }`}
                placeholder="e.g. 300.0"
                required
              />
              <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium">
                K
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              Ambient temperature (approx. {formData.air_temperature ? (formData.air_temperature - 273.15).toFixed(1) : 0}°C)
            </p>
            {errors.air_temperature && (
              <p className="mt-1 text-xs text-rose-600">{errors.air_temperature}</p>
            )}
          </div>

          {/* 3. Process Temperature */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Thermometer className="w-3.5 h-3.5 text-amber-500" />
                <span>Process Temperature</span>
                <span className="text-rose-500">*</span>
              </span>
              <span className="text-[11px] text-slate-400 font-mono">Kelvin [K]</span>
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                min="250"
                max="400"
                value={formData.process_temperature}
                onChange={(e) => handleChange('process_temperature', e.target.value)}
                className={`w-full px-3 py-2 text-sm bg-white border rounded-lg text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 transition-all ${
                  errors.process_temperature
                    ? 'border-rose-400 focus:border-rose-500'
                    : 'border-slate-200 focus:border-indigo-500'
                }`}
                placeholder="e.g. 310.0"
                required
              />
              <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium">
                K
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              Must be ≥ air temperature (ΔT: {(parseFloat(formData.process_temperature) - parseFloat(formData.air_temperature)).toFixed(1)} K)
            </p>
            {errors.process_temperature && (
              <p className="mt-1 text-xs text-rose-600">{errors.process_temperature}</p>
            )}
          </div>

          {/* 4. Rotational Speed */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <RotateCw className="w-3.5 h-3.5 text-emerald-500" />
                <span>Rotational Speed</span>
                <span className="text-rose-500">*</span>
              </span>
              <span className="text-[11px] text-slate-400 font-mono">rpm</span>
            </label>
            <div className="relative">
              <input
                type="number"
                step="1"
                min="1"
                max="10000"
                value={formData.rotational_speed}
                onChange={(e) => handleChange('rotational_speed', e.target.value)}
                className={`w-full px-3 py-2 text-sm bg-white border rounded-lg text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 transition-all ${
                  errors.rotational_speed
                    ? 'border-rose-400 focus:border-rose-500'
                    : 'border-slate-200 focus:border-indigo-500'
                }`}
                placeholder="e.g. 1500"
                required
              />
              <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium">
                rpm
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              Spindle shaft speed (1 – 10,000 rpm)
            </p>
            {errors.rotational_speed && (
              <p className="mt-1 text-xs text-rose-600">{errors.rotational_speed}</p>
            )}
          </div>

          {/* 5. Torque */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-violet-500" />
                <span>Torque</span>
                <span className="text-rose-500">*</span>
              </span>
              <span className="text-[11px] text-slate-400 font-mono">Nm</span>
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                min="0"
                max="200"
                value={formData.torque}
                onChange={(e) => handleChange('torque', e.target.value)}
                className={`w-full px-3 py-2 text-sm bg-white border rounded-lg text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 transition-all ${
                  errors.torque
                    ? 'border-rose-400 focus:border-rose-500'
                    : 'border-slate-200 focus:border-indigo-500'
                }`}
                placeholder="e.g. 40.0"
                required
              />
              <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium">
                Nm
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              Mechanical rotational torque (0 – 200 Nm)
            </p>
            {errors.torque && (
              <p className="mt-1 text-xs text-rose-600">{errors.torque}</p>
            )}
          </div>

          {/* 6. Tool Wear */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-cyan-500" />
                <span>Tool Wear</span>
                <span className="text-rose-500">*</span>
              </span>
              <span className="text-[11px] text-slate-400 font-mono">minutes</span>
            </label>
            <div className="relative">
              <input
                type="number"
                step="1"
                min="0"
                max="300"
                value={formData.tool_wear}
                onChange={(e) => handleChange('tool_wear', e.target.value)}
                className={`w-full px-3 py-2 text-sm bg-white border rounded-lg text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 transition-all ${
                  errors.tool_wear
                    ? 'border-rose-400 focus:border-rose-500'
                    : 'border-slate-200 focus:border-indigo-500'
                }`}
                placeholder="e.g. 120"
                required
              />
              <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium">
                min
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              Cumulative tool wear duration (0 – 300 min)
            </p>
            {errors.tool_wear && (
              <p className="mt-1 text-xs text-rose-600">{errors.tool_wear}</p>
            )}
          </div>
        </div>

        {/* Action bar */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-indigo-500"></span>
            <span>Target: Extra Trees Classifier (threshold: 0.45)</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 sm:flex-none px-4 py-2.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
            >
              Reset Form
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 rounded-lg shadow-sm hover:shadow transition-all cursor-pointer"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  <span>Running Inference...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Run Failure Prediction</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

