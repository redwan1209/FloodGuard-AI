import { FloodBasin, RiverGauge } from '../types';

export const FLOOD_BASINS: FloodBasin[] = [
  {
    id: 'brahmaputra-assam',
    name: 'Brahmaputra Basin (Guwahati / Kaziranga)',
    state: 'Assam',
    riverName: 'Brahmaputra',
    coordinates: [26.182, 91.758], // Guwahati
    zoom: 10,
    averageElevationM: 54,
    minElevationM: 42,
    slopeGradientPercent: 0.8, // extremely flat alluvial floodplain
    soilDrainageIndex: 0.35, // low permeability alluvial silt
    catchmentAreaSqKm: 580000,
    vulnerablePopulation: 3450000,
    historicalRecurrenceYears: 1.2, // Floods almost annually
    historicalFloodScore: 92,
    description: 'Braided transboundary river prone to catastrophic monsoon overflow, massive siltation, and embankment breaches impacting Kaziranga and lower Assam plains.',
    elevationProfileSource: 'Copernicus Global DEM / SRTM 30m Dataset',
    demResolution: '30m Spatial Grid',
    historicalEvents: [
      {
        year: 2020,
        floodLevelM: 50.85,
        populationDisplacedLakhs: 57.0,
        severity: 'CATASTROPHIC',
        keyCause: 'Continuous monsoon downpours across Arunachal & Assam catchments; 85% of Kaziranga National Park submerged.',
        summary: 'Massive flood wave displaced 5.7 million people across 30 districts; multiple embankment breaches along southern Brahmaputra bank.',
        sourceCitation: 'Assam State Disaster Management Authority (ASDMA) 2020 Flood Report'
      },
      {
        year: 2012,
        floodLevelM: 51.10,
        populationDisplacedLakhs: 38.0,
        severity: 'SEVERE',
        keyCause: 'Triple peak flood waves triggered by monsoon depressions in Bay of Bengal.',
        summary: 'Over 2,200 villages inundated, 124 human casualties, extensive erosion in Majuli Island riverine tract.',
        sourceCitation: 'Central Water Commission (CWC) Assam Basin Monograph'
      },
      {
        year: 1988,
        floodLevelM: 51.46,
        populationDisplacedLakhs: 42.0,
        severity: 'CATASTROPHIC',
        keyCause: 'All-time Record Highest Flood Level (HFL) at Pandu gauge.',
        summary: 'Historic flood crest reached 51.46m MSL; severed Guwahati-North Guwahati transportation corridors for 18 days.',
        sourceCitation: 'CWC Historical Gauge Register (Pandu Station 1988)'
      }
    ]
  },
  {
    id: 'kosi-bihar',
    name: 'Kosi-Ganga Basin (Saharsa / Supaul)',
    state: 'Bihar',
    riverName: 'Kosi River ("Sorrow of Bihar")',
    coordinates: [25.883, 86.600], // Saharsa / Kosi plain
    zoom: 10,
    averageElevationM: 45,
    minElevationM: 38,
    slopeGradientPercent: 0.5, // flat flood plain prone to course avulsion
    soilDrainageIndex: 0.28, // clayey alluvium with high water table
    catchmentAreaSqKm: 74500,
    vulnerablePopulation: 5200000,
    historicalRecurrenceYears: 1.4,
    historicalFloodScore: 95,
    description: 'Notorious dynamic river prone to avulsion and massive sediment load from Nepal Himalayas, leading to sudden extensive inundation across North Bihar.',
    elevationProfileSource: 'Survey of India Alluvial Topography & SRTM DEM',
    demResolution: '30m Spatial Grid',
    historicalEvents: [
      {
        year: 2008,
        floodLevelM: 75.80,
        populationDisplacedLakhs: 33.5,
        severity: 'CATASTROPHIC',
        keyCause: 'Breach of Kusaha eastern afflux embankment in Nepal upstream of Birpur barrage on 18 August 2008.',
        summary: 'Catastrophic river avulsion; Kosi carved a new course 120km eastward through Supaul, Madhepura, Saharsa, and Purnia, submerging 412 panchayats.',
        sourceCitation: 'National Disaster Management Authority (NDMA) Kosi Inquiry 2008'
      },
      {
        year: 2017,
        floodLevelM: 74.65,
        populationDisplacedLakhs: 85.0,
        severity: 'CATASTROPHIC',
        keyCause: 'Unprecedented Nepal Terai torrential cloudbursts causing flash deluge in Kosi, Gandak, and Mahananda tributaries.',
        summary: 'Deluged 19 districts in North Bihar; 514 fatalities; railway lines washed away between Darbhanga and Samastipur.',
        sourceCitation: 'Bihar State Disaster Management Authority (BSDMA) Annual Dossier 2017'
      },
      {
        year: 2019,
        floodLevelM: 74.30,
        populationDisplacedLakhs: 28.0,
        severity: 'SEVERE',
        keyCause: 'Birpur Barrage discharge exceeding 415,000 cusecs following catchment saturation.',
        summary: 'Extensive inundation of riverine diara islands; evacuation of 120,000 cattle to high embankments.',
        sourceCitation: 'Water Resources Department (WRD) Government of Bihar'
      }
    ]
  },
  {
    id: 'periyar-kerala',
    name: 'Periyar River Basin (Idukki / Aluva)',
    state: 'Kerala',
    riverName: 'Periyar',
    coordinates: [10.107, 76.351], // Aluva / Kochi Periyar delta
    zoom: 11,
    averageElevationM: 18,
    minElevationM: 4,
    slopeGradientPercent: 3.2, // steep upper catchment (Western Ghats), flat coastal delta
    soilDrainageIndex: 0.55, // lateritic soils
    catchmentAreaSqKm: 5398,
    vulnerablePopulation: 1850000,
    historicalRecurrenceYears: 3.0,
    historicalFloodScore: 78,
    description: 'Steep headwaters prone to intense orographic cloudbursts; dam reservoir releases (Idukki / Mullaperiyar) rapidly surge through coastal Ernakulam plains.',
    elevationProfileSource: 'CartoDEM / Bhuvan ISRO Kerala Elevation Dataset',
    demResolution: '30m Spatial Grid',
    historicalEvents: [
      {
        year: 2018,
        floodLevelM: 9.80,
        populationDisplacedLakhs: 14.5,
        severity: 'CATASTROPHIC',
        keyCause: '1-in-100 year torrential monsoon (164% above normal); simultaneous opening of 35 dams across Kerala.',
        summary: 'Aluva, Paravur, and Kochi airport inundated under 3-4m of water; 483 deaths; largest humanitarian rescue operation in modern Kerala history.',
        sourceCitation: 'Kerala State Disaster Management Authority (KSDMA) Post-Disaster Needs Assessment (PDNA)'
      },
      {
        year: 2019,
        floodLevelM: 7.60,
        populationDisplacedLakhs: 3.2,
        severity: 'SEVERE',
        keyCause: 'High-intensity isolated cloudbursts triggering Western Ghats debris flows and flash surges.',
        summary: 'Inundation of low-lying banks in Kalady and Aluva; 1,800 families shifted to relief camps.',
        sourceCitation: 'CWC Hydrological Studies Report (Southern Region)'
      },
      {
        year: 1924,
        floodLevelM: 11.20,
        populationDisplacedLakhs: 10.0,
        severity: 'CATASTROPHIC',
        keyCause: 'The Great Flood of 99 (Malayalam calendar 1099 ME).',
        summary: 'Historic deluge that reshaped the Periyar delta topography and created the modern Munambam bar.',
        sourceCitation: 'Imperial Gazette of Travancore Records'
      }
    ]
  },
  {
    id: 'mithi-mumbai',
    name: 'Mithi River Basin (Kurla / Bandra)',
    state: 'Maharashtra',
    riverName: 'Mithi River',
    coordinates: [19.072, 72.871], // Kurla / BKC
    zoom: 13,
    averageElevationM: 8,
    minElevationM: 2,
    slopeGradientPercent: 0.4, // low-lying urban coastal plain
    soilDrainageIndex: 0.15, // dense impervious concrete / urban runoff
    catchmentAreaSqKm: 108,
    vulnerablePopulation: 2900000,
    historicalRecurrenceYears: 2.0,
    historicalFloodScore: 84,
    description: 'Urban storm-water channel heavily choked by encroached floodplains; coincident spring high tides (>4.5m) prevent gravity discharge, causing flash urban floods.',
    elevationProfileSource: 'MCGM High-Resolution LiDAR Urban Elevation Grid',
    demResolution: '10m Spatial Grid',
    historicalEvents: [
      {
        year: 2005,
        floodLevelM: 4.80,
        populationDisplacedLakhs: 20.0,
        severity: 'CATASTROPHIC',
        keyCause: 'Extreme cloudburst (944mm rainfall in 24 hours on 26 July) combined with a 4.48m Arabian Sea spring high tide.',
        summary: 'Mithi breached its banks within 2 hours; Kurla, Kalina, and Mumbai Airport runway submerged; 1,094 lives lost across metropolitan Mumbai.',
        sourceCitation: 'Fact Finding Committee on Mumbai Floods (Chitale Committee 2006)'
      },
      {
        year: 2017,
        floodLevelM: 3.75,
        populationDisplacedLakhs: 4.5,
        severity: 'SEVERE',
        keyCause: '315mm downpour in 12 hours coincident with afternoon high tide on 29 August.',
        summary: 'Suburban railway lines paralyzed at Kurla-Sion bottleneck; Kranti Nagar slum evacuated by NDRF inflatable boats.',
        sourceCitation: 'MCGM Disaster Management Cell Annual Review 2017'
      },
      {
        year: 2019,
        floodLevelM: 3.65,
        populationDisplacedLakhs: 3.0,
        severity: 'SEVERE',
        keyCause: '400mm rainfall over 2 days with sluice gates at BKC partially choked.',
        summary: 'Precautionary evacuation of 1,200 residents from Kranti Nagar riverbanks to municipal schools.',
        sourceCitation: 'Maharashtra State Disaster Management Unit 2019'
      }
    ]
  },
  {
    id: 'mahanadi-odisha',
    name: 'Mahanadi Delta (Cuttack / Kendrapara)',
    state: 'Odisha',
    riverName: 'Mahanadi',
    coordinates: [20.462, 85.882], // Cuttack
    zoom: 11,
    averageElevationM: 22,
    minElevationM: 7,
    slopeGradientPercent: 0.9,
    soilDrainageIndex: 0.42,
    catchmentAreaSqKm: 141600,
    vulnerablePopulation: 2400000,
    historicalRecurrenceYears: 2.2,
    historicalFloodScore: 80,
    description: 'Vast deltaic network influenced by Hirakud Dam discharges and Bay of Bengal cyclonic storm surges, causing compound riverine-coastal flooding.',
    elevationProfileSource: 'Odisha Spatial Data Infrastructure (OSDI) & SRTM DEM',
    demResolution: '30m Spatial Grid',
    historicalEvents: [
      {
        year: 2001,
        floodLevelM: 27.60,
        populationDisplacedLakhs: 85.0,
        severity: 'CATASTROPHIC',
        keyCause: 'Prolonged depression over Bay of Bengal; peak discharge of 1.4 million cusecs through delta.',
        summary: 'Over 8.5 million people in 24 districts impacted; 99 embankment breaches reported across delta distributaries.',
        sourceCitation: 'Odisha State Disaster Management Authority (OSDMA) 2001 Flood Compendium'
      },
      {
        year: 2011,
        floodLevelM: 27.10,
        populationDisplacedLakhs: 34.0,
        severity: 'SEVERE',
        keyCause: 'Opening of 59 sluice gates at Hirakud Dam due to upper catchment torrential inflows from Chhattisgarh.',
        summary: 'Peak flow of 1.36 million cusecs at Mundali weir; Kendrapara and Puri districts submerged for 10 days.',
        sourceCitation: 'CWC Eastern Rivers Basin Hydrological Report 2011'
      },
      {
        year: 1982,
        floodLevelM: 27.85,
        populationDisplacedLakhs: 52.0,
        severity: 'CATASTROPHIC',
        keyCause: 'Breach of Dalei Ghai embankment on Devi river distributary.',
        summary: 'Historically renowned catastrophe that inundated 1,200 sq km of prime delta agricultural land.',
        sourceCitation: 'Government of Odisha Irrigation & Power Department Historical Record'
      }
    ]
  }
];

export const RIVER_GAUGES: RiverGauge[] = [
  // Brahmaputra Basin Gauges (Assam)
  {
    id: 'gauge-brahmaputra-pandu',
    basinId: 'brahmaputra-assam',
    stationName: 'Pandu Gauge Station (CWC)',
    riverName: 'Brahmaputra',
    coordinates: [26.175, 91.705],
    currentLevelM: 49.85,
    warningLevelM: 48.68,
    dangerLevelM: 49.68,
    highestFloodLevelM: 51.46,
    diffFromDangerM: 0.17, // +0.17m above danger
    rateOfChangeMPerHour: 0.08, // rising at 8cm/hr
    flowDischargeCusecs: 48500,
    trend: 'rising',
    lastUpdated: '12 mins ago',
    telemetryType: 'SIMULATED',
    telemetrySource: 'CWC Historical Gauge Benchmarks (Deterministic Simulation)'
  },
  {
    id: 'gauge-brahmaputra-tezpur',
    basinId: 'brahmaputra-assam',
    stationName: 'Tezpur Upstream Station',
    riverName: 'Brahmaputra',
    coordinates: [26.612, 92.795],
    currentLevelM: 65.40,
    warningLevelM: 64.20,
    dangerLevelM: 65.23,
    highestFloodLevelM: 66.80,
    diffFromDangerM: 0.17,
    rateOfChangeMPerHour: 0.06,
    flowDischargeCusecs: 52100,
    trend: 'rising',
    lastUpdated: '25 mins ago',
    telemetryType: 'SIMULATED',
    telemetrySource: 'CWC Historical Gauge Benchmarks (Deterministic Simulation)'
  },
  {
    id: 'gauge-brahmaputra-goalpara',
    basinId: 'brahmaputra-assam',
    stationName: 'Goalpara Downstream Checkpost',
    riverName: 'Brahmaputra',
    coordinates: [26.174, 90.628],
    currentLevelM: 35.80,
    warningLevelM: 35.25,
    dangerLevelM: 36.27,
    highestFloodLevelM: 37.43,
    diffFromDangerM: -0.47, // 0.47m below danger
    rateOfChangeMPerHour: 0.01,
    flowDischargeCusecs: 46200,
    trend: 'stable',
    lastUpdated: '40 mins ago',
    telemetryType: 'SIMULATED',
    telemetrySource: 'CWC Historical Gauge Benchmarks (Deterministic Simulation)'
  },

  // Kosi Basin Gauges (Bihar)
  {
    id: 'gauge-kosi-baltara',
    basinId: 'kosi-bihar',
    stationName: 'Baltara Gauge Station (CWC)',
    riverName: 'Kosi',
    coordinates: [25.590, 86.680],
    currentLevelM: 34.65,
    warningLevelM: 33.85,
    dangerLevelM: 34.85,
    highestFloodLevelM: 36.40,
    diffFromDangerM: -0.20,
    rateOfChangeMPerHour: 0.07,
    flowDischargeCusecs: 185000,
    trend: 'rising',
    lastUpdated: '8 mins ago',
    telemetryType: 'SIMULATED',
    telemetrySource: 'CWC Historical Gauge Benchmarks (Deterministic Simulation)'
  },
  {
    id: 'gauge-kosi-birpur',
    basinId: 'kosi-bihar',
    stationName: 'Birpur Barrage Telemetry',
    riverName: 'Kosi',
    coordinates: [26.520, 87.010],
    currentLevelM: 74.30,
    warningLevelM: 73.50,
    dangerLevelM: 74.80,
    highestFloodLevelM: 75.95,
    diffFromDangerM: -0.50,
    rateOfChangeMPerHour: 0.09,
    flowDischargeCusecs: 220000,
    trend: 'rising',
    lastUpdated: '18 mins ago',
    telemetryType: 'SIMULATED',
    telemetrySource: 'CWC Historical Gauge Benchmarks (Deterministic Simulation)'
  },

  // Periyar Basin Gauges (Kerala)
  {
    id: 'gauge-periyar-aluva',
    basinId: 'periyar-kerala',
    stationName: 'Aluva Manappuram Gauge',
    riverName: 'Periyar',
    coordinates: [10.108, 76.353],
    currentLevelM: 6.85,
    warningLevelM: 6.50,
    dangerLevelM: 7.50,
    highestFloodLevelM: 9.80,
    diffFromDangerM: -0.65,
    rateOfChangeMPerHour: 0.02,
    flowDischargeCusecs: 18200,
    trend: 'stable',
    lastUpdated: '15 mins ago',
    telemetryType: 'SIMULATED',
    telemetrySource: 'CWC Historical Gauge Benchmarks (Deterministic Simulation)'
  },
  {
    id: 'gauge-periyar-kalady',
    basinId: 'periyar-kerala',
    stationName: 'Kalady Bridge Station',
    riverName: 'Periyar',
    coordinates: [10.165, 76.435],
    currentLevelM: 14.10,
    warningLevelM: 13.80,
    dangerLevelM: 15.00,
    highestFloodLevelM: 17.20,
    diffFromDangerM: -0.90,
    rateOfChangeMPerHour: -0.04,
    flowDischargeCusecs: 19800,
    trend: 'falling',
    lastUpdated: '32 mins ago',
    telemetryType: 'SIMULATED',
    telemetrySource: 'CWC Historical Gauge Benchmarks (Deterministic Simulation)'
  },

  // Mithi Basin Gauges (Mumbai)
  {
    id: 'gauge-mithi-kurla',
    basinId: 'mithi-mumbai',
    stationName: 'Kranti Nagar Kurla Bridge (MCGM)',
    riverName: 'Mithi',
    coordinates: [19.068, 72.880],
    currentLevelM: 3.45,
    warningLevelM: 2.70,
    dangerLevelM: 3.60,
    highestFloodLevelM: 4.80,
    diffFromDangerM: -0.15,
    rateOfChangeMPerHour: 0.12,
    flowDischargeCusecs: 450,
    trend: 'rising',
    lastUpdated: '5 mins ago',
    telemetryType: 'SIMULATED',
    telemetrySource: 'MCGM Stormwater Gauge Benchmarks (Deterministic Simulation)'
  },
  {
    id: 'gauge-mithi-bkc',
    basinId: 'mithi-mumbai',
    stationName: 'BKC Outfall Sluice Gate',
    riverName: 'Mithi',
    coordinates: [19.062, 72.855],
    currentLevelM: 2.90,
    warningLevelM: 2.50,
    dangerLevelM: 3.20,
    highestFloodLevelM: 4.20,
    diffFromDangerM: -0.30,
    rateOfChangeMPerHour: 0.08,
    flowDischargeCusecs: 380,
    trend: 'rising',
    lastUpdated: '14 mins ago',
    telemetryType: 'SIMULATED',
    telemetrySource: 'MCGM Stormwater Gauge Benchmarks (Deterministic Simulation)'
  },

  // Mahanadi Basin Gauges (Odisha)
  {
    id: 'gauge-mahanadi-cuttack',
    basinId: 'mahanadi-odisha',
    stationName: 'Naraj Barrage Gauge (CWC)',
    riverName: 'Mahanadi',
    coordinates: [20.468, 85.765],
    currentLevelM: 26.20,
    warningLevelM: 25.40,
    dangerLevelM: 26.41,
    highestFloodLevelM: 27.60,
    diffFromDangerM: -0.21,
    rateOfChangeMPerHour: 0.05,
    flowDischargeCusecs: 64000,
    trend: 'rising',
    lastUpdated: '20 mins ago',
    telemetryType: 'SIMULATED',
    telemetrySource: 'CWC Historical Gauge Benchmarks (Deterministic Simulation)'
  },
  {
    id: 'gauge-mahanadi-jobra',
    basinId: 'mahanadi-odisha',
    stationName: 'Jobra Anicut Station',
    riverName: 'Mahanadi',
    coordinates: [20.485, 85.908],
    currentLevelM: 21.05,
    warningLevelM: 20.80,
    dangerLevelM: 21.94,
    highestFloodLevelM: 23.10,
    diffFromDangerM: -0.89,
    rateOfChangeMPerHour: 0.01,
    flowDischargeCusecs: 58000,
    trend: 'stable',
    lastUpdated: '35 mins ago',
    telemetryType: 'SIMULATED',
    telemetrySource: 'CWC Historical Gauge Benchmarks (Deterministic Simulation)'
  }
];
