"use client";

import React, { useEffect, useState } from 'react';
import { MapPin, Building, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Map from '../components/Map';
import countryData from '../data/countries.json';
import Header from '../components/Header';
import SearchControls from '../components/SearchControls';
import NetworkCard from '../components/NetworkCard';
import Pagination from '../components/Pagination';
import { fetchNetworks } from '../lib/api';
import type { Network } from '../types';

const HomePage = () => {
  const router = useRouter();
  const [networks, setNetworks] = useState<Network[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [networksPerPage] = useState(12);

  // Initialize from URL params on client
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSearch(params.get('search') || '');
    setSelectedCountry(params.get('country') || '');
    setCurrentPage(parseInt(params.get('page') || '1'));
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchNetworks();
        setNetworks(data);
      } catch (error) {
        console.error('Error fetching networks:', error);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (selectedCountry) params.set('country', selectedCountry);
    if (currentPage > 1) params.set('page', currentPage.toString());

    const queryString = params.toString();
    router.replace(queryString ? `/?${queryString}` : '/');
  }, [search, selectedCountry, currentPage, router]);

  const handleCountryChange = (value: string) => {
    setSelectedCountry(value);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const filteredNetworks = networks.filter((network) => {
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

      // If network has a 2-letter code, compare with countries.json
      if (net.length === 2) {
        const entry = countryData.data.find((c) => c.code.toLowerCase() === net);
        if (entry && entry.name.toLowerCase() === sel) return true;
      }

      // If selected country is a code, compare
      if (sel.length === 2) {
        if (net === sel) return true;
        const entry = countryData.data.find((c) => c.code.toLowerCase() === sel);
        if (entry && entry.name.toLowerCase() === net) return true;
      }

      // fallback to partial match
      if (net.includes(sel) || sel.includes(net)) return true;
      return false;
    })();

    return matchesSearch && matchesCountry;
  });

  const indexOfLastNetwork = currentPage * networksPerPage;
  const indexOfFirstNetwork = indexOfLastNetwork - networksPerPage;
  const currentNetworks = filteredNetworks.slice(indexOfFirstNetwork, indexOfLastNetwork);
  const totalPages = Math.ceil(filteredNetworks.length / networksPerPage);

  const handleNetworkClick = (id: string) => {
    router.push(`/network/${id}`);
  };

  return (
    <div className="h-screen w-screen bg-zinc-50 text-zinc-950 font-sans flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-96 bg-white border-r border-zinc-200 overflow-hidden flex flex-col">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-zinc-200 flex-shrink-0">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-grenadier-500/10 rounded-full flex items-center justify-center text-grenadier-500 font-bold">
              🚴
            </div>
            <span className="text-sm font-semibold text-grenadier-500">CycleMap</span>
          </div>
          <h2 className="text-2xl font-bold text-torea-bay-800 mb-4">Discover bike networks</h2>
          <p className="text-xs text-zinc-500 leading-relaxed">Lorem ipsum dolor sit amet consectetur. A volutpat adipiscing placerat turpis magna sem tempor amet faucibus.</p>
        </div>

        {/* Search Controls */}
        <div className="p-6 border-b border-zinc-200 flex-shrink-0">
          <SearchControls
            search={search}
            selectedCountry={selectedCountry}
            onSearchChange={(v) => setSearch(v)}
            onCountryChange={(v) => handleCountryChange(v)}
          />
        </div>

        {/* Networks List - Scrollable */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="p-6 space-y-3">
            {currentNetworks.length > 0 ? (
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

        {/* Pagination - Fixed at Bottom */}
        <div className="p-6 border-t border-zinc-200 flex-shrink-0">
          <Pagination current={currentPage} total={totalPages} onPage={(n) => setCurrentPage(n)} />
        </div>
      </div>

      {/* Map Container - Full Height */}
      <main className="flex-1 h-screen overflow-hidden">
        <Map networks={filteredNetworks.map((n) => ({ id: n.id, name: n.name, location: n.location }))} onNetworkClick={handleNetworkClick} />
      </main>
    </div>
  );
};

export default HomePage;
