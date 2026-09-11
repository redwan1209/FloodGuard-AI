import React from 'react';
import { FloodRiskAssessment, FloodBasin } from '../../types';
import { ShieldAlert, ArrowRight, CheckCircle2, Clock, AlertTriangle, HelpCircle, FileText, Map, Shield } from 'lucide-react';

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
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (assessment.overallScore / 100) * circumference;

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'SEVERE': return '#dc2626';
      case 'HIGH': return '#ea580c';
      case 'MODERATE': return '#d97706';
      default: return '#16a34a';
    }
  };

  const tierColor = getTierColor(assessment.riskLevel);

  return (
    <section aria-label="Flood Risk Assessment Report" className="bg-white border border-slate-200 rounded-lg p-4 sm:p-5 shadow-xs space-y-4">
      {/* Report Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-800" />
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
              Flood Risk Assessment Report
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              Basin: <strong className="text-slate-700">{basin.name}</strong> ({basin.state}) • River: <strong className="text-slate-700">{basin.riverName}</strong>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">
            Primary Driver: <strong className="text-slate-800">{assessment.primaryDriver}</strong>
          </span>
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded uppercase border ${
              assessment.riskLevel === 'SEVERE'
                ? 'bg-red-50 text-red-800 border-red-200'
                : assessment.riskLevel === 'HIGH'
                ? 'bg-orange-50 text-orange-800 border-orange-200'
                : assessment.riskLevel === 'MODERATE'
                ? 'bg-amber-50 text-amber-800 border-amber-200'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}
          >
            {assessment.riskLevel} ALERT TIER
          </span>
        </div>
      </div>

      {/* Main Assessment Body: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Radial Index Meter & Summary Status */}
        <div className="lg:col-span-4 bg-slate-50 border border-slate-200 rounded-md p-4 flex flex-col items-center justify-center text-center">
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 140 140">
              {/* Background Track */}
              <circle
                cx="70"
                cy="70"
                r={radius}
                stroke="#e2e8f0"
                strokeWidth="10"
                fill="transparent"
              />
              {/* Progress Ring */}
              <circle
                cx="70"
                cy="70"
                r={radius}
                stroke={tierColor}
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
                {assessment.overallScore}
              </span>
              <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
                Index / 100
              </span>
            </div>
          </div>

          <div className="mt-2 text-xs font-semibold text-slate-700">
            {assessment.riskLevel} FLOOD RISK LEVEL
          </div>

          {/* Forecast Window & Peak */}
          <div className="mt-2.5 pt-2 border-t border-slate-200 w-full text-xs text-slate-600 space-y-1">
            <div className="flex items-center justify-center gap-1">
              <Clock className="w-3.5 h-3.5 text-blue-700" />
              <span>Risk Window: <strong>{assessment.expectedRiskWindow}</strong></span>
            </div>
            <p className="text-[11px] text-slate-500">
              Est. Inundation Peak in ~<strong>{assessment.estimatedTimeToPeakHours} hrs</strong>
            </p>
          </div>

          {/* Model Confidence */}
          <div className="mt-2 pt-2 border-t border-slate-200 w-full text-left text-[11px] bg-white p-2 rounded border border-slate-200">
            <div className="flex justify-between items-center text-slate-700">
              <span className="font-semibold">Prediction Confidence:</span>
              <strong className="text-emerald-700 font-mono">{assessment.confidenceScore}% ({assessment.confidenceTier})</strong>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">
              {assessment.confidenceRationale}
            </p>
          </div>
        </div>

        {/* Right Column: 4-Pillar Breakdown & Plain-Language Diagnosis */}
        <div className="lg:col-span-8 space-y-3.5">
          <div>
            <h3 className="text-base font-bold text-slate-900 leading-snug">
              {assessment.alertHeadline}
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              {assessment.actionSummary}
            </p>
          </div>

          {/* 4-Pillar MCDA Weights Progress Bars (FFWC Analytical Format) */}
          <div className="bg-slate-50 border border-slate-200 rounded p-3 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600 font-bold text-[11px] uppercase tracking-wider">
              <span>Weighted MCDA Factor Contributions</span>
              <span>Points / 100</span>
            </div>

            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-slate-700 font-semibold text-xs mb-0.5">
                  <span>Hydrological Stress (35%)</span>
                  <span className="font-mono text-slate-900 font-bold">
                    {assessment.breakdown.hydrologyScore}/100 (+{assessment.breakdown.hydrologyContribution} pts)
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-cyan-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${assessment.breakdown.hydrologyScore}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-700 font-semibold text-xs mb-0.5">
                  <span>Meteorological Intensity (30%)</span>
                  <span className="font-mono text-slate-900 font-bold">
                    {assessment.breakdown.weatherScore}/100 (+{assessment.breakdown.weatherContribution} pts)
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${assessment.breakdown.weatherScore}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-700 font-semibold text-xs mb-0.5">
                  <span>Topographic Vulnerability (20%)</span>
                  <span className="font-mono text-slate-900 font-bold">
                    {assessment.breakdown.topographyScore}/100 (+{assessment.breakdown.topographyContribution} pts)
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${assessment.breakdown.topographyScore}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-700 font-semibold text-xs mb-0.5">
                  <span>Historical Susceptibility (15%)</span>
                  <span className="font-mono text-slate-900 font-bold">
                    {assessment.breakdown.historicalScore}/100 (+{assessment.breakdown.historicalContribution} pts)
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-pink-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${assessment.breakdown.historicalScore}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Explainable AI Analytical Summary Box */}
          <div className="bg-blue-50/70 border-l-3 border-blue-700 p-3 rounded-r text-xs">
            <span className="text-[10px] font-bold text-blue-900 uppercase tracking-wider block mb-1">
              Hydrological Model Explanation & Diagnosis:
            </span>
            <p className="text-slate-800 leading-relaxed font-sans font-medium">
              "{assessment.explanationSentence}"
            </p>
          </div>

          {/* Action Directives & Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Directives active for {basin.name} district disaster authority</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onNavigateToEvac}
                className="px-3 py-1.5 rounded bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>View Safe Shelters</span>
                <ArrowRight className="w-3 h-3" />
              </button>
              <button
                onClick={onNavigateToMap}
                className="px-3 py-1.5 rounded bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-300 transition-colors flex items-center gap-1.5"
              >
                <Map className="w-3.5 h-3.5 text-blue-700" />
                <span>Map Inundation</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
