import React from 'react';
import { RiverGauge } from '../../types';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid
} from 'recharts';
import { Waves, TrendingUp, AlertCircle } from 'lucide-react';

interface HydrographChartProps {
  gauge: RiverGauge;
}

export const HydrographChart: React.FC<HydrographChartProps> = ({ gauge }) => {
  // Generate realistic hydrograph time points: past 12h, present (T0), and 24h forecast
  const base = gauge.currentLevelM;
  const trendSlope = gauge.trend === 'rising' ? 0.08 : (gauge.trend === 'falling' ? -0.05 : 0.01);

  const data = [
    { time: '-12h', level: Number((base - 12 * trendSlope).toFixed(2)), stage: 'Past' },
    { time: '-8h', level: Number((base - 8 * trendSlope).toFixed(2)), stage: 'Past' },
    { time: '-4h', level: Number((base - 4 * trendSlope).toFixed(2)), stage: 'Past' },
    { time: 'Now', level: Number(base.toFixed(2)), stage: 'Current' },
    { time: '+4h', level: Number((base + 4 * trendSlope).toFixed(2)), stage: 'Forecast' },
    { time: '+8h', level: Number((base + 8 * trendSlope).toFixed(2)), stage: 'Forecast' },
    { time: '+12h', level: Number((base + 12 * trendSlope * 0.9).toFixed(2)), stage: 'Forecast' },
    { time: '+18h', level: Number((base + 18 * trendSlope * 0.8).toFixed(2)), stage: 'Forecast' },
    { time: '+24h', level: Number((base + 24 * trendSlope * 0.7).toFixed(2)), stage: 'Forecast' },
  ];

  const minLevel = Math.min(...data.map(d => d.level), gauge.warningLevelM - 1);
  const maxLevel = Math.max(...data.map(d => d.level), gauge.highestFloodLevelM + 0.5);

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Waves className="w-4 h-4 text-cyan-400" />
            <h3 className="text-base font-bold text-white">{gauge.stationName} — Stage Hydrograph</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Calibrated CWC Benchmark Hydrograph (Demo Telemetry) • Modeled on official station warning and danger marks (Meters MSL)
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-amber-400" />
            <span className="text-amber-300 font-medium">Warning: {gauge.warningLevelM}m</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-red-500" />
            <span className="text-red-400 font-medium">Danger: {gauge.dangerLevelM}m</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-purple-400 border-t border-dashed" />
            <span className="text-purple-300 font-medium">HFL: {gauge.highestFloodLevelM}m</span>
          </div>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="riverGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
            <YAxis
              domain={[Math.floor(minLevel), Math.ceil(maxLevel)]}
              stroke="#64748b"
              tick={{ fontSize: 11 }}
              unit="m"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#334155',
                borderRadius: '0.75rem',
                fontSize: '12px',
                color: '#f8fafc'
              }}
              formatter={(val: any) => [`${val} m MSL`, 'Water Level']}
            />
            <ReferenceLine
              y={gauge.warningLevelM}
              stroke="#f59e0b"
              strokeDasharray="4 4"
              label={{ value: 'Warning Mark', position: 'insideTopLeft', fill: '#f59e0b', fontSize: 10 }}
            />
            <ReferenceLine
              y={gauge.dangerLevelM}
              stroke="#ef4444"
              strokeWidth={1.5}
              label={{ value: 'Danger Mark', position: 'insideTopLeft', fill: '#ef4444', fontSize: 10 }}
            />
            <ReferenceLine
              y={gauge.highestFloodLevelM}
              stroke="#a855f7"
              strokeDasharray="2 2"
              label={{ value: 'Record HFL', position: 'insideTopLeft', fill: '#a855f7', fontSize: 10 }}
            />
            <Area
              type="monotone"
              dataKey="level"
              stroke="#06b6d4"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#riverGradient)"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div>
          <span className="text-slate-400 block">Current Stage</span>
          <strong className="text-white font-mono text-sm">{gauge.currentLevelM} m</strong>
        </div>
        <div>
          <span className="text-slate-400 block">Discharge Flow</span>
          <strong className="text-cyan-400 font-mono text-sm">{gauge.flowDischargeCusecs.toLocaleString()} cusecs</strong>
        </div>
        <div>
          <span className="text-slate-400 block">Current Trend</span>
          <strong className="text-amber-400 font-semibold capitalize flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            {gauge.trend}
          </strong>
        </div>
        <div>
          <span className="text-slate-400 block">Margin to Danger</span>
          <strong className={gauge.currentLevelM >= gauge.dangerLevelM ? 'text-red-400 font-mono text-sm' : 'text-emerald-400 font-mono text-sm'}>
            {(gauge.dangerLevelM - gauge.currentLevelM).toFixed(2)} m
          </strong>
        </div>
      </div>
    </div>
  );
};
