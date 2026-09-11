import React from 'react';
import { FloodBasin, FloodRiskAssessment } from '../../types';
import { FLOOD_BASINS } from '../../data/basins';
import { Shield, Waves, PhoneCall, Radio, RefreshCw, MapPin, ChevronDown } from 'lucide-react';

interface NavbarProps {
  selectedBasin: FloodBasin;
  onSelectBasin: (basin: FloodBasin) => void;
  riskAssessment: FloodRiskAssessment;
  isWeatherLive: boolean;
  isRefreshing: boolean;
  onRefresh: () => void;
  onOpenSosModal: () => void;
  language: 'EN' | 'HI';
  onToggleLanguage: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  selectedBasin,
  onSelectBasin,
  riskAssessment,
  isWeatherLive,
  isRefreshing,
  onOpenSosModal,
  language,
  onToggleLanguage,
  onRefresh
}) => {
  const getBadgeStyle = () => {
    switch (riskAssessment.riskLevel) {
      case 'SEVERE':
        return 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse';
      case 'HIGH':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/40';
      case 'MODERATE':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      default:
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
    }
  };

  const getRiskText = () => {
    if (language === 'HI') {
      switch (riskAssessment.riskLevel) {
        case 'SEVERE': return 'अति गंभीर (RED)';
        case 'HIGH': return 'गंभीर (ORANGE)';
        case 'MODERATE': return 'मध्यम (YELLOW)';
        default: return 'सामान्य (GREEN)';
      }
    }
    return `${riskAssessment.riskLevel} ALERT`;
  };

  return (
    <header className="bg-slate-900/95 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <div className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20 text-white">
            <Waves className="w-5 h-5 absolute text-cyan-200 opacity-60" />
            <Shield className="w-5 h-5 sm:w-6 sm:h-6 relative z-10" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                FloodGuard
              </span>
              <span className="text-[10px] sm:text-xs font-bold px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                AI
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block font-medium">
              {language === 'HI' ? 'भारत बाढ़ पूर्वानुमान एवं बचाव प्रणाली' : 'India Flood Intelligence & Evacuation System'}
            </p>
          </div>
        </div>

        {/* Center: Basin Selector with location pin icon and styled dropdown */}
        <div className="flex-1 max-w-xs sm:max-w-sm md:max-w-md mx-1 sm:mx-2">
          <div className="relative flex items-center">
            <MapPin className="w-3.5 h-3.5 text-cyan-400 absolute left-3 pointer-events-none z-10" />
            <select
              value={selectedBasin.id}
              onChange={(e) => {
                const found = FLOOD_BASINS.find((b) => b.id === e.target.value);
                if (found) onSelectBasin(found);
              }}
              aria-label="Select Monitored River Basin"
              className="w-full appearance-none bg-slate-800/95 text-slate-100 text-xs sm:text-sm font-medium rounded-lg pl-8 pr-8 py-2 border border-slate-700 hover:border-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all cursor-pointer truncate shadow-inner"
            >
              {FLOOD_BASINS.map((b) => (
                <option key={b.id} value={b.id} className="bg-slate-900 text-slate-100 py-1">
                  {b.name} ({b.state}) — {b.riverName}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 pointer-events-none z-10" />
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Risk Level Pill */}
          <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${getBadgeStyle()}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
            <span>{getRiskText()}</span>
            <span className="opacity-90 font-mono">({riskAssessment.overallScore}/100)</span>
          </div>

          {/* Live Data Badge */}
          <div
            title={isWeatherLive ? 'Connected to Open-Meteo High-Resolution Global Forecast API' : 'Using calibrated historical monsoon baseline'}
            className="hidden lg:flex items-center gap-1.5 text-[11px] text-slate-400 bg-slate-800/70 hover:bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700/80 transition-colors"
          >
            <Radio className={`w-3 h-3 ${isWeatherLive ? 'text-emerald-400 animate-pulse' : 'text-amber-400'}`} />
            <span>{isWeatherLive ? 'Weather: Live API' : 'Weather: Baseline'}</span>
          </div>

          {/* Refresh button */}
          <button
            onClick={onRefresh}
            aria-label="Refresh weather and sensor feeds"
            title="Refresh weather and sensor feeds"
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 hover:border-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 transition-all active:scale-95"
          >
            <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
          </button>

          {/* Language toggle */}
          <button
            onClick={onToggleLanguage}
            aria-label="Toggle language between English and Hindi"
            className="px-2 sm:px-2.5 py-1 rounded text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 hover:border-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 transition-all active:scale-95"
            title="Switch language (English / हिन्दी)"
          >
            {language === 'EN' ? 'हिन्दी' : 'EN'}
          </button>

          {/* SOS Helplines Modal Trigger */}
          <button
            onClick={onOpenSosModal}
            aria-label="Open Emergency SOS 112 Rescue Helpline Modal"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-600/30 border border-red-500/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 transition-all active:scale-95"
          >
            <PhoneCall className="w-3.5 h-3.5 animate-bounce" />
            <span className="font-mono">SOS 112</span>
          </button>
        </div>
      </div>
    </header>
  );
};
