import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { FloodBasin, RiverGauge, Shelter, FloodRiskAssessment } from '../../types';
import {
  Layers,
  Shield,
  Waves,
  Navigation,
  MapPin,
  Filter,
  CheckSquare,
  Square,
  Info,
  Maximize2,
  TrendingUp,
  AlertTriangle,
  Search,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface FloodMapProps {
  basin: FloodBasin;
  gauges: RiverGauge[];
  shelters: Shelter[];
  assessment: FloodRiskAssessment;
  onSelectShelter?: (shelter: Shelter) => void;
  onNavigateToTelemetry?: () => void;
}

export const FloodMap: React.FC<FloodMapProps> = ({
  basin,
  gauges,
  shelters,
  assessment,
  onSelectShelter,
  onNavigateToTelemetry
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const baseTileRef = useRef<L.TileLayer | null>(null);

  // Layer Toggles
  const [showInundation, setShowInundation] = useState(true);
  const [showGauges, setShowGauges] = useState(true);
  const [showShelters, setShowShelters] = useState(true);
  const [showCorridors, setShowCorridors] = useState(true);
  const [showFloodplain, setShowFloodplain] = useState(true);

  // UI state
  const [showLegend, setShowLegend] = useState(true);
  const [showLayerPanel, setShowLayerPanel] = useState(false);
  const [baseMapStyle, setBaseMapStyle] = useState<'osm' | 'esri' | 'positron'>('osm');
  const [selectedGauge, setSelectedGauge] = useState<RiverGauge | null>(gauges[0] || null);
  const [isStatusExpanded, setIsStatusExpanded] = useState(true);

  // Supported professional GIS base maps
  const createTileLayer = (style: 'osm' | 'esri' | 'positron') => {
    let layer: L.TileLayer;
    switch (style) {
      case 'esri':
        layer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
          maxZoom: 19,
          attribution: '&copy; Esri, USGS, NOAA, CWC'
        });
        break;
      case 'positron':
        layer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
          maxZoom: 19,
          subdomains: 'abcd',
          attribution: '&copy; CartoDB &copy; OpenStreetMap'
        });
        break;
      case 'osm':
      default:
        layer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          subdomains: 'abc', // Critical: OSM only supports 'abc', NOT 'abcd'. Prevents missing grey tiles!
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        });
        break;
    }

    // Auto-retry once on intermittent network drops
    layer.on('tileerror', (event) => {
      const tile = (event as any).tile as HTMLImageElement;
      if (tile && !tile.dataset.retry) {
        tile.dataset.retry = '1';
        const currentSrc = tile.src;
        setTimeout(() => {
          tile.src = currentSrc;
        }, 500);
      }
    });

    return layer;
  };

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

      // Professional light tile layer with error recovery
      const tile = createTileLayer(baseMapStyle).addTo(map);
      baseTileRef.current = tile;

      // Add zoom control top-left
      L.control.zoom({ position: 'topleft' }).addTo(map);

      // Add scale indicator bottom-left
      L.control.scale({ imperial: false, position: 'bottomleft' }).addTo(map);

      const layerGroup = L.layerGroup().addTo(map);
      layerGroupRef.current = layerGroup;
      mapInstanceRef.current = map;

      // Immediate & phased invalidation to guarantee full tile coverage
      map.invalidateSize();
      const t1 = setTimeout(() => map.invalidateSize(), 150);
      const t2 = setTimeout(() => map.invalidateSize(), 400);

      // ResizeObserver to adapt dynamically to viewport or DOM changes
      const ro = new ResizeObserver(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      });
      ro.observe(mapContainerRef.current);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        ro.disconnect();
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
      };
    }
  }, []);

  // Update base map style
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !baseTileRef.current) return;

    map.removeLayer(baseTileRef.current);
    const newTile = createTileLayer(baseMapStyle).addTo(map);
    baseTileRef.current = newTile;
    map.invalidateSize();
  }, [baseMapStyle]);

  // Update center when basin changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(basin.coordinates, basin.zoom, { duration: 0.8 });
      mapInstanceRef.current.invalidateSize();
      setSelectedGauge(gauges[0] || null);
    }
  }, [basin]);

  // Redraw layers when basin, toggles, or data changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    // 1. Inundation Hazard Zones (MCDA Estimated Buffer)
    if (showInundation) {
      const bufferRadiusMeters = assessment.overallScore * 65;
      const fillColor =
        assessment.riskLevel === 'SEVERE'
          ? '#dc2626'
          : assessment.riskLevel === 'HIGH'
          ? '#ea580c'
          : assessment.riskLevel === 'MODERATE'
          ? '#d97706'
          : '#16a34a';

      const mainInundationCircle = L.circle(basin.coordinates, {
        radius: bufferRadiusMeters,
        color: fillColor,
        weight: 1.5,
        opacity: 0.9,
        fillColor: fillColor,
        fillOpacity: assessment.riskLevel === 'SEVERE' ? 0.35 : 0.20
      }).bindTooltip(
        `<strong>Estimated Flood Inundation Footprint</strong><br/>Risk Level: ${assessment.riskLevel}<br/>Approx Area: ~${assessment.inundationAreaSqKm} km²`,
        { sticky: true }
      );
      layerGroup.addLayer(mainInundationCircle);

      // Station inundation buffers
      gauges.forEach((g) => {
        const isOverDanger = g.currentLevelM >= g.dangerLevelM;
        const stationRadius = isOverDanger ? 3500 : 2000;
        const stationColor = isOverDanger ? '#dc2626' : '#d97706';
        const stationCircle = L.circle(g.coordinates, {
          radius: stationRadius,
          color: stationColor,
          weight: 1.2,
          dashArray: '4, 4',
          fillColor: stationColor,
          fillOpacity: isOverDanger ? 0.25 : 0.12
        }).bindTooltip(
          `<strong>${g.stationName} Flood Risk Zone</strong><br/>Current Level: ${g.currentLevelM}m MSL`,
          { sticky: true }
        );
        layerGroup.addLayer(stationCircle);
      });
    }

    // 2. Low Alluvial Floodplain Buffer (SRTM DEM)
    if (showFloodplain) {
      const plainCircle = L.circle(basin.coordinates, {
        radius: 8500,
        color: '#0284c7',
        weight: 1.2,
        dashArray: '5, 5',
        fillColor: '#38bdf8',
        fillOpacity: 0.08
      }).bindTooltip(
        `<strong>Low Alluvial Floodplain (&lt; ${basin.averageElevationM}m MSL)</strong><br/>Gradient: ${basin.slopeGradientPercent}% • Soil Drainage: ${Math.round(basin.soilDrainageIndex * 100)}%<br/>Dataset: ${basin.elevationProfileSource}`,
        { sticky: true }
      );
      layerGroup.addLayer(plainCircle);
    }

    // 3. River Gauge Stations
    if (showGauges) {
      gauges.forEach((g) => {
        const isDanger = g.currentLevelM >= g.dangerLevelM;
        const isWarning = g.currentLevelM >= g.warningLevelM;
        const markerColor = isDanger ? '#dc2626' : isWarning ? '#d97706' : '#16a34a';

        const customIcon = L.divIcon({
          className: `gis-station-marker ${isDanger ? 'gis-station-danger' : ''}`,
          html: `
            <div style="
              width: 26px;
              height: 26px;
              background-color: ${markerColor};
              border: 2px solid #ffffff;
              border-radius: 50%;
              box-shadow: 0 1px 4px rgba(0,0,0,0.35);
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 11px;
              font-weight: 800;
              line-height: 1;
              cursor: pointer;
            ">
              ▲
            </div>
          `,
          iconSize: [26, 26],
          iconAnchor: [13, 13]
        });

        const marker = L.marker(g.coordinates, { icon: customIcon });

        const diff = (g.currentLevelM - g.dangerLevelM).toFixed(2);
        const isAboveDanger = Number(diff) >= 0;

        marker.bindPopup(`
          <div style="width: 250px; font-family: sans-serif; padding: 0;">
            <div style="background-color: #0f2744; color: #ffffff; padding: 8px 12px; border-top-left-radius: 6px; border-top-right-radius: 6px;">
              <span style="font-size: 9px; font-weight: 700; color: #93c5fd; text-transform: uppercase; letter-spacing: 0.05em; display: block;">
                CWC Hydrological Monitoring Station
              </span>
              <h4 style="font-size: 13px; font-weight: 700; margin: 2px 0 0 0; color: #ffffff;">${g.stationName}</h4>
              <span style="font-size: 11px; color: #cbd5e1;">River: ${g.riverName}</span>
            </div>
            <div style="padding: 10px 12px; font-size: 12px; display: flex; flex-direction: column; gap: 5px; color: #1e293b;">
              <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #f1f5f9; padding-bottom: 4px;">
                <span style="color: #64748b;">Current Water Stage:</span>
                <strong style="color: ${isAboveDanger ? '#dc2626' : '#0f172a'}; font-family: monospace; font-size: 13px;">${g.currentLevelM} m MSL</strong>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #64748b;">Danger Level (DL):</span>
                <span style="color: #dc2626; font-weight: 700; font-family: monospace;">${g.dangerLevelM} m</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #64748b;">Warning Level (WL):</span>
                <span style="color: #d97706; font-weight: 600; font-family: monospace;">${g.warningLevelM} m</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #64748b;">Margin to Danger:</span>
                <strong style="color: ${isAboveDanger ? '#dc2626' : '#16a34a'}; font-family: monospace;">
                  ${isAboveDanger ? `+${diff} m (Breached)` : `${diff} m (Safe)`}
                </strong>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #64748b;">Discharge Flow:</span>
                <span style="color: #0f172a; font-family: monospace;">${g.flowDischargeCusecs.toLocaleString()} cusecs</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #64748b;">Trend:</span>
                <span style="font-weight: 700; text-transform: capitalize; color: ${g.trend === 'rising' ? '#dc2626' : '#16a34a'};">
                  ${g.trend} ${g.trend === 'rising' ? '↑' : g.trend === 'falling' ? '↓' : '→'}
                </span>
              </div>
              <div style="margin-top: 6px; padding-top: 6px; border-top: 1px solid #e2e8f0; font-size: 10px; color: #64748b;">
                <strong>Telemetry:</strong> Demo: CWC Benchmark Model
              </div>
            </div>
          </div>
        `);

        marker.on('click', () => {
          setSelectedGauge(g);
        });

        layerGroup.addLayer(marker);
      });
    }

    // 4. River Reach Alignment across Gauges
    if (gauges.length > 1) {
      const coords = gauges.map((g) => g.coordinates);
      const riverLine = L.polyline(coords, {
        color: '#1d4ed8',
        weight: 3.5,
        opacity: 0.8,
        dashArray: '3, 5'
      }).bindTooltip(
        `<strong>${basin.riverName} Channel Alignment</strong><br/>Active Flow Discharge: ${gauges[0].flowDischargeCusecs.toLocaleString()} cusecs`,
        { sticky: true }
      );
      layerGroup.addLayer(riverLine);
    }

    // 5. High-Ground Safe Shelters
    if (showShelters) {
      shelters.forEach((s) => {
        const shelterIcon = L.divIcon({
          className: 'gis-shelter-marker',
          html: `
            <div style="
              width: 24px;
              height: 24px;
              background-color: #0284c7;
              border: 2px solid #ffffff;
              border-radius: 4px;
              box-shadow: 0 1px 4px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 11px;
              font-weight: bold;
              cursor: pointer;
            ">
              H
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        const marker = L.marker(s.coordinates, { icon: shelterIcon });
        marker.bindPopup(`
          <div style="width: 250px; font-family: sans-serif; padding: 0;">
            <div style="background-color: #0369a1; color: #ffffff; padding: 8px 12px; border-top-left-radius: 6px; border-top-right-radius: 6px;">
              <span style="font-size: 9px; font-weight: 700; color: #bae6fd; text-transform: uppercase; letter-spacing: 0.05em; display: block;">
                Designated High-Ground Relief Camp
              </span>
              <h4 style="font-size: 13px; font-weight: 700; margin: 2px 0 0 0; color: #ffffff;">${s.name}</h4>
            </div>
            <div style="padding: 10px 12px; font-size: 12px; display: flex; flex-direction: column; gap: 5px; color: #1e293b;">
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #64748b;">Elevation Safety:</span>
                <strong style="color: #047857;">${s.elevationM}m MSL (+${s.safetyMarginAboveFloodM}m buffer)</strong>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #64748b;">Capacity:</span>
                <span>${s.currentOccupancy} / ${s.totalCapacity} (${Math.round((s.currentOccupancy/s.totalCapacity)*100)}%)</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #64748b;">Road Condition:</span>
                <span style="font-weight: 700; color: ${s.roadAccessibility === 'CLEAR' ? '#16a34a' : '#d97706'};">
                  ${s.roadAccessibility}
                </span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #64748b;">Contact:</span>
                <span style="font-family: monospace; color: #0284c7;">${s.contactPhone}</span>
              </div>
              <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #e2e8f0; text-align: right;">
                <button id="gis-shelter-btn-${s.id}" style="
                  background-color: #0284c7;
                  color: #ffffff;
                  font-size: 11px;
                  font-weight: 700;
                  padding: 4px 10px;
                  border-radius: 4px;
                  border: none;
                  cursor: pointer;
                ">
                  View Evacuation Details →
                </button>
              </div>
            </div>
          </div>
        `);

        marker.on('popupopen', () => {
          const btn = document.getElementById(`gis-shelter-btn-${s.id}`);
          if (btn && onSelectShelter) {
            btn.onclick = () => onSelectShelter(s);
          }
        });

        layerGroup.addLayer(marker);
      });
    }

    // 6. Evacuation Corridors & Safe Havens
    if (showCorridors) {
      shelters.forEach((s) => {
        // Safe haven buffer
        const safeHaven = L.circle(s.coordinates, {
          radius: 1200,
          color: '#16a34a',
          weight: 1.2,
          fillColor: '#22c55e',
          fillOpacity: 0.15
        }).bindTooltip(
          `<strong>High-Ground Safe Haven: ${s.name}</strong><br/>Elevation: ${s.elevationM}m MSL (+${s.safetyMarginAboveFloodM}m buffer)`,
          { sticky: true }
        );
        layerGroup.addLayer(safeHaven);

        // Corridor polyline
        const corridorColor = s.roadAccessibility === 'CLEAR' ? '#16a34a' : s.roadAccessibility === 'CAUTION' ? '#d97706' : '#dc2626';
        const corridorLine = L.polyline([basin.coordinates, s.coordinates], {
          color: corridorColor,
          weight: 2.5,
          dashArray: '5, 6',
          opacity: 0.85
        }).bindTooltip(
          `<strong>Evacuation Corridor → ${s.name}</strong><br/>Road Status: <span style="font-weight: bold; color: ${corridorColor};">${s.roadAccessibility}</span>`,
          { sticky: true }
        );
        layerGroup.addLayer(corridorLine);
      });
    }
  }, [basin, gauges, shelters, assessment, showInundation, showGauges, showShelters, showCorridors, showFloodplain]);

  // Primary gauge for quick readout
  const primaryGauge = gauges[0];

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden flex flex-col">
      {/* 1. GIS Operational Map Toolbar */}
      <div className="bg-slate-50 border-b border-slate-200 px-3 sm:px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <span className="font-bold text-slate-800 flex items-center gap-1.5 pr-2 border-r border-slate-300">
            <Layers className="w-4 h-4 text-blue-700" />
            <span>GIS Workspace</span>
          </span>

          {/* Layer Quick Toggles */}
          <button
            onClick={() => setShowInundation(!showInundation)}
            className={`flex items-center gap-1 px-2 py-1 rounded border text-[11px] font-semibold transition-colors ${
              showInundation
                ? 'bg-blue-100 text-blue-900 border-blue-300'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {showInundation ? <CheckSquare className="w-3 h-3 text-blue-700" /> : <Square className="w-3 h-3 text-slate-400" />}
            <span>Inundation</span>
          </button>

          <button
            onClick={() => setShowGauges(!showGauges)}
            className={`flex items-center gap-1 px-2 py-1 rounded border text-[11px] font-semibold transition-colors ${
              showGauges
                ? 'bg-blue-100 text-blue-900 border-blue-300'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {showGauges ? <CheckSquare className="w-3 h-3 text-blue-700" /> : <Square className="w-3 h-3 text-slate-400" />}
            <span>Stations ({gauges.length})</span>
          </button>

          <button
            onClick={() => setShowShelters(!showShelters)}
            className={`flex items-center gap-1 px-2 py-1 rounded border text-[11px] font-semibold transition-colors ${
              showShelters
                ? 'bg-blue-100 text-blue-900 border-blue-300'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {showShelters ? <CheckSquare className="w-3 h-3 text-blue-700" /> : <Square className="w-3 h-3 text-slate-400" />}
            <span>Shelters ({shelters.length})</span>
          </button>

          <button
            onClick={() => setShowCorridors(!showCorridors)}
            className={`flex items-center gap-1 px-2 py-1 rounded border text-[11px] font-semibold transition-colors ${
              showCorridors
                ? 'bg-blue-100 text-blue-900 border-blue-300'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {showCorridors ? <CheckSquare className="w-3 h-3 text-blue-700" /> : <Square className="w-3 h-3 text-slate-400" />}
            <span>Corridors</span>
          </button>

          <button
            onClick={() => setShowFloodplain(!showFloodplain)}
            className={`hidden sm:flex items-center gap-1 px-2 py-1 rounded border text-[11px] font-semibold transition-colors ${
              showFloodplain
                ? 'bg-blue-100 text-blue-900 border-blue-300'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {showFloodplain ? <CheckSquare className="w-3 h-3 text-blue-700" /> : <Square className="w-3 h-3 text-slate-400" />}
            <span>DEM Floodplain</span>
          </button>
        </div>

        {/* Right Toolbar Controls */}
        <div className="flex items-center gap-2">
          {/* Base Map Selector */}
          <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-slate-200">
            <span className="text-[10px] text-slate-500 font-semibold uppercase">Base:</span>
            <select
              value={baseMapStyle}
              onChange={(e) => setBaseMapStyle(e.target.value as any)}
              className="text-[11px] font-semibold bg-transparent text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="osm">OSM Standard</option>
              <option value="esri">Esri Topographic</option>
              <option value="positron">CartoDB Positron</option>
            </select>
          </div>

          {/* Legend toggle */}
          <button
            onClick={() => setShowLegend(!showLegend)}
            className={`px-2 py-1 rounded text-[11px] font-semibold border transition-colors ${
              showLegend
                ? 'bg-slate-200 text-slate-800 border-slate-300'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Legend
          </button>

          {/* Recenter button */}
          <button
            onClick={() => {
              if (mapInstanceRef.current) {
                mapInstanceRef.current.flyTo(basin.coordinates, basin.zoom, { duration: 0.8 });
                mapInstanceRef.current.invalidateSize();
              }
            }}
            title="Recenter Map to Basin Coordinates"
            className="flex items-center gap-1 bg-white hover:bg-slate-50 text-slate-700 px-2 py-1 rounded border border-slate-200 text-[11px] font-semibold transition-colors"
          >
            <Navigation className="w-3 h-3 text-blue-700" />
            <span>Recenter</span>
          </button>
        </div>
      </div>

      {/* 2. Main Map Canvas Container with Floating Operational Panels */}
      <div className="relative w-full h-[500px] sm:h-[580px] lg:h-[620px] bg-slate-100 overflow-hidden">
        {/* Leaflet container */}
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Floating Operational FLOOD STATUS Card (Top-Right) */}
        <div className="absolute top-3 left-3 right-3 sm:left-auto sm:right-3 sm:w-72 z-10 bg-white/95 backdrop-blur-md rounded-md border border-slate-300 shadow-md p-3 sm:p-3.5 pointer-events-auto transition-all">
          <div className="flex items-center justify-between border-b border-slate-200 pb-1.5 mb-2">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-700 tracking-wider">
                Flood Risk Status
              </span>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                  assessment.riskLevel === 'SEVERE'
                    ? 'bg-red-100 text-red-800 border border-red-300'
                    : assessment.riskLevel === 'HIGH'
                    ? 'bg-orange-100 text-orange-800 border border-orange-300'
                    : assessment.riskLevel === 'MODERATE'
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                }`}
              >
                {assessment.riskLevel}
              </span>
            </div>

            <button
              onClick={() => setIsStatusExpanded(!isStatusExpanded)}
              className="sm:hidden text-slate-500 hover:text-slate-800 p-0.5"
              title={isStatusExpanded ? 'Collapse' : 'Expand'}
            >
              {isStatusExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Large Index Score */}
          <div className="flex items-baseline justify-between mb-1.5">
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
                {assessment.overallScore}
              </span>
              <span className="text-xs text-slate-500 font-semibold"> / 100</span>
            </div>
            <span className="text-xs font-semibold text-slate-600">
              Peak: ~{assessment.estimatedTimeToPeakHours}h
            </span>
          </div>

          {isStatusExpanded && (
            <>
              {/* Operational Metrics List */}
              <div className="space-y-1.5 text-xs text-slate-700 pt-1 border-t border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-500">River Stage:</span>
                  <span className="font-semibold font-mono text-slate-900">
                    {primaryGauge ? `${primaryGauge.currentLevelM}m MSL ${primaryGauge.trend === 'rising' ? '↑' : primaryGauge.trend === 'falling' ? '↓' : '→'}` : '--'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">24h Rainfall:</span>
                  <span className="font-semibold font-mono text-slate-900">
                    {primaryGauge ? (assessment.breakdown.weatherScore > 60 ? 'Heavy' : 'Moderate') : '--'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Floodplain Pop:</span>
                  <span className="font-semibold font-mono text-slate-900">
                    {(basin.vulnerablePopulation / 100000).toFixed(1)} Lakh
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Est. Inundation:</span>
                  <span className="font-semibold font-mono text-slate-900">
                    ~{assessment.inundationAreaSqKm} km²
                  </span>
                </div>
              </div>

              {/* Quick Jump Action */}
              {onNavigateToTelemetry && (
                <button
                  onClick={onNavigateToTelemetry}
                  className="mt-2.5 w-full py-1 px-2 rounded bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
                >
                  <span>View River Telemetry Table</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              )}
            </>
          )}
        </div>

        {/* Floating Map Legend (Bottom-Right) */}
        {showLegend && (
          <div className="absolute bottom-3 right-3 z-10 w-52 sm:w-56 bg-white/95 backdrop-blur-md rounded-md border border-slate-300 shadow-md p-2.5 text-xs pointer-events-auto">
            <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-200">
              <span className="font-bold text-[10px] uppercase text-slate-700 tracking-wider">
                GIS Legend
              </span>
              <button
                onClick={() => setShowLegend(false)}
                className="text-slate-400 hover:text-slate-700 text-[10px] font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1.5 text-[11px] text-slate-700">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-600 border border-white shrink-0" />
                <span>Normal Stage (Below WL)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500 border border-white shrink-0" />
                <span>Warning Level (WL Breached)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-600 border border-white shrink-0" />
                <span>Danger Mark (DL Breached)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-sky-600 text-white text-[9px] font-bold flex items-center justify-center shrink-0">H</span>
                <span>Safe High-Ground Shelter</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-0.5 bg-emerald-600 border-b border-emerald-600 shrink-0" />
                <span>Safe Evacuation Corridor</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/25 border border-red-500 shrink-0" />
                <span>Inundation Hazard Buffer</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Station Summary Strip Below Map (FFWC-style Operational Status) */}
      <div className="bg-slate-50 border-t border-slate-200 px-3 sm:px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-slate-600 font-medium">
          <div>
            <span className="text-slate-400">Selected Basin: </span>
            <strong className="text-slate-900">{basin.name}</strong> ({basin.state})
          </div>
          <div>
            <span className="text-slate-400">River Network: </span>
            <strong className="text-slate-900">{basin.riverName}</strong>
          </div>
          <div>
            <span className="text-slate-400">Mean Elevation: </span>
            <strong className="text-slate-900">{basin.averageElevationM}m MSL</strong>
          </div>
          <div>
            <span className="text-slate-400">Catchment: </span>
            <strong className="text-slate-900">{basin.catchmentAreaSqKm.toLocaleString()} km²</strong>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Hydrological Model Synchronized (CWC + Open-Meteo)</span>
        </div>
      </div>
    </div>
  );
};
