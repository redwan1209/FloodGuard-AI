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
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-pink-500/15 text-pink-400 flex items-center justify-center">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Historical Flood Atlas & Recurrence Prior (Task 5)
              </h3>
              <p className="text-xs text-slate-400">
                Documented flood benchmarks influencing the 15% historical susceptibility component
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-pink-500/10 text-pink-300 border border-pink-500/20">
            Public Government Post-Disaster Records
          </span>
          <span className="text-slate-400">
            Recurrence: <strong className="text-white">~{basin.historicalRecurrenceYears} yrs</strong>
          </span>
        </div>
      </div>

      {/* Historical Events Timeline / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {basin.historicalEvents.map((evt, idx) => (
          <div
            key={idx}
            className="bg-slate-950/70 rounded-xl p-3.5 border border-slate-800/80 flex flex-col justify-between space-y-2 hover:border-slate-700 transition-all"
          >
            <div>
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="font-extrabold text-white text-sm flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-pink-400" />
                  <span>Year {evt.year}</span>
                </span>
                <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${getSeverityBadge(evt.severity)}`}>
                  {evt.severity}
                </span>
              </div>

              {evt.floodLevelM && (
                <div className="text-[11px] text-cyan-300 font-mono font-semibold">
                  Peak Stage: {evt.floodLevelM} m MSL
                </div>
              )}

              <p className="text-xs font-medium text-slate-300 mt-1 leading-snug">
                {evt.keyCause}
              </p>

              <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                {evt.summary}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
              <span className="flex items-center gap-1 text-slate-400">
                <Users className="w-3 h-3 text-slate-500" />
                <span>~{evt.populationDisplacedLakhs} Lakh Displaced</span>
              </span>
              <span className="italic truncate max-w-[140px]" title={evt.sourceCitation}>
                {evt.sourceCitation}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Methodology Note */}
      <div className="bg-slate-950/40 p-2.5 rounded-lg border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
        <span>
          <strong className="text-slate-300">Model Impact:</strong> Historical recurrence score ({basin.historicalFloodScore}/100) contributes 15% baseline resistance/vulnerability to prevent underestimating chronic floodways during early monsoon stages.
        </span>
        <span className="font-mono text-pink-400 text-xs font-bold shrink-0 ml-2">
          Weight: 15% (+{(basin.historicalFloodScore * 0.15).toFixed(1)} pts)
        </span>
      </div>
    </div>
  );
};
