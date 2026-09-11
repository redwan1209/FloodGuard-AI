import React from 'react';
import { FloodBasin } from '../../types';
import { History, BookOpen, AlertOctagon, Users, ExternalLink, Calendar } from 'lucide-react';

interface HistoricalEventsCardProps {
  basin: FloodBasin;
}

export const HistoricalEventsCard: React.FC<HistoricalEventsCardProps> = ({ basin }) => {
  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'CATASTROPHIC':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'SEVERE':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      default:
        return 'bg-amber-50 text-amber-800 border-amber-200';
    }
  };

  return (
    <section aria-label="Historical Flood Atlas and Recurrence Prior" className="bg-white border border-slate-200 rounded-lg p-4 sm:p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-slate-100 text-slate-700 flex items-center justify-center border border-slate-200">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Historical Flood Atlas & Recurrence Prior
            </h3>
            <p className="text-xs text-slate-500">
              Documented disaster benchmarks influencing the 15% historical susceptibility component
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
            Public Post-Disaster Records
          </span>
          <span className="text-slate-600">
            Recurrence: <strong className="text-slate-900 font-mono">~{basin.historicalRecurrenceYears} yrs</strong>
          </span>
        </div>
      </div>

      {/* Historical Events Timeline / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {basin.historicalEvents.map((evt, idx) => (
          <div
            key={idx}
            className="bg-slate-50 rounded border border-slate-200 p-3.5 flex flex-col justify-between space-y-3 hover:border-slate-300 transition-all shadow-2xs"
          >
            <div>
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <span className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  <span>Year {evt.year}</span>
                </span>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${getSeverityBadge(evt.severity)}`}>
                  {evt.severity}
                </span>
              </div>

              {evt.floodLevelM && (
                <div className="text-xs text-blue-700 font-mono font-bold">
                  Peak Water Stage: {evt.floodLevelM} m MSL
                </div>
              )}

              <p className="text-xs font-semibold text-slate-800 mt-1 leading-snug">
                {evt.keyCause}
              </p>

              <p className="text-[11px] text-slate-600 mt-1.5 leading-relaxed">
                {evt.summary}
              </p>
            </div>

            <div className="pt-2.5 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1 font-medium">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                <span>~{evt.populationDisplacedLakhs} Lakh Displaced</span>
              </span>
              <span className="italic truncate max-w-[130px] text-[10px] text-slate-400" title={evt.sourceCitation}>
                {evt.sourceCitation}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Methodology Note */}
      <div className="bg-slate-50 p-3 rounded border border-slate-200 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-2">
        <span className="text-[11px] leading-relaxed">
          <strong className="text-slate-800">Model Impact:</strong> Historical recurrence score ({basin.historicalFloodScore}/100) contributes 15% baseline susceptibility to prevent underestimating chronic floodways during early monsoon stages.
        </span>
        <span className="font-mono text-blue-700 text-xs font-bold shrink-0">
          Weight: 15% (+{(basin.historicalFloodScore * 0.15).toFixed(1)} pts)
        </span>
      </div>
    </section>
  );
};
