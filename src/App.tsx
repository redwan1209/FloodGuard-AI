import React, { useState, useEffect, useMemo } from 'react';
import { FloodBasin, RiverGauge, WeatherData, SimulationParams, Shelter } from './types';
import { FLOOD_BASINS, RIVER_GAUGES } from './data/basins';
import { SHELTERS } from './data/shelters';
import { fetchLiveWeather } from './services/weatherService';
import { calculateFloodRisk } from './services/floodRiskEngine';
import { rankSheltersForLocation } from './services/evacuationEngine';

import { Navbar } from './components/layout/Navbar';
import { SafetyBanner } from './components/layout/SafetyBanner';
import { TabNav, ActiveTab } from './components/layout/TabNav';
import { SosModal } from './components/layout/SosModal';

import { MetricCards } from './components/dashboard/MetricCards';
import { RiskScoreCard } from './components/dashboard/RiskScoreCard';
import { FactorBreakdown } from './components/dashboard/FactorBreakdown';
import { AlertBroadcast } from './components/dashboard/AlertBroadcast';
import { JudgeDemoGuide } from './components/dashboard/JudgeDemoGuide';

import { FloodMap } from './components/map/FloodMap';
import { HydrographChart } from './components/analytics/HydrographChart';
import { RainfallChart } from './components/analytics/RainfallChart';
import { HistoricalEventsCard } from './components/analytics/HistoricalEventsCard';

import { ShelterList } from './components/evacuation/ShelterList';
import { SurvivalKit } from './components/evacuation/SurvivalKit';
import { EvacuationPass } from './components/evacuation/EvacuationPass';

import { ScenarioSimulator } from './components/simulator/ScenarioSimulator';
import { EmergencyHelplines } from './components/about/EmergencyHelplines';
import { DeveloperProfile } from './components/about/DeveloperProfile';
import { MethodologyModal } from './components/about/MethodologyModal';

const DEFAULT_SIM: SimulationParams = {
  rainfallMultiplier: 1.0,
  additionalRainfallMm: 0,
  damWaterRelease: false,
  damDischargeIncreaseM: 0,
  drainageEfficiency: 100
};

export const App: React.FC = () => {
  const [selectedBasin, setSelectedBasin] = useState<FloodBasin>(FLOOD_BASINS[0]);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);
  const [language, setLanguage] = useState<'EN' | 'HI'>('EN');
  const [simParams, setSimParams] = useState<SimulationParams>(DEFAULT_SIM);

  // Basin river gauges
  const basinGauges = useMemo(() => {
    return RIVER_GAUGES.filter((g) => g.basinId === selectedBasin.id);
  }, [selectedBasin.id]);

  // Basin shelters
  const basinShelters = useMemo(() => {
    return SHELTERS.filter((s) => s.basinId === selectedBasin.id);
  }, [selectedBasin.id]);

  // Fetch weather data for selected basin
  const loadWeather = async (basin: FloodBasin) => {
    setIsRefreshing(true);
    try {
      const data = await fetchLiveWeather(basin.id, basin.coordinates[0], basin.coordinates[1]);
      setWeather(data);
    } catch (e) {
      console.error('Failed to load weather:', e);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadWeather(selectedBasin);
    setSimParams(DEFAULT_SIM); // reset simulation on basin switch
  }, [selectedBasin]);

  // Baseline risk assessment (no simulation)
  const baselineAssessment = useMemo(() => {
    if (!weather) return null;
    return calculateFloodRisk(selectedBasin, basinGauges, weather, DEFAULT_SIM);
  }, [selectedBasin, basinGauges, weather]);

  // Current active assessment (with simulation if any)
  const currentAssessment = useMemo(() => {
    if (!weather) return null;
    return calculateFloodRisk(selectedBasin, basinGauges, weather, simParams);
  }, [selectedBasin, basinGauges, weather, simParams]);

  // Ranked shelters
  const rankedShelters = useMemo(() => {
    return rankSheltersForLocation(basinShelters, selectedBasin.coordinates, currentAssessment);
  }, [basinShelters, selectedBasin.coordinates, currentAssessment]);

  if (!weather || !currentAssessment || !baselineAssessment) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold tracking-wide">Initializing FloodGuard AI Hydrological Engine...</p>
        <p className="text-xs text-slate-500 mt-1">Connecting to CWC India gauges and Open-Meteo feeds</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-white">
      {/* Top Prototype Disclaimer Banner */}
      <SafetyBanner onOpenMethodology={() => setIsMethodologyOpen(true)} language={language} />

      {/* Main Navbar */}
      <Navbar
        selectedBasin={selectedBasin}
        onSelectBasin={(b) => setSelectedBasin(b)}
        riskAssessment={currentAssessment}
        isWeatherLive={weather.isLiveApi}
        isRefreshing={isRefreshing}
        onRefresh={() => loadWeather(selectedBasin)}
        onOpenSosModal={() => setIsSosOpen(true)}
        language={language}
        onToggleLanguage={() => setLanguage(language === 'EN' ? 'HI' : 'EN')}
      />

      {/* View Switcher Tabs */}
      <TabNav activeTab={activeTab} onChangeTab={setActiveTab} language={language} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Tab 1: Live Monitor & Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* 2-Minute Judge Demo Experience Tour (Phase 6) */}
            <JudgeDemoGuide
              basin={selectedBasin}
              assessment={currentAssessment}
              isSimulated={
                simParams.additionalRainfallMm !== 0 ||
                simParams.rainfallMultiplier !== 1 ||
                simParams.damWaterRelease ||
                simParams.drainageEfficiency !== 100
              }
              onApplyScenario={(params) => setSimParams(params)}
              onResetScenario={() => setSimParams(DEFAULT_SIM)}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />

            {/* Top Metric Cards */}
            <MetricCards
              basin={selectedBasin}
              gauges={basinGauges}
              weather={weather}
              assessment={currentAssessment}
            />

            {/* Circular Risk Score & Recommendation Card */}
            <RiskScoreCard
              assessment={currentAssessment}
              basin={selectedBasin}
              onNavigateToEvac={() => setActiveTab('evacuation')}
              onNavigateToMap={() => setActiveTab('map')}
            />

            {/* 4-Pillar MCDA Factor Breakdown */}
            <FactorBreakdown
              assessment={currentAssessment}
              basin={selectedBasin}
              gauges={basinGauges}
              weather={weather}
            />

            {/* Public Advisory Dispatch Card */}
            <AlertBroadcast
              assessment={currentAssessment}
              basin={selectedBasin}
              gauges={basinGauges}
            />
          </div>
        )}

        {/* Tab 2: Interactive Hazard Map */}
        {activeTab === 'map' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-white">
                  {selectedBasin.name} — Geospatial Hazard Map
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Interactive spatial layers showing CWC telemetry gauges, inundation buffers, and designated relief shelters
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                Basin Catchment: {selectedBasin.catchmentAreaSqKm.toLocaleString()} km²
              </span>
            </div>

            <FloodMap
              basin={selectedBasin}
              gauges={basinGauges}
              shelters={basinShelters}
              assessment={currentAssessment}
              onSelectShelter={() => setActiveTab('evacuation')}
            />
          </div>
        )}

        {/* Tab 3: Basin Analytics & Telemetry */}
        {activeTab === 'analytics' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <h2 className="text-xl font-bold text-white">
                Hydrological & Meteorological Telemetry
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Time-series hydrographs, CWC danger thresholds, and 72-hour precipitation forecast curves
              </p>
            </div>

            {/* River Hydrographs for all gauges in this basin */}
            <div className="space-y-6">
              {basinGauges.map((g) => (
                <HydrographChart key={g.id} gauge={g} />
              ))}
            </div>

            {/* Rainfall & Soil Saturation */}
            <RainfallChart weather={weather} />

            {/* Documented Historical Flood Events Atlas (Task 5) */}
            <HistoricalEventsCard basin={selectedBasin} />
          </div>
        )}

        {/* Tab 4: Evacuation & Safe Shelters */}
        {activeTab === 'evacuation' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <h2 className="text-xl font-bold text-white">
                Disaster Evacuation & Shelter Center
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Designated high-ground relief camps, 72-hour survival grab-bag checklist, and priority evacuation passes
              </p>
            </div>

            {/* Safe Shelters Grid with Risk-Linked Corridors */}
            <ShelterList shelters={rankedShelters} assessment={currentAssessment} />

            {/* 72-Hour Survival Kit Readiness */}
            <SurvivalKit />

            {/* Priority Evacuation Pass Generator */}
            <EvacuationPass basin={selectedBasin} shelters={basinShelters} />
          </div>
        )}

        {/* Tab 5: Scenario Simulator (What-If) */}
        {activeTab === 'simulator' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <ScenarioSimulator
              basin={selectedBasin}
              simParams={simParams}
              onChangeParams={setSimParams}
              onReset={() => setSimParams(DEFAULT_SIM)}
              assessment={currentAssessment}
              baselineScore={baselineAssessment.overallScore}
              onNavigateToMap={() => setActiveTab('map')}
              onNavigateToEvac={() => setActiveTab('evacuation')}
            />
          </div>
        )}

        {/* Tab 6: Methodology & Helplines */}
        {activeTab === 'about' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Developer Profile Section */}
            <DeveloperProfile />

            {/* Official Disaster Helplines Directory */}
            <EmergencyHelplines />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900/80 border-t border-slate-800/90 py-8 mt-12 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span className="font-bold text-white text-sm">FloodGuard AI</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300">AI-Powered Flood Prediction & Decision Support System</span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Engine Operational
              </span>
            </div>

            <nav className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs" aria-label="Footer Navigation">
              <button
                onClick={() => setActiveTab('about')}
                className="text-slate-400 hover:text-cyan-400 transition-colors font-medium"
              >
                Developer Profile
              </button>
              <span className="text-slate-600">•</span>
              <button
                onClick={() => setIsMethodologyOpen(true)}
                className="text-slate-400 hover:text-cyan-400 transition-colors font-medium"
              >
                Methodology & Data Sources
              </button>
              <span className="text-slate-600">•</span>
              <button
                onClick={() => setIsSosOpen(true)}
                className="text-red-400 hover:text-red-300 font-bold transition-colors"
              >
                Emergency Helplines (112)
              </button>
            </nav>
          </div>

          <div className="pt-4 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
            <p>
              Hackathon prototype intended for research & demonstration. Data calibrated on Open-Meteo, CWC benchmarks, and SRTM DEM datasets.
            </p>
            <p className="shrink-0">
              Always comply with official directives from IMD, CWC, and NDMA.
            </p>
          </div>
        </div>
      </footer>

      {/* SOS Modal */}
      <SosModal
        isOpen={isSosOpen}
        onClose={() => setIsSosOpen(false)}
        basin={selectedBasin}
      />

      {/* Methodology Modal */}
      <MethodologyModal
        isOpen={isMethodologyOpen}
        onClose={() => setIsMethodologyOpen(false)}
      />
    </div>
  );
};
