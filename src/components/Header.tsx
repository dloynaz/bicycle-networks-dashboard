import React from 'react';
import { MapPin } from 'lucide-react';

// Header renders the branded hero header used in the app.
const Header: React.FC = () => {
  return (
    <header className="p-8 bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto">
        {/* Brand block */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center text-accent">
            <MapPin className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium">CycleMap</span>
        </div>
        <h1 className="text-4xl font-bold">Discover bike networks</h1>
        <p className="text-sm opacity-90 mt-2">Lorem ipsum dolor sit amet consectetur. A volutpat adipiscing placerat turpis magna sem tempor amet faucibus.</p>
      </div>
    </header>
  );
};

export default Header;
