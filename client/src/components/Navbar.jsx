import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Leaf, Menu, X } from "lucide-react";
import axios from "axios";
import ThemeToggle from "./ThemeToggle";

const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const triggerEmergencyRescue = async () => {
    if (loading) return;
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("scanMode", "emergency");

      const response = await axios.post(
        `${BACKEND_URL}/api/analyze`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      if (response.data && response.data.id) {
        navigate(`/report?id=${response.data.id}`);
      }
    } catch (err) {
      console.error("Emergency rescue request failed:", err);
      alert(
        "Failed to compile emergency report. Ensure local server is running.",
      );
    } finally {
      setLoading(false);
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { label: "Inspect Console", path: "/scan" },
    { label: "Ask Gemma", path: "/chat" },
    { label: "History Timeline", path: "/dashboard" },
  ];

  return (
    <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-2">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="p-1.5 bg-emerald-600 text-white rounded-lg group-hover:opacity-90 transition-opacity">
            <Leaf className="w-5 h-5" />
          </div>
          <span className="font-bold text-base sm:text-lg tracking-tight text-white whitespace-nowrap">
            Green Praxis
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden xl:flex items-center gap-5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Gemma AI Online
          </span>

          <button
            onClick={triggerEmergencyRescue}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-all cursor-pointer whitespace-nowrap disabled:opacity-50"
          >
            {loading ? "Compiling..." : "🚨 Emergency Rescue"}
          </button>

          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
                location.pathname === link.path
                  ? "text-white underline underline-offset-4 decoration-emerald-500"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}

          <a
            href="#about"
            onClick={(e) => {
              e.preventDefault();
              if (location.pathname !== "/") {
                window.location.href = "/#about";
              } else {
                const el = document.getElementById("about");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="text-xs sm:text-sm font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
          >
            About & Team
          </a>

          <ThemeToggle />
        </div>

        {/* Tablet / Compact Controls (when screen is narrow) */}
        <div className="flex xl:hidden items-center gap-2">
          <button
            onClick={triggerEmergencyRescue}
            disabled={loading}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20"
          >
            {loading ? "..." : "🚨 Emergency"}
          </button>

          <ThemeToggle />

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-white/5 text-slate-300 hover:text-white border border-white/10"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile / Narrow Screen Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-slate-950 border-b border-white/10 px-4 py-4 space-y-3 animate-fadeIn">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block py-2 text-sm font-semibold ${
                location.pathname === link.path
                  ? "text-emerald-400 font-bold"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="#about"
            onClick={(e) => {
              e.preventDefault();
              setMobileMenuOpen(false);
              if (location.pathname !== "/") {
                window.location.href = "/#about";
              } else {
                const el = document.getElementById("about");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="block py-2 text-sm font-semibold text-slate-300 hover:text-white"
          >
            About & Team
          </a>
        </div>
      )}
    </header>
  );
}

export default Navbar;
