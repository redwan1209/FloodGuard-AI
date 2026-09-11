import React, { useState } from 'react';
import { Shelter, FloodBasin } from '../../types';
import { FileText, Printer, CheckCircle, AlertCircle, X, Shield, QrCode } from 'lucide-react';

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
    <section aria-label="Emergency Evacuation Pass Generator" className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <FileText className="w-5 h-5 text-cyan-400" />
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white">Emergency Evacuation Pass Generator</h3>
            <p className="text-xs text-slate-400">
              Generate an official digital pass for fast-track family check-in at high-ground relief camps
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
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
            <label className="block font-semibold text-slate-300 mb-1">Family Head / Representative Name</label>
            <input
              type="text"
              value={residentName}
              onChange={(e) => setResidentName(e.target.value)}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Total Family Members</label>
            <input
              type="number"
              min="1"
              max="20"
              value={familyCount}
              onChange={(e) => setFamilyCount(Number(e.target.value))}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Designated High-Ground Shelter</label>
            <select
              value={selectedShelterId}
              onChange={(e) => setSelectedShelterId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 cursor-pointer transition-all"
            >
              {shelters.map((s) => (
                <option key={s.id} value={s.id} className="bg-slate-900 text-white">
                  {s.name} (+{s.safetyMarginAboveFloodM}m buffer)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Primary Mobile Number</label>
            <input
              type="tel"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-semibold text-slate-300 mb-1">
              Special Medical / Vulnerability Needs (Optional)
            </label>
            <input
              type="text"
              value={medicalNeeds}
              onChange={(e) => setMedicalNeeds(e.target.value)}
              placeholder="e.g. Wheelchair access, infant nutrition, insulin refrigeration"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
            />
          </div>

          <div className="sm:col-span-2 pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-cyan-600/30 transition-all active:scale-95"
            >
              Generate Digital Emergency Evacuation Pass
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          {/* Printable Pass Card with .printable-pass-container for @media print */}
          <div className="printable-pass-container bg-slate-950 border-2 border-cyan-500/50 rounded-2xl p-5 sm:p-6 relative overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3.5 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center font-bold">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-black tracking-wide text-white uppercase">
                    District Evacuation Priority Pass
                  </h4>
                  <span className="text-[11px] text-slate-400 font-mono">PASS ID: {passId}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 block">
                  PRIORITY ALLOCATED
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-4">
              <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 text-[10px] block">Resident / Head</span>
                <strong className="text-white text-sm">{residentName}</strong>
              </div>
              <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 text-[10px] block">Family Size</span>
                <strong className="text-white text-sm">{familyCount} Members</strong>
              </div>
              <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 text-[10px] block">Monitored Basin</span>
                <strong className="text-cyan-400 text-sm">{basin.name}</strong>
              </div>
              <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 text-[10px] block">Contact Number</span>
                <strong className="text-white font-mono text-sm">{contactPhone}</strong>
              </div>
            </div>

            <div className="bg-slate-900/90 rounded-xl p-3.5 border border-slate-800 text-xs mb-4">
              <div className="flex flex-wrap justify-between items-start gap-2">
                <div>
                  <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-wider block">
                    Assigned High-Ground Shelter
                  </span>
                  <div className="text-sm sm:text-base font-bold text-white mt-0.5">{selectedShelter.name}</div>
                  <span className="text-slate-300 text-xs font-medium">
                    Elevation: {selectedShelter.elevationM}m MSL (+{selectedShelter.safetyMarginAboveFloodM}m safety elevation above flood stage)
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 text-[10px] block">Camp Officer Helpline</span>
                  <span className="font-mono text-cyan-300 font-bold text-sm">{selectedShelter.contactPhone}</span>
                </div>
              </div>
              {medicalNeeds && (
                <div className="mt-3 pt-2.5 border-t border-slate-800 text-xs text-amber-300 flex items-center gap-1.5 font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
                  <span>Medical Attention Flag: {medicalNeeds}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 text-[10px] text-slate-400 border-t border-slate-800/80">
              <span>Present this pass at the shelter intake desk for expedited biometric bedding, food packet rations, and infant kit allocation.</span>
              <span className="font-mono text-cyan-400 font-bold hidden sm:block">NDMA DDMP COMPLIANT</span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 pt-1">
            <button
              onClick={() => setIsGenerated(false)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors"
            >
              ← Edit Details
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-cyan-600/25 transition-all active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
