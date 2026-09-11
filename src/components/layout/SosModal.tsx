import React from 'react';
import { FloodBasin } from '../../types';
import { PhoneCall, AlertOctagon, X, Volume2, ShieldAlert } from 'lucide-react';

interface SosModalProps {
  isOpen: boolean;
  onClose: () => void;
  basin: FloodBasin;
}

export const SosModal: React.FC<SosModalProps> = ({ isOpen, onClose, basin }) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="sos-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="relative w-full max-w-lg bg-white border-2 border-red-600 rounded-lg p-6 sm:p-7 shadow-2xl text-slate-900 animate-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          aria-label="Close SOS Dialog"
          className="absolute top-4 right-4 p-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-slate-200 pb-4 mb-4">
          <div className="w-12 h-12 rounded bg-red-50 text-red-600 border border-red-200 flex items-center justify-center shadow-xs">
            <AlertOctagon className="w-7 h-7" />
          </div>
          <div>
            <h3 id="sos-modal-title" className="text-lg font-bold text-slate-900 uppercase tracking-wide">
              Emergency SOS Rescue Dispatch
            </h3>
            <p className="text-xs text-red-700 font-semibold">
              Immediate connection to Indian Disaster Response Control Rooms
            </p>
          </div>
        </div>

        {/* Location Dispatch Information */}
        <div className="bg-slate-50 p-4 rounded border border-slate-200 mb-4 text-xs">
          <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
            Read This Location Clearly to the Emergency Operator:
          </span>
          <div className="font-mono text-blue-800 font-bold text-sm sm:text-base">
            {basin.name}, {basin.state}
          </div>
          <div className="text-slate-600 mt-1 text-xs font-mono">
            GPS Coordinates: {basin.coordinates[0].toFixed(4)}° N, {basin.coordinates[1].toFixed(4)}° E | River Basin: {basin.riverName}
          </div>
        </div>

        {/* Emergency Call Buttons */}
        <div className="space-y-2.5">
          <a
            href="tel:112"
            className="w-full py-3.5 px-4 rounded bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm flex items-center justify-between shadow-xs transition-colors"
          >
            <div className="flex items-center gap-3">
              <PhoneCall className="w-5 h-5" />
              <div className="text-left">
                <div className="text-sm font-bold">Dial 112 — National Emergency Helpline</div>
                <div className="text-[11px] font-normal text-red-100">Police • Fire • Ambulance • Flood Rescue</div>
              </div>
            </div>
            <span className="text-xs font-bold bg-red-800 px-2.5 py-1 rounded">Instant Dial</span>
          </a>

          <a
            href="tel:1070"
            className="w-full py-3 px-4 rounded bg-slate-50 hover:bg-slate-100 text-slate-900 font-bold text-xs flex items-center justify-between border border-slate-300 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <PhoneCall className="w-4 h-4 text-blue-700" />
              <div className="text-left">
                <div className="font-bold">1070 — National Emergency Operations Centre (NEOC)</div>
                <div className="text-[10px] text-slate-500">NDMA Central Control Room</div>
              </div>
            </div>
            <span className="text-xs text-blue-800 font-mono font-bold">1070</span>
          </a>

          <a
            href="tel:1077"
            className="w-full py-3 px-4 rounded bg-slate-50 hover:bg-slate-100 text-slate-900 font-bold text-xs flex items-center justify-between border border-slate-300 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <PhoneCall className="w-4 h-4 text-amber-700" />
              <div className="text-left">
                <div className="font-bold">1077 — District Emergency Operations Centre (DEOC)</div>
                <div className="text-[10px] text-slate-500">District Collectorate Disaster Desk</div>
              </div>
            </div>
            <span className="text-xs text-amber-800 font-mono font-bold">1077</span>
          </a>
        </div>

        {/* SOS Whistle / Sound Signal Tip */}
        <div className="mt-4 pt-3.5 border-t border-slate-200 flex items-start gap-2.5 text-xs text-slate-600">
          <Volume2 className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
          <span className="leading-relaxed">
            <strong className="text-slate-800">Survival Sound Signal:</strong> Blow whistle 3 times sharply with 1-second pauses to guide NDRF motorized search boats through flood fog or heavy rain.
          </span>
        </div>
      </div>
    </div>
  );
};
