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
    <section aria-label="Emergency Evacuation Pass Generator" className="bg-white border border-slate-200 rounded-lg p-4 sm:p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <FileText className="w-5 h-5 text-blue-700" />
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">Emergency Evacuation Pass Generator</h3>
            <p className="text-xs text-slate-500">
              Generate an official digital pass for fast-track family check-in at high-ground relief camps
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
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
            <label className="block font-semibold text-slate-700 mb-1">Family Head / Representative Name</label>
            <input
              type="text"
              value={residentName}
              onChange={(e) => setResidentName(e.target.value)}
              required
              className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Total Family Members</label>
            <input
              type="number"
              min="1"
              max="20"
              value={familyCount}
              onChange={(e) => setFamilyCount(Number(e.target.value))}
              required
              className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Designated High-Ground Shelter</label>
            <select
              value={selectedShelterId}
              onChange={(e) => setSelectedShelterId(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 cursor-pointer transition-all"
            >
              {shelters.map((s) => (
                <option key={s.id} value={s.id} className="text-slate-900">
                  {s.name} (+{s.safetyMarginAboveFloodM}m buffer)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Primary Mobile Number</label>
            <input
              type="tel"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              required
              className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-slate-900 font-mono focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-semibold text-slate-700 mb-1">
              Special Medical / Vulnerability Needs (Optional)
            </label>
            <input
              type="text"
              value={medicalNeeds}
              onChange={(e) => setMedicalNeeds(e.target.value)}
              placeholder="e.g. Wheelchair access, infant nutrition, insulin refrigeration"
              className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
            />
          </div>

          <div className="sm:col-span-2 pt-2">
            <button
              type="submit"
              className="w-full py-2.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-colors"
            >
              Generate Digital Emergency Evacuation Pass
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          {/* Printable Pass Card with .printable-pass-container for @media print */}
          <div className="printable-pass-container bg-white border-2 border-slate-300 rounded-lg p-5 sm:p-6 relative overflow-hidden shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3.5 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded bg-blue-50 text-blue-800 border border-blue-200 flex items-center justify-center font-bold">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-black tracking-wide text-slate-950 uppercase">
                    District Evacuation Priority Pass
                  </h4>
                  <span className="text-[11px] text-slate-500 font-mono">PASS ID: {passId}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 block">
                  PRIORITY ALLOCATED
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-4">
              <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                <span className="text-slate-500 text-[10px] block">Resident / Head</span>
                <strong className="text-slate-900 text-sm">{residentName}</strong>
              </div>
              <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                <span className="text-slate-500 text-[10px] block">Family Size</span>
                <strong className="text-slate-900 text-sm">{familyCount} Members</strong>
              </div>
              <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                <span className="text-slate-500 text-[10px] block">Monitored Basin</span>
                <strong className="text-blue-800 text-sm">{basin.name}</strong>
              </div>
              <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                <span className="text-slate-500 text-[10px] block">Contact Number</span>
                <strong className="text-slate-900 font-mono text-sm">{contactPhone}</strong>
              </div>
            </div>

            <div className="bg-blue-50/60 rounded p-3.5 border border-blue-200 text-xs mb-4">
              <div className="flex flex-wrap justify-between items-start gap-2">
                <div>
                  <span className="text-blue-800 text-[10px] font-bold uppercase tracking-wider block">
                    Assigned High-Ground Shelter
                  </span>
                  <div className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">{selectedShelter.name}</div>
                  <span className="text-slate-600 text-xs font-medium">
                    Elevation: {selectedShelter.elevationM}m MSL (+{selectedShelter.safetyMarginAboveFloodM}m buffer above flood stage)
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 text-[10px] block">Camp Officer Helpline</span>
                  <span className="font-mono text-blue-800 font-bold text-sm">{selectedShelter.contactPhone}</span>
                </div>
              </div>
              {medicalNeeds && (
                <div className="mt-3 pt-2.5 border-t border-blue-200 text-xs text-amber-800 flex items-center gap-1.5 font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                  <span>Medical Attention Flag: {medicalNeeds}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 text-[10px] text-slate-500 border-t border-slate-200">
              <span>Present this pass at the shelter intake desk for expedited biometric bedding, food packet rations, and infant kit allocation.</span>
              <span className="font-mono text-slate-600 font-bold hidden sm:block">NDMA DDMP COMPLIANT</span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 pt-1">
            <button
              onClick={() => setIsGenerated(false)}
              className="px-3 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 transition-colors"
            >
              ← Edit Details
            </button>
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
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
