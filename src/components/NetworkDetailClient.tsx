'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, MapPin, Building } from 'lucide-react';
import StationMap from './StationMap';
import type { Network } from '../types';

type Props = {
  network: Network;
};

export default function NetworkDetailClient({ network }: Props) {
  const [sortBy, setSortBy] = useState<'free_bikes' | 'empty_slots'>('free_bikes');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [stationsPerPage] = useState(10);
  const router = useRouter();

  const sortedStations = [...(network.stations || [])].sort((a, b) => {
    const value = sortBy === 'free_bikes' ? a.free_bikes - b.free_bikes : a.empty_slots - b.empty_slots;
    return sortOrder === 'asc' ? value : -value;
  });

  const indexOfLastStation = currentPage * stationsPerPage;
  const indexOfFirstStation = indexOfLastStation - stationsPerPage;
  const currentStations = sortedStations.slice(indexOfFirstStation, indexOfLastStation);
  const totalPages = Math.ceil(sortedStations.length / stationsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy, sortOrder]);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950 font-sans flex flex-col overflow-hidden h-screen">
      {/* Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-96 bg-white border-r border-zinc-200 overflow-y-auto flex flex-col">
          {/* Back Button & Network Title */}
          <div className="p-6 border-b border-zinc-200">
            <button 
              onClick={() => router.back()} 
              className="mb-4 text-sm text-torea-bay-800 font-semibold flex items-center gap-2 hover:gap-3 transition-all"
            >
              <ChevronLeft className="w-5 h-5 flex-shrink-0" strokeWidth={2.5} /> Back
            </button>
            <h2 className="text-2xl font-bold text-torea-bay-800">{network.name}</h2>
          </div>

          {/* Network Info Card */}
          <div className="p-6 border-b border-zinc-200">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-grenadier-500/10 rounded-lg flex items-center justify-center flex-shrink-0 text-grenadier-500 text-xl">
                🚴
              </div>
              <div className="flex-1">
                <p className="text-xs text-zinc-600 flex items-center gap-1.5 font-medium">
                  <MapPin className="w-4 h-4 text-grenadier-500 flex-shrink-0" strokeWidth={2} />
                  {network.location.city}, {network.location.country}
                </p>
                <p className="text-xs text-zinc-600 flex items-start gap-1.5 mt-2 font-medium">
                  <Building className="w-4 h-4 text-grenadier-500 flex-shrink-0 mt-0.5" strokeWidth={2} />
                  <span className="truncate">{network.company.join(', ')}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Stations List Header */}
          <div className="px-6 py-4 border-b border-zinc-200">
            <div className="flex items-center justify-between gap-2 mb-3">
              <h3 className="font-bold text-torea-bay-800 text-sm">
                All <span className="bg-grenadier-500 text-white px-2 py-0.5 rounded-lg text-xs font-bold">{sortedStations.length}</span> stations
              </h3>
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-zinc-200">
                  <th className="text-left py-2 font-bold text-torea-bay-800">STATION NAME</th>
                  <th className="text-right py-2 font-bold text-torea-bay-800 whitespace-nowrap">FREE BIKES</th>
                  <th className="text-right py-2 font-bold text-torea-bay-800 whitespace-nowrap">EMPTY SLOTS</th>
                </tr>
              </thead>
            </table>
          </div>

          {/* Stations Table Body */}
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-xs">
              <tbody>
                {currentStations.map((station) => (
                  <tr key={station.id} className="border-b border-zinc-200 hover:bg-zinc-50 transition">
                    <td className="p-4 text-torea-bay-800 font-medium">{station.name}</td>
                    <td className="p-4 text-right font-bold text-torea-bay-800">{station.free_bikes}</td>
                    <td className="p-4 text-right font-bold text-torea-bay-800">{station.empty_slots}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-6 border-t border-zinc-200">
              <div className="flex justify-center items-center gap-1">
                <button 
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} 
                  disabled={currentPage === 1} 
                  className="p-1.5 text-torea-bay-800 disabled:text-zinc-300 disabled:cursor-not-allowed hover:text-torea-bay-700 transition"
                >
                  <ChevronLeft className="w-4 h-4" strokeWidth={2} />
                </button>
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = currentPage > 3 ? currentPage - 2 + i : i + 1;
                    if (pageNum > totalPages) return null;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-8 h-8 rounded-lg font-semibold text-xs transition-all ${
                          currentPage === pageNum 
                            ? 'bg-torea-bay-800 text-white' 
                            : 'bg-zinc-100 text-torea-bay-800 hover:bg-zinc-200'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button 
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} 
                  disabled={currentPage === totalPages} 
                  className="p-1.5 text-torea-bay-800 disabled:text-zinc-300 disabled:cursor-not-allowed hover:text-torea-bay-700 transition"
                >
                  <ChevronLeft className="w-4 h-4 rotate-180" strokeWidth={2} />
                </button>
              </div>
            </div>
          )}
        </aside>

        {/* Map Container */}
        <main className="flex-1 overflow-hidden relative">
          <StationMap stations={network.stations || []} networkLocation={network.location} />
        </main>
      </div>
    </div>
  );
}
