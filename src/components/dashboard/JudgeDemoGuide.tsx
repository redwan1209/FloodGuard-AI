import React, { useState } from 'react';
import { FloodBasin, FloodRiskAssessment, SimulationParams } from '../../types';
import { ActiveTab } from '../layout/TabNav';
import {
  Zap,
  ChevronDown,
  ChevronUp,
  Sliders,
  Map,
  ShieldCheck,
  RotateCcw,
  ArrowRight,
  Database,
  Cpu,
  Flame,
  Activity
} from 'lucide-react';

interface JudgeDemoGuideProps {
  basin: FloodBasin;
  assessment: FloodRiskAssessment;
  isSimulated: boolean;
  onApplyScenario: (params: SimulationParams) => void;
  onResetScenario: () => void;
  onNavigateTab: (tab: ActiveTab) => void;
}

export const JudgeDemoGuide: React.FC<JudgeDemoGuideProps> = ({
  basin,
  assessment,
  isSimulated,
  onApplyScenario,
  onResetScenario,
  onNavigateTab
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  // Quick stress scenario preset
  const triggerCatastrophicDeluge = () => {
    onApplyScenario({
      rainfallMultiplier: 2.2,
      additionalRainfallMm: 140,
      damWaterRelease: true,
      damDischargeIncreaseM: 2.4,
      drainageEfficiency: 35
    });
  };

  return (
    <section
      aria-label="Operational Verification Protocol"
      className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden transition-all"
    >
      {/* Sleek Operational Header Bar */}
      <div className="px-3 py-2 sm:px-4 sm:py-2.5 bg-slate-50 flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center gap-1.5 font-bold text-slate-800 min-w-0">
            <Activity className="w-3.5 h-3.5 text-blue-700 shrink-0" />
            <span className="text-xs sm:text-sm tracking-tight truncate">
              <span className="sm:hidden">Operational Protocol</span>
              <span className="hidden sm:inline">Operational Verification Protocol</span>
            </span>
          </div>
          <span className="hidden md:inline-flex text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200 shrink-0">
            2-Min Audit Tour
          </span>
          {isSimulated && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-800 border border-red-300 flex items-center gap-1 animate-pulse shrink-0">
              <Flame className="w-2.5 h-2.5 fill-red-600 text-red-600" />
              <span>Stress Active</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {isSimulated && (
            <button
              onClick={onResetScenario}
              className="flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 transition-colors shadow-xs"
              title="Reset simulation parameters to live baseline"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden sm:inline">Reset Baseline</span>
            </button>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 transition-colors shadow-xs"
          >
            <span>{isExpanded ? 'Minimize' : 'Tour'}</span>
            {isExpanded ? <ChevronUp className="w-3 h-3 text-slate-500" /> : <ChevronDown className="w-3 h-3 text-slate-500" />}
          </button>
        </div>
      </div>

      {/* Compact Operational Steps (Reduced Vertical Footprint) */}
      {isExpanded && (
        <div className="p-2.5 sm:p-3 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 animate-in fade-in duration-150">
          {/* Step 1: Telemetry Data */}
          <div className="bg-slate-50 rounded p-2.5 border border-slate-200 flex flex-col justify-between hover:border-slate-300 transition-all">
            <div>
              <div className="flex items-center justify-between text-[10px] font-bold text-blue-800 uppercase tracking-wide">
                <span className="flex items-center gap-1">
                  <Database className="w-3 h-3 text-blue-600" />
                  <span>01 • Telemetry</span>
                </span>
                <span className="text-slate-400 font-mono">LIVE</span>
              </div>
              <p className="text-xs font-bold text-slate-900 mt-1">Multi-Source Feeds</p>
              <p className="text-[11px] text-slate-600 mt-0.5 leading-tight">
                CWC river benchmarks + Open-Meteo precipitation + SRTM 30m DEM terrain.
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('analytics')}
              className="mt-2 w-full py-1 px-2 rounded bg-white hover:bg-slate-100 text-slate-800 text-[11px] font-semibold border border-slate-200 flex items-center justify-center gap-1 transition-colors shadow-xs"
            >
              <span>Inspect Telemetry</span>
              <ArrowRight className="w-2.5 h-2.5 text-blue-600" />
            </button>
          </div>

          {/* Step 2: 4-Pillar MCDA */}
          <div className="bg-slate-50 rounded p-2.5 border border-slate-200 flex flex-col justify-between hover:border-slate-300 transition-all">
            <div>
              <div className="flex items-center justify-between text-[10px] font-bold text-indigo-800 uppercase tracking-wide">
                <span className="flex items-center gap-1">
                  <Cpu className="w-3 h-3 text-indigo-600" />
                  <span>02 • MCDA Model</span>
                </span>
                <span className="text-slate-400 font-mono">100%</span>
              </div>
              <p className="text-xs font-bold text-slate-900 mt-1">Weighted Assessment</p>
              <p className="text-[11px] text-slate-600 mt-0.5 leading-tight">
                35% River + 30% Rain + 20% Topo + 15% History.
              </p>
            </div>
            <div className="mt-2 py-0.5 px-2 rounded bg-white border border-slate-200 text-[11px] text-slate-800 flex items-center justify-between font-mono">
              <span className="text-slate-500 font-sans">Current FRI:</span>
              <span className="font-bold text-slate-900">{assessment.overallScore}/100</span>
            </div>
          </div>

          {/* Step 3: What-If Stress */}
          <div className="bg-slate-50 rounded p-2.5 border border-amber-200 flex flex-col justify-between hover:border-amber-300 transition-all">
            <div>
              <div className="flex items-center justify-between text-[10px] font-bold text-amber-900 uppercase tracking-wide">
                <span className="flex items-center gap-1">
                  <Sliders className="w-3 h-3 text-amber-700" />
                  <span>03 • Stress Test</span>
                </span>
                <span className="text-amber-600 font-mono">SIM</span>
              </div>
              <p className="text-xs font-bold text-slate-900 mt-1">Cloudburst Surge</p>
              <p className="text-[11px] text-slate-600 mt-0.5 leading-tight">
                Inject +140mm rainfall & +2.4m dam breach to simulate catastrophic surge.
              </p>
            </div>
            <div className="mt-2 flex gap-1.5">
              <button
                onClick={triggerCatastrophicDeluge}
                className="flex-1 py-1 px-2 rounded bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold transition-colors shadow-xs"
              >
                ⚡ Trigger Deluge
              </button>
              <button
                onClick={() => onNavigateTab('simulator')}
                className="py-1 px-2 rounded bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-[11px] transition-colors shadow-xs"
                title="Open Scenario Simulator"
              >
                <Sliders className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Step 4: Spatial & Evacuation Triage */}
          <div className="bg-slate-50 rounded p-2.5 border border-emerald-200 flex flex-col justify-between hover:border-emerald-300 transition-all">
            <div>
              <div className="flex items-center justify-between text-[10px] font-bold text-emerald-800 uppercase tracking-wide">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-700" />
                  <span>04 • Spatial Action</span>
                </span>
                <span className="text-emerald-600 font-mono">GIS</span>
              </div>
              <p className="text-xs font-bold text-slate-900 mt-1">Hazard & Shelters</p>
              <p className="text-[11px] text-slate-600 mt-0.5 leading-tight">
                Inundation footprint (~{assessment.inundationAreaSqKm} km²) & safe corridors.
              </p>
            </div>
            <div className="mt-2 flex gap-1.5">
              <button
                onClick={() => onNavigateTab('map')}
                className="flex-1 py-1 px-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold transition-colors flex items-center justify-center gap-1 shadow-xs"
              >
                <Map className="w-2.5 h-2.5" />
                <span>Map</span>
              </button>
              <button
                onClick={() => onNavigateTab('evacuation')}
                className="flex-1 py-1 px-2 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-colors flex items-center justify-center gap-1 shadow-xs"
              >
                <ShieldCheck className="w-2.5 h-2.5" />
                <span>Shelters</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
