import React from 'react';
import { MachineTypeBadge, RiskBadge } from '../components/common/StatusBadge';
import { formatPercentage, formatTempK } from '../utils/formatters';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Info,
  Sliders,
  Wrench,
  Thermometer,
  RotateCw,
  Gauge,
  Layers,
  Sparkles,
} from 'lucide-react';

const MACHINE_PROFILES = [
  {
    id: 'MAC-L-01',
    name: 'Milling Unit Alpha (Variant L)',
    type: 'L',
    description: 'Light-duty high-speed milling spindle representing 50% of manufacturing volume.',
    sampleTelemetry: {
      air_temperature: 303.0,
      process_temperature: 313.0,
      rotational_speed: 1400,
      torque: 55.0,
      tool_wear: 240,
    },
    knownBehavior: 'Prone to Tool Wear Failure (TWF) and Heat Dissipation Failure (HDF) under prolonged torque loads.',
    sampleTag: 'High-Wear Sample Profile',
  },
  {
    id: 'MAC-M-02',
    name: 'Machining Center Beta (Variant M)',
    type: 'M',
    description: 'Standard medium-duty universal machining center representing 30% of manufacturing volume.',
    sampleTelemetry: {
      air_temperature: 300.0,
      process_temperature: 310.0,
      rotational_speed: 1500,
      torque: 40.0,
      tool_wear: 120,
    },
    knownBehavior: 'Standard balanced operating envelope with nominal wear cycles and optimal thermal gradient.',
    sampleTag: 'Nominal Benchmark Sample',
  },
  {
    id: 'MAC-H-03',
    name: 'Heavy Lathe Gamma (Variant H)',
    type: 'H',
    description: 'Heavy-duty turning lathe for high-tensile components representing 20% of manufacturing volume.',
    sampleTelemetry: {
      air_temperature: 298.5,
      process_temperature: 308.2,
      rotational_speed: 1380,
      torque: 48.0,
      tool_wear: 85,
    },
    knownBehavior: 'High torque tolerance with rigid tooling assemblies; lower failure frequency in dataset.',
    sampleTag: 'Heavy Variant Sample',
  },
];

export function MachineMonitoringPage({
  history = [],
  onPrefillAndPredict,
}) {
  // Find latest prediction per machine type if available
  const getLatestByMachineType = (type) => {
    return history.find((h) => h.input.machine_type === type) || null;
  };

  return (
    <div className="space-y-6">
      {/* Important Disclaimer Notice as strictly required */}
      <div className="bg-amber-50/70 border border-amber-200/90 rounded-xl p-4 text-xs text-amber-900 flex items-start gap-3 shadow-xs">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-amber-950">
            Architectural Note: Simulated & Manual Telemetry Environment
          </h4>
          <p className="mt-0.5 leading-relaxed">
            This dashboard operates on <strong>manually submitted operational parameters and offline test benchmarks</strong>. No physical IoT edge sensors or OPC-UA streaming pipelines are connected. Telemetry shown below represents machine profiles and user-submitted inputs, not live production telemetry.
          </p>
        </div>
      </div>

      {/* Machine Profiles Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {MACHINE_PROFILES.map((machine) => {
          const userSubmission = getLatestByMachineType(machine.type);
          const activeTelemetry = userSubmission ? userSubmission.input : machine.sampleTelemetry;
          const activeResult = userSubmission ? userSubmission.result : null;

          return (
            <div
              key={machine.id}
              className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <MachineTypeBadge type={machine.type} />
                    <span className="text-xs font-mono text-slate-400">
                      {machine.id}
                    </span>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                    {userSubmission ? 'Session Submission' : machine.sampleTag}
                  </span>
                </div>

                <div className="mt-3">
                  <h3 className="text-base font-bold text-slate-900">
                    {machine.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-snug">
                    {machine.description}
                  </p>
                </div>

                {/* Status Indicator */}
                <div className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-600 font-medium">
                    Inference Status:
                  </span>
                  {activeResult ? (
                    <RiskBadge
                      isRisk={activeResult.failure_risk_detected}
                      size="sm"
                    />
                  ) : (
                    <span className="text-xs text-slate-500 italic">
                      Awaiting evaluation
                    </span>
                  )}
                </div>

                {/* Sensor Readings Snapshot */}
                <div className="mt-4 space-y-2">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    {userSubmission ? 'Last Evaluated Readings' : 'Sample Benchmark Readings'}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 bg-slate-50 rounded border border-slate-100">
                      <span className="text-slate-400 block text-[10px]">Air Temp</span>
                      <strong className="text-slate-800">{activeTelemetry.air_temperature} K</strong>
                    </div>
                    <div className="p-2 bg-slate-50 rounded border border-slate-100">
                      <span className="text-slate-400 block text-[10px]">Process Temp</span>
                      <strong className="text-slate-800">{activeTelemetry.process_temperature} K</strong>
                    </div>
                    <div className="p-2 bg-slate-50 rounded border border-slate-100">
                      <span className="text-slate-400 block text-[10px]">Speed</span>
                      <strong className="text-slate-800">{activeTelemetry.rotational_speed} rpm</strong>
                    </div>
                    <div className="p-2 bg-slate-50 rounded border border-slate-100">
                      <span className="text-slate-400 block text-[10px]">Torque</span>
                      <strong className="text-slate-800">{activeTelemetry.torque} Nm</strong>
                    </div>
                    <div className="p-2 bg-slate-50 rounded border border-slate-100 col-span-2 flex items-center justify-between">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Tool Wear</span>
                        <strong className="text-slate-800">{activeTelemetry.tool_wear} min</strong>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        Max: 300 min
                      </span>
                    </div>
                  </div>
                </div>

                {/* Known failure behavior description */}
                <p className="mt-3 text-[11px] text-slate-500 italic">
                  Note: {machine.knownBehavior}
                </p>
              </div>

              {/* Action Button */}
              <div className="mt-5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() =>
                    onPrefillAndPredict({
                      machine_type: machine.type,
                      ...activeTelemetry,
                    })
                  }
                  className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50 transition-colors shadow-2xs cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Load into Failure Prediction</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

