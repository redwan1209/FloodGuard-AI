import React from 'react';
import { FloodBasin, FloodRiskAssessment } from '../../types';
import { FLOOD_BASINS } from '../../data/basins';
import { Shield, Waves, PhoneCall, Radio, RefreshCw, MapPin, ChevronDown, Clock } from 'lucide-react';

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
  // Functional, restrained government risk styling
  const getRiskBadgeStyle = () => {
    switch (riskAssessment.riskLevel) {
      case 'SEVERE':
        return 'bg-red-700 text-white border-red-800';
      case 'HIGH':
        return 'bg-orange-600 text-white border-orange-700';
      case 'MODERATE':
        return 'bg-amber-500 text-slate-950 border-amber-600';
      default:
        return 'bg-emerald-600 text-white border-emerald-700';
    }
  };

  const getRiskText = () => {
    if (language === 'HI') {
      switch (riskAssessment.riskLevel) {
        case 'SEVERE': return 'अति गंभीर (SEVERE)';
        case 'HIGH': return 'गंभीर (HIGH)';
        case 'MODERATE': return 'चेतावनी (WARNING)';
        default: return 'सामान्य (NORMAL)';
      }
    }
    return riskAssessment.riskLevel;
  };

  const formattedDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  return (
    <header className="bg-[#0f2744] text-white border-b border-[#1c3d64] sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-1.5 sm:gap-4">
        {/* Brand & System Identity */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="flex items-center justify-center w-8 h-8 rounded bg-[#1e40af] border border-blue-400/40 text-white shadow-sm">
            <Waves className="w-5 h-5 text-blue-200" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="font-bold text-sm sm:text-base tracking-tight text-white leading-tight">
                FloodGuard AI
              </h1>
              <span className="hidden xs:inline-block text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-blue-900/80 text-blue-200 border border-blue-700/60 tracking-wider">
                GIS Portal
              </span>
            </div>
            <p className="text-[11px] text-blue-200/80 hidden md:block font-normal">
              {language === 'HI' ? 'बाढ़ पूर्वानुमान एवं जल-मौसम निगरानी प्रणाली' : 'Flood Intelligence & Hydrological Monitoring System'}
            </p>
          </div>
        </div>

        {/* Center: Monitored Region Selector */}
        <div className="flex-1 max-w-[150px] sm:max-w-xs md:max-w-md mx-1 sm:mx-2 min-w-0">
          <div className="relative flex items-center">
            <MapPin className="w-3.5 h-3.5 text-blue-300 absolute left-2 pointer-events-none z-10" />
            <select
              value={selectedBasin.id}
              onChange={(e) => {
                const found = FLOOD_BASINS.find((b) => b.id === e.target.value);
                if (found) onSelectBasin(found);
              }}
              aria-label="Select Monitored River Basin"
              className="w-full appearance-none bg-[#163359] text-white text-xs font-semibold rounded pl-7 pr-6 py-1.5 border border-[#2b5280] hover:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 cursor-pointer truncate shadow-inner"
            >
              {FLOOD_BASINS.map((b) => (
                <option key={b.id} value={b.id} className="bg-slate-900 text-white">
                  {b.name} ({b.state})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-blue-300 absolute right-1.5 pointer-events-none z-10" />
          </div>
        </div>

        {/* Right side operational controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Real-time Risk Status Pill (sm+) */}
          <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold border shadow-sm ${getRiskBadgeStyle()}`}>
            <span className="w-2 h-2 rounded-full bg-current opacity-90"></span>
            <span>{getRiskText()}</span>
            <span className="font-mono opacity-90">({riskAssessment.overallScore}/100)</span>
          </div>

          {/* Date & Time display */}
          <div className="hidden xl:flex items-center gap-1 text-[11px] text-blue-200/90 bg-[#163359] px-2 py-1 rounded border border-[#2b5280]">
            <Clock className="w-3 h-3 text-blue-300" />
            <span className="font-mono">{formattedDate}</span>
          </div>

          {/* Live Data Status */}
          <div
            title={isWeatherLive ? 'Open-Meteo High-Resolution Live Forecast Connected' : 'Calibrated Historical Baseline'}
            className="hidden lg:flex items-center gap-1.5 text-[11px] text-blue-200/90 bg-[#163359] px-2 py-1 rounded border border-[#2b5280]"
          >
            <Radio className={`w-3 h-3 ${isWeatherLive ? 'text-emerald-400' : 'text-amber-300'}`} />
            <span className="font-medium">{isWeatherLive ? 'Live API' : 'Calibrated'}</span>
          </div>

          {/* Refresh button */}
          <button
            onClick={onRefresh}
            aria-label="Refresh telemetry feeds"
            title="Refresh weather and river telemetry"
            className="hidden sm:inline-flex p-1.5 rounded bg-[#163359] hover:bg-[#1f4370] text-blue-200 hover:text-white border border-[#2b5280] transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-200' : ''}`} />
          </button>

          {/* Language Toggle */}
          <button
            onClick={onToggleLanguage}
            aria-label="Toggle language between English and Hindi"
            className="px-2 py-1 rounded text-xs font-bold bg-[#163359] hover:bg-[#1f4370] text-blue-200 hover:text-white border border-[#2b5280] transition-colors"
            title="Switch Language"
          >
            {language === 'EN' ? 'हिन्दी' : 'EN'}
          </button>

          {/* Emergency SOS Control */}
          <button
            onClick={onOpenSosModal}
            aria-label="Emergency Helplines Dispatch"
            className="flex items-center gap-1 px-2 py-1 rounded bg-red-700 hover:bg-red-600 text-white text-xs font-bold border border-red-800 shadow-sm transition-colors active:scale-95"
          >
            <PhoneCall className="w-3 h-3" />
            <span className="font-mono tracking-tight text-[11px] sm:text-xs">SOS 112</span>
          </button>
        </div>
      </div>
    </header>
  );
};
