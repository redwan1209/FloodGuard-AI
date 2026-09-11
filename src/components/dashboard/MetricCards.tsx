import React from 'react';
import { FloodBasin, RiverGauge, WeatherData, FloodRiskAssessment } from '../../types';
import { Waves, Droplets, Users, ShieldAlert, ArrowUpRight, ArrowDownRight, Minus, AlertCircle, CheckCircle } from 'lucide-react';

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
  const primaryGauge = gauges[0];
  const deltaFromDanger = primaryGauge
    ? Number((primaryGauge.currentLevelM - primaryGauge.dangerLevelM).toFixed(2))
    : 0;

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'SEVERE': return 'text-red-700 bg-red-50 border-red-200';
      case 'HIGH': return 'text-orange-700 bg-orange-50 border-orange-200';
      case 'MODERATE': return 'text-amber-800 bg-amber-50 border-amber-200';
      default: return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. Compact Professional Status Bar (4 Key Hydrological Metrics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Metric 1: Flood Risk Index */}
        <div className="bg-white border border-slate-200 rounded-md p-3.5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 mb-1.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Flood Risk Index
            </span>
            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-blue-50 text-blue-800 border border-blue-200 uppercase">
              Calculated MCDA
            </span>
          </div>
          <div className="flex items-baseline justify-between mt-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
                {assessment.overallScore}
              </span>
              <span className="text-xs text-slate-500 font-medium">/ 100</span>
            </div>
            <span className={`text-xs font-bold px-2 py-0.5 rounded border uppercase ${getRiskColor(assessment.riskLevel)}`}>
              {assessment.riskLevel}
            </span>
          </div>
          <p className="text-[11px] text-slate-600 mt-2 pt-1.5 border-t border-slate-100 flex justify-between">
            <span>Peak window:</span>
            <strong className="text-slate-800 font-medium">{assessment.expectedRiskWindow}</strong>
          </p>
        </div>

        {/* Metric 2: River Stage Telemetry */}
        <div className="bg-white border border-slate-200 rounded-md p-3.5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 mb-1.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              River Stage Telemetry
            </span>
            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-50 text-amber-900 border border-amber-200 uppercase">
              Demo: CWC Telemetry
            </span>
          </div>
          <div className="flex items-baseline justify-between mt-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
                {primaryGauge ? primaryGauge.currentLevelM.toFixed(2) : '--'}
              </span>
              <span className="text-xs text-slate-500">m MSL</span>
            </div>
            {primaryGauge && (
              <span className={`text-xs font-bold flex items-center gap-0.5 ${
                primaryGauge.trend === 'rising' ? 'text-red-700' : 'text-emerald-700'
              }`}>
                {primaryGauge.trend === 'rising' && <ArrowUpRight className="w-3.5 h-3.5" />}
                {primaryGauge.trend === 'falling' && <ArrowDownRight className="w-3.5 h-3.5" />}
                {primaryGauge.trend === 'stable' && <Minus className="w-3.5 h-3.5" />}
                <span className="capitalize">{primaryGauge.trend}</span>
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-600 mt-2 pt-1.5 border-t border-slate-100 flex justify-between">
            <span>DL: {primaryGauge?.dangerLevelM}m</span>
            <span className={`font-mono font-bold ${deltaFromDanger >= 0 ? 'text-red-700' : 'text-emerald-700'}`}>
              {deltaFromDanger >= 0 ? `+${deltaFromDanger.toFixed(2)}m (Over)` : `${deltaFromDanger.toFixed(2)}m (Under)`}
            </span>
          </p>
        </div>

        {/* Metric 3: 24h Rainfall & Outlook */}
        <div className="bg-white border border-slate-200 rounded-md p-3.5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 mb-1.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              24h Rainfall & Outlook
            </span>
            <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border uppercase ${
              weather.isLiveApi
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-slate-100 text-slate-700 border-slate-200'
            }`}>
              {weather.isLiveApi ? 'Live: Open-Meteo' : 'Demo Baseline'}
            </span>
          </div>
          <div className="flex items-baseline justify-between mt-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
                {weather.currentRainfallMm.toFixed(1)}
              </span>
              <span className="text-xs text-slate-500">mm / 24h</span>
            </div>
            <span className="text-xs font-bold text-blue-900 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200 font-mono">
              72h: {weather.forecast72hMm}mm
            </span>
          </div>
          <p className="text-[11px] text-slate-600 mt-2 pt-1.5 border-t border-slate-100 flex justify-between">
            <span>Soil Saturation: <strong className="text-slate-800">{weather.soilMoisturePercent}%</strong></span>
            <span>Rain Prob: <strong className="text-slate-800">{weather.precipitationProbability}%</strong></span>
          </p>
        </div>

        {/* Metric 4: Vulnerable Population & Topography */}
        <div className="bg-white border border-slate-200 rounded-md p-3.5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 mb-1.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Vulnerable Population
            </span>
            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-200 uppercase">
              Static: Census
            </span>
          </div>
          <div className="flex items-baseline justify-between mt-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
                {(basin.vulnerablePopulation / 100000).toFixed(1)}
              </span>
              <span className="text-xs text-slate-500">Lakh Residents</span>
            </div>
            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
              {basin.state}
            </span>
          </div>
          <p className="text-[11px] text-slate-600 mt-2 pt-1.5 border-t border-slate-100 flex justify-between">
            <span>DEM Slope: <strong className="text-slate-800">{basin.slopeGradientPercent}%</strong></span>
            <span>Elev: <strong className="text-slate-800">{basin.averageElevationM}m MSL</strong></span>
          </p>
        </div>
      </div>

      {/* 2. CWC Hydrological Monitoring Stations Table (FFWC-Style Operational Grid) */}
      <div className="bg-white border border-slate-200 rounded-md shadow-xs overflow-hidden">
        <div className="bg-slate-50 px-3 py-2 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Waves className="w-4 h-4 text-blue-800" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              River Gauge Monitoring Stations — {basin.name}
            </h3>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">
            Benchmark CWC Danger Levels (Meters MSL)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-100/75 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-2 px-3">Station Name</th>
                <th className="py-2 px-3">River</th>
                <th className="py-2 px-3 text-right">Current Stage</th>
                <th className="py-2 px-3 text-right">Warning Mark</th>
                <th className="py-2 px-3 text-right">Danger Mark</th>
                <th className="py-2 px-3 text-right">Diff (Δ DL)</th>
                <th className="py-2 px-3 text-right">Discharge</th>
                <th className="py-2 px-3 text-center">Trend</th>
                <th className="py-2 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {gauges.map((g) => {
                const diff = (g.currentLevelM - g.dangerLevelM).toFixed(2);
                const isOverDanger = Number(diff) >= 0;
                const isOverWarning = g.currentLevelM >= g.warningLevelM;

                return (
                  <tr key={g.id} className="hover:bg-slate-50/80 transition-colors font-medium">
                    <td className="py-2 px-3 font-bold text-slate-900">{g.stationName}</td>
                    <td className="py-2 px-3 text-slate-600">{g.riverName}</td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                      {g.currentLevelM.toFixed(2)} m
                    </td>
                    <td className="py-2 px-3 text-right font-mono text-amber-700">
                      {g.warningLevelM.toFixed(2)} m
                    </td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-red-700">
                      {g.dangerLevelM.toFixed(2)} m
                    </td>
                    <td className="py-2 px-3 text-right font-mono font-bold">
                      <span className={isOverDanger ? 'text-red-700' : 'text-emerald-700'}>
                        {isOverDanger ? `+${diff}` : diff} m
                      </span>
                    </td>
                    <td className="py-2 px-3 text-right font-mono text-slate-700">
                      {g.flowDischargeCusecs.toLocaleString()} cusecs
                    </td>
                    <td className="py-2 px-3 text-center">
                      <span className={`inline-flex items-center gap-0.5 text-xs font-bold capitalize ${
                        g.trend === 'rising' ? 'text-red-700' : 'text-emerald-700'
                      }`}>
                        {g.trend === 'rising' && '↑ Rising'}
                        {g.trend === 'falling' && '↓ Falling'}
                        {g.trend === 'stable' && '→ Steady'}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                          isOverDanger
                            ? 'bg-red-100 text-red-800 border border-red-200'
                            : isOverWarning
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        {isOverDanger ? 'Above Danger' : isOverWarning ? 'Warning' : 'Normal'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
