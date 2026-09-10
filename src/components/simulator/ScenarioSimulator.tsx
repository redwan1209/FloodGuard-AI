import React from 'react';
import { SimulationParams, FloodRiskAssessment, FloodBasin } from '../../types';
import { Sliders, RotateCcw, AlertOctagon, CloudLightning, Waves, ShieldAlert, ArrowRight, Clock, Droplets, MapPin } from 'lucide-react';

interface ScenarioSimulatorProps {
  basin: FloodBasin;
  simParams: SimulationParams;
  onChangeParams: (params: SimulationParams) => void;
  onReset: () => void;
  assessment: FloodRiskAssessment;
  baselineScore: number;
  onNavigateToMap?: () => void;
  onNavigateToEvac?: () => void;
}

export const ScenarioSimulator: React.FC<ScenarioSimulatorProps> = ({
  basin,
  simParams,
  onChangeParams,
  onReset,
  assessment,
  baselineScore,
  onNavigateToMap,
  onNavigateToEvac
}) => {
  // Preset scenarios matching Phase 4 criteria
  const applyPreset = (type: 'scenario_a' | 'scenario_b' | 'scenario_c' | 'scenario_d' | 'baseline') => {
    switch (type) {
      case 'baseline':
        onReset();
        break;
      case 'scenario_a':
        // Scenario A: Heavy rainfall increases by 25%
        onChangeParams({
          rainfallMultiplier: 1.25,
          additionalRainfallMm: 25,
          damWaterRelease: false,
          damDischargeIncreaseM: 0,
          drainageEfficiency: 95
        });
        break;
      case 'scenario_b':
        // Scenario B: River level rises by 0.5 m
        onChangeParams({
          rainfallMultiplier: 1.0,
          additionalRainfallMm: 0,
          damWaterRelease: true,
          damDischargeIncreaseM: 0.5,
          drainageEfficiency: 90
        });
        break;
      case 'scenario_c':
        // Scenario C: Heavy rainfall + rapidly rising river
        onChangeParams({
          rainfallMultiplier: 1.5,
          additionalRainfallMm: 65,
          damWaterRelease: true,
          damDischargeIncreaseM: 1.3,
          drainageEfficiency: 75
        });
        break;
      case 'scenario_d':
        // Scenario D: Extreme rainfall + high historical susceptibility + low elevation
        onChangeParams({
          rainfallMultiplier: 2.2,
          additionalRainfallMm: 160,
          damWaterRelease: true,
          damDischargeIncreaseM: 2.8,
          drainageEfficiency: 35
        });
        break;
    }
  };

  const deltaScore = assessment.overallScore - baselineScore;

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white">
              "What-If" Scenario Stress Simulator & Sensitivity Lab (Phase 4)
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Simulate realistic multi-factor stress scenarios for <span className="text-cyan-300 font-semibold">{basin.name}</span> and observe instant recalculations
          </p>
        </div>

        <button
          onClick={onReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset to Baseline</span>
        </button>
      </div>

      {/* Realistic Presets (Scenario A, B, C, D) */}
      <div>
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
          Documented Interactive Scenarios (Phase 4)
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          <button
            onClick={() => applyPreset('scenario_a')}
            className="p-3 rounded-xl bg-slate-950/80 border border-blue-500/30 hover:border-blue-500/60 text-left transition-all group"
          >
            <span className="text-xs font-bold text-blue-400 group-hover:text-blue-300 flex items-center gap-1">
              <CloudLightning className="w-3.5 h-3.5" /> Scenario A: +25% Rain
            </span>
            <span className="text-[11px] text-slate-300 block mt-1 font-medium">Moderate Precipitation Surge</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">+25mm rain load; river steady</span>
          </button>

          <button
            onClick={() => applyPreset('scenario_b')}
            className="p-3 rounded-xl bg-slate-950/80 border border-cyan-500/30 hover:border-cyan-500/60 text-left transition-all group"
          >
            <span className="text-xs font-bold text-cyan-400 group-hover:text-cyan-300 flex items-center gap-1">
              <Waves className="w-3.5 h-3.5" /> Scenario B: +0.5m River Rise
            </span>
            <span className="text-[11px] text-slate-300 block mt-1 font-medium">Hydrological River Surge</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Water stage increases by 0.5m</span>
          </button>

          <button
            onClick={() => applyPreset('scenario_c')}
            className="p-3 rounded-xl bg-slate-950/80 border border-amber-500/30 hover:border-amber-500/60 text-left transition-all group"
          >
            <span className="text-xs font-bold text-amber-400 group-hover:text-amber-300 flex items-center gap-1">
              <Droplets className="w-3.5 h-3.5" /> Scenario C: Rain + River Surge
            </span>
            <span className="text-[11px] text-slate-300 block mt-1 font-medium">Compound Inflow Surge</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">+65mm rain & +1.3m river stage</span>
          </button>

          <button
            onClick={() => applyPreset('scenario_d')}
            className="p-3 rounded-xl bg-slate-950/80 border border-red-500/30 hover:border-red-500/60 text-left transition-all group"
          >
            <span className="text-xs font-bold text-red-400 group-hover:text-red-300 flex items-center gap-1">
              <AlertOctagon className="w-3.5 h-3.5" /> Scenario D: Catastrophe
            </span>
            <span className="text-[11px] text-slate-300 block mt-1 font-medium">Extreme Cloudburst + Dam Spillway</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">+160mm rain, +2.8m stage, choked drains</span>
          </button>
        </div>
      </div>

      {/* Interactive Controls & Live Score Delta */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sliders (7 Cols) */}
        <div className="lg:col-span-7 space-y-5 bg-slate-950/60 p-5 rounded-xl border border-slate-800/80">
          {/* Slider 1: Additional Rainfall */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <CloudLightning className="w-3.5 h-3.5 text-blue-400" />
                Additional 24h Precipitation Surge
              </span>
              <span className="font-mono font-bold text-blue-400">
                +{simParams.additionalRainfallMm} mm (×{simParams.rainfallMultiplier.toFixed(2)})
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="200"
              step="10"
              value={simParams.additionalRainfallMm}
              onChange={(e) =>
                onChangeParams({
                  ...simParams,
                  additionalRainfallMm: Number(e.target.value)
                })
              }
              className="w-full accent-blue-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
              <span>0 mm (Normal)</span>
              <span>+100 mm (Heavy)</span>
              <span>+200 mm (Extreme Cloudburst)</span>
            </div>
          </div>

          {/* Toggle & Slider 2: Dam Floodgate Discharge */}
          <div className="pt-2 border-t border-slate-800/60">
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={simParams.damWaterRelease}
                  onChange={(e) =>
                    onChangeParams({
                      ...simParams,
                      damWaterRelease: e.target.checked,
                      damDischargeIncreaseM: e.target.checked ? (simParams.damDischargeIncreaseM || 1.0) : 0
                    })
                  }
                  className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-200">
                  Simulate River Surge / Dam Spillway Release
                </span>
              </label>
              {simParams.damWaterRelease && (
                <span className="text-xs font-mono font-bold text-cyan-400">
                  +{simParams.damDischargeIncreaseM.toFixed(1)} m River Rise
                </span>
              )}
            </div>

            {simParams.damWaterRelease && (
              <div className="mt-2 pl-6">
                <input
                  type="range"
                  min="0.2"
                  max="4.0"
                  step="0.1"
                  value={simParams.damDischargeIncreaseM}
                  onChange={(e) =>
                    onChangeParams({
                      ...simParams,
                      damDischargeIncreaseM: Number(e.target.value)
                    })
                  }
                  className="w-full accent-cyan-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                  <span>+0.2 m (Minor Spillway)</span>
                  <span>+1.5 m (Major Runoff)</span>
                  <span>+4.0 m (Catastrophic Overtopping)</span>
                </div>
              </div>
            )}
          </div>

          {/* Slider 3: Local Drainage System Efficiency */}
          <div className="pt-2 border-t border-slate-800/60">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="font-semibold text-slate-200">
                Drainage Channel Conveyance Efficiency
              </span>
              <span className="font-mono font-bold text-slate-300">
                {simParams.drainageEfficiency}%
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              step="5"
              value={simParams.drainageEfficiency}
              onChange={(e) =>
                onChangeParams({
                  ...simParams,
                  drainageEfficiency: Number(e.target.value)
                })
              }
              className="w-full accent-purple-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
              <span>20% (Choked Silt / Spring Tide Lock)</span>
              <span>60% (Moderate Desiltation)</span>
              <span>100% (Clean Embankments)</span>
            </div>
          </div>
        </div>

        {/* Dynamic Simulated Impact Card (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-950/90 rounded-xl p-5 border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Dynamic MCDA Recalculation
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700 font-mono">
                Formula Verified
              </span>
            </div>

            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-4xl font-black" style={{ color: assessment.colorCode }}>
                {assessment.overallScore}
              </span>
              <span className="text-xs text-slate-400 font-medium">/ 100</span>
              {deltaScore !== 0 && (
                <span
                  className={`ml-auto text-xs font-bold px-2 py-0.5 rounded ${
                    deltaScore > 0
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  {deltaScore > 0 ? `+${deltaScore}` : deltaScore} pts vs Baseline
                </span>
              )}
            </div>

            <div
              className="mt-2.5 text-xs font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 border"
              style={{
                backgroundColor: `${assessment.colorCode}20`,
                color: assessment.colorCode,
                borderColor: `${assessment.colorCode}40`
              }}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>{assessment.riskLevel} ALERT LEVEL</span>
            </div>

            {/* Simulated Expected Window & Time to Peak */}
            <div className="mt-3 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-cyan-400" /> Expected Window:
                </span>
                <span className="font-semibold text-white">{assessment.expectedRiskWindow}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Est. Inundation Footprint:</span>
                <span className="font-mono text-cyan-300 font-semibold">~{assessment.inundationAreaSqKm} km²</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Primary Stress Driver:</span>
                <span className="font-medium text-amber-300">{assessment.primaryDriver}</span>
              </div>
            </div>

            {/* Explainable AI Diagnostic Output */}
            <div className="mt-3 bg-slate-900/80 p-2.5 rounded-lg border-l-2 border-cyan-400 text-[11px] text-slate-300 leading-relaxed">
              <span className="font-bold text-cyan-400 block mb-0.5">Live Explanation:</span>
              "{assessment.explanationSentence}"
            </div>
          </div>

          {/* Quick Nav Actions */}
          <div className="pt-2 border-t border-slate-800/80 flex flex-wrap gap-2">
            {onNavigateToMap && (
              <button
                onClick={onNavigateToMap}
                className="flex-1 py-2 px-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-cyan-600/20 transition-all"
              >
                <span>View On Map</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            {onNavigateToEvac && (
              <button
                onClick={onNavigateToEvac}
                className="flex-1 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
              >
                <span>Evacuation Plan</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
