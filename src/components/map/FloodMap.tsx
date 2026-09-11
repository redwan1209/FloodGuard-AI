import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { FloodBasin, RiverGauge, Shelter, FloodRiskAssessment } from '../../types';
import { Layers, Eye, Shield, Waves, Navigation, MapPin, Route, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';

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
  const [isLayersCollapsed, setIsLayersCollapsed] = useState(false);

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

      // CartoDB Voyager raster tiles
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
          className: `custom-gauge-marker ${isDanger ? 'pulse-marker' : ''}`,
          html: `
            <div style="
              width: 28px;
              height: 28px;
              background-color: ${markerColor};
              border: 3px solid #ffffff;
              border-radius: 50%;
              box-shadow: 0 0 14px ${markerColor};
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 13px;
              font-weight: 800;
              line-height: 1;
            ">
              ~
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });

        const marker = L.marker(g.coordinates, { icon: customIcon });
        marker.bindPopup(`
          <div style="min-width: 210px; padding: 4px; color: #f8fafc; font-family: sans-serif;">
            <div style="font-size: 10px; font-weight: 700; color: #38bdf8; text-transform: uppercase; letter-spacing: 0.05em;">CWC Hydrological Station</div>
            <h4 style="font-size: 14px; font-weight: 700; color: #ffffff; margin: 2px 0 8px 0;">${g.stationName}</h4>
            <div style="font-size: 12px; display: flex; flex-direction: column; gap: 4px;">
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #94a3b8;">Current Level:</span>
                <strong style="color: #ffffff; font-family: monospace;">${g.currentLevelM} m</strong>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #94a3b8;">Warning Mark:</span>
                <span style="color: #fbbf24; font-family: monospace;">${g.warningLevelM} m</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #94a3b8;">Danger Mark:</span>
                <span style="color: #f87171; font-family: monospace; font-weight: 700;">${g.dangerLevelM} m</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #94a3b8;">Flow Discharge:</span>
                <span style="color: #cbd5e1;">${g.flowDischargeCusecs.toLocaleString()} cusecs</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding-top: 4px; border-top: 1px solid #334155;">
                <span style="color: #94a3b8;">Trend:</span>
                <span style="color: #67e8f9; font-weight: 600; text-transform: capitalize;">${g.trend}</span>
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
              box-shadow: 0 4px 10px rgba(0,0,0,0.5);
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 11px;
              font-weight: 800;
            ">
              H
            </div>
          `,
          iconSize: [26, 26],
          iconAnchor: [13, 13]
        });

        const marker = L.marker(s.coordinates, { icon: shelterIcon });
        marker.bindPopup(`
          <div style="min-width: 220px; padding: 4px; color: #f8fafc; font-family: sans-serif;">
            <div style="font-size: 10px; font-weight: 700; color: #34d399; text-transform: uppercase; letter-spacing: 0.05em;">High-Ground Safe Shelter</div>
            <h4 style="font-size: 14px; font-weight: 700; color: #ffffff; margin: 2px 0 8px 0;">${s.name}</h4>
            <div style="font-size: 12px; display: flex; flex-direction: column; gap: 4px;">
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #94a3b8;">Elevation:</span>
                <strong style="color: #34d399;">${s.elevationM}m MSL (+${s.safetyMarginAboveFloodM}m buffer)</strong>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #94a3b8;">Capacity:</span>
                <span style="color: #cbd5e1;">${s.currentOccupancy} / ${s.totalCapacity} (${Math.round((s.currentOccupancy/s.totalCapacity)*100)}%)</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #94a3b8;">Road Status:</span>
                <span style="font-weight: 600; color: ${s.roadAccessibility === 'CLEAR' ? '#34d399' : '#fbbf24'};">${s.roadAccessibility}</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #94a3b8;">Contact:</span>
                <span style="color: #67e8f9; font-family: monospace;">${s.contactPhone}</span>
              </div>
            </div>
            <div style="margin-top: 10px; padding-top: 8px; border-top: 1px solid #334155; text-align: right;">
              <button id="shelter-nav-btn-${s.id}" style="
                background-color: #0284c7;
                color: #ffffff;
                font-size: 11px;
                font-weight: 700;
                padding: 5px 10px;
                border-radius: 6px;
                border: none;
                cursor: pointer;
                transition: background-color 0.15s;
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

    // 4. Evacuation Corridors, Safe Havens & Low Alluvial Floodplain
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
    <div className="relative w-full h-[540px] sm:h-[620px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Layer Controls (Collapsible for clean mobile experience) */}
      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 bg-slate-900/95 backdrop-blur-md p-2.5 sm:p-3 rounded-xl border border-slate-800 shadow-2xl max-w-[280px] sm:max-w-xs transition-all">
        <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-slate-800 text-xs font-bold text-slate-200">
          <div className="flex items-center gap-1.5 uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Map Layers</span>
          </div>
          <button
            onClick={() => setIsLayersCollapsed(!isLayersCollapsed)}
            className="p-0.5 rounded text-slate-400 hover:text-white"
            title={isLayersCollapsed ? 'Expand Layer Controls' : 'Collapse Layer Controls'}
          >
            {isLayersCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>

        {!isLayersCollapsed && (
          <div className="mt-2 space-y-2 text-xs">
            <label className="flex items-center justify-between gap-2 cursor-pointer hover:text-white select-none">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: assessment.colorCode }} />
                <span>Flood Inundation (MCDA)</span>
              </span>
              <input
                type="checkbox"
                checked={showInundation}
                onChange={(e) => setShowInundation(e.target.checked)}
                className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between gap-2 cursor-pointer hover:text-white select-none">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500 border border-white shrink-0" />
                <span>CWC River Gauges</span>
              </span>
              <input
                type="checkbox"
                checked={showGauges}
                onChange={(e) => setShowGauges(e.target.checked)}
                className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between gap-2 cursor-pointer hover:text-white select-none">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-sky-500 text-[9px] text-white flex items-center justify-center font-bold shrink-0">H</span>
                <span>Safe High-Ground Shelters</span>
              </span>
              <input
                type="checkbox"
                checked={showShelters}
                onChange={(e) => setShowShelters(e.target.checked)}
                className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between gap-2 cursor-pointer hover:text-white select-none">
              <span className="flex items-center gap-2">
                <span className="w-3 h-1 border-b-2 border-emerald-400 border-dashed shrink-0" />
                <span>Evacuation Corridors</span>
              </span>
              <input
                type="checkbox"
                checked={showCorridors}
                onChange={(e) => setShowCorridors(e.target.checked)}
                className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0 cursor-pointer"
              />
            </label>
          </div>
        )}
      </div>

      {/* Floating Legend / Quick Summary */}
      <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 bg-slate-900/95 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-800 shadow-2xl flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-bold text-white">{basin.name}</span>
        </div>
        <div className="h-3.5 w-px bg-slate-700" />
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400">Elev:</span>
          <span className="font-semibold text-slate-200">{basin.averageElevationM}m MSL</span>
        </div>
        <div className="h-3.5 w-px bg-slate-700 hidden sm:block" />
        <div className="hidden sm:flex items-center gap-1.5">
          <span className="text-slate-400">Slope:</span>
          <span className="font-semibold text-slate-200">{basin.slopeGradientPercent}%</span>
        </div>
        <div className="h-3.5 w-px bg-slate-700 hidden md:block" />
        <div className="hidden md:flex items-center gap-1 text-[10px] text-slate-400">
          <span className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono">DEM: SRTM 30m</span>
          <span>• Simulated GIS</span>
        </div>
      </div>

      {/* Recenter Button */}
      <button
        onClick={() => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.flyTo(basin.coordinates, basin.zoom, { duration: 0.8 });
          }
        }}
        aria-label="Recenter Basin on Map"
        className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-10 bg-slate-900/95 hover:bg-slate-800 text-slate-200 hover:text-white px-3 py-2 rounded-xl border border-slate-800 shadow-2xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95"
      >
        <Navigation className="w-3.5 h-3.5 text-cyan-400" />
        <span>Recenter</span>
      </button>
    </div>
  );
};
