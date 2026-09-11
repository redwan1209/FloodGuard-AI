import React from 'react';
import { WeatherData } from '../../types';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell
} from 'recharts';
import { CloudRain, Droplets, Thermometer, Wind } from 'lucide-react';

interface RainfallChartProps {
  weather: WeatherData;
}

export const RainfallChart: React.FC<RainfallChartProps> = ({ weather }) => {
  // Synthesize 3-day projection based on current and 72h forecast
  const d1 = weather.forecast24hMm;
  const d2 = Number(Math.max(10, (weather.forecast72hMm - d1) * 0.55).toFixed(1));
  const d3 = Number(Math.max(5, weather.forecast72hMm - d1 - d2).toFixed(1));

  const data = [
    { period: 'Day 1 (0-24h)', rainfall: d1, probability: weather.precipitationProbability },
    { period: 'Day 2 (24-48h)', rainfall: d2, probability: Math.max(30, weather.precipitationProbability - 10) },
    { period: 'Day 3 (48-72h)', rainfall: d3, probability: Math.max(20, weather.precipitationProbability - 25) },
  ];

  const getRainColor = (val: number) => {
    if (val >= 115.5) return '#ef4444'; // Very Heavy (IMD)
    if (val >= 64.5) return '#f97316';  // Heavy (IMD)
    if (val >= 35.5) return '#06b6d4';  // Moderate (IMD)
    return '#3b82f6';
  };

  return (
    <section aria-label="Meteorological Rainfall Outlook and Soil Moisture" className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <CloudRain className="w-4 h-4 text-blue-400" />
            <h3 className="text-base sm:text-lg font-bold text-white">Precipitation Outlook & Soil Moisture</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {weather.isLiveApi ? 'Source: Live Open-Meteo High-Resolution Weather API' : 'Source: Calibrated Historical Baseline (Demo)'} • IMD Categorization
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          <span className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700 text-slate-200">
            <Thermometer className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-mono">{weather.temperatureC}°C</span>
          </span>
          <span className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700 text-slate-200">
            <Wind className="w-3.5 h-3.5 text-cyan-400" />
            <span>Humidity <strong className="font-mono">{weather.humidityPercent}%</strong></span>
          </span>
          <span className="flex items-center gap-1.5 text-blue-300 font-bold bg-blue-500/15 px-2.5 py-1 rounded-lg border border-blue-500/30">
            Total 72h: <strong className="font-mono">{weather.forecast72hMm} mm</strong>
          </span>
        </div>
      </div>

      <div className="h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="period" stroke="#64748b" tick={{ fontSize: 11 }} />
            <YAxis stroke="#64748b" tick={{ fontSize: 11 }} unit="mm" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                borderColor: '#334155',
                borderRadius: '0.875rem',
                fontSize: '12px',
                color: '#f8fafc',
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)'
              }}
              formatter={(val: any, name: any, item: any) => [
                `${val} mm (Precipitation Probability: ${item.payload.probability}%)`,
                'Forecast Rainfall'
              ]}
            />
            <Bar dataKey="rainfall" radius={[8, 8, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getRainColor(entry.rainfall)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Soil Saturation Meter & Legend */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex-1 min-w-[220px]">
          <div className="flex justify-between text-slate-300 mb-1.5">
            <span className="flex items-center gap-1.5 font-medium">
              <Droplets className="w-3.5 h-3.5 text-blue-400" />
              Catchment Soil Moisture Saturation
            </span>
            <span className="font-mono font-bold text-white">{weather.soilMoisturePercent}%</span>
          </div>
          <div className="w-full bg-slate-800/80 rounded-full h-2.5 overflow-hidden shadow-inner">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                weather.soilMoisturePercent >= 85
                  ? 'bg-red-500 shadow-sm shadow-red-500/50'
                  : weather.soilMoisturePercent >= 70
                  ? 'bg-amber-500 shadow-sm shadow-amber-500/50'
                  : 'bg-blue-500'
              }`}
              style={{ width: `${weather.soilMoisturePercent}%` }}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-blue-500" /> Moderate (&lt;64.5mm)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-orange-500" /> Heavy (64.5–115.5mm)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-red-500" /> Very Heavy (&gt;115.5mm)
          </span>
        </div>
      </div>
    </section>
  );
};
