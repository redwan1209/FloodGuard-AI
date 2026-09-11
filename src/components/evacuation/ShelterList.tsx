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
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'RECOMMENDED':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'BACKUP':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      default:
        return 'bg-red-50 text-red-800 border-red-200';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header & Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-lg border border-slate-200 shadow-sm">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>Designated High-Ground Relief Shelters</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Ranked by elevation safety buffer, road accessibility, and remaining camp capacity
          </p>
        </div>

        {/* Quick Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded border border-slate-200">
            <button
              onClick={() => setFilterType('ALL')}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                filterType === 'ALL'
                  ? 'bg-white text-blue-800 shadow-2xs font-bold border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({shelters.length})
            </button>
            <button
              onClick={() => setFilterType('CLEAR_ROAD')}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                filterType === 'CLEAR_ROAD'
                  ? 'bg-white text-emerald-800 shadow-2xs font-bold border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Clear Roads
            </button>
            <button
              onClick={() => setFilterType('MEDICAL')}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                filterType === 'MEDICAL'
                  ? 'bg-white text-blue-800 shadow-2xs font-bold border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Medical Aid
            </button>
          </div>
        </div>
      </div>

      {/* Risk-Linked Evacuation Corridor & Danger Zone Advisory */}
      {assessment && (
        <section aria-label="Evacuation Route Protocols" className="bg-white border border-slate-200 rounded-lg p-4 sm:p-5 space-y-3.5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 shrink-0" style={{ color: assessment.colorCode }} />
              <h4 className="text-sm sm:text-base font-bold text-slate-900">
                Evacuation Route Advisory — {assessment.riskLevel} Level Protocol
              </h4>
            </div>
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded uppercase border"
              style={{
                backgroundColor: `${assessment.colorCode}15`,
                color: assessment.colorCode,
                borderColor: `${assessment.colorCode}30`
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
            <div className="bg-emerald-50/70 border border-emerald-200 rounded p-3.5">
              <span className="font-bold text-emerald-800 flex items-center gap-1.5 mb-2">
                <Navigation className="w-4 h-4 text-emerald-600" />
                <span>Recommended Safe Evacuation Corridors</span>
              </span>
              <ul className="space-y-1.5 text-slate-700 text-xs">
                {assessment.evacuationCorridors.map((c, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                    <span className="font-medium">{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Roads to Avoid */}
            <div className="bg-red-50/70 border border-red-200 rounded p-3.5">
              <span className="font-bold text-red-800 flex items-center gap-1.5 mb-2">
                <Ban className="w-4 h-4 text-red-600" />
                <span>Hazard Roads & Inundated Zones to Avoid</span>
              </span>
              <ul className="space-y-1.5 text-slate-700 text-xs">
                {assessment.roadsToAvoid.map((r, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-600 shrink-0" />
                    <span className="font-medium">{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="text-[10px] text-slate-500 italic pt-1">
            Official Advisory: These corridor calculations are generated from spatial elevation and river proximity models. Always follow on-ground police and State Disaster Management Authority traffic diversions.
          </p>
        </section>
      )}

      {/* Shelter Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((shelter) => (
          <div
            key={shelter.id}
            className="bg-white border border-slate-200 rounded-lg p-4 sm:p-5 hover:border-blue-400 transition-all flex flex-col justify-between group shadow-sm"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                      Rank #{shelter.recommendationRank}
                    </span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${getViabilityBadge(shelter.evacuationViability)}`}>
                      {shelter.evacuationViability}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mt-2 group-hover:text-blue-700 transition-colors">
                    {shelter.name}
                  </h4>
                  <span className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{shelter.type} • {shelter.distanceKm} km from basin center</span>
                  </span>
                </div>
              </div>

              {/* Stats row */}
              <div className="mt-3.5 grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-500 text-[11px] block">Elevation Safety Buffer</span>
                  <span className="font-bold text-emerald-700 text-sm">
                    +{shelter.safetyMarginAboveFloodM}m <span className="text-[10px] text-slate-500 font-normal">({shelter.elevationM}m MSL)</span>
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block">Capacity & Occupancy</span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-bold text-slate-900 text-sm font-mono">{shelter.currentOccupancy}</span>
                    <span className="text-slate-500 text-[11px]">/ {shelter.totalCapacity} ({shelter.occupancyPercent}%)</span>
                  </div>
                </div>
              </div>

              {/* Occupancy bar */}
              <div className="mt-2 w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    shelter.occupancyPercent >= 90
                      ? 'bg-red-600'
                      : shelter.occupancyPercent >= 75
                      ? 'bg-amber-500'
                      : 'bg-emerald-600'
                  }`}
                  style={{ width: `${shelter.occupancyPercent}%` }}
                />
              </div>

              {/* Amenities tags */}
              <div className="mt-3 flex flex-wrap gap-1.5 text-[11px]">
                {shelter.hasMedicalPost && (
                  <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded flex items-center gap-1 font-semibold">
                    <Activity className="w-3 h-3 text-emerald-600" /> Medical Aid Post
                  </span>
                )}
                {shelter.hasCleanWater && (
                  <span className="bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-3 h-3 text-blue-600" /> Clean Water
                  </span>
                )}
                <span
                  className={`px-2 py-0.5 rounded border flex items-center gap-1 font-semibold ${
                    shelter.roadAccessibility === 'CLEAR'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}
                >
                  <AlertTriangle className="w-3 h-3" /> Road: {shelter.roadAccessibility}
                </span>
              </div>
            </div>

            {/* Footer / Contact */}
            <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-slate-600">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate max-w-[150px] font-medium">{shelter.contactPerson}</span>
              </div>
              <a
                href={`tel:${shelter.contactPhone}`}
                className="flex items-center gap-1 px-3 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-blue-800 font-mono text-xs font-bold border border-slate-200 transition-colors shadow-2xs"
              >
                <Phone className="w-3 h-3 text-blue-700" />
                <span>{shelter.contactPhone}</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
