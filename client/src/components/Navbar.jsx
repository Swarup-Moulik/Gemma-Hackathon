import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import axios from 'axios';
import ThemeToggle from './ThemeToggle';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const triggerEmergencyRescue = async () => {
    if (loading) return;
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("scanMode", "emergency");
      
      const response = await axios.post("http://localhost:8000/api/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      if (response.data && response.data.id) {
        navigate(`/report?id=${response.data.id}`);
      }
    } catch (err) {
      console.error("Emergency rescue request failed:", err);
      alert("Failed to compile emergency report. Ensure local server is running on port 8000.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="border-b border-white/10 bg-slate-950/40 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-primary text-primary-foreground rounded-lg group-hover:opacity-90 transition-opacity">
            <Leaf className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg tracking-tight">
            Green Praxis
          </span>
        </Link>

        {/* Status Badge & Actions */}
        <div className="flex items-center gap-4">
          <span className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground border border-border">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Gemma AI Engine Online
          </span>

          <button
            onClick={triggerEmergencyRescue}
            disabled={loading}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? "Compiling..." : "🚨 Emergency Rescue"}
          </button>

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
            to="/chat"
            className={`text-sm font-semibold transition-colors ${
              location.pathname === '/chat'
                ? 'text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Ask Gemma
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
