"use client";

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Locate, Bike } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Map from '../components/Map';
import countryData from '../data/countries.json';
import SearchControls from '../components/SearchControls';
import NetworkCard from '../components/NetworkCard';
import Pagination from '../components/Pagination';
import { fetchNetworks } from '../lib/api';
import type { Network as BikeNetwork } from '../types';

const NETWORKS_PER_PAGE = 12;

// HomePage renders the main networks dashboard with filters, list, pagination, and map.
const HomePage = () => {
  const router = useRouter();
  const [networks, setNetworks] = useState<BikeNetwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Initialize client state from URL params for shareable state.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSearch(params.get('search') || '');
    setSelectedCountry(params.get('country') || '');
    setCurrentPage(parseInt(params.get('page') || '1'));
  }, []);

  const loadNetworks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchNetworks();
      setNetworks(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to load networks.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch network list on mount.
  useEffect(() => {
    loadNetworks();
  }, [loadNetworks]);

  // Keep URL in sync with filters and pagination.
  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (selectedCountry) params.set('country', selectedCountry);
    if (currentPage > 1) params.set('page', currentPage.toString());

    const queryString = params.toString();
    router.replace(queryString ? `/?${queryString}` : '/');
  }, [search, selectedCountry, currentPage, router]);

  const handleCountryChange = useCallback((value: string) => {
    setSelectedCountry(value);
    setCurrentPage(1);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setCurrentPage(1);
  }, []);

  // Apply search and country filters client-side.
  const filteredNetworks = useMemo<BikeNetwork[]>(() => {
    return networks.filter((network) => {
      const matchesSearch =
        network.name.toLowerCase().includes(search.toLowerCase()) ||
        network.company?.some((company) => company.toLowerCase().includes(search.toLowerCase()));

      const matchesCountry = (() => {
        if (!selectedCountry) return true;
        const sel = selectedCountry.trim().toLowerCase();
        const netCountryRaw = (network.location.country || '').trim();
        const net = netCountryRaw.toLowerCase();
        if (!net) return false;

        if (net === sel) return true;

        if (net.length === 2) {
          const entry = countryData.data.find((c) => c.code.toLowerCase() === net);
          if (entry && entry.name.toLowerCase() === sel) return true;
        }

        if (sel.length === 2) {
          if (net === sel) return true;
          const entry = countryData.data.find((c) => c.code.toLowerCase() === sel);
          if (entry && entry.name.toLowerCase() === net) return true;
        }

        if (net.includes(sel) || sel.includes(net)) return true;
        return false;
      })();

      return matchesSearch && matchesCountry;
    });
  }, [networks, search, selectedCountry]);

  // Derive pagination values from filtered results.
  const totalPages = useMemo(
    () => Math.ceil(filteredNetworks.length / NETWORKS_PER_PAGE),
    [filteredNetworks.length]
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages || 1);
    }
  }, [currentPage, totalPages]);

  const currentNetworks = useMemo<BikeNetwork[]>(() => {
    const indexOfLastNetwork = currentPage * NETWORKS_PER_PAGE;
    const indexOfFirstNetwork = indexOfLastNetwork - NETWORKS_PER_PAGE;
    return filteredNetworks.slice(indexOfFirstNetwork, indexOfLastNetwork);
  }, [currentPage, filteredNetworks]);

  // Navigate to the network detail page.
  const handleNetworkClick = useCallback(
    (id: string) => {
      router.push(`/network/${id}`);
    },
    [router]
  );

  const mapNetworks = useMemo(
    () => filteredNetworks.map((n: BikeNetwork) => ({ id: n.id, name: n.name, location: n.location })),
    [filteredNetworks]
  );

  // Locate the user and navigate to the nearest network.
  const handleNearMe = useCallback(() => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    if (filteredNetworks.length === 0) {
      alert('No networks are available to search nearby.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        
        // Find nearest network
        let nearestNetworkId: string | null = null;
        let minDistance = Infinity;
        
        filteredNetworks.forEach((network) => {
          if (network.location?.latitude && network.location?.longitude) {
            // Calculate distance using Haversine formula
            const R = 6371; // Earth's radius in km
            const dLat = (network.location.latitude - latitude) * Math.PI / 180;
            const dLon = (network.location.longitude - longitude) * Math.PI / 180;
            const a = 
              Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(latitude * Math.PI / 180) * Math.cos(network.location.latitude * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            const distance = R * c;
            
            if (distance < minDistance) {
              minDistance = distance;
              nearestNetworkId = network.id;
            }
          }
        });
        
        if (nearestNetworkId) {
          // Navigate to nearest network detail page
          router.push(`/network/${nearestNetworkId}`);
        }
      },
      (error) => {
        alert('Unable to get your location. Please enable location services.');
      }
    );
  }, [filteredNetworks, router]);

  return (
    <div className="h-screen w-screen bg-zinc-50 text-zinc-950 font-sans flex overflow-hidden relative">
      <div className="w-[551px] bg-white overflow-hidden flex flex-col">
        <div className="p-4 flex-shrink-0">
          <div className="flex items-center gap-2 mb-4">
            <Bike className="w-5 h-5 text-accent" strokeWidth={2} />
            <span className="text-lg font-semibold text-accent">CycleMap</span>
          </div>
          <h2 className="text-2xl font-bold text-primary mb-4">Discover bike networks</h2>
          <p className="text-xs text-zinc-500 leading-relaxed">Lorem ipsum dolor sit amet consectetur. A volutpat adipiscing placerat turpis magna sem tempor amet faucibus.</p>
        </div>

        <div className="p-4 flex-shrink-0">
          <SearchControls
            search={search}
            selectedCountry={selectedCountry}
            onSearchChange={handleSearchChange}
            onCountryChange={handleCountryChange}
          />
        </div>

        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="px-0 py-0 space-y-0">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="px-4 py-4 border-b border-zinc-200 animate-pulse">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-zinc-200 rounded-full flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="h-5 bg-zinc-200 rounded w-3/4 mb-2" />
                      <div className="h-3 bg-zinc-200 rounded w-1/2 mb-1" />
                      <div className="h-3 bg-zinc-200 rounded w-2/3" />
                    </div>
                  </div>
                </div>
              ))
            ) : error ? (
              <div className="text-center py-8 text-zinc-500">
                <p className="text-sm">{error}</p>
                <button
                  type="button"
                  onClick={loadNetworks}
                  className="mt-3 inline-flex items-center justify-center rounded-pill border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-primary hover:bg-zinc-50"
                >
                  Try again
                </button>
              </div>
            ) : currentNetworks.length > 0 ? (
              currentNetworks.map((network) => (
                <NetworkCard key={network.id} network={network} onClick={handleNetworkClick} />
              ))
            ) : (
              <div className="text-center py-8 text-zinc-500">
                <p className="text-sm">No networks found</p>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 flex-shrink-0">
          <Pagination current={currentPage} total={totalPages} onPage={(n) => setCurrentPage(n)} />
        </div>
      </div>

      <main className="flex-1 h-screen overflow-hidden min-w-0">
        <Map 
          networks={mapNetworks} 
          onNetworkClick={handleNetworkClick}
          userLocation={userLocation}
        />
      </main>

      <button 
        onClick={handleNearMe}
        className="hidden md:flex px-4 py-2.5 bg-primary text-primary-foreground rounded-pill shadow-lg hover:shadow-xl transition-shadow items-center gap-2 font-semibold text-sm z-[9999] cursor-pointer"
        style={{ position: 'absolute', left: '610px', bottom: '790px' }}
      >
        <Locate className="w-5 h-5" />
        Near me
      </button>
    </div>
  );
};

export default HomePage;
