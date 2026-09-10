import React from 'react';
import { FloodRiskAssessment, FloodBasin } from '../../types';
import { ShieldAlert, ArrowRight, CheckCircle2, Clock, AlertTriangle, HelpCircle, Compass, Zap } from 'lucide-react';

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
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden space-y-5">
      {/* Background ambient glow */}
      <div
        className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl opacity-15 pointer-events-none"
        style={{ backgroundColor: assessment.colorCode }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: Circular Gauge & Confidence */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center text-center p-4 bg-slate-950/50 rounded-xl border border-slate-800/80">
          <div className="relative w-40 h-40 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 160 160">
              {/* Background ring */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="stroke-slate-800"
                strokeWidth="12"
                fill="transparent"
              />
              {/* Progress ring */}
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
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            {/* Center score readout */}
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-black text-white tracking-tight">
                {assessment.overallScore}
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Index Score
              </span>
            </div>
          </div>

          <div
            className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border"
            style={{
              backgroundColor: `${assessment.colorCode}20`,
              color: assessment.colorCode,
              borderColor: `${assessment.colorCode}50`
            }}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{assessment.riskLevel} Hazard Tier</span>
          </div>

          {/* Time Window & Peak */}
          <div className="mt-3 space-y-1 text-xs text-slate-400">
            <div className="flex items-center justify-center gap-1.5 font-medium text-slate-300">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Window: {assessment.expectedRiskWindow}</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Estimated Peak Inundation in ~{assessment.estimatedTimeToPeakHours} hrs
            </p>
          </div>

          {/* Model Confidence & Uncertainty Indicator */}
          <div className="mt-3 pt-3 border-t border-slate-800/80 w-full text-left bg-slate-900/60 p-2.5 rounded-lg text-[11px]">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-medium flex items-center gap-1">
                <HelpCircle className="w-3 h-3 text-cyan-400" />
                Prediction Confidence:
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
              <span className="text-cyan-400 font-semibold tracking-wide uppercase">
                {basin.name} • {basin.riverName}
              </span>
              <span className="text-slate-600">•</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-semibold flex items-center gap-1">
                <Zap className="w-2.5 h-2.5 text-amber-400" />
                Primary Driver: {assessment.primaryDriver}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white mt-1 leading-snug">
              {assessment.alertHeadline}
            </h2>

            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              {assessment.actionSummary}
            </p>
          </div>

          {/* Explainable AI Decision Explanation (Task 6) */}
          <div className="bg-slate-950/90 rounded-xl p-3.5 border-l-4 border-cyan-500 border-slate-800/80">
            <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider block mb-1">
              Plain-Language Model Explanation (Explainable AI):
            </span>
            <p className="text-xs text-slate-200 leading-relaxed font-sans">
              "{assessment.explanationSentence}"
            </p>
          </div>

          {/* Action Directives */}
          <div className="bg-slate-950/40 rounded-xl p-3.5 border border-slate-800/60">
            <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
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
              className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-cyan-600/20 transition-all active:scale-95"
            >
              <span>View Safe Shelters & Evacuation Corridors</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onNavigateToMap}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-medium text-xs sm:text-sm border border-slate-700 transition-colors"
            >
              Explore Inundation Hazard Map
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
