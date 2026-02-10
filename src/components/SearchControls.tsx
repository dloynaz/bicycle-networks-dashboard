import React from 'react';
import { Search, MapPin } from 'lucide-react';
import countryData from '../data/countries.json';

type Props = {
  search: string;
  selectedCountry: string;
  onSearchChange: (v: string) => void;
  onCountryChange: (v: string) => void;
};

const SearchControls: React.FC<Props> = ({ search, selectedCountry, onSearchChange, onCountryChange }) => {
  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zinc-500" />
        <input
          type="text"
          placeholder="Search network"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full h-12 pl-10 pr-4 border border-zinc-200 rounded-pill shadow-sm focus:outline-none focus:ring-2 focus:ring-torea-bay-800 focus:border-transparent text-sm"
        />
      </div>
      <div className="relative">
        <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zinc-500" />
        <select
          value={selectedCountry}
          onChange={(e) => onCountryChange(e.target.value)}
          className="w-full h-12 pl-10 pr-4 border border-zinc-200 rounded-pill shadow-sm focus:outline-none focus:ring-2 focus:ring-torea-bay-800 focus:border-transparent text-sm appearance-none bg-white cursor-pointer"
        >
          <option value="">Country</option>
          {countryData.data.map((country) => (
            <option key={country.code} value={country.name}>
              {country.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SearchControls;
