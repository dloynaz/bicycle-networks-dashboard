'use client';

import React, { useEffect, useRef, useState } from 'react';
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
};

const Map: React.FC<MapProps> = ({ networks, onNetworkClick }) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (!mapContainer.current || !mapboxgl.accessToken) return;

    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [0, 20],
        zoom: 2,
      });
    }

    return () => {
      markers.current.forEach((m) => m.remove());
      markers.current = [];
      // Do not remove map here to preserve it if component re-renders; Next will unload when unmounting
      if (map.current) {
        try {
          map.current.remove();
        } catch (e) {
          // ignore
        }
        map.current = null;
      }
    };
    // run once for init/unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Manage markers whenever networks change
  useEffect(() => {
    if (!map.current) return;

    // clear previous markers
    markers.current.forEach((m) => m.remove());
    markers.current = [];

    networks.forEach((network) => {
      if (!network.location || !network.location.latitude || !network.location.longitude) return;
      const el = document.createElement('div');
      el.className = 'w-3.5 h-3.5 bg-grenadier-500 rounded-full cursor-pointer hover:opacity-90 transition shadow-md';

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([network.location.longitude, network.location.latitude])
        .addTo(map.current!);

      el.addEventListener('click', () => {
        onNetworkClick(network.id);
      });

      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
        `<div class="font-semibold text-sm">${network.name}</div>`
      );

      marker.setPopup(popup);
      markers.current.push(marker);
    });
  }, [networks, onNetworkClick]);

  // If Mapbox token is missing, use Leaflet + OpenStreetMap tiles as a free interactive fallback.
  const [leafletLoading, setLeafletLoading] = useState(false);
  useEffect(() => {
    if (mapboxgl.accessToken) return; // Leaflet fallback only when no token
    if (!mapContainer.current) return;

    let leafletMap: any = null;
    let leafletMarkers: any[] = [];
    let mounted = true;

    const loadLeaflet = async () => {
      try {
        setLeafletLoading(true);
        const L = (await import('leaflet')) as any;

        if (!mounted) return;
        leafletMap = L.map(mapContainer.current!, { center: [20, 0], zoom: 2 });
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
        }).addTo(leafletMap);

        networks.forEach((network) => {
          if (!network.location?.latitude || !network.location?.longitude) return;
          // use a div icon to avoid default image asset issues
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
        console.error('Leaflet fallback failed', e);
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
        // ignore
      }
    };
  }, [networks, onNetworkClick]);

  const handleNearMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          if (map.current) {
            map.current.flyTo({
              center: [longitude, latitude],
              zoom: 12,
              duration: 1000,
            });
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          alert('Unable to get your location. Please enable location services.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  if (!mapboxgl.accessToken) {
    return (
      <div ref={mapContainer} className="w-full h-full overflow-hidden bg-gray-50 flex items-center justify-center">
        {leafletLoading ? <div className="text-sm text-gray-500">Loading map…</div> : null}
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <div ref={mapContainer} className="w-full h-full overflow-hidden absolute inset-0" style={{ filter: 'grayscale(100%) brightness(1.1)' }} />
      <button 
        onClick={handleNearMe}
        className="absolute top-3 left-3 px-4 py-2.5 bg-torea-bay-700 text-white rounded-pill shadow-lg hover:shadow-xl transition-shadow flex items-center gap-2 font-semibold text-sm z-20"
      >
        <span>📍</span>
        Near me
      </button>
    </div>
  );
};

export default Map;