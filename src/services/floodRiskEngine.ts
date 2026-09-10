import { FloodBasin, RiverGauge, WeatherData, SimulationParams, FloodRiskAssessment, RiskLevel } from '../types';

export function calculateFloodRisk(
  basin: FloodBasin,
  gauges: RiverGauge[],
  weather: WeatherData,
  simParams?: SimulationParams
): FloodRiskAssessment {
  // 1. Apply simulation overrides if present
  const sim = simParams || {
    rainfallMultiplier: 1.0,
    additionalRainfallMm: 0,
    damWaterRelease: false,
    damDischargeIncreaseM: 0,
    drainageEfficiency: 100
  };

  const effectiveRainfall24h = (weather.currentRainfallMm + sim.additionalRainfallMm) * sim.rainfallMultiplier;
  const effectiveForecast24h = weather.forecast24hMm * sim.rainfallMultiplier;
  const effectiveForecast72h = weather.forecast72hMm * sim.rainfallMultiplier;

  // 2. Hydrological Factor (Weight: 35%)
  // Integrates stage proximity to Danger Level, rate of rise (m/hr), and discharge
  let maxRiverStress = 0;
  let primaryGaugeInfo = { name: 'River Station', level: 0, danger: 0, diff: 0, rate: 0 };

  if (gauges.length > 0) {
    const stressLevels = gauges.map((g) => {
      const extraDamLevel = sim.damWaterRelease ? sim.damDischargeIncreaseM : 0;
      const simulatedCurrentLevel = g.currentLevelM + extraDamLevel;
      const simulatedDiffFromDanger = simulatedCurrentLevel - g.dangerLevelM;
      const simulatedRateOfChange = sim.damWaterRelease ? g.rateOfChangeMPerHour + 0.15 : g.rateOfChangeMPerHour;

      const span = Math.max(0.4, g.dangerLevelM - g.warningLevelM);
      let stationScore = 0;

      if (simulatedCurrentLevel >= g.dangerLevelM) {
        // Exceeded danger level: scale 85 to 100 based on Highest Flood Level
        const hflSpan = Math.max(0.5, g.highestFloodLevelM - g.dangerLevelM);
        const overDangerRatio = (simulatedCurrentLevel - g.dangerLevelM) / hflSpan;
        const rateBonus = Math.min(10, Math.max(0, simulatedRateOfChange * 50));
        stationScore = Math.min(100, 85 + overDangerRatio * 10 + rateBonus);
      } else if (simulatedCurrentLevel >= g.warningLevelM) {
        // Between warning and danger: scale 50 to 85
        const ratio = (simulatedCurrentLevel - g.warningLevelM) / span;
        const trendBonus = g.trend === 'rising' ? 8 : (g.trend === 'falling' ? -6 : 0);
        const rateBonus = Math.min(8, Math.max(0, simulatedRateOfChange * 40));
        stationScore = Math.min(84, Math.max(50, 50 + ratio * 28 + trendBonus + rateBonus));
      } else {
        // Below warning level: scale 10 to 49
        const distToWarning = g.warningLevelM - simulatedCurrentLevel;
        const baseScore = Math.max(10, 42 - distToWarning * 14);
        stationScore = Math.min(49, baseScore);
      }

      return { score: stationScore, gauge: g, simulatedLevel: simulatedCurrentLevel, diff: simulatedDiffFromDanger, rate: simulatedRateOfChange };
    });

    // Find the gauge experiencing maximum hydraulic stress
    const worst = stressLevels.reduce((prev, curr) => (curr.score > prev.score ? curr : prev), stressLevels[0]);
    maxRiverStress = worst.score;
    primaryGaugeInfo = {
      name: worst.gauge.stationName,
      level: Number(worst.simulatedLevel.toFixed(2)),
      danger: worst.gauge.dangerLevelM,
      diff: Number(worst.diff.toFixed(2)),
      rate: Number(worst.rate.toFixed(2))
    };
  } else {
    maxRiverStress = 35;
  }
  const hydrologyScore = Math.min(100, Math.max(0, Math.round(maxRiverStress)));

  // 3. Meteorological Factor (Weight: 30%)
  // IMD criteria: >64.5mm Heavy, >115.5mm Very Heavy, >204.5mm Extremely Heavy
  const rainObservedScore = Math.min(35, (effectiveRainfall24h / 150) * 35);
  const rainForecast24hScore = Math.min(25, (effectiveForecast24h / 150) * 25);
  const forecast72hScore = Math.min(25, (effectiveForecast72h / 250) * 25);
  const soilMoistureScore = (weather.soilMoisturePercent / 100) * 15;
  const rawWeatherScore = rainObservedScore + rainForecast24hScore + forecast72hScore + soilMoistureScore;
  const weatherScore = Math.min(100, Math.max(0, Math.round(rawWeatherScore)));

  // 4. Topographical Vulnerability (Weight: 20%)
  // Lower elevation = higher susceptibility; flat slope (<1%) = severe water accumulation
  // Coastal/alluvial depressions (elevation < 15m) receive elevation penalty
  const elevationVulnerability = Math.min(30, Math.max(5, (100 - Math.min(100, basin.averageElevationM)) * 0.30));
  const slopePenalty = Math.max(0, (2.5 - Math.min(2.5, basin.slopeGradientPercent)) / 2.5) * 40; // 0 to 40
  const drainagePenalty = (1 - basin.soilDrainageIndex) * 20; // 0 to 20
  const urbanOrFlatPenalty = (100 - sim.drainageEfficiency) * 0.10; // 0 to 10
  const rawTopoScore = elevationVulnerability + slopePenalty + drainagePenalty + urbanOrFlatPenalty;
  const topographyScore = Math.min(100, Math.max(0, Math.round(rawTopoScore)));

  // 5. Historical Flood Susceptibility (Weight: 15%)
  // Sourced from NDMA & State Disaster Authority decadal recurrence records
  const historicalScore = Math.min(100, Math.max(0, Math.round(basin.historicalFloodScore)));

  // Exact component weighted contributions (rounded to 1 decimal place)
  const hydrologyContribution = Number((hydrologyScore * 0.35).toFixed(1));
  const weatherContribution = Number((weatherScore * 0.30).toFixed(1));
  const topographyContribution = Number((topographyScore * 0.20).toFixed(1));
  const historicalContribution = Number((historicalScore * 0.15).toFixed(1));

  // 6. Multi-Criteria Composite Fusion (strictly equals sum of contributions)
  const compositeScore = (
    hydrologyContribution +
    weatherContribution +
    topographyContribution +
    historicalContribution
  );

  const overallScore = Math.min(100, Math.max(0, Math.round(compositeScore)));

  // 7. Dynamic Early Warning Classification (0-25 LOW, 26-50 MODERATE, 51-75 HIGH, 76-100 SEVERE)
  let riskLevel: RiskLevel = 'LOW';
  let colorCode = '#10B981'; // Emerald
  let alertHeadline = 'NORMAL VIGILANCE: River Within Safe Embankments';
  let actionSummary = `Hydrological and weather indicators in ${basin.name} are within normal seasonal tolerance. No immediate inundation detected.`;
  let expectedRiskWindow = 'Next 48 to 72 Hours';
  let primaryDriver = 'Normal Seasonal Baseflow';

  let recommendedActions: string[] = [
    'Maintain routine daily monitoring of local catchment channels.',
    'Inspect household 72-hour emergency go-bags and essential family documents.',
    'Review district disaster authority emergency contacts (112, 1070).'
  ];

  let roadsToAvoid: string[] = [
    'Low-elevation riverbed crossing causeways during night hours'
  ];

  let evacuationCorridors: string[] = [
    'Standard State Highways & District Arterial Roads (Clear)'
  ];

  if (overallScore >= 76) {
    riskLevel = 'SEVERE';
    colorCode = '#EF4444'; // Red
    alertHeadline = `CRITICAL RED ALERT: Imminent Inundation along ${basin.riverName}`;
    actionSummary = `River stage at ${primaryGaugeInfo.name} is breaching danger threshold (Δ ${primaryGaugeInfo.diff > 0 ? '+' : ''}${primaryGaugeInfo.diff}m, rate: ${primaryGaugeInfo.rate > 0 ? '+' : ''}${primaryGaugeInfo.rate}m/hr) with severe rainfall saturation. Immediate floodplain evacuation strongly advised.`;
    expectedRiskWindow = 'Next 4 to 12 Hours (Imminent Peak)';
    primaryDriver = primaryGaugeInfo.diff >= 0 ? 'River Stage Over Danger Mark' : 'Extreme Catchment Precipitation Surge';

    recommendedActions = [
      'IMMEDIATE DIRECTIVE: Execute rapid evacuation of riverbank habitations and low-lying wards.',
      'Open and activate designated elevated relief camps immediately with power & water backup.',
      'Deploy NDRF / SDRF motorized rescue boat teams and high-clearance emergency transport.',
      'Disconnect power grids in submerged low-lying transformers to eliminate electrocution risks.',
      'Call emergency helpline 112 or District Control Room 1077 for urgent rescue assistance.'
    ];

    roadsToAvoid = [
      'Riverbank service roads and low-lying bypass bunds',
      'Submerged railway underpasses and culvert crossings',
      'Areas within 500 meters of unreinforced earthen river embankments'
    ];

    evacuationCorridors = [
      'Designated High-Ridge Highways towards elevated relief centers',
      'Inter-district National Highway bypasses'
    ];
  } else if (overallScore >= 51) {
    riskLevel = 'HIGH';
    colorCode = '#F97316'; // Orange
    alertHeadline = `ORANGE WARNING: Rapidly Rising Flood Waters in ${basin.name}`;
    actionSummary = `River volume is approaching critical danger mark at ${primaryGaugeInfo.name} (Δ ${primaryGaugeInfo.diff}m) combined with heavy forecasted precipitation (${effectiveForecast24h.toFixed(1)}mm / 24h). Localized floodplain inundation expected.`;
    expectedRiskWindow = 'Next 12 to 24 Hours';
    primaryDriver = effectiveRainfall24h > 100 ? 'Heavy Monsoon Precipitation' : 'Upstream Discharge Accumulation';

    recommendedActions = [
      'Place Quick Response Teams (QRT) and village disaster volunteers on 2-hour alert.',
      'Advise residents in riverine chars/diaras to secure livestock, rations, and move to designated high ground.',
      'Deploy municipal suction pumps at urban drainage choke-points and inspect sluice gates.',
      'Stock potable drinking water, ORS packets, and emergency medicine kits in flood shelters.'
    ];

    roadsToAvoid = [
      'Low-lying agricultural access paths and riverbed roads',
      'Unpaved floodway causeways experiencing overflow'
    ];

    evacuationCorridors = [
      'Paved District Arterials leading to designated community shelters'
    ];
  } else if (overallScore >= 26) {
    riskLevel = 'MODERATE';
    colorCode = '#F59E0B'; // Amber
    alertHeadline = `YELLOW ADVISORY: Heightened Water Inflow in ${basin.riverName}`;
    actionSummary = `River volume is elevated at ${primaryGaugeInfo.name} due to upstream rainfall runoff. Low-lying agricultural lands and chars may experience localized waterlogging.`;
    expectedRiskWindow = 'Next 24 to 48 Hours';
    primaryDriver = 'Upstream Runoff & Soil Saturation';

    recommendedActions = [
      'Maintain 6-hourly telemetry monitoring at upstream and barrage gauge stations.',
      'Fishermen and small boat commuters advised against venturing into deep river channels.',
      'Verify emergency food stocks and medical kits at local panchayat shelters.'
    ];

    roadsToAvoid = [
      'Low riverbank walking paths and seasonal sand-bar ferries'
    ];

    evacuationCorridors = [
      'Standard arterial village roads (Operating normally)'
    ];
  }

  // 8. Plain-Language Explainable AI Sentence (Task 6)
  const riverContext = primaryGaugeInfo.diff >= 0
    ? `river level at ${primaryGaugeInfo.name} is breaching the CWC danger threshold by +${primaryGaugeInfo.diff}m (rising at ${primaryGaugeInfo.rate}m/hr)`
    : `river level at ${primaryGaugeInfo.name} is ${Math.abs(primaryGaugeInfo.diff)}m below the danger mark (trend: ${primaryGaugeInfo.rate >= 0 ? '+' : ''}${primaryGaugeInfo.rate}m/hr)`;

  const rainContext = effectiveRainfall24h >= 100
    ? `heavy precipitation (${effectiveRainfall24h.toFixed(0)}mm in 24h, 72h forecast: ${effectiveForecast72h.toFixed(0)}mm)`
    : `moderate rainfall (${effectiveRainfall24h.toFixed(0)}mm in 24h)`;

  const topoContext = basin.averageElevationM <= 20
    ? `critically low elevation (${basin.averageElevationM}m MSL) and flat drainage slope (${basin.slopeGradientPercent}%)`
    : `elevation of ${basin.averageElevationM}m MSL with ${basin.slopeGradientPercent}% drainage gradient`;

  const explanationSentence = `Flood Risk Index is ${overallScore}/100 (${riskLevel}) because ${riverContext}, combined with ${rainContext}, ${topoContext}, and a historical flood vulnerability rating of ${basin.historicalFloodScore}/100 in the ${basin.name}.`;

  // 9. Confidence & Uncertainty Scoring (Task 7)
  // Confidence is high when weather API is live and gauges are active; slightly reduced on offline fallback
  const confidenceScore = weather.isLiveApi ? 88 : 72;
  const confidenceTier: 'HIGH' | 'MODERATE' | 'LOW' = weather.isLiveApi ? 'HIGH' : 'MODERATE';
  const confidenceRationale = weather.isLiveApi
    ? 'High confidence: Driven by live Open-Meteo precipitation query + deterministic CWC gauge telemetry. Subject to ±10% spatial elevation interpolation margin.'
    : 'Moderate confidence: Using calibrated historical baseline weather and benchmark CWC telemetry. Connect to live internet for real-time forecast precision.';

  // Estimated inundation area based on score and catchment size
  const inundationAreaSqKm = Math.round((overallScore / 100) * (basin.catchmentAreaSqKm * 0.008) * 10) / 10;

  // Estimated time to peak (hours)
  const estimatedTimeToPeakHours = overallScore >= 76 ? 6 : (overallScore >= 51 ? 14 : (overallScore >= 26 ? 36 : 72));

  return {
    basinId: basin.id,
    overallScore,
    riskLevel,
    colorCode,
    breakdown: {
      hydrologyScore,
      hydrologyContribution,
      weatherScore,
      weatherContribution,
      topographyScore,
      topographyContribution,
      historicalScore,
      historicalContribution
    },
    inundationAreaSqKm,
    estimatedTimeToPeakHours,
    expectedRiskWindow,
    alertHeadline,
    actionSummary,
    explanationSentence,
    primaryDriver,
    confidenceScore,
    confidenceTier,
    confidenceRationale,
    recommendedActions,
    roadsToAvoid,
    evacuationCorridors
  };
}
