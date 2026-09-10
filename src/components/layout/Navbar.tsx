import React from 'react';
import { FloodBasin, FloodRiskAssessment } from '../../types';
import { FLOOD_BASINS } from '../../data/basins';
import { Shield, Waves, PhoneCall, Radio, RefreshCw } from 'lucide-react';

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
    <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20 text-white">
            <Waves className="w-5 h-5 absolute animate-pulse-slow text-cyan-200" />
            <Shield className="w-6 h-6 relative z-10" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                FloodGuard
              </span>
              <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                AI
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">
              {language === 'HI' ? 'भारत बाढ़ पूर्वानुमान एवं बचाव प्रणाली' : 'India Flood Intelligence & Evacuation System'}
            </p>
          </div>
        </div>

        {/* Center: Basin Selector */}
        <div className="flex-1 max-w-md mx-2">
          <div className="relative">
            <select
              value={selectedBasin.id}
              onChange={(e) => {
                const found = FLOOD_BASINS.find((b) => b.id === e.target.value);
                if (found) onSelectBasin(found);
              }}
              className="w-full bg-slate-800/90 text-slate-100 text-xs sm:text-sm font-medium rounded-lg px-3 py-2 border border-slate-700 hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all cursor-pointer truncate shadow-inner"
            >
              {FLOOD_BASINS.map((b) => (
                <option key={b.id} value={b.id} className="bg-slate-900 text-slate-100">
                  {b.name} ({b.state}) — {b.riverName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Risk Level Pill */}
          <div className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${getBadgeStyle()}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
            <span>{getRiskText()}</span>
            <span className="opacity-80 font-mono">({riskAssessment.overallScore}/100)</span>
          </div>

          {/* Live Data Badge */}
          <div className="hidden lg:flex items-center gap-1 text-[11px] text-slate-400 bg-slate-800/60 px-2 py-1 rounded-md border border-slate-700/60">
            <Radio className={`w-3 h-3 ${isWeatherLive ? 'text-emerald-400 animate-pulse' : 'text-amber-400'}`} />
            <span>{isWeatherLive ? 'Weather: Open-Meteo Live' : 'Weather: Demo Telemetry'}</span>
          </div>

          {/* Refresh button */}
          <button
            onClick={onRefresh}
            title="Refresh weather and sensor feeds"
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
          </button>

          {/* Language toggle */}
          <button
            onClick={onToggleLanguage}
            className="px-2 py-1 rounded text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            title="Switch language (English / हिन्दी)"
          >
            {language === 'EN' ? 'हिन्दी' : 'EN'}
          </button>

          {/* SOS Helplines Modal Trigger */}
          <button
            onClick={onOpenSosModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-600/30 transition-all active:scale-95"
          >
            <PhoneCall className="w-3.5 h-3.5 animate-bounce" />
            <span>SOS 112</span>
          </button>
        </div>
      </div>
    </header>
  );
};
