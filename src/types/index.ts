// Types for FloodGuard AI
// Data Provenance Tags
export type DataSourceType = 'LIVE_API' | 'PUBLIC_DATASET' | 'STATIC_DATA' | 'SIMULATED' | 'CALCULATED';

export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'SEVERE';

export interface HistoricalFloodEvent {
  year: number;
  floodLevelM?: number;
  populationDisplacedLakhs: number;
  severity: 'MODERATE' | 'SEVERE' | 'CATASTROPHIC';
  keyCause: string;
  summary: string;
  sourceCitation: string;
}

export interface FloodBasin {
  id: string;
  name: string;
  state: string;
  riverName: string;
  coordinates: [number, number]; // [lat, lng]
  zoom: number;
  averageElevationM: number;
  minElevationM: number;
  slopeGradientPercent: number; // Low slope (<2%) = water stagnation
  soilDrainageIndex: number; // 0 (clay/impervious) to 1 (high drainage)
  catchmentAreaSqKm: number;
  vulnerablePopulation: number;
  historicalRecurrenceYears: number; // e.g. 1.5 years = frequent
  historicalFloodScore: number; // 0 - 100 baseline vulnerability
  description: string;
  historicalEvents: HistoricalFloodEvent[];
  elevationProfileSource: string;
  demResolution: string;
}

export interface RiverGauge {
  id: string;
  basinId: string;
  stationName: string;
  riverName: string;
  coordinates: [number, number];
  currentLevelM: number;
  warningLevelM: number;
  dangerLevelM: number;
  highestFloodLevelM: number;
  diffFromDangerM: number; // current - danger (positive = breached)
  rateOfChangeMPerHour: number; // e.g. +0.08 m/hr
  flowDischargeCusecs: number;
  trend: 'rising' | 'falling' | 'stable';
  lastUpdated: string;
  telemetryType: DataSourceType; // 'SIMULATED' | 'STATIC_DATA'
  telemetrySource: string;
}

export interface WeatherData {
  basinId: string;
  currentRainfallMm: number; // mm in last 24h
  recent6hRainfallMm: number; // short-term observed
  forecast24hMm: number;
  forecast72hMm: number;
  precipitationProbability: number;
  rainfallTrend: 'increasing' | 'decreasing' | 'steady';
  soilMoisturePercent: number;
  temperatureC: number;
  humidityPercent: number;
  isLiveApi: boolean;
  weatherSource: string;
  lastUpdated: string;
}

export interface FactorBreakdown {
  weatherScore: number;         // 0-100 (raw subscore)
  weatherContribution: number;  // points contributed to FRI (weatherScore * 0.30)
  hydrologyScore: number;       // 0-100 (raw subscore)
  hydrologyContribution: number;// points contributed to FRI (hydrologyScore * 0.35)
  topographyScore: number;      // 0-100 (raw subscore)
  topographyContribution: number;// points contributed to FRI (topographyScore * 0.20)
  historicalScore: number;      // 0-100 (raw subscore)
  historicalContribution: number;// points contributed to FRI (historicalScore * 0.15)
}

export interface FloodRiskAssessment {
  basinId: string;
  overallScore: number; // 0 to 100
  riskLevel: RiskLevel;
  colorCode: string;
  breakdown: FactorBreakdown;
  inundationAreaSqKm: number;
  estimatedTimeToPeakHours: number;
  expectedRiskWindow: string;
  alertHeadline: string;
  actionSummary: string;
  explanationSentence: string; // Plain-language explainable AI sentence
  primaryDriver: string;
  confidenceScore: number; // 0 - 100%
  confidenceTier: 'HIGH' | 'MODERATE' | 'LOW';
  confidenceRationale: string;
  recommendedActions: string[];
  roadsToAvoid: string[];
  evacuationCorridors: string[];
}

export interface Shelter {
  id: string;
  basinId: string;
  name: string;
  type: 'School' | 'Community Hall' | 'Stadium' | 'Hospital' | 'High-Ground Camp';
  coordinates: [number, number];
  elevationM: number;
  safetyMarginAboveFloodM: number;
  totalCapacity: number;
  currentOccupancy: number;
  hasMedicalPost: boolean;
  hasCleanWater: boolean;
  hasPowerBackup: boolean;
  contactPhone: string;
  contactPerson: string;
  roadAccessibility: 'CLEAR' | 'CAUTION' | 'FLOODED';
  shelterDataSource?: string;
}

export interface EmergencyContact {
  id: string;
  agency: string;
  name: string;
  state: string;
  phone: string;
  altPhone?: string;
  type: 'NDRF' | 'State EOC' | 'District Collector' | 'Ambulance' | 'Police' | 'Fire & Rescue';
  jurisdiction: string;
  available24x7: boolean;
}

export interface SimulationParams {
  rainfallMultiplier: number; // 0.5 to 3.0
  additionalRainfallMm: number; // 0 to 200 mm
  damWaterRelease: boolean;
  damDischargeIncreaseM: number; // 0 to 4.0 meters
  drainageEfficiency: number; // 20% to 100%
}
