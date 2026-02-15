'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import 'leaflet/dist/leaflet.css';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

type MapProps = {
  networks: Array<{
    id: string;
    location: { latitude: number; longitude: number };
    name: string;
  }>;
  onNetworkClick: (id: string) => void;
  userLocation?: { lat: number; lng: number } | null;
};

// Map renders the overview map with network markers and optional user location.
const Map: React.FC<MapProps> = ({ networks, onNetworkClick, userLocation }) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const userMarker = useRef<mapboxgl.Marker | null>(null);
  const hasMapboxToken = Boolean(mapboxgl.accessToken);

  // Clear all network markers from the map.
  const clearMarkers = useCallback(() => {
    markers.current.forEach((m) => m.remove());
    markers.current = [];
  }, []);

  useEffect(() => {
    if (!mapContainer.current || !hasMapboxToken) return;

    // Initialize the Mapbox map once.
    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [0, 20],
        zoom: 2,
      });
    }

    return () => {
      clearMarkers();
      if (userMarker.current) {
        userMarker.current.remove();
        userMarker.current = null;
      }
      if (map.current) {
        try {
          map.current.remove();
        } catch (e) {
        }
        map.current = null;
      }
    };
  }, [clearMarkers, hasMapboxToken]);

  useEffect(() => {
    if (!map.current) return;

    clearMarkers();

    // Render a marker and popup for each network.
    networks.forEach((network) => {
      if (!network.location || !network.location.latitude || !network.location.longitude) return;
      const el = document.createElement('div');
      el.className = 'w-3.5 h-3.5 bg-accent rounded-full cursor-pointer hover:opacity-90 transition shadow-md';
      el.setAttribute('role', 'button');
      el.setAttribute('tabindex', '0');
      el.setAttribute('aria-label', `Open ${network.name} details`);

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([network.location.longitude, network.location.latitude])
        .addTo(map.current!);

      el.addEventListener('click', () => {
        onNetworkClick(network.id);
      });
      el.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onNetworkClick(network.id);
        }
      });

      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
        `<div class="font-semibold text-sm">${network.name}</div>`
      );

      marker.setPopup(popup);
      markers.current.push(marker);
    });
  }, [clearMarkers, networks, onNetworkClick]);

  useEffect(() => {
    if (!map.current || !userLocation) return;

    if (userMarker.current) {
      userMarker.current.remove();
    }

    const el = document.createElement('div');
    el.className = 'w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg';
    el.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.2)';

    userMarker.current = new mapboxgl.Marker({ element: el })
      .setLngLat([userLocation.lng, userLocation.lat])
      .addTo(map.current);

    map.current.flyTo({
      center: [userLocation.lng, userLocation.lat],
      zoom: 12,
      duration: 1000,
    });
  }, [userLocation]);

  // Leaflet fallback state for environments without a Mapbox token.
  const [leafletLoading, setLeafletLoading] = useState(false);
  const [leafletError, setLeafletError] = useState<string | null>(null);
  useEffect(() => {
    if (hasMapboxToken) return;
    if (!mapContainer.current) return;

    let leafletMap: any = null;
    let leafletMarkers: any[] = [];
    let mounted = true;

    const loadLeaflet = async () => {
      try {
        setLeafletLoading(true);
        setLeafletError(null);
        const L = (await import('leaflet')) as any;

        if (!mounted) return;
        leafletMap = L.map(mapContainer.current!, { center: [20, 0], zoom: 2 });
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
        }).addTo(leafletMap);

        networks.forEach((network) => {
          if (!network.location?.latitude || !network.location?.longitude) return;
          const icon = L.divIcon({
            className: 'leaflet-custom-icon',
            html: `<div class="marker-dot marker-dot-network"></div>`,
            iconSize: [18, 18],
            iconAnchor: [9, 9],
          });

          const marker = L.marker([network.location.latitude, network.location.longitude], { icon }).addTo(leafletMap);
          marker.on('click', () => onNetworkClick(network.id));
          marker.bindPopup(`<strong>${network.name}</strong>`);
          leafletMarkers.push(marker);
        });
      } catch (e) {
        setLeafletError('Unable to load the fallback map.');
      } finally {
        if (mounted) setLeafletLoading(false);
      }
    };

    loadLeaflet();

    return () => {
      mounted = false;
      try {
        leafletMarkers.forEach((m) => m.remove());
        if (leafletMap) leafletMap.remove();
      } catch (e) {
      }
    };
  }, [hasMapboxToken, networks, onNetworkClick]);

  if (!hasMapboxToken) {
    return (
      <div ref={mapContainer} className="w-full h-full overflow-hidden bg-gray-50 flex items-center justify-center map-grayscale">
        {leafletLoading ? <div className="text-sm text-gray-500">Loading map…</div> : null}
        {!leafletLoading && leafletError ? <div className="text-sm text-gray-500">{leafletError}</div> : null}
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <div ref={mapContainer} className="w-full h-full overflow-hidden absolute inset-0 map-grayscale" />
    </div>
  );
};

export default Map;