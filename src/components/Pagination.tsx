import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Props = {
  current: number;
  total: number;
  onPage: (n: number) => void;
};

const Pagination: React.FC<Props> = ({ current, total, onPage }) => {
  if (total <= 1) return null;
  
  const pages = Math.min(5, total);
  
  return (
    <div className="flex justify-center items-center gap-2">
      <button 
        onClick={() => onPage(Math.max(1, current - 1))} 
        disabled={current === 1} 
        className="p-1.5 text-torea-bay-800 disabled:text-zinc-300 disabled:cursor-not-allowed hover:text-torea-bay-700 transition"
      >
        <ChevronLeft className="w-5 h-5" strokeWidth={1.5} />
      </button>
      
      <div className="flex gap-1">
        {Array.from({ length: pages }, (_, i) => {
          const pageNum = current > 3 ? current - 2 + i : i + 1;
          if (pageNum > total) return null;
          const isSelected = current === pageNum;
          return (
            <button 
              key={pageNum} 
              onClick={() => onPage(pageNum)} 
              className={isSelected ? 'w-8 h-8 rounded-lg font-bold text-sm bg-torea-bay-800 text-white shadow-md transition-all' : 'w-8 h-8 rounded-lg font-bold text-sm bg-white border-2 border-zinc-200 text-torea-bay-800 hover:border-zinc-300 transition-all'}
            >
              {pageNum}
            </button>
          );
        })}
        {total > 5 && <span className="text-zinc-300 text-xs px-1">…</span>}
      </div>
      
      <button 
        onClick={() => onPage(Math.min(total, current + 1))} 
        disabled={current === total} 
        className="p-1.5 text-torea-bay-800 disabled:text-zinc-300 disabled:cursor-not-allowed hover:text-torea-bay-700 transition"
      >
        <ChevronRight className="w-5 h-5" strokeWidth={1.5} />
      </button>
    </div>
  );
};

export default Pagination;
