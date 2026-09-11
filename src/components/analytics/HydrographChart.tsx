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
import { Waves, TrendingUp, AlertCircle, Clock } from 'lucide-react';

interface HydrographChartProps {
  gauge: RiverGauge;
}

export const HydrographChart: React.FC<HydrographChartProps> = ({ gauge }) => {
  // Generate realistic hydrograph time points: past 12h, present (T0), and 24h forecast
  const base = gauge.currentLevelM;
  const trendSlope = gauge.trend === 'rising' ? 0.08 : (gauge.trend === 'falling' ? -0.05 : 0.01);

  const data = [
    { time: '-12h', level: Number((base - 12 * trendSlope).toFixed(2)), stage: 'Recorded Past' },
    { time: '-8h', level: Number((base - 8 * trendSlope).toFixed(2)), stage: 'Recorded Past' },
    { time: '-4h', level: Number((base - 4 * trendSlope).toFixed(2)), stage: 'Recorded Past' },
    { time: 'Now (T0)', level: Number(base.toFixed(2)), stage: 'Current Telemetry' },
    { time: '+4h', level: Number((base + 4 * trendSlope).toFixed(2)), stage: 'Forecast Projection' },
    { time: '+8h', level: Number((base + 8 * trendSlope).toFixed(2)), stage: 'Forecast Projection' },
    { time: '+12h', level: Number((base + 12 * trendSlope * 0.9).toFixed(2)), stage: 'Forecast Projection' },
    { time: '+18h', level: Number((base + 18 * trendSlope * 0.8).toFixed(2)), stage: 'Forecast Projection' },
    { time: '+24h', level: Number((base + 24 * trendSlope * 0.7).toFixed(2)), stage: 'Forecast Projection' },
  ];

  const minLevel = Math.min(...data.map(d => d.level), gauge.warningLevelM - 1);
  const maxLevel = Math.max(...data.map(d => d.level), gauge.highestFloodLevelM + 0.5);

  return (
    <section aria-label={`${gauge.stationName} River Hydrograph`} className="bg-white border border-slate-200 rounded-lg p-4 sm:p-5 shadow-sm space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Waves className="w-4 h-4 text-blue-700" />
            <h3 className="text-base sm:text-lg font-bold text-slate-900">{gauge.stationName} — Stage Hydrograph</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Calibrated CWC Benchmark Hydrograph (Simulated Telemetry) • Station Warning & Danger Marks (Meters MSL)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-amber-500" />
            <span className="text-amber-800 font-semibold">Warning: {gauge.warningLevelM}m</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-red-600" />
            <span className="text-red-700 font-semibold">Danger: {gauge.dangerLevelM}m</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-purple-600 border-t border-dashed" />
            <span className="text-purple-800 font-semibold">HFL: {gauge.highestFloodLevelM}m</span>
          </div>
        </div>
      </div>

      <div className="h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="riverGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0284c7" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#0284c7" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
            <YAxis
              domain={[Math.floor(minLevel), Math.ceil(maxLevel)]}
              stroke="#64748b"
              tick={{ fontSize: 11 }}
              unit="m"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                borderColor: '#cbd5e1',
                borderRadius: '0.5rem',
                fontSize: '12px',
                color: '#0f172a',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
              }}
              formatter={(val: any, name: any, item: any) => [
                `${val} m MSL (${item.payload.stage})`,
                'Water Level'
              ]}
            />
            <ReferenceLine
              y={gauge.warningLevelM}
              stroke="#d97706"
              strokeDasharray="4 4"
              label={{ value: 'Warning Mark', position: 'insideTopLeft', fill: '#d97706', fontSize: 10 }}
            />
            <ReferenceLine
              y={gauge.dangerLevelM}
              stroke="#dc2626"
              strokeWidth={1.5}
              label={{ value: 'Danger Mark', position: 'insideTopLeft', fill: '#dc2626', fontSize: 10 }}
            />
            <ReferenceLine
              y={gauge.highestFloodLevelM}
              stroke="#9333ea"
              strokeDasharray="2 2"
              label={{ value: 'Record HFL', position: 'insideTopLeft', fill: '#9333ea', fontSize: 10 }}
            />
            <ReferenceLine
              x="Now (T0)"
              stroke="#0284c7"
              strokeDasharray="3 3"
              label={{ value: 'T0: Current', position: 'top', fill: '#0284c7', fontSize: 10 }}
            />
            <Area
              type="monotone"
              dataKey="level"
              stroke="#0284c7"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#riverGradient)"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
          <span className="text-slate-500 block text-[11px]">Current Stage</span>
          <strong className="text-slate-900 font-mono text-sm">{gauge.currentLevelM} m MSL</strong>
        </div>
        <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
          <span className="text-slate-500 block text-[11px]">Discharge Flow</span>
          <strong className="text-blue-700 font-mono text-sm">{gauge.flowDischargeCusecs.toLocaleString()} cusecs</strong>
        </div>
        <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
          <span className="text-slate-500 block text-[11px]">Current Trend</span>
          <strong className="text-amber-700 font-semibold capitalize flex items-center gap-1 mt-0.5">
            <TrendingUp className="w-3.5 h-3.5" />
            {gauge.trend}
          </strong>
        </div>
        <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
          <span className="text-slate-500 block text-[11px]">Margin to Danger</span>
          <strong className={`font-mono text-sm ${gauge.currentLevelM >= gauge.dangerLevelM ? 'text-red-600' : 'text-emerald-700'}`}>
            {(gauge.dangerLevelM - gauge.currentLevelM).toFixed(2)} m
          </strong>
        </div>
      </div>
    </section>
  );
};
