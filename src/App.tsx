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
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center text-slate-700">
        <div className="w-10 h-10 border-3 border-[#0f2744] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-bold text-slate-900 tracking-tight">Initializing FloodGuard AI Hydrological Engine...</p>
        <p className="text-xs text-slate-500 mt-1">Connecting to CWC India gauges and Open-Meteo feeds</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900 selection:bg-blue-600 selection:text-white overflow-x-hidden w-full">
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
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-5 space-y-5">
        {/* Tab 1: Live Monitor & Dashboard (Overview & GIS Map Hero) */}
        {activeTab === 'dashboard' && (
          <div className="space-y-3.5 sm:space-y-4 animate-in fade-in duration-300">
            {/* Operational Verification Protocol */}
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

            {/* Primary GIS Flood Map Hero Workspace */}
            <FloodMap
              basin={selectedBasin}
              gauges={basinGauges}
              shelters={basinShelters}
              assessment={currentAssessment}
              onSelectShelter={() => setActiveTab('evacuation')}
            />

            {/* CWC River Gauge Monitoring Stations Table & Metrics */}
            <MetricCards
              basin={selectedBasin}
              gauges={basinGauges}
              weather={weather}
              assessment={currentAssessment}
            />

            {/* Risk Assessment Report & MCDA Factor Breakdown Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <div className="lg:col-span-5">
                <RiskScoreCard
                  assessment={currentAssessment}
                  basin={selectedBasin}
                  onNavigateToEvac={() => setActiveTab('evacuation')}
                  onNavigateToMap={() => setActiveTab('map')}
                />
              </div>
              <div className="lg:col-span-7">
                <FactorBreakdown
                  assessment={currentAssessment}
                  basin={selectedBasin}
                  gauges={basinGauges}
                  weather={weather}
                />
              </div>
            </div>

            {/* Public Advisory Dispatch Card */}
            <AlertBroadcast
              assessment={currentAssessment}
              basin={selectedBasin}
              gauges={basinGauges}
            />
          </div>
        )}

        {/* Tab 2: Interactive Hazard Map (Dedicated Full View) */}
        {activeTab === 'map' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  {selectedBasin.name} — Geospatial Hydrological Hazard Map
                </h2>
                <p className="text-xs text-slate-500">
                  Interactive spatial layers showing CWC telemetry gauges, modeled inundation footprints, and high-ground shelters
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200">
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
          <div className="space-y-5 animate-in fade-in duration-300">
            <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Hydrological & Meteorological Telemetry Records
              </h2>
              <p className="text-xs text-slate-500">
                Calibrated CWC hydrographs, warning & danger marks, and 72-hour precipitation forecast curves
              </p>
            </div>

            {/* River Hydrographs for all gauges in this basin */}
            <div className="space-y-5">
              {basinGauges.map((g) => (
                <HydrographChart key={g.id} gauge={g} />
              ))}
            </div>

            {/* Rainfall & Soil Saturation */}
            <RainfallChart weather={weather} />

            {/* Documented Historical Flood Events Atlas */}
            <HistoricalEventsCard basin={selectedBasin} />
          </div>
        )}

        {/* Tab 4: Evacuation & Safe Shelters */}
        {activeTab === 'evacuation' && (
          <div className="space-y-5 animate-in fade-in duration-300">
            <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Disaster Evacuation & Relief Shelter Management
              </h2>
              <p className="text-xs text-slate-500">
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
          <div className="space-y-5 animate-in fade-in duration-300">
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
          <div className="space-y-5 animate-in fade-in duration-300">
            {/* Developer Profile Section */}
            <DeveloperProfile />

            {/* Official Disaster Helplines Directory */}
            <EmergencyHelplines />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-10 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-sm">FloodGuard AI</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600">Hydrological Risk Monitoring & Early Warning Platform</span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                Engine Operational
              </span>
            </div>

            <nav className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs" aria-label="Footer Navigation">
              <button
                onClick={() => setActiveTab('about')}
                className="text-slate-600 hover:text-blue-800 transition-colors font-medium"
              >
                Developer Profile
              </button>
              <span className="text-slate-300">•</span>
              <button
                onClick={() => setIsMethodologyOpen(true)}
                className="text-slate-600 hover:text-blue-800 transition-colors font-medium"
              >
                Methodology & Data Provenance
              </button>
              <span className="text-slate-300">•</span>
              <button
                onClick={() => setIsSosOpen(true)}
                className="text-red-700 hover:text-red-800 font-bold transition-colors"
              >
                Emergency SOS (112)
              </button>
            </nav>
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
            <p>
              Decision-support prototype calibrated with Open-Meteo numerical weather predictions, CWC station benchmarks, and SRTM 30m DEM elevation data.
            </p>
            <p className="shrink-0">
              Follow official directives issued by IMD, CWC, and NDMA for active emergency response.
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
