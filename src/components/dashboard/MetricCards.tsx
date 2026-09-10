import React from 'react';
import { FloodBasin, RiverGauge, WeatherData, FloodRiskAssessment } from '../../types';
import { ShieldAlert, Droplets, Waves, Users, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

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
  // Determine highest river gauge status
  const primaryGauge = gauges[0];
  const isGaugeOverDanger = gauges.some((g) => g.currentLevelM >= g.dangerLevelM);
  const isGaugeOverWarning = gauges.some((g) => g.currentLevelM >= g.warningLevelM);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Flood Risk Index Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-lg hover:border-slate-700 transition-all relative overflow-hidden group">
        <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: assessment.colorCode }} />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-slate-400">Flood Risk Index (FRI)</span>
            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              Calculated MCDA
            </span>
          </div>
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${assessment.colorCode}20`, color: assessment.colorCode }}
          >
            <ShieldAlert className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold tracking-tight" style={{ color: assessment.colorCode }}>
            {assessment.overallScore}
          </span>
          <span className="text-xs text-slate-400 font-medium">/ 100</span>
          <span
            className="ml-auto text-xs font-bold px-2 py-0.5 rounded"
            style={{ backgroundColor: `${assessment.colorCode}25`, color: assessment.colorCode }}
          >
            {assessment.riskLevel}
          </span>
        </div>
        <p className="mt-2 text-[11px] text-slate-400 line-clamp-1">
          Peak water expected in ~{assessment.estimatedTimeToPeakHours} hrs (Simulated Inundation: ~{assessment.inundationAreaSqKm} km²)
        </p>
      </div>

      {/* 2. River Level & Discharge Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-lg hover:border-slate-700 transition-all relative overflow-hidden">
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{
            backgroundColor: isGaugeOverDanger ? '#EF4444' : isGaugeOverWarning ? '#F59E0B' : '#10B981'
          }}
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-slate-400">River Stage Telemetry</span>
            <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
              Demo: CWC Telemetry
            </span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
            <Waves className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-white">
            {primaryGauge ? primaryGauge.currentLevelM.toFixed(2) : '--'}
          </span>
          <span className="text-xs text-slate-400">m MSL</span>
          {primaryGauge && (
            <span className="ml-auto text-xs flex items-center gap-0.5 text-slate-300 font-medium">
              {primaryGauge.trend === 'rising' && <ArrowUpRight className="w-3.5 h-3.5 text-red-400" />}
              {primaryGauge.trend === 'falling' && <ArrowDownRight className="w-3.5 h-3.5 text-emerald-400" />}
              {primaryGauge.trend === 'stable' && <Minus className="w-3.5 h-3.5 text-amber-400" />}
              <span className="capitalize">{primaryGauge.trend}</span>
            </span>
          )}
        </div>
        <p className="mt-2 text-[11px] text-slate-400">
          {primaryGauge
            ? `Danger: ${primaryGauge.dangerLevelM}m (Δ ${(primaryGauge.currentLevelM - primaryGauge.dangerLevelM > 0 ? '+' : '')}${(primaryGauge.currentLevelM - primaryGauge.dangerLevelM).toFixed(2)}m) • Discharge: ${primaryGauge.flowDischargeCusecs.toLocaleString()} cusecs`
            : 'No gauge detected'}
        </p>
      </div>

      {/* 3. Meteorological Rainfall Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-lg hover:border-slate-700 transition-all relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-slate-400">24h Rainfall & Outlook</span>
            <span className={`text-[9px] font-semibold px-1.5 py-0.2 rounded border ${
              weather.isLiveApi
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                : 'bg-slate-700 text-slate-300 border-slate-600'
            }`}>
              {weather.isLiveApi ? 'Live: Open-Meteo' : 'Demo Baseline'}
            </span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
            <Droplets className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-white">
            {weather.currentRainfallMm.toFixed(1)}
          </span>
          <span className="text-xs text-slate-400">mm / 24h</span>
          <span className="ml-auto text-xs font-semibold text-blue-300 bg-blue-500/15 px-2 py-0.5 rounded">
            72h: {weather.forecast72hMm}mm
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
          <span>Soil Moisture: {weather.soilMoisturePercent}%</span>
          <span>Rain Prob: {weather.precipitationProbability}%</span>
        </div>
      </div>

      {/* 4. Population & Topography Exposure */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-lg hover:border-slate-700 transition-all relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-purple-500" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-slate-400">Vulnerable Population</span>
            <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
              Static: Census
            </span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-white">
            {(basin.vulnerablePopulation / 100000).toFixed(1)}
          </span>
          <span className="text-xs text-slate-400">Lakh residents</span>
        </div>
        <p className="mt-2 text-[11px] text-slate-400 flex justify-between">
          <span>Slope: {basin.slopeGradientPercent}% (SRTM DEM)</span>
          <span>Elev: {basin.averageElevationM}m MSL</span>
        </p>
      </div>
    </div>
  );
};
