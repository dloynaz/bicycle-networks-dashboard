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
};

const StationMap: React.FC<StationMapProps> = ({ stations, networkLocation }) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current) return;

    if (!mapboxgl.accessToken) return;

    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [networkLocation.longitude, networkLocation.latitude],
        zoom: 12,
      });

      map.current.addControl(new mapboxgl.NavigationControl());
    }

    // Clear existing markers
    markers.current.forEach((m) => m.remove());
    markers.current = [];

    stations.forEach((station) => {
      const el = document.createElement('div');
      el.className = 'station-marker';
      el.style.width = '12px';
      el.style.height = '12px';
      el.style.background = '#FF7E5F';
      el.style.borderRadius = '50%';
      el.style.cursor = 'pointer';
      el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';

      const marker = new mapboxgl.Marker(el)
        .setLngLat([station.longitude, station.latitude])
        .setPopup(
          new mapboxgl.Popup({ offset: 12 }).setHTML(
            `<strong>${station.name}</strong><br/>Free: ${station.free_bikes} • Empty: ${station.empty_slots}`
          )
        )
        .addTo(map.current as mapboxgl.Map);

      markers.current.push(marker);
    });

    return () => {
      markers.current.forEach((m) => m.remove());
      markers.current = [];
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [stations, networkLocation]);

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
            html: `<div style="width: 12px; height: 12px; background-color: #FF7E5F; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.2); cursor: pointer;"></div>`,
            iconSize: [12, 12],
            iconAnchor: [6, 6],
            popupAnchor: [0, -6],
          });
          
          const marker = L.marker([station.latitude, station.longitude], { icon }).addTo(leafletMap);
          marker.bindPopup(`<strong>${station.name}</strong><br/>Free: ${station.free_bikes} • Empty: ${station.empty_slots}`);
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
      <div className="w-full h-full relative bg-gray-50 flex items-center justify-center rounded-lg overflow-hidden">
        {leafletLoading ? <div className="text-sm text-gray-500">Loading map…</div> : <div className="text-sm text-gray-500">Mapbox token not set</div>}
        <div ref={mapContainer} className="w-full h-full absolute inset-0" />
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <div ref={mapContainer} className="w-full h-full absolute inset-0" style={{ filter: 'grayscale(100%) brightness(1.1)' }} />
      <button 
        onClick={() => {
          if (map.current) {
            map.current.flyTo({
              center: [networkLocation.longitude, networkLocation.latitude],
              zoom: 13,
              duration: 1000,
            });
          }
        }}
        className="absolute top-3 left-3 px-4 py-2.5 bg-torea-bay-700 text-white rounded-pill shadow-lg hover:shadow-xl transition-shadow flex items-center gap-2 font-semibold text-sm z-20"
      >
        <span>📍</span>
        Near me
      </button>
    </div>
  );
};

export default StationMap;