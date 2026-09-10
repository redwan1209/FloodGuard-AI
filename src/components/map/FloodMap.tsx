import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { FloodBasin, RiverGauge, Shelter, FloodRiskAssessment } from '../../types';
import { Layers, Eye, Shield, Waves, Navigation, MapPin, Route, ShieldCheck } from 'lucide-react';

interface FloodMapProps {
  basin: FloodBasin;
  gauges: RiverGauge[];
  shelters: Shelter[];
  assessment: FloodRiskAssessment;
  onSelectShelter?: (shelter: Shelter) => void;
}

export const FloodMap: React.FC<FloodMapProps> = ({
  basin,
  gauges,
  shelters,
  assessment,
  onSelectShelter
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  // Layer Visibility Toggles
  const [showInundation, setShowInundation] = useState(true);
  const [showGauges, setShowGauges] = useState(true);
  const [showShelters, setShowShelters] = useState(true);
  const [showCorridors, setShowCorridors] = useState(true);
  const [selectedStation, setSelectedStation] = useState<RiverGauge | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: basin.coordinates,
        zoom: basin.zoom,
        zoomControl: false,
        attributionControl: false
      });

      // CartoDB Dark Matter / Dark All tiles for disaster command center look
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
        attribution: '&copy; CartoDB &copy; OpenStreetMap'
      }).addTo(map);

      // Add zoom control in top-right
      L.control.zoom({ position: 'topright' }).addTo(map);

      const layerGroup = L.layerGroup().addTo(map);
      layerGroupRef.current = layerGroup;
      mapInstanceRef.current = map;

      // Invalidate size to ensure clean tile rendering after mount
      setTimeout(() => {
        map.invalidateSize();
      }, 200);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Invalidate size whenever component becomes active or basin updates
  useEffect(() => {
    if (mapInstanceRef.current) {
      setTimeout(() => {
        mapInstanceRef.current?.invalidateSize();
      }, 150);
    }
  }, [basin]);

  // Update center when basin changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(basin.coordinates, basin.zoom, { duration: 1.2 });
    }
  }, [basin]);

  // Redraw layers when basin, toggles, or data changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    // 1. Inundation Hazard Zones (Simulated buffer circles & river flood corridor based on risk level)
    if (showInundation) {
      const bufferRadiusMeters = assessment.overallScore * 65; // radius expands with risk
      const color = assessment.colorCode;

      // Primary inundation zone around basin center
      const mainInundationCircle = L.circle(basin.coordinates, {
        radius: bufferRadiusMeters,
        color: color,
        weight: 2,
        opacity: 0.8,
        fillColor: color,
        fillOpacity: assessment.riskLevel === 'SEVERE' ? 0.35 : 0.20
      }).bindTooltip(
        `<strong>Estimated Flood Inundation Buffer</strong><br/>Risk Level: ${assessment.riskLevel}<br/>Approx Area: ~${assessment.inundationAreaSqKm} km²`,
        { sticky: true }
      );
      layerGroup.addLayer(mainInundationCircle);

      // Add secondary flood plain buffers around each gauge station
      gauges.forEach((g) => {
        const isOverDanger = g.currentLevelM >= g.dangerLevelM;
        const stationRadius = isOverDanger ? 3500 : 2000;
        const stationCircle = L.circle(g.coordinates, {
          radius: stationRadius,
          color: isOverDanger ? '#EF4444' : '#F59E0B',
          weight: 1.5,
          dashArray: '4, 4',
          fillColor: isOverDanger ? '#EF4444' : '#F59E0B',
          fillOpacity: isOverDanger ? 0.25 : 0.12
        }).bindTooltip(
          `<strong>${g.stationName} Floodplain</strong><br/>Water Level: ${g.currentLevelM}m MSL`,
          { sticky: true }
        );
        layerGroup.addLayer(stationCircle);
      });
    }

    // 2. River Gauge Stations
    if (showGauges) {
      gauges.forEach((g) => {
        const isDanger = g.currentLevelM >= g.dangerLevelM;
        const isWarning = g.currentLevelM >= g.warningLevelM;
        const markerColor = isDanger ? '#EF4444' : isWarning ? '#F59E0B' : '#10B981';

        const customIcon = L.divIcon({
          className: 'custom-gauge-marker',
          html: `
            <div style="
              width: 28px;
              height: 28px;
              background-color: ${markerColor};
              border: 3px solid #ffffff;
              border-radius: 50%;
              box-shadow: 0 0 12px ${markerColor};
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 12px;
              font-weight: bold;
            ">
              ~
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });

        const marker = L.marker(g.coordinates, { icon: customIcon });
        marker.bindPopup(`
          <div class="p-1 text-slate-100">
            <div class="text-[10px] font-semibold text-cyan-400 uppercase tracking-wider">CWC Hydrological Station</div>
            <h4 class="font-bold text-sm text-white mt-0.5">${g.stationName}</h4>
            <div class="mt-2 text-xs space-y-1">
              <div class="flex justify-between">
                <span class="text-slate-400">Current Level:</span>
                <strong class="text-white">${g.currentLevelM} m</strong>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Warning Level:</span>
                <span class="text-amber-400">${g.warningLevelM} m</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Danger Level:</span>
                <span class="text-red-400">${g.dangerLevelM} m</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Flow Discharge:</span>
                <span class="text-slate-200">${g.flowDischargeCusecs.toLocaleString()} cusecs</span>
              </div>
              <div class="flex justify-between pt-1 border-t border-slate-700">
                <span class="text-slate-400">Trend:</span>
                <span class="font-semibold text-cyan-300 capitalize">${g.trend}</span>
              </div>
            </div>
          </div>
        `);

        marker.on('click', () => setSelectedStation(g));
        layerGroup.addLayer(marker);
      });
    }

    // 3. High-Ground Shelters
    if (showShelters) {
      shelters.forEach((s) => {
        const shelterIcon = L.divIcon({
          className: 'custom-shelter-marker',
          html: `
            <div style="
              width: 26px;
              height: 26px;
              background-color: #0284c7;
              border: 2px solid #38bdf8;
              border-radius: 8px;
              box-shadow: 0 4px 8px rgba(0,0,0,0.4);
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 11px;
              font-weight: bold;
            ">
              H
            </div>
          `,
          iconSize: [26, 26],
          iconAnchor: [13, 13]
        });

        const marker = L.marker(s.coordinates, { icon: shelterIcon });
        marker.bindPopup(`
          <div class="p-1 text-slate-100">
            <div class="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">High-Ground Safe Shelter</div>
            <h4 class="font-bold text-sm text-white mt-0.5">${s.name}</h4>
            <div class="mt-2 text-xs space-y-1">
              <div class="flex justify-between">
                <span class="text-slate-400">Elevation:</span>
                <strong class="text-emerald-400">${s.elevationM} m MSL (+${s.safetyMarginAboveFloodM}m buffer)</strong>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Capacity:</span>
                <span class="text-slate-200">${s.currentOccupancy} / ${s.totalCapacity} (${Math.round((s.currentOccupancy/s.totalCapacity)*100)}%)</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Road Status:</span>
                <span class="font-semibold ${s.roadAccessibility === 'CLEAR' ? 'text-emerald-400' : 'text-amber-400'}">${s.roadAccessibility}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Contact:</span>
                <span class="text-cyan-300 font-mono">${s.contactPhone}</span>
              </div>
            </div>
            <div class="mt-2.5 pt-2 border-t border-slate-700 text-right">
              <button id="shelter-nav-btn-${s.id}" style="
                background-color: #0284c7;
                color: #ffffff;
                font-size: 10px;
                font-weight: bold;
                padding: 4px 8px;
                border-radius: 6px;
                border: none;
                cursor: pointer;
              ">
                View in Evacuation Center →
              </button>
            </div>
          </div>
        `);

        marker.on('popupopen', () => {
          const btn = document.getElementById(`shelter-nav-btn-${s.id}`);
          if (btn) {
            btn.onclick = () => {
              if (onSelectShelter) onSelectShelter(s);
            };
          }
        });

        layerGroup.addLayer(marker);
      });
    }

    // 4. Evacuation Corridors, Safe Havens & Low Alluvial Floodplain (Phase 1)
    if (showCorridors) {
      // 4a. Low-Elevation Alluvial Plain Buffer (SRTM 30m DEM)
      const plainCircle = L.circle(basin.coordinates, {
        radius: 8000,
        color: '#38bdf8',
        weight: 1.5,
        dashArray: '5, 5',
        fillColor: '#0284c7',
        fillOpacity: 0.05
      }).bindTooltip(
        `<strong>Low Alluvial Floodplain (< ${basin.averageElevationM}m MSL)</strong><br/>Drainage Gradient: ${basin.slopeGradientPercent}% • Soil Drainage: ${Math.round(basin.soilDrainageIndex * 100)}%<br/>Dataset: ${basin.elevationProfileSource}`,
        { sticky: true }
      );
      layerGroup.addLayer(plainCircle);

      // 4b. River Reach Alignment across Gauges
      if (gauges.length > 1) {
        const coords = gauges.map((g) => g.coordinates);
        const riverLine = L.polyline(coords, {
          color: '#0284c7',
          weight: 4,
          opacity: 0.7,
          dashArray: '4, 4'
        }).bindTooltip(
          `<strong>${basin.riverName} Channel Alignment</strong><br/>Active Flow Discharge: ${gauges[0].flowDischargeCusecs.toLocaleString()} cusecs`,
          { sticky: true }
        );
        layerGroup.addLayer(riverLine);
      }

      // 4c. High-Ground Safe Haven Buffers and Evacuation Corridors to each shelter
      shelters.forEach((s) => {
        // High-ground haven circle around shelter
        const safeHaven = L.circle(s.coordinates, {
          radius: 1200,
          color: '#10b981',
          weight: 1.5,
          fillColor: '#10b981',
          fillOpacity: 0.15
        }).bindTooltip(
          `<strong>High-Ground Safe Haven: ${s.name}</strong><br/>Elevation: ${s.elevationM}m MSL (+${s.safetyMarginAboveFloodM}m safety elevation above flood stage)`,
          { sticky: true }
        );
        layerGroup.addLayer(safeHaven);

        // Evacuation corridor polyline from basin center to shelter
        const corridorColor = s.roadAccessibility === 'CLEAR' ? '#10b981' : s.roadAccessibility === 'CAUTION' ? '#f59e0b' : '#ef4444';
        const corridorLine = L.polyline([basin.coordinates, s.coordinates], {
          color: corridorColor,
          weight: 3,
          dashArray: '6, 8',
          opacity: 0.85
        }).bindTooltip(
          `<strong>Designated Evacuation Corridor → ${s.name}</strong><br/>Route Status: <span style="color: ${corridorColor}; font-weight: bold;">${s.roadAccessibility}</span><br/>Safe High-Ground Access (+${s.safetyMarginAboveFloodM}m MSL)`,
          { sticky: true }
        );
        layerGroup.addLayer(corridorLine);
      });
    }
  }, [basin, gauges, shelters, assessment, showInundation, showGauges, showShelters, showCorridors]);

  return (
    <div className="relative w-full h-[600px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Layer Controls */}
      <div className="absolute top-4 left-4 z-10 bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-slate-800 shadow-xl max-w-xs">
        <div className="flex items-center gap-2 pb-2 mb-2 border-b border-slate-800 text-xs font-bold text-slate-200 uppercase tracking-wider">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>Interactive Map Layers</span>
        </div>

        <div className="space-y-2 text-xs">
          <label className="flex items-center justify-between gap-3 cursor-pointer hover:text-white">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: assessment.colorCode }} />
              <span>Flood Inundation (Calculated MCDA)</span>
            </span>
            <input
              type="checkbox"
              checked={showInundation}
              onChange={(e) => setShowInundation(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between gap-3 cursor-pointer hover:text-white">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500 border border-white" />
              <span>River Gauges (Demo: CWC Telemetry)</span>
            </span>
            <input
              type="checkbox"
              checked={showGauges}
              onChange={(e) => setShowGauges(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between gap-3 cursor-pointer hover:text-white">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-sky-500 text-[9px] text-white flex items-center justify-center font-bold">H</span>
              <span>Safe Shelters (Designated Camps)</span>
            </span>
            <input
              type="checkbox"
              checked={showShelters}
              onChange={(e) => setShowShelters(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between gap-3 cursor-pointer hover:text-white">
            <span className="flex items-center gap-2">
              <span className="w-3 h-1.5 border-b-2 border-emerald-400 border-dashed" />
              <span>Evacuation Corridors & Safe Havens</span>
            </span>
            <input
              type="checkbox"
              checked={showCorridors}
              onChange={(e) => setShowCorridors(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0 cursor-pointer"
            />
          </label>
        </div>
      </div>

      {/* Floating Legend / Quick Summary */}
      <div className="absolute bottom-4 left-4 z-10 bg-slate-900/90 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-slate-800 shadow-xl flex items-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-semibold text-white">{basin.name}</span>
        </div>
        <div className="h-4 w-px bg-slate-700" />
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Elevation:</span>
          <span className="font-semibold text-slate-200">{basin.averageElevationM}m MSL</span>
        </div>
        <div className="h-4 w-px bg-slate-700 hidden sm:block" />
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-slate-400">Slope:</span>
          <span className="font-semibold text-slate-200">{basin.slopeGradientPercent}%</span>
        </div>
        <div className="h-4 w-px bg-slate-700 hidden md:block" />
        <div className="hidden md:flex items-center gap-1.5 text-[10px] text-slate-400">
          <span className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono">DEM: SRTM 30m</span>
          <span>• Simulated GIS Model</span>
        </div>
      </div>

      {/* Recenter Button */}
      <button
        onClick={() => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.flyTo(basin.coordinates, basin.zoom, { duration: 0.8 });
          }
        }}
        className="absolute bottom-4 right-4 z-10 bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white px-3 py-2 rounded-xl border border-slate-800 shadow-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
      >
        <Navigation className="w-3.5 h-3.5 text-cyan-400" />
        <span>Recenter Basin</span>
      </button>
    </div>
  );
};
