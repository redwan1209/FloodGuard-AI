import React, { useState } from 'react';
import { Shelter, FloodBasin } from '../../types';
import { FileText, Printer, CheckCircle, AlertCircle, X, Shield } from 'lucide-react';

interface EvacuationPassProps {
  basin: FloodBasin;
  shelters: Shelter[];
  onClose?: () => void;
}

export const EvacuationPass: React.FC<EvacuationPassProps> = ({ basin, shelters, onClose }) => {
  const [residentName, setResidentName] = useState('Ramesh Sharma');
  const [familyCount, setFamilyCount] = useState(4);
  const [selectedShelterId, setSelectedShelterId] = useState(shelters[0]?.id || '');
  const [medicalNeeds, setMedicalNeeds] = useState('Elderly mobility assistance (1 person)');
  const [contactPhone, setContactPhone] = useState('+91 98765 43210');
  const [isGenerated, setIsGenerated] = useState(false);

  const selectedShelter = shelters.find((s) => s.id === selectedShelterId) || shelters[0];
  const passId = `EVAC-${basin.id.substring(0, 3).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-cyan-400" />
          <div>
            <h3 className="text-base font-bold text-white">Emergency Evacuation Pass Generator</h3>
            <p className="text-xs text-slate-400">
              Generate a fast-track pass for family check-in at designated high-ground shelters
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {!isGenerated ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setIsGenerated(true);
          }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs"
        >
          <div>
            <label className="block font-medium text-slate-300 mb-1">Family Head / Representative</label>
            <input
              type="text"
              value={residentName}
              onChange={(e) => setResidentName(e.target.value)}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-300 mb-1">Total Family Members</label>
            <input
              type="number"
              min="1"
              max="20"
              value={familyCount}
              onChange={(e) => setFamilyCount(Number(e.target.value))}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-300 mb-1">Designated High-Ground Shelter</label>
            <select
              value={selectedShelterId}
              onChange={(e) => setSelectedShelterId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer"
            >
              {shelters.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} (+{s.safetyMarginAboveFloodM}m buffer)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium text-slate-300 mb-1">Primary Mobile Number</label>
            <input
              type="tel"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-medium text-slate-300 mb-1">
              Special Medical / Vulnerability Needs (Optional)
            </label>
            <input
              type="text"
              value={medicalNeeds}
              onChange={(e) => setMedicalNeeds(e.target.value)}
              placeholder="e.g. Wheelchair access, infant food, insulin refrigeration"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          <div className="sm:col-span-2 pt-2">
            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-cyan-600/30 transition-all"
            >
              Generate Digital Emergency Evacuation Pass
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          {/* Printable Pass Card */}
          <div className="bg-slate-950 border-2 border-cyan-500/40 rounded-2xl p-5 relative overflow-hidden shadow-2xl print:border-black print:text-black print:bg-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black tracking-wide text-white uppercase">
                    District Evacuation Priority Pass
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono">ID: {passId}</span>
                </div>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                VERIFIED ADVISORY
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-3">
              <div>
                <span className="text-slate-500 text-[10px] block">Resident / Representative</span>
                <strong className="text-white">{residentName}</strong>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Family Size</span>
                <strong className="text-white">{familyCount} Persons</strong>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Target River Basin</span>
                <strong className="text-cyan-400">{basin.name}</strong>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Contact Number</span>
                <strong className="text-white font-mono">{contactPhone}</strong>
              </div>
            </div>

            <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800 text-xs mb-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-wide">
                    Assigned High-Ground Shelter
                  </span>
                  <div className="text-sm font-bold text-white">{selectedShelter.name}</div>
                  <span className="text-slate-400 text-[11px]">
                    Elevation: {selectedShelter.elevationM}m MSL (+{selectedShelter.safetyMarginAboveFloodM}m buffer)
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 text-[10px] block">Camp Officer Contact</span>
                  <span className="font-mono text-cyan-300 font-semibold">{selectedShelter.contactPhone}</span>
                </div>
              </div>
              {medicalNeeds && (
                <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] text-amber-300 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>Medical Attention Flag: {medicalNeeds}</span>
                </div>
              )}
            </div>

            <p className="text-[10px] text-slate-500 italic">
              Present this pass at the shelter reception for priority biometric bedding, food packet rations, and emergency medical kit allocation.
            </p>
          </div>

          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => setIsGenerated(false)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              ← Edit Details
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-cyan-600/20"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
