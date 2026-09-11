import React from 'react';
import { SimulationParams, FloodRiskAssessment, FloodBasin } from '../../types';
import { Sliders, RotateCcw, AlertOctagon, CloudLightning, Waves, ShieldAlert, ArrowRight, Clock, Droplets, MapPin, CheckCircle, Flame } from 'lucide-react';

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
        onChangeParams({
          rainfallMultiplier: 1.25,
          additionalRainfallMm: 25,
          damWaterRelease: false,
          damDischargeIncreaseM: 0,
          drainageEfficiency: 95
        });
        break;
      case 'scenario_b':
        onChangeParams({
          rainfallMultiplier: 1.0,
          additionalRainfallMm: 0,
          damWaterRelease: true,
          damDischargeIncreaseM: 0.5,
          drainageEfficiency: 90
        });
        break;
      case 'scenario_c':
        onChangeParams({
          rainfallMultiplier: 1.5,
          additionalRainfallMm: 65,
          damWaterRelease: true,
          damDischargeIncreaseM: 1.3,
          drainageEfficiency: 75
        });
        break;
      case 'scenario_d':
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

  // Determine which preset is actively applied
  const isScenarioA = simParams.additionalRainfallMm === 25 && !simParams.damWaterRelease;
  const isScenarioB = simParams.additionalRainfallMm === 0 && simParams.damWaterRelease && simParams.damDischargeIncreaseM === 0.5;
  const isScenarioC = simParams.additionalRainfallMm === 65 && simParams.damWaterRelease && simParams.damDischargeIncreaseM === 1.3;
  const isScenarioD = simParams.additionalRainfallMm === 160 && simParams.damWaterRelease && simParams.damDischargeIncreaseM === 2.8;

  return (
    <section aria-label="What-If Disaster Scenario Simulator" className="bg-white border border-slate-200 rounded-lg p-4 sm:p-5 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-blue-50 text-blue-800 border border-blue-200 flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                "What-If" Scenario Stress Simulator & Sensitivity Lab
              </h3>
              <p className="text-xs text-slate-500">
                Simulate multi-factor hydrological disaster stress for <strong className="text-blue-700">{basin.name}</strong> and observe instant recalculations
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 text-xs font-bold border border-slate-300 transition-colors shadow-2xs"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset to Baseline</span>
        </button>
      </div>

      {/* Documented Interactive Presets */}
      <div>
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
          Calibrated Stress Presets
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={() => applyPreset('scenario_a')}
            className={`p-3 rounded border text-left transition-all group ${
              isScenarioA
                ? 'bg-blue-50 border-blue-500 shadow-2xs ring-1 ring-blue-500'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <span className="text-xs font-bold text-blue-700 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <CloudLightning className="w-3.5 h-3.5" /> Scenario A: +25% Rain
              </span>
              {isScenarioA && <CheckCircle className="w-3.5 h-3.5 text-blue-600" />}
            </span>
            <span className="text-[11px] text-slate-900 block mt-1 font-semibold">Moderate Rain Surge</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">+25mm rain load; river steady</span>
          </button>

          <button
            onClick={() => applyPreset('scenario_b')}
            className={`p-3 rounded border text-left transition-all group ${
              isScenarioB
                ? 'bg-blue-50 border-blue-500 shadow-2xs ring-1 ring-blue-500'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <span className="text-xs font-bold text-blue-700 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Waves className="w-3.5 h-3.5" /> Scenario B: +0.5m River Rise
              </span>
              {isScenarioB && <CheckCircle className="w-3.5 h-3.5 text-blue-600" />}
            </span>
            <span className="text-[11px] text-slate-900 block mt-1 font-semibold">Hydrological River Surge</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Water stage increases by 0.5m</span>
          </button>

          <button
            onClick={() => applyPreset('scenario_c')}
            className={`p-3 rounded border text-left transition-all group ${
              isScenarioC
                ? 'bg-amber-50 border-amber-500 shadow-2xs ring-1 ring-amber-500'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <span className="text-xs font-bold text-amber-800 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5" /> Scenario C: Rain + River
              </span>
              {isScenarioC && <CheckCircle className="w-3.5 h-3.5 text-amber-700" />}
            </span>
            <span className="text-[11px] text-slate-900 block mt-1 font-semibold">Compound Inflow Surge</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">+65mm rain & +1.3m river stage</span>
          </button>

          <button
            onClick={() => applyPreset('scenario_d')}
            className={`p-3 rounded border text-left transition-all group ${
              isScenarioD
                ? 'bg-red-50 border-red-500 shadow-2xs ring-1 ring-red-500'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <span className="text-xs font-bold text-red-700 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <AlertOctagon className="w-3.5 h-3.5" /> Scenario D: Catastrophe
              </span>
              {isScenarioD && <CheckCircle className="w-3.5 h-3.5 text-red-600" />}
            </span>
            <span className="text-[11px] text-slate-900 block mt-1 font-semibold">Extreme Cloudburst + Spillway</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">+160mm rain, +2.8m stage, choked drains</span>
          </button>
        </div>
      </div>

      {/* Interactive Controls & Live Score Delta */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Sliders (7 Cols) */}
        <div className="lg:col-span-7 space-y-4 bg-slate-50 p-4 sm:p-5 rounded border border-slate-200">
          {/* Slider 1: Additional Rainfall */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                <CloudLightning className="w-4 h-4 text-blue-600" />
                <span>Additional 24h Precipitation Surge</span>
              </span>
              <span className="font-mono font-bold text-blue-700 text-sm">
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
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-medium">
              <span>0 mm (Baseline)</span>
              <span>+100 mm (Heavy)</span>
              <span>+200 mm (Cloudburst)</span>
            </div>
          </div>

          {/* Toggle & Slider 2: Dam Floodgate Discharge */}
          <div className="pt-3 border-t border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center gap-2 cursor-pointer select-none">
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
                  className="rounded border-slate-300 text-blue-600 focus:ring-0 cursor-pointer w-4 h-4"
                />
                <span className="text-xs font-semibold text-slate-800">
                  Simulate River Surge / Dam Spillway Discharge
                </span>
              </label>
              {simParams.damWaterRelease && (
                <span className="text-xs font-mono font-bold text-blue-700 text-sm">
                  +{simParams.damDischargeIncreaseM.toFixed(1)} m River Rise
                </span>
              )}
            </div>

            {simParams.damWaterRelease && (
              <div className="mt-2.5 pl-6">
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
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-medium">
                  <span>+0.2 m (Minor Spillway)</span>
                  <span>+1.5 m (Major Runoff)</span>
                  <span>+4.0 m (Catastrophic Overtopping)</span>
                </div>
              </div>
            )}
          </div>

          {/* Slider 3: Local Drainage System Efficiency */}
          <div className="pt-3 border-t border-slate-200">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="font-semibold text-slate-800">
                Drainage Channel Conveyance Efficiency
              </span>
              <span className="font-mono font-bold text-indigo-700 text-sm">
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
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-medium">
              <span>20% (Choked Silt / Tidal Backwater)</span>
              <span>60% (Moderate Desiltation)</span>
              <span>100% (Clean Embankments)</span>
            </div>
          </div>
        </div>

        {/* Dynamic Simulated Impact Card (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded border border-slate-200 p-4 sm:p-5 flex flex-col justify-between space-y-4 shadow-sm">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Dynamic MCDA Recalculation
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-mono font-semibold">
                Formula Verified
              </span>
            </div>

            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-black font-mono tracking-tight" style={{ color: assessment.colorCode }}>
                {assessment.overallScore}
              </span>
              <span className="text-xs text-slate-500 font-medium">/ 100</span>
              {deltaScore !== 0 && (
                <span
                  className={`ml-auto text-xs font-bold px-2.5 py-1 rounded border ${
                    deltaScore > 0
                      ? 'bg-red-50 text-red-700 border-red-200'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}
                >
                  {deltaScore > 0 ? `+${deltaScore}` : deltaScore} pts vs Baseline
                </span>
              )}
            </div>

            <div
              className="mt-2 text-xs font-bold px-2.5 py-1 rounded inline-flex items-center gap-1.5 border"
              style={{
                backgroundColor: `${assessment.colorCode}15`,
                color: assessment.colorCode,
                borderColor: `${assessment.colorCode}30`
              }}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>{assessment.riskLevel} ALERT LEVEL</span>
            </div>

            {/* Simulated Expected Window & Time to Peak */}
            <div className="mt-3 bg-slate-50 p-3 rounded border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-700">
                <span className="text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-blue-600" /> Expected Window:
                </span>
                <span className="font-bold text-slate-900">{assessment.expectedRiskWindow}</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span className="text-slate-500">Est. Inundation Footprint:</span>
                <span className="font-mono text-blue-700 font-bold">~{assessment.inundationAreaSqKm} km²</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span className="text-slate-500">Primary Stress Driver:</span>
                <span className="font-semibold text-amber-800">{assessment.primaryDriver}</span>
              </div>
            </div>

            {/* Explainable AI Diagnostic Output */}
            <div className="mt-3 bg-slate-50 p-3 rounded border-l-3 border-blue-600 text-xs text-slate-700 leading-relaxed">
              <span className="font-bold text-blue-800 block mb-0.5">Live Diagnostic:</span>
              "{assessment.explanationSentence}"
            </div>
          </div>

          {/* Quick Nav Actions */}
          <div className="pt-2 border-t border-slate-200 flex flex-wrap gap-2">
            {onNavigateToMap && (
              <button
                onClick={onNavigateToMap}
                className="flex-1 py-2 px-3 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-colors"
              >
                <span>View On Map</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            {onNavigateToEvac && (
              <button
                onClick={onNavigateToEvac}
                className="flex-1 py-2 px-3 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 text-xs font-semibold border border-slate-300 transition-colors"
              >
                <span>Evacuation Plan</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
