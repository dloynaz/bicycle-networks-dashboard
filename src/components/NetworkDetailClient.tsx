"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, MapPin, Building } from 'lucide-react';
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

  const [selectedStationId, setSelectedStationId] = useState<string | null>(null);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="min-h-screen bg-zinc-50 font-sans flex overflow-hidden h-screen relative">
      {/* Sidebar */}
      <aside className="w-[551px] bg-[#1c2266] overflow-hidden flex flex-col">
        {/* Media Header with Gradient */}
        <div className="relative h-44">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "url('https://images.pexels.com/photos/1084069/pexels-photo-1084069.jpeg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1c2266]/80 via-[#1c2266]/75 to-[#1c2266]" />
          <button onClick={() => router.back()} className="absolute top-3 left-3 w-9 h-9 rounded-full bg-white/90 text-accent shadow-md flex items-center justify-center cursor-pointer">
            <ChevronLeft className="w-5 h-5" strokeWidth={2.5} />
          </button>
          <div className="absolute bottom-4 left-4 right-4">
            <h2 className="text-2xl font-bold text-white">{network.name}</h2>
            <p className="text-xs text-white/80 mt-1 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-white/90" strokeWidth={2} />
              {network.location.city}, {network.location.country}
            </p>
            <p className="text-xs text-white/80 mt-1 flex items-center gap-2">
              <Building className="w-4 h-4 text-white/90 flex-shrink-0" strokeWidth={2} />
              <span className="truncate">{network.company.join(', ')}</span>
            </p>
          </div>
        </div>

        {/* All Stations Counter */}
        <div className="px-6 py-4">
          <div className="inline-flex items-center gap-2">
            <span className="text-sm text-white/90">All</span>
            <span className="px-3 py-1 border-2 border-accent rounded text-sm font-bold text-white">
              {network.stations?.length || 0}
            </span>
            <span className="text-sm text-white/90">stations</span>
          </div>
        </div>

        {/* Stations Table - single table to align columns */}
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-xs table-fixed text-white">
            <colgroup>
              <col style={{ width: '55%' }} />
              <col style={{ width: '22.5%' }} />
              <col style={{ width: '22.5%' }} />
            </colgroup>
            <thead>
              <tr className="border-b border-white/20 border-dashed">
                <th className="text-left py-3 px-6 font-bold tracking-wide uppercase text-white/90">Station Name</th>
                <th 
                  className="text-center py-3 px-6 font-bold tracking-wide uppercase whitespace-nowrap text-white/90 cursor-pointer hover:text-white transition-colors"
                  onClick={() => {
                    if (sortBy === 'free_bikes') {
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    } else {
                      setSortBy('free_bikes');
                      setSortOrder('desc');
                    }
                  }}
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>Free Bikes</span>
                    <span className="text-xs">{sortBy === 'free_bikes' ? (sortOrder === 'asc' ? '↑' : '↓') : '↕'}</span>
                  </div>
                </th>
                <th 
                  className="text-center py-3 px-6 font-bold tracking-wide uppercase whitespace-nowrap text-white/90 cursor-pointer hover:text-white transition-colors"
                  onClick={() => {
                    if (sortBy === 'empty_slots') {
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    } else {
                      setSortBy('empty_slots');
                      setSortOrder('desc');
                    }
                  }}
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>Empty Slots</span>
                    <span className="text-xs">{sortBy === 'empty_slots' ? (sortOrder === 'asc' ? '↑' : '↓') : '↕'}</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {currentStations.map((station) => (
                <tr
                  key={station.id}
                  className="group border-b border-white/20 border-dashed cursor-pointer transition-colors duration-200 hover:bg-white/5"
                  onClick={() => setSelectedStationId(station.id)}
                >
                  <td className="p-4 px-6 font-medium text-white relative overflow-hidden">
                    <span className="inline-block transition-transform duration-300 ease-out group-hover:translate-x-2">
                      {station.name}
                    </span>
                  </td>
                  <td className="p-4 px-6 text-center font-extrabold text-white">{station.free_bikes}</td>
                  <td className="p-4 px-6 text-center font-extrabold text-white">{station.empty_slots}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4">
            <div className="flex justify-center items-center gap-2">
              <button 
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} 
                disabled={currentPage === 1} 
                className="p-1.5 text-white disabled:text-white/30 disabled:cursor-not-allowed hover:text-accent transition cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" strokeWidth={1.5} />
              </button>
              
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = currentPage > 3 ? currentPage - 2 + i : i + 1;
                  if (pageNum > totalPages) return null;
                  const isSelected = currentPage === pageNum;
                  return (
                    <button 
                      key={pageNum} 
                      onClick={() => setCurrentPage(pageNum)} 
                      className={isSelected 
                        ? 'w-8 h-8 rounded-lg font-bold text-sm bg-accent text-white shadow-md transition-all cursor-pointer' 
                        : 'w-8 h-8 rounded-lg font-bold text-sm bg-white border-2 border-white/20 text-primary hover:border-accent transition-all cursor-pointer'}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                {totalPages > 5 && <span className="text-white/50 text-xs px-1">…</span>}
              </div>
              
              <button 
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} 
                disabled={currentPage === totalPages} 
                className="p-1.5 text-white disabled:text-white/30 disabled:cursor-not-allowed hover:text-accent transition cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* Map Container - Full Screen */}
      <main className="flex-1 overflow-hidden relative">
        <StationMap 
          stations={network.stations || []} 
          networkLocation={network.location} 
          selectedStationId={selectedStationId ?? undefined}
          onStationClick={setSelectedStationId}
          userLocation={null} 
        />
      </main>
    </motion.div>
  );
}
 
