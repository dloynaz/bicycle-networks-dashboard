import React from 'react';
import { MapPin, Building, ArrowRight } from 'lucide-react';
import type { Network } from '../types';

type Props = {
  network: Network;
  onClick: (id: string) => void;
};

const NetworkCard: React.FC<Props> = ({ network, onClick }) => {
  return (
    <div 
      className="group p-4 bg-white border-b border-zinc-200 cursor-pointer hover:bg-[#e2eafd] hover:shadow-md transition-all duration-200 w-full"
      onClick={() => onClick(network.id)}
    >
      <h2 className="text-base font-bold text-primary">{network.name}</h2>
      <div className="flex items-center gap-2 text-xs text-zinc-500 mt-2">
        <div className="w-5 h-5 rounded-full bg-zinc-100 flex items-center justify-center flex-shrink-0">
          <MapPin className="w-3 h-3 text-accent" />
        </div>
        <span>{network.location.city}, {network.location.country}</span>
      </div>
      <div className="flex items-center gap-2 text-xs text-zinc-500 mt-1.5">
        <div className="w-5 h-5 rounded-full bg-zinc-100 flex items-center justify-center flex-shrink-0">
          <Building className="w-3 h-3 text-accent" />
        </div>
        <span className="truncate flex-1">{network.company?.slice(0, 2).join(', ')}{network.company?.length > 2 ? ` +${network.company.length - 2}` : ''}</span>
        {/* Action aligned exactly with company row; no layout shift */}
        <div className="relative h-10 flex items-center">
          <ArrowRight className="w-4 h-4 text-accent transition-opacity group-hover:opacity-0" />
          <button
            aria-label="Details"
            className="absolute right-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-pill bg-white text-accent shadow-sm overflow-hidden origin-right scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] cursor-pointer"
          >
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">Details</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NetworkCard;
