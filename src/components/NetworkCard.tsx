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
      className="p-4 bg-white rounded-lg border border-zinc-200 cursor-pointer hover:shadow-md transition-all duration-200"
      onClick={() => onClick(network.id)}
    >
      <h2 className="text-base font-bold text-torea-bay-800">{network.name}</h2>
      <div className="flex items-center gap-2 text-xs text-zinc-500 mt-2">
        <MapPin className="w-3.5 h-3.5 text-grenadier-500 flex-shrink-0" />
        <span>{network.location.city}, {network.location.country}</span>
      </div>
      <div className="flex items-center gap-2 text-xs text-zinc-500 mt-1.5">
        <Building className="w-3.5 h-3.5 text-grenadier-500 flex-shrink-0" />
        <span className="truncate">{network.company?.slice(0, 2).join(', ')}{network.company?.length > 2 ? ` +${network.company.length - 2}` : ''}</span>
      </div>
      <div className="mt-3 pt-3 border-t border-zinc-200">
        <button className="text-grenadier-500 text-xs flex items-center gap-1.5 font-semibold hover:gap-2 transition-all">
          Details <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default NetworkCard;
