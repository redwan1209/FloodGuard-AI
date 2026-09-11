import React, { useState } from 'react';
import { Shelter, FloodRiskAssessment } from '../../types';
import { RankedShelter } from '../../services/evacuationEngine';
import {
  ShieldCheck,
  Phone,
  User,
  Activity,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Filter,
  Navigation,
  Ban,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';

interface ShelterListProps {
  shelters: RankedShelter[];
  assessment?: FloodRiskAssessment;
  onSelectShelter?: (shelter: Shelter) => void;
}

export const ShelterList: React.FC<ShelterListProps> = ({ shelters, assessment, onSelectShelter }) => {
  const [filterType, setFilterType] = useState<string>('ALL');

  const filtered = shelters.filter((s) => {
    if (filterType === 'ALL') return true;
    if (filterType === 'MEDICAL') return s.hasMedicalPost;
    if (filterType === 'CLEAR_ROAD') return s.roadAccessibility === 'CLEAR';
    return true;
  });

  const getViabilityBadge = (v: RankedShelter['evacuationViability']) => {
    switch (v) {
      case 'OPTIMAL':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'RECOMMENDED':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      case 'BACKUP':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      default:
        return 'bg-red-500/20 text-red-300 border-red-500/40';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header & Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 p-4 sm:p-5 rounded-2xl border border-slate-800 shadow-md">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>Designated High-Ground Relief Shelters</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Ranked by elevation safety margin, road accessibility, and remaining capacity
          </p>
        </div>

        {/* Quick Filter Buttons / Select */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setFilterType('ALL')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                filterType === 'ALL'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All ({shelters.length})
            </button>
            <button
              onClick={() => setFilterType('CLEAR_ROAD')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                filterType === 'CLEAR_ROAD'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Clear Roads
            </button>
            <button
              onClick={() => setFilterType('MEDICAL')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                filterType === 'MEDICAL'
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Medical Aid
            </button>
          </div>
        </div>
      </div>

      {/* Risk-Linked Evacuation Corridor & Danger Zone Advisory (Task 9) */}
      {assessment && (
        <section aria-label="Evacuation Route Protocols" className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4.5 sm:p-5 space-y-3.5 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 shrink-0" style={{ color: assessment.colorCode }} />
              <h4 className="text-sm sm:text-base font-bold text-white">
                Evacuation Route Advisory — {assessment.riskLevel} Level Protocol
              </h4>
            </div>
            <span
              className="text-[10px] font-bold px-2.5 py-0.5 rounded uppercase border"
              style={{
                backgroundColor: `${assessment.colorCode}20`,
                color: assessment.colorCode,
                borderColor: `${assessment.colorCode}40`
              }}
            >
              {assessment.riskLevel === 'SEVERE'
                ? 'Mandatory Floodplain Evacuation'
                : assessment.riskLevel === 'HIGH'
                ? 'High-Alert Staged Evacuation'
                : 'Precautionary Advisory'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
            {/* Safe Corridors */}
            <div className="bg-emerald-950/25 border border-emerald-500/35 rounded-xl p-3.5 shadow-sm">
              <span className="font-bold text-emerald-400 flex items-center gap-1.5 mb-2">
                <Navigation className="w-4 h-4" />
                <span>Recommended Safe Evacuation Corridors</span>
              </span>
              <ul className="space-y-1.5 text-slate-200 text-xs">
                {assessment.evacuationCorridors.map((c, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 shadow-sm shadow-emerald-400/50" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Roads to Avoid */}
            <div className="bg-red-950/25 border border-red-500/35 rounded-xl p-3.5 shadow-sm">
              <span className="font-bold text-red-400 flex items-center gap-1.5 mb-2">
                <Ban className="w-4 h-4" />
                <span>Hazard Roads & Waterlogging Zones to Avoid</span>
              </span>
              <ul className="space-y-1.5 text-slate-200 text-xs">
                {assessment.roadsToAvoid.map((r, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-400 shrink-0 shadow-sm shadow-red-400/50" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="text-[10px] text-slate-400 italic pt-1">
            ⚠️ Disclaimer: These corridor estimations are generated from spatial elevation and proximity modeling. Always comply with field traffic diversions posted by Local Police and State Disaster Management Authorities.
          </p>
        </section>
      )}

      {/* Shelter Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((shelter) => (
          <div
            key={shelter.id}
            className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 hover:border-cyan-500/40 hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between group shadow-xl"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                      Rank #{shelter.recommendationRank}
                    </span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${getViabilityBadge(shelter.evacuationViability)}`}>
                      {shelter.evacuationViability}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white mt-2 group-hover:text-cyan-300 transition-colors">
                    {shelter.name}
                  </h4>
                  <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{shelter.type} • {shelter.distanceKm} km from basin center</span>
                  </span>
                </div>
              </div>

              {/* Stats row */}
              <div className="mt-3.5 grid grid-cols-2 gap-2 bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 text-xs">
                <div>
                  <span className="text-slate-400 text-[11px] block">Elevation Safety Buffer</span>
                  <span className="font-bold text-emerald-400 text-sm">
                    +{shelter.safetyMarginAboveFloodM}m <span className="text-[10px] text-slate-400 font-normal">({shelter.elevationM}m MSL)</span>
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Capacity & Occupancy</span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-bold text-slate-100 text-sm font-mono">{shelter.currentOccupancy}</span>
                    <span className="text-slate-400 text-[11px]">/ {shelter.totalCapacity} ({shelter.occupancyPercent}%)</span>
                  </div>
                </div>
              </div>

              {/* Occupancy bar */}
              <div className="mt-2 w-full bg-slate-800/80 rounded-full h-2 overflow-hidden shadow-inner">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    shelter.occupancyPercent >= 90
                      ? 'bg-red-500'
                      : shelter.occupancyPercent >= 75
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${shelter.occupancyPercent}%` }}
                />
              </div>

              {/* Amenities tags */}
              <div className="mt-3 flex flex-wrap gap-1.5 text-[11px]">
                {shelter.hasMedicalPost && (
                  <span className="bg-emerald-500/15 text-emerald-300 border border-emerald-500/25 px-2 py-0.5 rounded-md flex items-center gap-1 font-semibold">
                    <Activity className="w-3 h-3" /> Medical Aid Post
                  </span>
                )}
                {shelter.hasCleanWater && (
                  <span className="bg-blue-500/15 text-blue-300 border border-blue-500/25 px-2 py-0.5 rounded-md flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-3 h-3" /> Clean Water
                  </span>
                )}
                <span
                  className={`px-2 py-0.5 rounded-md border flex items-center gap-1 font-semibold ${
                    shelter.roadAccessibility === 'CLEAR'
                      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25'
                      : 'bg-amber-500/15 text-amber-300 border-amber-500/25'
                  }`}
                >
                  <AlertTriangle className="w-3 h-3" /> Road: {shelter.roadAccessibility}
                </span>
              </div>
            </div>

            {/* Footer / Contact */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-slate-300">
                <User className="w-3.5 h-3.5 text-slate-500" />
                <span className="truncate max-w-[150px] font-medium">{shelter.contactPerson}</span>
              </div>
              <a
                href={`tel:${shelter.contactPhone}`}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white border border-slate-700 font-mono text-xs font-bold transition-all shadow-sm"
              >
                <Phone className="w-3 h-3" />
                <span>{shelter.contactPhone}</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
