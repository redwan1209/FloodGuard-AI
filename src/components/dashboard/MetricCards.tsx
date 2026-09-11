import React from 'react';
import { FloodBasin, RiverGauge, WeatherData, FloodRiskAssessment } from '../../types';
import { ShieldAlert, Droplets, Waves, Users, ArrowUpRight, ArrowDownRight, Minus, AlertTriangle, CheckCircle } from 'lucide-react';

interface MetricCardsProps {
  basin: FloodBasin;
  gauges: RiverGauge[];
  weather: WeatherData;
  assessment: FloodRiskAssessment;
}

export const MetricCards: React.FC<MetricCardsProps> = ({
  basin,
  gauges,
  weather,
  assessment
}) => {
  // Determine primary river gauge status
  const primaryGauge = gauges[0];
  const isGaugeOverDanger = gauges.some((g) => g.currentLevelM >= g.dangerLevelM);
  const isGaugeOverWarning = gauges.some((g) => g.currentLevelM >= g.warningLevelM);

  const deltaFromDanger = primaryGauge
    ? Number((primaryGauge.currentLevelM - primaryGauge.dangerLevelM).toFixed(2))
    : 0;

  return (
    <section aria-label="Key Hydrological and Risk Metrics" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Flood Risk Index Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg hover:border-slate-700 hover:-translate-y-0.5 transition-all duration-200 relative overflow-hidden flex flex-col justify-between group">
        <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: assessment.colorCode }} />
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-300">Flood Risk Index (FRI)</span>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/25">
                Calculated MCDA
              </span>
            </div>
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105"
              style={{ backgroundColor: `${assessment.colorCode}20`, color: assessment.colorCode }}
            >
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black tracking-tight" style={{ color: assessment.colorCode }}>
              {assessment.overallScore}
            </span>
            <span className="text-xs text-slate-400 font-medium">/ 100</span>
            <span
              className="ml-auto text-xs font-bold px-2 py-0.5 rounded border"
              style={{
                backgroundColor: `${assessment.colorCode}20`,
                color: assessment.colorCode,
                borderColor: `${assessment.colorCode}40`
              }}
            >
              {assessment.riskLevel}
            </span>
          </div>
        </div>
        <p className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 line-clamp-1">
          Peak water expected in ~<strong className="text-slate-200">{assessment.estimatedTimeToPeakHours} hrs</strong> (Est. Inundation: ~{assessment.inundationAreaSqKm} km²)
        </p>
      </div>

      {/* 2. River Level & Discharge Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg hover:border-slate-700 hover:-translate-y-0.5 transition-all duration-200 relative overflow-hidden flex flex-col justify-between group">
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{
            backgroundColor: isGaugeOverDanger ? '#EF4444' : isGaugeOverWarning ? '#F59E0B' : '#10B981'
          }}
        />
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-300">River Stage Telemetry</span>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-300 border border-amber-500/25">
                Demo: CWC Telemetry
              </span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center transition-transform group-hover:scale-105">
              <Waves className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-white tracking-tight font-mono">
              {primaryGauge ? primaryGauge.currentLevelM.toFixed(2) : '--'}
            </span>
            <span className="text-xs text-slate-400">m MSL</span>
            {primaryGauge && (
              <span className="ml-auto text-xs flex items-center gap-0.5 text-slate-300 font-semibold">
                {primaryGauge.trend === 'rising' && <ArrowUpRight className="w-3.5 h-3.5 text-red-400" />}
                {primaryGauge.trend === 'falling' && <ArrowDownRight className="w-3.5 h-3.5 text-emerald-400" />}
                {primaryGauge.trend === 'stable' && <Minus className="w-3.5 h-3.5 text-amber-400" />}
                <span className="capitalize">{primaryGauge.trend}</span>
              </span>
            )}
          </div>
        </div>
        <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Danger: <strong className="text-slate-200">{primaryGauge?.dangerLevelM}m</strong></span>
          <span className={`font-mono font-bold ${deltaFromDanger >= 0 ? 'text-red-400' : 'text-emerald-400'}`}>
            {deltaFromDanger >= 0 ? `+${deltaFromDanger.toFixed(2)}m (Breached)` : `${deltaFromDanger.toFixed(2)}m (Safe)`}
          </span>
        </div>
      </div>

      {/* 3. Meteorological Rainfall Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg hover:border-slate-700 hover:-translate-y-0.5 transition-all duration-200 relative overflow-hidden flex flex-col justify-between group">
        <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500" />
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-300">24h Rainfall & Outlook</span>
              <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${
                weather.isLiveApi
                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                  : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}>
                {weather.isLiveApi ? 'Live: Open-Meteo' : 'Demo Baseline'}
              </span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center transition-transform group-hover:scale-105">
              <Droplets className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-white tracking-tight font-mono">
              {weather.currentRainfallMm.toFixed(1)}
            </span>
            <span className="text-xs text-slate-400">mm / 24h</span>
            <span className="ml-auto text-xs font-bold text-blue-300 bg-blue-500/15 px-2 py-0.5 rounded border border-blue-500/20">
              72h: {weather.forecast72hMm}mm
            </span>
          </div>
        </div>
        <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <span>Soil Moisture: <strong className="text-slate-200">{weather.soilMoisturePercent}%</strong></span>
          <span>Rain Prob: <strong className="text-slate-200">{weather.precipitationProbability}%</strong></span>
        </div>
      </div>

      {/* 4. Population & Topography Exposure */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg hover:border-slate-700 hover:-translate-y-0.5 transition-all duration-200 relative overflow-hidden flex flex-col justify-between group">
        <div className="absolute top-0 left-0 right-0 h-1 bg-purple-500" />
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-300">Exposed Population</span>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-purple-500/15 text-purple-300 border border-purple-500/25">
                Static: Census
              </span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center transition-transform group-hover:scale-105">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-white tracking-tight font-mono">
              {(basin.vulnerablePopulation / 100000).toFixed(1)}
            </span>
            <span className="text-xs text-slate-400">Lakh residents</span>
          </div>
        </div>
        <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Slope: <strong className="text-slate-200">{basin.slopeGradientPercent}%</strong> (SRTM)</span>
          <span>Elev: <strong className="text-slate-200">{basin.averageElevationM}m MSL</strong></span>
        </div>
      </div>
    </section>
  );
};
