import React from 'react';
import { FloodRiskAssessment, FloodBasin } from '../../types';
import { ShieldAlert, ArrowRight, CheckCircle2, Clock, AlertTriangle, HelpCircle, Compass, Zap, Map, Shield } from 'lucide-react';

interface RiskScoreCardProps {
  assessment: FloodRiskAssessment;
  basin: FloodBasin;
  onNavigateToEvac: () => void;
  onNavigateToMap: () => void;
}

export const RiskScoreCard: React.FC<RiskScoreCardProps> = ({
  assessment,
  basin,
  onNavigateToEvac,
  onNavigateToMap
}) => {
  // Compute circle stroke offset for SVG radial meter
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (assessment.overallScore / 100) * circumference;

  return (
    <section
      aria-label="Composite Flood Risk Index Assessment"
      className="bg-slate-900/95 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xl relative overflow-hidden space-y-5"
    >
      {/* Background ambient glow matching risk level */}
      <div
        className="absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-700"
        style={{ backgroundColor: assessment.colorCode }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: Circular Gauge & Confidence */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center text-center p-4 sm:p-5 bg-slate-950/70 rounded-xl border border-slate-800/90 shadow-inner">
          <div className="relative w-40 h-40 sm:w-44 sm:h-44 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 160 160">
              <defs>
                <filter id="gaugeGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor={assessment.colorCode} floodOpacity="0.6" />
                </filter>
              </defs>
              {/* Background track */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="stroke-slate-800/80"
                strokeWidth="12"
                fill="transparent"
              />
              {/* Progress ring with glow */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke={assessment.colorCode}
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                filter="url(#gaugeGlow)"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            {/* Center score readout */}
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl sm:text-5xl font-black text-white tracking-tight font-mono">
                {assessment.overallScore}
              </span>
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Index / 100
              </span>
            </div>
          </div>

          <div
            className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide border shadow-sm"
            style={{
              backgroundColor: `${assessment.colorCode}20`,
              color: assessment.colorCode,
              borderColor: `${assessment.colorCode}50`
            }}
          >
            <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
            <span>{assessment.riskLevel} Hazard Tier</span>
          </div>

          {/* Time Window & Peak */}
          <div className="mt-3 space-y-1 text-xs text-slate-300">
            <div className="flex items-center justify-center gap-1.5 font-semibold text-slate-200">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Window: {assessment.expectedRiskWindow}</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Estimated Peak Water in ~<strong className="text-slate-200">{assessment.estimatedTimeToPeakHours} hrs</strong>
            </p>
          </div>

          {/* Model Confidence & Uncertainty Indicator */}
          <div className="mt-3 pt-3 border-t border-slate-800/80 w-full text-left bg-slate-900/70 p-2.5 rounded-lg text-[11px]">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-medium flex items-center gap-1">
                <HelpCircle className="w-3 h-3 text-cyan-400" />
                <span>Prediction Confidence:</span>
              </span>
              <span className="font-bold text-emerald-400 font-mono">
                {assessment.confidenceScore}% ({assessment.confidenceTier})
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1 leading-tight">
              {assessment.confidenceRationale}
            </p>
          </div>
        </div>

        {/* Right: Detailed Advisory & Recommendations */}
        <div className="lg:col-span-8 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-cyan-400 font-bold tracking-wide uppercase">
                {basin.name} • {basin.riverName}
              </span>
              <span className="text-slate-600">•</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-semibold flex items-center gap-1">
                <Zap className="w-2.5 h-2.5 text-amber-400" />
                Primary Driver: {assessment.primaryDriver}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white mt-1.5 leading-snug">
              {assessment.alertHeadline}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              {assessment.actionSummary}
            </p>
          </div>

          {/* Explainable AI Decision Explanation (Task 6) */}
          <div className="bg-slate-950/90 rounded-xl p-3.5 sm:p-4 border-l-4 border-cyan-500 border-slate-800/90 shadow-md">
            <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider block mb-1">
              Explainable AI Model Diagnosis & Factor Synthesis:
            </span>
            <p className="text-xs text-slate-200 leading-relaxed font-sans font-medium italic">
              "{assessment.explanationSentence}"
            </p>
          </div>

          {/* Action Directives */}
          <div className="bg-slate-950/50 rounded-xl p-3.5 border border-slate-800/70">
            <div className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Dynamic Early Warning Directives ({assessment.riskLevel} Level)</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {assessment.recommendedActions.slice(0, 3).map((act, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{act}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-1">
            <button
              onClick={onNavigateToEvac}
              className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-cyan-600/25 transition-all active:scale-95"
            >
              <Shield className="w-4 h-4" />
              <span>View Safe Shelters & Evacuation Corridors</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onNavigateToMap}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold text-xs sm:text-sm border border-slate-700 hover:border-slate-600 transition-all flex items-center gap-2 active:scale-95"
            >
              <Map className="w-4 h-4 text-cyan-400" />
              <span>Explore Inundation Hazard Map</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
