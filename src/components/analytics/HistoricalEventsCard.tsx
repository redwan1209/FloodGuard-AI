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
        return 'bg-red-500/20 text-red-300 border-red-500/40';
      case 'SEVERE':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/40';
      default:
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    }
  };

  return (
    <section aria-label="Historical Flood Atlas and Recurrence Prior" className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-pink-500/15 text-pink-400 flex items-center justify-center shadow-inner">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              Historical Flood Atlas & Recurrence Prior (Task 5)
            </h3>
            <p className="text-xs text-slate-400">
              Documented disaster benchmarks influencing the 15% historical susceptibility component
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-pink-500/15 text-pink-300 border border-pink-500/30">
            Public Government Post-Disaster Records
          </span>
          <span className="text-slate-300">
            Recurrence: <strong className="text-white font-mono">~{basin.historicalRecurrenceYears} yrs</strong>
          </span>
        </div>
      </div>

      {/* Historical Events Timeline / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {basin.historicalEvents.map((evt, idx) => (
          <div
            key={idx}
            className="bg-slate-950/70 rounded-xl p-4 border border-slate-800 flex flex-col justify-between space-y-3 hover:border-slate-700 transition-all shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <span className="font-extrabold text-white text-sm flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-pink-400" />
                  <span>Year {evt.year}</span>
                </span>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${getSeverityBadge(evt.severity)}`}>
                  {evt.severity}
                </span>
              </div>

              {evt.floodLevelM && (
                <div className="text-xs text-cyan-300 font-mono font-bold">
                  Peak Water Stage: {evt.floodLevelM} m MSL
                </div>
              )}

              <p className="text-xs font-semibold text-slate-200 mt-1 leading-snug">
                {evt.keyCause}
              </p>

              <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                {evt.summary}
              </p>
            </div>

            <div className="pt-2.5 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1 font-medium">
                <Users className="w-3.5 h-3.5 text-slate-500" />
                <span>~{evt.populationDisplacedLakhs} Lakh Displaced</span>
              </span>
              <span className="italic truncate max-w-[130px] text-[10px] text-slate-500" title={evt.sourceCitation}>
                {evt.sourceCitation}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Methodology Note */}
      <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 flex flex-wrap items-center justify-between gap-2">
        <span className="text-[11px] leading-relaxed">
          <strong className="text-slate-200">Model Impact:</strong> Historical recurrence score ({basin.historicalFloodScore}/100) contributes 15% baseline resistance/vulnerability to prevent underestimating chronic floodways during early monsoon stages.
        </span>
        <span className="font-mono text-pink-400 text-xs font-bold shrink-0">
          Weight: 15% (+{(basin.historicalFloodScore * 0.15).toFixed(1)} pts)
        </span>
      </div>
    </section>
  );
};
