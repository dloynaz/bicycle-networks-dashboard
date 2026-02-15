import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import countryData from '../data/countries.json';

type Props = {
  search: string;
  selectedCountry: string;
  onSearchChange: (v: string) => void;
  onCountryChange: (v: string) => void;
};

// SearchControls provides the network search box and country filter dropdown.
const SearchControls: React.FC<Props> = ({ search, selectedCountry, onSearchChange, onCountryChange }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter country list by the local dropdown search term.
  const filteredCountries = useMemo(
    () => countryData.data.filter((country) => country.name.toLowerCase().includes(countrySearch.toLowerCase())),
    [countrySearch]
  );

  // Close the dropdown when clicking outside the control.
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        setCountrySearch('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCountrySelect = useCallback(
    (countryName: string) => {
      onCountryChange(countryName);
      setIsDropdownOpen(false);
      setCountrySearch('');
    },
    [onCountryChange]
  );

  const handleToggleDropdown = useCallback(() => {
    setIsDropdownOpen((prev) => !prev);
  }, []);

  return (
    <div className="flex items-center gap-6">
      <div className="relative flex-1 min-w-0">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
        <input
          type="text"
          placeholder="Search network"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full h-12 pl-14 pr-5 bg-white rounded-pill border border-zinc-200 focus:outline-none focus:ring-4 focus:ring-primary/20 text-sm text-secondary placeholder:text-secondary/60"
        />
      </div>

      <div className="relative w-[150px] flex-none" ref={dropdownRef}>
        <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary z-10 pointer-events-none" />
        <button
          onClick={handleToggleDropdown}
          className="w-full h-12 pl-14 pr-5 bg-white rounded-pill border border-zinc-200 focus:outline-none focus:ring-4 focus:ring-primary/20 text-sm text-secondary cursor-pointer text-left"
        >
          {selectedCountry || 'Country'}
        </button>
        
        {isDropdownOpen && (
          <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg border border-zinc-200 z-50 overflow-hidden">
            <div className="p-3 border-b border-zinc-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search country"
                  value={countrySearch}
                  onChange={(e) => setCountrySearch(e.target.value)}
                  className="w-full h-9 pl-10 pr-3 bg-white rounded border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm text-zinc-900 placeholder:text-zinc-400"
                  autoFocus
                />
              </div>
            </div>
            
            <div className="max-h-64 overflow-y-auto">
              <button
                onClick={() => handleCountrySelect('')}
                className="w-full px-4 py-2.5 text-left text-sm text-zinc-900 hover:bg-zinc-50 transition-colors cursor-pointer"
              >
                Country
              </button>
              {filteredCountries.map((country) => (
                <button
                  key={country.code}
                  onClick={() => handleCountrySelect(country.name)}
                  className="w-full px-4 py-2.5 text-left text-sm text-zinc-900 hover:bg-zinc-50 transition-colors cursor-pointer"
                >
                  {country.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchControls;
