import { WeatherData } from '../types';

// Fallback baseline weather when network is offline or for guaranteed hackathon reliability
const BASELINE_WEATHER: Record<string, WeatherData> = {
  'brahmaputra-assam': {
    basinId: 'brahmaputra-assam',
    currentRainfallMm: 118.4,
    recent6hRainfallMm: 38.2,
    forecast24hMm: 142.0,
    forecast72hMm: 295.5,
    precipitationProbability: 92,
    rainfallTrend: 'increasing',
    soilMoisturePercent: 88,
    temperatureC: 27.4,
    humidityPercent: 94,
    isLiveApi: false,
    weatherSource: 'Calibrated Historical Monsoon Baseline (Demo Fallback)',
    lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  },
  'kosi-bihar': {
    basinId: 'kosi-bihar',
    currentRainfallMm: 96.0,
    recent6hRainfallMm: 28.5,
    forecast24hMm: 125.0,
    forecast72hMm: 260.0,
    precipitationProbability: 88,
    rainfallTrend: 'increasing',
    soilMoisturePercent: 82,
    temperatureC: 29.1,
    humidityPercent: 91,
    isLiveApi: false,
    weatherSource: 'Calibrated Historical Monsoon Baseline (Demo Fallback)',
    lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  },
  'periyar-kerala': {
    basinId: 'periyar-kerala',
    currentRainfallMm: 45.2,
    recent6hRainfallMm: 12.0,
    forecast24hMm: 68.0,
    forecast72hMm: 135.0,
    precipitationProbability: 65,
    rainfallTrend: 'steady',
    soilMoisturePercent: 71,
    temperatureC: 28.0,
    humidityPercent: 84,
    isLiveApi: false,
    weatherSource: 'Calibrated Historical Monsoon Baseline (Demo Fallback)',
    lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  },
  'mithi-mumbai': {
    basinId: 'mithi-mumbai',
    currentRainfallMm: 85.5,
    recent6hRainfallMm: 34.0,
    forecast24hMm: 110.0,
    forecast72hMm: 180.0,
    precipitationProbability: 80,
    rainfallTrend: 'increasing',
    soilMoisturePercent: 79,
    temperatureC: 30.2,
    humidityPercent: 89,
    isLiveApi: false,
    weatherSource: 'Calibrated Historical Monsoon Baseline (Demo Fallback)',
    lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  },
  'mahanadi-odisha': {
    basinId: 'mahanadi-odisha',
    currentRainfallMm: 62.0,
    recent6hRainfallMm: 18.0,
    forecast24hMm: 78.5,
    forecast72hMm: 165.0,
    precipitationProbability: 75,
    rainfallTrend: 'steady',
    soilMoisturePercent: 76,
    temperatureC: 31.0,
    humidityPercent: 86,
    isLiveApi: false,
    weatherSource: 'Calibrated Historical Monsoon Baseline (Demo Fallback)',
    lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
};

export async function fetchLiveWeather(
  basinId: string,
  lat: number,
  lng: number
): Promise<WeatherData> {
  const fallback = BASELINE_WEATHER[basinId] || {
    basinId,
    currentRainfallMm: 50.0,
    recent6hRainfallMm: 15.0,
    forecast24hMm: 70.0,
    forecast72hMm: 150.0,
    precipitationProbability: 70,
    rainfallTrend: 'steady',
    soilMoisturePercent: 75,
    temperatureC: 28.0,
    humidityPercent: 85,
    isLiveApi: false,
    weatherSource: 'Calibrated Historical Monsoon Baseline (Demo Fallback)',
    lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500); // 4.5 sec timeout

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=precipitation_sum,precipitation_probability_max,temperature_2m_max&hourly=precipitation&current=precipitation,temperature_2m,relative_humidity_2m&timezone=Asia%2FKolkata`;
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`Open-Meteo returned status ${response.status}. Using calibrated dataset.`);
      return fallback;
    }

    const data = await response.json();
    const dailyPrecip = data.daily?.precipitation_sum || [];
    const dailyProb = data.daily?.precipitation_probability_max || [];
    const hourlyPrecip = data.hourly?.precipitation || [];

    // 24h & 72h forecast sums
    const forecast24hMm = Number(dailyPrecip[0] ?? fallback.forecast24hMm);
    const forecast72hMm = Number((dailyPrecip.slice(0, 3).reduce((acc: number, val: number) => acc + (val || 0), 0)) || fallback.forecast72hMm);
    const precipProb = Number(dailyProb[0] ?? fallback.precipitationProbability);
    const temp = Number(data.current?.temperature_2m ?? fallback.temperatureC);
    const humidity = Number(data.current?.relative_humidity_2m ?? fallback.humidityPercent);

    // Compute recent 6h rainfall and trend from hourly data
    let recent6hRainfallMm = fallback.recent6hRainfallMm;
    let rainfallTrend: 'increasing' | 'decreasing' | 'steady' = 'steady';
    if (hourlyPrecip.length >= 24) {
      // First 6 hours of forecast vs next 6 hours
      const first6hSum = hourlyPrecip.slice(0, 6).reduce((a: number, b: number) => a + (b || 0), 0);
      const next6hSum = hourlyPrecip.slice(6, 12).reduce((a: number, b: number) => a + (b || 0), 0);
      recent6hRainfallMm = Number(first6hSum.toFixed(1));
      if (next6hSum > first6hSum + 2.0) {
        rainfallTrend = 'increasing';
      } else if (next6hSum < first6hSum - 2.0) {
        rainfallTrend = 'decreasing';
      } else {
        rainfallTrend = 'steady';
      }
    }

    // Calculate approximate soil saturation based on humidity and accumulated rain
    const estimatedSoilMoisture = Math.min(
      98,
      Math.max(40, Math.round(humidity * 0.5 + Math.min(forecast24hMm, 100) * 0.45))
    );

    return {
      basinId,
      currentRainfallMm: Number((forecast24hMm * 0.85).toFixed(1)),
      recent6hRainfallMm,
      forecast24hMm: Number(forecast24hMm.toFixed(1)),
      forecast72hMm: Number(forecast72hMm.toFixed(1)),
      precipitationProbability: precipProb,
      rainfallTrend,
      soilMoisturePercent: estimatedSoilMoisture,
      temperatureC: Number(temp.toFixed(1)),
      humidityPercent: humidity,
      isLiveApi: true,
      weatherSource: 'Open-Meteo High-Resolution Global Forecast API (Live Query)',
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  } catch (err) {
    console.info('Weather API fetch failed or timed out (using calibrated offline baseline):', err);
    return fallback;
  }
}
