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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-slate-900 border-2 border-red-500/60 rounded-2xl p-6 shadow-2xl text-slate-100 animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-red-600/30 text-red-400 border border-red-500/50 flex items-center justify-center">
            <AlertOctagon className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white uppercase tracking-wide">
              Emergency SOS Rescue Dispatch
            </h3>
            <p className="text-xs text-red-300 font-medium">
              Immediate connection to Indian Disaster Response Operators
            </p>
          </div>
        </div>

        {/* Location Dispatch Information */}
        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 mb-4 text-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
            Read This Location to Emergency Operator:
          </span>
          <div className="font-mono text-cyan-300 font-bold text-sm">
            {basin.name}, {basin.state}
          </div>
          <div className="text-slate-400 mt-0.5 text-[11px]">
            Coords: {basin.coordinates[0].toFixed(4)}° N, {basin.coordinates[1].toFixed(4)}° E | River: {basin.riverName}
          </div>
        </div>

        {/* Emergency Call Buttons */}
        <div className="space-y-2.5">
          <a
            href="tel:112"
            className="w-full py-3 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-sm flex items-center justify-between shadow-lg shadow-red-600/40 transition-all active:scale-95"
          >
            <div className="flex items-center gap-3">
              <PhoneCall className="w-5 h-5 animate-bounce" />
              <div className="text-left">
                <div>Dial 112 (National Emergency Helpline)</div>
                <div className="text-[10px] font-normal text-red-100 opacity-90">Police • Fire • Ambulance • Flood Rescue</div>
              </div>
            </div>
            <span className="text-xs bg-red-700/80 px-2.5 py-1 rounded-lg">Instant Dial</span>
          </a>

          <a
            href="tel:1070"
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-between border border-slate-700 transition-all"
          >
            <div className="flex items-center gap-2.5">
              <PhoneCall className="w-4 h-4 text-cyan-400" />
              <div className="text-left">
                <div>1070 — National Emergency Operations Centre (NEOC)</div>
                <div className="text-[10px] text-slate-400">NDMA National Control Room</div>
              </div>
            </div>
            <span className="text-xs text-cyan-400 font-mono">1070</span>
          </a>

          <a
            href="tel:1077"
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-between border border-slate-700 transition-all"
          >
            <div className="flex items-center gap-2.5">
              <PhoneCall className="w-4 h-4 text-amber-400" />
              <div className="text-left">
                <div>1077 — District Emergency Operations Centre (DEOC)</div>
                <div className="text-[10px] text-slate-400">District Collectorate Disaster Desk</div>
              </div>
            </div>
            <span className="text-xs text-amber-400 font-mono">1077</span>
          </a>
        </div>

        {/* SOS Whistle / Sound Signal Tip */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-start gap-2.5 text-[11px] text-slate-400">
          <Volume2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <span>
            <strong className="text-slate-200">Survival Sound Signal:</strong> Blow whistle 3 times sharply with 1-second pauses to guide NDRF motorized search boats through flood fog or rain.
          </span>
        </div>
      </div>
    </div>
  );
};
