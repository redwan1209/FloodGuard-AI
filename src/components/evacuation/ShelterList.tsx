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
  ShieldAlert
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
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>Designated High-Ground Relief Shelters</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Ranked by elevation safety margin, road accessibility, and remaining capacity
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-slate-800 text-xs text-slate-200 rounded-lg px-3 py-1.5 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer"
          >
            <option value="ALL">All Shelters ({shelters.length})</option>
            <option value="MEDICAL">With Medical Post</option>
            <option value="CLEAR_ROAD">Clear Roads Only</option>
          </select>
        </div>
      </div>

      {/* Risk-Linked Evacuation Corridor & Danger Zone Advisory (Task 9) */}
      {assessment && (
        <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4.5 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5" style={{ color: assessment.colorCode }} />
              <h4 className="text-sm font-bold text-white">
                Evacuation Route Advisory — {assessment.riskLevel} Level Protocol
              </h4>
            </div>
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded uppercase border"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {/* Safe Corridors */}
            <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-lg p-3">
              <span className="font-bold text-emerald-400 flex items-center gap-1.5 mb-1.5">
                <Navigation className="w-3.5 h-3.5" />
                <span>Recommended Safe Evacuation Corridors</span>
              </span>
              <ul className="space-y-1 text-slate-300 text-[11px]">
                {assessment.evacuationCorridors.map((c, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Roads to Avoid */}
            <div className="bg-red-950/20 border border-red-500/30 rounded-lg p-3">
              <span className="font-bold text-red-400 flex items-center gap-1.5 mb-1.5">
                <Ban className="w-3.5 h-3.5" />
                <span>Hazard Roads & Waterlogging Zones to Avoid</span>
              </span>
              <ul className="space-y-1 text-slate-300 text-[11px]">
                {assessment.roadsToAvoid.map((r, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="text-[10px] text-slate-500 italic pt-1">
            ⚠️ Disclaimer: These corridor estimations are generated from spatial elevation and proximity modeling. Always comply with field traffic diversions posted by Local Police and State Disaster Management Authorities.
          </p>
        </div>
      )}

      {/* Shelter Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((shelter) => (
          <div
            key={shelter.id}
            className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 hover:border-cyan-500/50 transition-all flex flex-col justify-between group shadow-lg"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      Rank #{shelter.recommendationRank}
                    </span>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${getViabilityBadge(shelter.evacuationViability)}`}>
                      {shelter.evacuationViability}
                    </span>
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-white mt-1.5 group-hover:text-cyan-300 transition-colors">
                    {shelter.name}
                  </h4>
                  <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    <span>{shelter.type} • {shelter.distanceKm} km from basin center</span>
                  </span>
                </div>
              </div>

              {/* Stats row */}
              <div className="mt-3.5 grid grid-cols-2 gap-2 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 text-xs">
                <div>
                  <span className="text-slate-400 text-[11px] block">Elevation Safety Buffer</span>
                  <span className="font-bold text-emerald-400 text-sm">
                    +{shelter.safetyMarginAboveFloodM}m <span className="text-[10px] text-slate-400 font-normal">({shelter.elevationM}m MSL)</span>
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Capacity & Occupancy</span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-bold text-slate-200 text-sm">{shelter.currentOccupancy}</span>
                    <span className="text-slate-400 text-[11px]">/ {shelter.totalCapacity} ({shelter.occupancyPercent}%)</span>
                  </div>
                </div>
              </div>

              {/* Occupancy bar */}
              <div className="mt-2 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    shelter.occupancyPercent >= 90
                      ? 'bg-red-500'
                      : shelter.occupancyPercent >= 75
                      ? 'bg-amber-500'
                      : 'bg-cyan-500'
                  }`}
                  style={{ width: `${shelter.occupancyPercent}%` }}
                />
              </div>

              {/* Amenities tags */}
              <div className="mt-3 flex flex-wrap gap-1.5 text-[11px]">
                {shelter.hasMedicalPost && (
                  <span className="bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-2 py-0.5 rounded flex items-center gap-1">
                    <Activity className="w-3 h-3" /> Medical Aid Post
                  </span>
                )}
                {shelter.hasCleanWater && (
                  <span className="bg-blue-500/10 text-blue-300 border border-blue-500/20 px-2 py-0.5 rounded flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Clean Drinking Water
                  </span>
                )}
                <span
                  className={`px-2 py-0.5 rounded border flex items-center gap-1 ${
                    shelter.roadAccessibility === 'CLEAR'
                      ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                  }`}
                >
                  <AlertTriangle className="w-3 h-3" /> Road: {shelter.roadAccessibility}
                </span>
              </div>
            </div>

            {/* Footer / Contact */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 text-slate-400">
                <User className="w-3.5 h-3.5 text-slate-500" />
                <span className="truncate max-w-[150px]">{shelter.contactPerson}</span>
              </div>
              <a
                href={`tel:${shelter.contactPhone}`}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 font-mono transition-colors"
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
