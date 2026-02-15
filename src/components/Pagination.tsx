import React, { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getPageNumbers } from '../lib/pagination';

type Props = {
  current: number;
  total: number;
  onPage: (n: number) => void;
};

// Pagination renders page navigation controls for list views.
const Pagination: React.FC<Props> = ({ current, total, onPage }) => {
  if (total <= 1) return null;
  
  // Limit the number of visible page buttons for compact UI.
  const pages = useMemo(() => getPageNumbers(current, total, 5), [current, total]);
  
  return (
    <div className="flex justify-center items-center gap-2">
      <button 
        onClick={() => onPage(Math.max(1, current - 1))} 
        disabled={current === 1} 
        className="p-1.5 text-primary disabled:text-zinc-300 disabled:cursor-not-allowed hover:text-secondary transition cursor-pointer"
      >
        <ChevronLeft className="w-5 h-5" strokeWidth={1.5} />
      </button>
      
      <div className="flex gap-1">
        {pages.map((pageNum) => {
          const isSelected = current === pageNum;
          return (
            <button 
              key={pageNum} 
              onClick={() => onPage(pageNum)} 
              className={isSelected ? 'w-8 h-8 rounded-lg font-bold text-sm bg-primary text-primary-foreground shadow-md transition-all cursor-pointer' : 'w-8 h-8 rounded-lg font-bold text-sm bg-white border-2 border-zinc-200 text-primary hover:border-zinc-300 transition-all cursor-pointer'}
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
        className="p-1.5 text-primary disabled:text-zinc-300 disabled:cursor-not-allowed hover:text-secondary transition cursor-pointer"
      >
        <ChevronRight className="w-5 h-5" strokeWidth={1.5} />
      </button>
    </div>
  );
};

export default Pagination;
