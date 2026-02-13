'use client';

import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import 'leaflet/dist/leaflet.css';
import { useState } from 'react';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

type Station = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  free_bikes: number;
  empty_slots: number;
};

type StationMapProps = {
  stations: Station[];
  networkLocation: { latitude: number; longitude: number };
  selectedStationId?: string;
  onStationClick?: (stationId: string) => void;
  userLocation?: { lat: number; lng: number } | null;
};

const StationMap: React.FC<StationMapProps> = ({ stations, networkLocation, selectedStationId, onStationClick, userLocation }) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);

  const [leafletLoading, setLeafletLoading] = useState(false);
  useEffect(() => {
    if (mapboxgl.accessToken) return; // only use Leaflet fallback when no Mapbox token
    if (!mapContainer.current) return;

    let L: any = null;
    let leafletMap: any = null;
    const leafletMarkers: any[] = [];
    let mounted = true;

    const init = async () => {
      try {
        setLeafletLoading(true);
        // @ts-ignore - dynamic import of Leaflet; types may not be installed in the workspace
        L = (await import('leaflet')) as any;

        if (!mounted) return;
        leafletMap = L.map(mapContainer.current!, { center: [networkLocation.latitude, networkLocation.longitude], zoom: 12 });
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
        }).addTo(leafletMap);

        stations.forEach((station) => {
          if (!station.latitude || !station.longitude) return;
          
          // Create a custom div icon with coral styling
          const icon = L.divIcon({
            className: '',
            html: `<div style="width: 12px; height: 12px; background-color: var(--accent); border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.2); cursor: pointer;"></div>`,
            iconSize: [12, 12],
            iconAnchor: [6, 6],
            popupAnchor: [0, -6],
          });
          
          const popupHTML = `
            <div class="station-popup-content">
              <div class="station-popup-title">${station.name}</div>
              <div class="station-popup-row">
                <span class="station-popup-label">Free bikes</span>
                <span class="station-popup-value">${station.free_bikes}</span>
              </div>
              <div class="station-popup-row">
                <span class="station-popup-label">Empty slots</span>
                <span class="station-popup-value">${station.empty_slots}</span>
              </div>
            </div>
          `;
          
          const marker = L.marker([station.latitude, station.longitude], { icon }).addTo(leafletMap);
          marker.bindPopup(popupHTML, { className: 'station-popup' });
          leafletMarkers.push(marker);
        });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Leaflet fallback failed', e);
      } finally {
        if (mounted) setLeafletLoading(false);
      }
    };

    init();

    return () => {
      mounted = false;
      try {
        leafletMarkers.forEach((m) => m.remove());
        if (leafletMap) leafletMap.remove();
      } catch (e) {
        // ignore
      }
    };
  }, [stations, networkLocation]);

  if (!mapboxgl.accessToken) {
    return (
      <div className="w-full h-full relative bg-gray-50 flex items-center justify-center overflow-hidden">
        {leafletLoading ? <div className="text-sm text-gray-500">Loading map…</div> : <div className="text-sm text-gray-500">Mapbox token not set</div>}
        <div ref={mapContainer} className="w-full h-full absolute inset-0 map-grayscale" />
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <div ref={mapContainer} className="w-full h-full absolute inset-0 map-grayscale" />
    </div>
  );
};

// Pan to selected station when provided
// Separate effect to avoid remounting the entire map
// and ensure smooth focus updates
export default StationMap;

