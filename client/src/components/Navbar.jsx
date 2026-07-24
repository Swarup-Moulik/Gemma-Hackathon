import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

function Navbar() {
  const location = useLocation();

  return (
    <header className="border-b border-white/10 bg-slate-950/40 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-primary text-primary-foreground rounded-lg group-hover:opacity-90 transition-opacity">
            <Leaf className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg tracking-tight">
            AgriRescue AI
          </span>
        </Link>

        {/* Status Badge & Actions */}
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground border border-border">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Offline Gemma Engine Active
          </span>

          <Link
            to="/scan"
            className={`text-sm font-semibold transition-colors ${
              location.pathname === '/scan'
                ? 'text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Inspect Console
          </Link>

          <Link
            to="/dashboard"
            className={`text-sm font-semibold transition-colors ${
              location.pathname === '/dashboard'
                ? 'text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            History Timeline
          </Link>

          {/* Theme Toggle Button */}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

export default Navbar;
