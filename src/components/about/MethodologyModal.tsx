import React from 'react';
import { ShieldCheck, BookOpen, Database, AlertTriangle, X, CheckCircle, Info, Compass, HelpCircle } from 'lucide-react';

interface MethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MethodologyModal: React.FC<MethodologyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-2xl my-8 text-slate-200 max-h-[90vh] overflow-y-auto space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">FloodGuard AI — Scientific Methodology & Data Provenance</h2>
            <p className="text-xs text-slate-400">Multi-Criteria Decision Analysis (MCDA) Hydrological Risk Engine (Task 11)</p>
          </div>
        </div>

        {/* Prototype Warning */}
        <div className="bg-amber-950/40 border border-amber-500/40 rounded-xl p-3.5 text-xs text-amber-200 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-amber-300 font-semibold block">Academic & Hackathon Prototype Safety Notice</strong>
            This application is an educational decision-support tool. It computes simulated/estimated risk metrics and is <strong>NOT</strong> an official emergency warning system. Never use this prototype as the sole basis for life-safety evacuations. Always adhere to real-time directives from the <strong>India Meteorological Department (IMD)</strong>, <strong>Central Water Commission (CWC)</strong>, and <strong>National Disaster Management Authority (NDMA)</strong>.
          </div>
        </div>

        {/* Section 1: Mathematical Model & Weights */}
        <div className="space-y-3 text-xs leading-relaxed">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>1. Risk-Model Formula & Component Weights (Sum = 100%)</span>
          </h3>
          <p className="text-slate-300">
            The composite <strong className="text-white">Flood Risk Index (FRI ∈ [0, 100])</strong> is mathematically defined as the strict linear sum of four calibrated sub-indices:
          </p>

          <div className="bg-slate-950 rounded-xl p-3.5 font-mono text-cyan-300 text-center border border-slate-800 text-xs sm:text-sm">
            FRI = (0.35 × S_hydrology) + (0.30 × S_weather) + (0.20 × S_topography) + (0.15 × S_history)
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-cyan-400">Hydrological Stress</span>
                <span className="font-bold text-cyan-300 font-mono">Weight: 35%</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Measures river water stage relative to CWC Warning Level (WL) and Danger Level (DL), combined with current rate of rise (m/hr) and discharge volume (cusecs).
              </p>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-blue-400">Meteorological Intensity</span>
                <span className="font-bold text-blue-300 font-mono">Weight: 30%</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Combines 24h observed precipitation, 24h & 72h forecast precipitation from Open-Meteo, short-term trends, and catchment soil moisture saturation against IMD heavy rainfall thresholds.
              </p>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-purple-400">Topographic Vulnerability</span>
                <span className="font-bold text-purple-300 font-mono">Weight: 20%</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Quantifies digital elevation (SRTM DEM) vulnerability: low elevation (&lt;15m MSL) + flat alluvial slope (&lt;1%) experience high water stagnation and drainage resistance.
              </p>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-pink-400">Historical Susceptibility</span>
                <span className="font-bold text-pink-300 font-mono">Weight: 15%</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Priors derived from NDMA decadal recurrence frequencies and documented historical benchmarks (e.g. 2008 Kosi avulsion, 2018 Kerala floods, 2005 Mumbai cloudburst).
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Topography & Historical Methodology */}
        <div className="space-y-3 text-xs leading-relaxed border-t border-slate-800 pt-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Compass className="w-4 h-4 text-purple-400" />
            <span>2. Topography & Historical Recurrence Modeling Methodology</span>
          </h3>
          <div className="space-y-2 text-slate-300 text-[11px]">
            <p>
              • <strong>Elevation Vulnerability Modeling:</strong> High-risk alluvial floodplains (such as Majuli/Guwahati in Assam at 54m MSL, or coastal Kurla/BKC at 8m MSL) experience gravity drainage locks when coincident with river crests or spring high tides. The model applies an inverse elevation penalty: lower baseline elevation relative to surrounding relief increases the computed topographic vulnerability.
            </p>
            <p>
              • <strong>Historical Event Priors:</strong> Flood return periods are empirical estimates. To prevent under-warning chronic floodplains during early monsoon stages, the historical factor guarantees that notoriously vulnerable basins (Kosi 95/100, Brahmaputra 92/100) maintain an elevated baseline readiness score.
            </p>
          </div>
        </div>

        {/* Section 3: Data Sources Provenance Table */}
        <div className="space-y-3 text-xs leading-relaxed border-t border-slate-800 pt-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-400" />
            <span>3. Complete Data Provenance & Classification Audit (Task 1 & 10)</span>
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-[11px] text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-2 pr-3">Metric / Layer</th>
                  <th className="py-2 pr-3">Audit Classification</th>
                  <th className="py-2">Source / Telemetry Protocol</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                <tr>
                  <td className="py-1.5 pr-3 font-semibold text-white">Rainfall & 72h Forecast</td>
                  <td className="py-1.5 pr-3"><span className="text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">LIVE API</span></td>
                  <td className="py-1.5">Open-Meteo High-Resolution Global Forecast API (Asia/Kolkata timezone)</td>
                </tr>
                <tr>
                  <td className="py-1.5 pr-3 font-semibold text-white">River Stages & Danger Levels</td>
                  <td className="py-1.5 pr-3"><span className="text-amber-400 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">DEMO / SIMULATED</span></td>
                  <td className="py-1.5">Calibrated CWC station historical benchmarks & deterministic hydraulic models</td>
                </tr>
                <tr>
                  <td className="py-1.5 pr-3 font-semibold text-white">Topography & Elevation</td>
                  <td className="py-1.5 pr-3"><span className="text-purple-400 font-bold bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/20">STATIC DATASET</span></td>
                  <td className="py-1.5">NASA SRTM / Copernicus 30m Global Digital Elevation Model (DEM)</td>
                </tr>
                <tr>
                  <td className="py-1.5 pr-3 font-semibold text-white">Historical Flood Events</td>
                  <td className="py-1.5 pr-3"><span className="text-pink-400 font-bold bg-pink-500/10 px-1.5 py-0.5 rounded border border-pink-500/20">PUBLIC DATASET</span></td>
                  <td className="py-1.5">Official post-disaster reports from NDMA, ASDMA, BSDMA, KSDMA & CWC</td>
                </tr>
                <tr>
                  <td className="py-1.5 pr-3 font-semibold text-white">Flood Risk Index (FRI)</td>
                  <td className="py-1.5 pr-3"><span className="text-cyan-400 font-bold bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">CALCULATED</span></td>
                  <td className="py-1.5">FloodGuard AI deterministic Multi-Criteria Decision Analysis (MCDA) Engine</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 4: Prediction Limitations & Uncertainty */}
        <div className="space-y-2 text-xs leading-relaxed border-t border-slate-800 pt-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span>4. Prediction Limitations & Uncertainty Bounds</span>
          </h3>
          <ul className="space-y-1 text-slate-400 text-[11px]">
            <li>• <strong>Spatial Interpolation Margin:</strong> Point-based precipitation from numerical weather models may miss micro-scale cloudburst events occurring between grid nodes.</li>
            <li>• <strong>Gauge Latency:</strong> Real river hydraulic surges depend on unmodeled tributary flash inflows and upstream barrage gate operation schedules.</li>
            <li>• <strong>Confidence Score:</strong> Ranging between 70% and 90%, confidence is scaled based on live telemetry availability and data freshness.</li>
          </ul>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-md shadow-cyan-600/20"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
