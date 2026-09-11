import React from 'react';
import { ShieldCheck, BookOpen, Database, AlertTriangle, X, CheckCircle, Info, Compass, HelpCircle } from 'lucide-react';

interface MethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MethodologyModal: React.FC<MethodologyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white border border-slate-300 rounded-lg p-6 sm:p-8 shadow-2xl my-8 text-slate-800 max-h-[90vh] overflow-y-auto space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
          <div className="w-10 h-10 rounded bg-blue-50 text-blue-800 border border-blue-200 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">FloodGuard AI — Scientific Methodology & Data Provenance</h2>
            <p className="text-xs text-slate-500">Multi-Criteria Decision Analysis (MCDA) Hydrological Risk Engine</p>
          </div>
        </div>

        {/* Prototype Warning */}
        <div className="bg-amber-50 border border-amber-300 rounded p-3.5 text-xs text-amber-900 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong className="text-amber-950 font-semibold block">Academic & Hackathon Prototype Safety Notice</strong>
            This application is an educational decision-support tool. It computes simulated/estimated risk metrics and is <strong>NOT</strong> an official emergency warning system. Never use this prototype as the sole basis for life-safety evacuations. Always adhere to real-time directives from the <strong>India Meteorological Department (IMD)</strong>, <strong>Central Water Commission (CWC)</strong>, and <strong>National Disaster Management Authority (NDMA)</strong>.
          </div>
        </div>

        {/* Section 1: Mathematical Model & Weights */}
        <div className="space-y-3 text-xs leading-relaxed">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-700" />
            <span>1. Risk-Model Formula & Component Weights (Sum = 100%)</span>
          </h3>
          <p className="text-slate-600">
            The composite <strong className="text-slate-900">Flood Risk Index (FRI ∈ [0, 100])</strong> is mathematically defined as the strict linear sum of four calibrated sub-indices:
          </p>

          <div className="bg-slate-50 rounded p-3.5 font-mono text-blue-800 text-center border border-slate-200 text-xs sm:text-sm font-bold">
            FRI = (0.35 × S_hydrology) + (0.30 × S_weather) + (0.20 × S_topography) + (0.15 × S_history)
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="bg-slate-50 p-3 rounded border border-slate-200">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-blue-800">Hydrological Stress</span>
                <span className="font-bold text-blue-700 font-mono">Weight: 35%</span>
              </div>
              <p className="text-slate-600 text-[11px]">
                Measures river water stage relative to CWC Warning Level (WL) and Danger Level (DL), combined with current rate of rise (m/hr) and discharge volume (cusecs).
              </p>
            </div>

            <div className="bg-slate-50 p-3 rounded border border-slate-200">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-blue-800">Meteorological Intensity</span>
                <span className="font-bold text-blue-700 font-mono">Weight: 30%</span>
              </div>
              <p className="text-slate-600 text-[11px]">
                Combines 24h observed precipitation, 24h & 72h forecast precipitation from Open-Meteo, short-term trends, and catchment soil moisture saturation against IMD heavy rainfall thresholds.
              </p>
            </div>

            <div className="bg-slate-50 p-3 rounded border border-slate-200">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-indigo-800">Topographic Vulnerability</span>
                <span className="font-bold text-indigo-700 font-mono">Weight: 20%</span>
              </div>
              <p className="text-slate-600 text-[11px]">
                Quantifies digital elevation (SRTM DEM) vulnerability: low elevation (&lt;15m MSL) + flat alluvial slope (&lt;1%) experience high water stagnation and drainage resistance.
              </p>
            </div>

            <div className="bg-slate-50 p-3 rounded border border-slate-200">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-purple-800">Historical Susceptibility</span>
                <span className="font-bold text-purple-700 font-mono">Weight: 15%</span>
              </div>
              <p className="text-slate-600 text-[11px]">
                Priors derived from NDMA decadal recurrence frequencies and documented historical benchmarks (e.g. 2008 Kosi avulsion, 2018 Kerala floods, 2005 Mumbai cloudburst).
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Topography & Historical Methodology */}
        <div className="space-y-3 text-xs leading-relaxed border-t border-slate-200 pt-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Compass className="w-4 h-4 text-indigo-700" />
            <span>2. Topography & Historical Recurrence Modeling Methodology</span>
          </h3>
          <div className="space-y-2 text-slate-600 text-[11px]">
            <p>
              • <strong>Elevation Vulnerability Modeling:</strong> High-risk alluvial floodplains (such as Majuli/Guwahati in Assam at 54m MSL, or coastal Kurla/BKC at 8m MSL) experience gravity drainage locks when coincident with river crests or spring high tides. The model applies an inverse elevation penalty: lower baseline elevation relative to surrounding relief increases the computed topographic vulnerability.
            </p>
            <p>
              • <strong>Historical Event Priors:</strong> Flood return periods are empirical estimates. To prevent under-warning chronic floodplains during early monsoon stages, the historical factor guarantees that notoriously vulnerable basins (Kosi 95/100, Brahmaputra 92/100) maintain an elevated baseline readiness score.
            </p>
          </div>
        </div>

        {/* Section 3: Data Sources Provenance Table */}
        <div className="space-y-3 text-xs leading-relaxed border-t border-slate-200 pt-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-700" />
            <span>3. Complete Data Provenance & Classification Audit</span>
          </h3>
          <div className="overflow-x-auto border border-slate-200 rounded">
            <table className="w-full text-[11px] text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                  <th className="py-2.5 px-3">Metric / Layer</th>
                  <th className="py-2.5 px-3">Audit Classification</th>
                  <th className="py-2.5 px-3">Source / Telemetry Protocol</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                <tr>
                  <td className="py-2 px-3 font-semibold text-slate-900">Rainfall & 72h Forecast</td>
                  <td className="py-2 px-3"><span className="text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">LIVE API</span></td>
                  <td className="py-2 px-3">Open-Meteo High-Resolution Global Forecast API (Asia/Kolkata timezone)</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold text-slate-900">River Stages & Danger Levels</td>
                  <td className="py-2 px-3"><span className="text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">DEMO / SIMULATED</span></td>
                  <td className="py-2 px-3">Calibrated CWC station historical benchmarks & deterministic hydraulic models</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold text-slate-900">Topography & Elevation</td>
                  <td className="py-2 px-3"><span className="text-indigo-800 font-bold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">STATIC DATASET</span></td>
                  <td className="py-2 px-3">NASA SRTM / Copernicus 30m Global Digital Elevation Model (DEM)</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold text-slate-900">Historical Flood Events</td>
                  <td className="py-2 px-3"><span className="text-purple-800 font-bold bg-purple-50 px-2 py-0.5 rounded border border-purple-200">PUBLIC DATASET</span></td>
                  <td className="py-2 px-3">Official post-disaster reports from NDMA, ASDMA, BSDMA, KSDMA & CWC</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold text-slate-900">Flood Risk Index (FRI)</td>
                  <td className="py-2 px-3"><span className="text-blue-800 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">CALCULATED</span></td>
                  <td className="py-2 px-3">FloodGuard AI deterministic Multi-Criteria Decision Analysis (MCDA) Engine</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 4: Prediction Limitations & Uncertainty */}
        <div className="space-y-2 text-xs leading-relaxed border-t border-slate-200 pt-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-amber-700" />
            <span>4. Prediction Limitations & Uncertainty Bounds</span>
          </h3>
          <ul className="space-y-1 text-slate-600 text-[11px]">
            <li>• <strong>Spatial Interpolation Margin:</strong> Point-based precipitation from numerical weather models may miss micro-scale cloudburst events occurring between grid nodes.</li>
            <li>• <strong>Gauge Latency:</strong> Real river hydraulic surges depend on unmodeled tributary flash inflows and upstream barrage gate operation schedules.</li>
            <li>• <strong>Confidence Score:</strong> Ranging between 70% and 90%, confidence is scaled based on live telemetry availability and data freshness.</li>
          </ul>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-2xs"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
