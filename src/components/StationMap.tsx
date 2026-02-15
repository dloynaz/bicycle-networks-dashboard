'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import 'leaflet/dist/leaflet.css';

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
};

// StationMap renders the station-level map with markers and popups for a network.
const StationMap: React.FC<StationMapProps> = ({ stations, networkLocation }) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const hasMapboxToken = Boolean(mapboxgl.accessToken);

  const clearMarkers = useCallback(() => {
    markers.current.forEach((m) => m.remove());
    markers.current = [];
  }, []);

  useEffect(() => {
    if (!mapContainer.current || !hasMapboxToken) return;

    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [networkLocation.longitude, networkLocation.latitude],
        zoom: 12,
      });
    }

    return () => {
      clearMarkers();
      if (map.current) {
        try {
          map.current.remove();
        } catch (e) {
        }
        map.current = null;
      }
    };
  }, [clearMarkers, hasMapboxToken, networkLocation.latitude, networkLocation.longitude]);

  useEffect(() => {
    if (!map.current) return;

    clearMarkers();

    stations.forEach((station) => {
      if (!station.latitude || !station.longitude) return;
      const el = document.createElement('div');
      el.className = 'w-3.5 h-3.5 rounded-full bg-emerald-400 shadow-md';
      el.setAttribute('role', 'button');
      el.setAttribute('tabindex', '0');
      el.setAttribute('aria-label', `View station ${station.name}`);

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([station.longitude, station.latitude])
        .addTo(map.current!);

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

      const popup = new mapboxgl.Popup({ offset: 20 }).setHTML(popupHTML);
      marker.setPopup(popup);
      el.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          marker.togglePopup();
        }
      });
      markers.current.push(marker);
    });
  }, [clearMarkers, stations]);

  useEffect(() => {
    if (!map.current) return;

    map.current.flyTo({
      center: [networkLocation.longitude, networkLocation.latitude],
      zoom: 12,
      duration: 800,
    });
  }, [networkLocation.latitude, networkLocation.longitude]);

  // Leaflet fallback loading state when Mapbox token is unavailable.
  const [leafletLoading, setLeafletLoading] = useState(false);
  const [leafletError, setLeafletError] = useState<string | null>(null);
  useEffect(() => {
    if (hasMapboxToken) return;
    if (!mapContainer.current) return;

    let L: any = null;
    let leafletMap: any = null;
    const leafletMarkers: any[] = [];
    let mounted = true;

    const init = async () => {
      try {
        setLeafletLoading(true);
        setLeafletError(null);
        L = (await import('leaflet')) as any;

        if (!mounted) return;
        // Initialize Leaflet map at the network location.
        leafletMap = L.map(mapContainer.current!, { center: [networkLocation.latitude, networkLocation.longitude], zoom: 12 });
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
        }).addTo(leafletMap);

        stations.forEach((station) => {
          if (!station.latitude || !station.longitude) return;
          
          const icon = L.divIcon({
            className: '',
            html: `<div style="width: 12px; height: 12px; background-color: var(--accent); border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.2); cursor: pointer;"></div>`,
            iconSize: [12, 12],
            iconAnchor: [6, 6],
            popupAnchor: [0, -6],
          });
          
          // Popup content mirrors the station details shown in the table.
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
        setLeafletError('Unable to load the fallback map.');
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
      }
    };
  }, [hasMapboxToken, stations, networkLocation]);

  if (!hasMapboxToken) {
    return (
      <div className="w-full h-full relative bg-gray-50 flex items-center justify-center overflow-hidden">
        {leafletLoading ? <div className="text-sm text-gray-500">Loading map…</div> : null}
        {!leafletLoading && leafletError ? <div className="text-sm text-gray-500">{leafletError}</div> : null}
        {!leafletLoading && !leafletError ? <div className="text-sm text-gray-500">Mapbox token not set</div> : null}
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

export default StationMap;

