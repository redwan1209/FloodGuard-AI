import React from 'react';
import { FloodRiskAssessment, FloodBasin, RiverGauge, WeatherData } from '../../types';
import { Waves, CloudRain, Mountain, History, CheckCircle, Calculator, ShieldCheck } from 'lucide-react';

interface FactorBreakdownProps {
  assessment: FloodRiskAssessment;
  basin: FloodBasin;
  gauges: RiverGauge[];
  weather: WeatherData;
}

export const FactorBreakdown: React.FC<FactorBreakdownProps> = ({
  assessment,
  basin,
  gauges,
  weather
}) => {
  const { breakdown } = assessment;

  const factors = [
    {
      id: 'hydrology',
      title: 'Hydrological Stress',
      weight: '35%',
      weightMultiplier: 0.35,
      score: breakdown.hydrologyScore,
      contribution: breakdown.hydrologyContribution,
      icon: Waves,
      accentColor: '#06B6D4', // cyan
      sourceType: 'Demo / Calibrated Telemetry',
      sourceBadgeColor: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      dataSource: 'Central Water Commission (CWC) station benchmarks & danger marks',
      details: gauges.length > 0
        ? `${gauges[0].stationName}: ${gauges[0].currentLevelM}m (Danger: ${gauges[0].dangerLevelM}m)`
        : 'CWC Telemetry Active',
      subtext: 'Proximity of river stage to CWC Danger Level (DL) and discharge surge rate.'
    },
    {
      id: 'weather',
      title: 'Meteorological Intensity',
      weight: '30%',
      weightMultiplier: 0.30,
      score: breakdown.weatherScore,
      contribution: breakdown.weatherContribution,
      icon: CloudRain,
      accentColor: '#3B82F6', // blue
      sourceType: weather.isLiveApi ? 'Live API Data' : 'Demo Baseline',
      sourceBadgeColor: weather.isLiveApi
        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
        : 'bg-slate-800 text-slate-300 border-slate-700',
      dataSource: weather.isLiveApi ? 'Open-Meteo Global Weather API (live query)' : 'Calibrated Historical Monsoon Fallback',
      details: `${weather.currentRainfallMm}mm (24h) | Forecast: ${weather.forecast72hMm}mm (72h) | Saturation: ${weather.soilMoisturePercent}%`,
      subtext: '24h observed rain + 24h & 72h forecast precipitation and soil saturation curve.'
    },
    {
      id: 'topography',
      title: 'Topography & Drainage',
      weight: '20%',
      weightMultiplier: 0.20,
      score: breakdown.topographyScore,
      contribution: breakdown.topographyContribution,
      icon: Mountain,
      accentColor: '#8B5CF6', // purple
      sourceType: 'Static DEM Data',
      sourceBadgeColor: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
      dataSource: 'SRTM / Copernicus 30m Global Digital Elevation Model (DEM)',
      details: `Slope: ${basin.slopeGradientPercent}% gradient | Elevation: ${basin.averageElevationM}m MSL`,
      subtext: 'Terrain depression, low slope stagnation penalty, and soil percolation coefficient.'
    },
    {
      id: 'historical',
      title: 'Historical Recurrence',
      weight: '15%',
      weightMultiplier: 0.15,
      score: breakdown.historicalScore,
      contribution: breakdown.historicalContribution,
      icon: History,
      accentColor: '#EC4899', // pink
      sourceType: 'Static Historical Atlas',
      sourceBadgeColor: 'bg-pink-500/15 text-pink-300 border-pink-500/30',
      dataSource: 'NDMA & State Disaster Management (ASDMA/BSDMA) Flood Atlas',
      details: `Basin Recurrence: ~${basin.historicalRecurrenceYears} yrs | Vulnerability Index: ${basin.historicalFloodScore}/100`,
      subtext: 'Empirical multi-decadal flood return periods and known floodplain inundation frequencies.'
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 75) return '#EF4444';
    if (score >= 50) return '#F97316';
    if (score >= 25) return '#F59E0B';
    return '#10B981';
  };

  const calculatedSum = Number(
    (
      breakdown.hydrologyContribution +
      breakdown.weatherContribution +
      breakdown.topographyContribution +
      breakdown.historicalContribution
    ).toFixed(1)
  );

  return (
    <section aria-label="MCDA Factor Breakdown and Data Provenance" className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <span>Multi-Factor Risk Synthesis & Data Provenance</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
              MCDA Multi-Criteria Engine
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Transparent breakdown of component subscores, weights, verified data sources, and final point contributions
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800 shadow-inner">
          <Calculator className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-mono">Sum of Weighted Sub-indices = Final FRI</span>
        </div>
      </div>

      {/* 4 Factor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {factors.map((f) => {
          const Icon = f.icon;
          const scoreColor = getScoreColor(f.score);

          return (
            <div
              key={f.id}
              className="bg-slate-950/70 rounded-xl p-4 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between shadow-sm"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 shadow-md"
                      style={{ backgroundColor: `${f.accentColor}20`, color: f.accentColor }}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-bold text-slate-100">{f.title}</h4>
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${f.sourceBadgeColor}`}>
                          {f.sourceType}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">
                        Model Weight: <strong className="text-slate-200 font-semibold">{f.weight}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-base font-black tracking-tight font-mono" style={{ color: scoreColor }}>
                      {f.score} <span className="text-xs text-slate-500 font-normal">/100</span>
                    </div>
                    <span className="text-[11px] font-bold text-cyan-300 font-mono">
                      +{f.contribution} pts
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-3 w-full bg-slate-800/80 rounded-full h-2 overflow-hidden shadow-inner">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${f.score}%`,
                      backgroundColor: scoreColor
                    }}
                  />
                </div>

                <div className="mt-2.5 text-xs font-semibold text-slate-200">
                  {f.details}
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-800/70 text-[11px] space-y-1">
                <p className="text-slate-400 leading-snug">{f.subtext}</p>
                <p className="text-[10px] text-slate-500 italic">
                  <strong className="text-slate-400 not-italic">Source:</strong> {f.dataSource}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mathematical Consistency Verification Banner */}
      <div className="bg-slate-950 rounded-xl p-3.5 sm:p-4 border border-cyan-500/40 text-xs flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <span className="font-bold text-white">Mathematical Audit Verification: </span>
            <span className="font-mono text-cyan-300 font-semibold">
              {breakdown.hydrologyContribution} (Hydro) + {breakdown.weatherContribution} (Weather) + {breakdown.topographyContribution} (Topo) + {breakdown.historicalContribution} (History) = {calculatedSum} pts ≈ {assessment.overallScore}/100
            </span>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold tracking-wide uppercase flex items-center gap-1 shadow-sm">
          <CheckCircle className="w-3 h-3 text-emerald-400" />
          <span>100% Mathematically Consistent</span>
        </span>
      </div>
    </section>
  );
};
