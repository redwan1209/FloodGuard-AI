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
    if (val >= 115.5) return '#ef4444'; // Very Heavy
    if (val >= 64.5) return '#f97316';  // Heavy
    if (val >= 35.5) return '#06b6d4';  // Moderate
    return '#3b82f6';
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <CloudRain className="w-4 h-4 text-blue-400" />
            <h3 className="text-base font-bold text-white">Precipitation Outlook & Soil Moisture</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {weather.isLiveApi ? 'Source: Live Open-Meteo Weather API' : 'Source: Calibrated Historical Baseline (Demo)'} • IMD Rainfall Benchmarks
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1 text-slate-300">
            <Thermometer className="w-3.5 h-3.5 text-amber-400" />
            <span>{weather.temperatureC}°C</span>
          </span>
          <span className="flex items-center gap-1 text-slate-300">
            <Wind className="w-3.5 h-3.5 text-cyan-400" />
            <span>Humidity {weather.humidityPercent}%</span>
          </span>
          <span className="flex items-center gap-1 text-blue-300 font-semibold bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/30">
            Total 72h: {weather.forecast72hMm} mm
          </span>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="period" stroke="#64748b" tick={{ fontSize: 11 }} />
            <YAxis stroke="#64748b" tick={{ fontSize: 11 }} unit="mm" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#334155',
                borderRadius: '0.75rem',
                fontSize: '12px',
                color: '#f8fafc'
              }}
              formatter={(val: any) => [`${val} mm`, 'Rainfall']}
            />
            <Bar dataKey="rainfall" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getRainColor(entry.rainfall)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Soil Saturation Meter & Legend */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex-1 min-w-[200px]">
          <div className="flex justify-between text-slate-400 mb-1">
            <span className="flex items-center gap-1">
              <Droplets className="w-3.5 h-3.5 text-blue-400" />
              Catchment Soil Moisture Saturation
            </span>
            <span className="font-bold text-white">{weather.soilMoisturePercent}%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                weather.soilMoisturePercent >= 85
                  ? 'bg-red-500'
                  : weather.soilMoisturePercent >= 70
                  ? 'bg-amber-500'
                  : 'bg-blue-500'
              }`}
              style={{ width: `${weather.soilMoisturePercent}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded bg-blue-500" /> Moderate (&lt;64.5mm)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded bg-orange-500" /> Heavy (64.5-115.5mm)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded bg-red-500" /> Very Heavy (&gt;115.5mm)
          </span>
        </div>
      </div>
    </div>
  );
};
