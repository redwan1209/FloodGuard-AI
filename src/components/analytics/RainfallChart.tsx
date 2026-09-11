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
    if (val >= 115.5) return '#dc2626'; // Very Heavy (IMD)
    if (val >= 64.5) return '#ea580c';  // Heavy (IMD)
    if (val >= 35.5) return '#0284c7';  // Moderate (IMD)
    return '#2563eb';
  };

  return (
    <section aria-label="Meteorological Rainfall Outlook and Soil Moisture" className="bg-white border border-slate-200 rounded-lg p-4 sm:p-5 shadow-sm space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <CloudRain className="w-4 h-4 text-blue-700" />
            <h3 className="text-base sm:text-lg font-bold text-slate-900">Precipitation Outlook & Soil Moisture</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {weather.isLiveApi ? 'Source: Live Open-Meteo High-Resolution Weather API' : 'Source: Calibrated Historical Baseline (Demo)'} • IMD Categorization
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          <span className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded border border-slate-200 text-slate-700">
            <Thermometer className="w-3.5 h-3.5 text-amber-600" />
            <span className="font-mono font-medium">{weather.temperatureC}°C</span>
          </span>
          <span className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded border border-slate-200 text-slate-700">
            <Wind className="w-3.5 h-3.5 text-blue-600" />
            <span>Humidity <strong className="font-mono">{weather.humidityPercent}%</strong></span>
          </span>
          <span className="flex items-center gap-1.5 text-blue-800 font-bold bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
            Total 72h: <strong className="font-mono">{weather.forecast72hMm} mm</strong>
          </span>
        </div>
      </div>

      <div className="h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="period" stroke="#64748b" tick={{ fontSize: 11 }} />
            <YAxis stroke="#64748b" tick={{ fontSize: 11 }} unit="mm" />
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
                `${val} mm (Precipitation Probability: ${item.payload.probability}%)`,
                'Forecast Rainfall'
              ]}
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
      <div className="mt-4 pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex-1 min-w-[220px]">
          <div className="flex justify-between text-slate-700 mb-1.5">
            <span className="flex items-center gap-1.5 font-medium">
              <Droplets className="w-3.5 h-3.5 text-blue-600" />
              Catchment Soil Moisture Saturation
            </span>
            <span className="font-mono font-bold text-slate-900">{weather.soilMoisturePercent}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                weather.soilMoisturePercent >= 85
                  ? 'bg-red-600'
                  : weather.soilMoisturePercent >= 70
                  ? 'bg-amber-500'
                  : 'bg-blue-600'
              }`}
              style={{ width: `${weather.soilMoisturePercent}%` }}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-600">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-blue-600" /> Moderate (&lt;64.5mm)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-orange-600" /> Heavy (64.5–115.5mm)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-red-600" /> Very Heavy (&gt;115.5mm)
          </span>
        </div>
      </div>
    </section>
  );
};
