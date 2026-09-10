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
  Cpu
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

  // Scenario presets for quick judge testing
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
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-2xl p-4 sm:p-5 shadow-2xl relative overflow-hidden transition-all">
      {/* Background Accent Glow */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/25 shrink-0">
            <Zap className="w-5 h-5 text-amber-200 fill-amber-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                2-Minute Hackathon Judge Demo Tour
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Decision Support Pipeline
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Quickly test end-to-end: <span className="text-slate-300 font-medium">Data Telemetry</span> → <span className="text-slate-300 font-medium">MCDA AI Model</span> → <span className="text-slate-300 font-medium">Scenario Stress</span> → <span className="text-slate-300 font-medium">Spatial Hazard Map</span> → <span className="text-slate-300 font-medium">Evacuation Triage</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isSimulated && (
            <button
              onClick={onResetScenario}
              className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition-colors shadow-sm"
              title="Reset simulation parameters to live baseline"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Baseline</span>
            </button>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
          >
            <span>{isExpanded ? 'Minimize Guide' : 'Open 2-Min Guide'}</span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Collapsible Steps Content */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-4 gap-3 animate-in fade-in duration-200">
          {/* Step 1: Telemetry Data */}
          <div className="bg-slate-900/90 rounded-xl p-3.5 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-[11px] font-bold text-cyan-400 uppercase tracking-wider mb-1">
                <span className="flex items-center gap-1">
                  <Database className="w-3 h-3" /> Step 1: Multi-Source Data
                </span>
                <span className="text-slate-500 font-mono">01</span>
              </div>
              <p className="text-xs text-slate-300 font-semibold mt-1">
                Live APIs + Public Benchmarks
              </p>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                Open-Meteo real-time rain + CWC gauge benchmarks + Copernicus/SRTM 30m DEM elevation.
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('analytics')}
              className="mt-3 w-full py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
            >
              <span>Inspect Hydrographs</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Step 2: Explainable MCDA Model */}
          <div className="bg-slate-900/90 rounded-xl p-3.5 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-[11px] font-bold text-indigo-400 uppercase tracking-wider mb-1">
                <span className="flex items-center gap-1">
                  <Cpu className="w-3 h-3" /> Step 2: 4-Pillar MCDA AI
                </span>
                <span className="text-slate-500 font-mono">02</span>
              </div>
              <p className="text-xs text-slate-300 font-semibold mt-1">
                Rigorous 100% Equal Formula
              </p>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                35% Hydro + 30% Rain + 20% Topo + 15% History = Current Score <strong className="text-white">{assessment.overallScore}/100</strong>.
              </p>
            </div>
            <div className="mt-3 text-[11px] text-slate-400 italic bg-slate-950/60 p-1.5 rounded border border-slate-800/80 truncate">
              "{assessment.primaryDriver}"
            </div>
          </div>

          {/* Step 3: Trigger "What-If" Stress */}
          <div className="bg-slate-900/90 rounded-xl p-3.5 border border-amber-500/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-1">
                <span className="flex items-center gap-1">
                  <Sliders className="w-3 h-3" /> Step 3: "What-If" Stress
                </span>
                <span className="text-slate-500 font-mono">03</span>
              </div>
              <p className="text-xs text-slate-300 font-semibold mt-1">
                Simulate Cloudburst Surge
              </p>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                Apply +140mm rainfall & +2.4m river rise to observe instant score surge to RED ALERT.
              </p>
            </div>
            <div className="mt-3 flex gap-1.5">
              <button
                onClick={triggerCatastrophicDeluge}
                className="flex-1 py-1.5 px-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-md shadow-red-600/20 transition-all text-center"
              >
                ⚡ Trigger Deluge
              </button>
              <button
                onClick={() => onNavigateTab('simulator')}
                className="py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
                title="Open Simulator"
              >
                <Sliders className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Step 4: Map & Evacuation Directives */}
          <div className="bg-slate-900/90 rounded-xl p-3.5 border border-emerald-500/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Step 4: Map & Shelters
                </span>
                <span className="text-slate-500 font-mono">04</span>
              </div>
              <p className="text-xs text-slate-300 font-semibold mt-1">
                Dynamic Corridors & Shelters
              </p>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                Inundation footprint (~{assessment.inundationAreaSqKm} km²), safe high grounds, and clear vs flooded roads.
              </p>
            </div>
            <div className="mt-3 flex gap-1.5">
              <button
                onClick={() => onNavigateTab('map')}
                className="flex-1 py-1.5 px-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1"
              >
                <Map className="w-3 h-3" />
                <span>Map</span>
              </button>
              <button
                onClick={() => onNavigateTab('evacuation')}
                className="flex-1 py-1.5 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1"
              >
                <ShieldCheck className="w-3 h-3" />
                <span>Shelters</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
