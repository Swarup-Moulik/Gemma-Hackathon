import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Leaf } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

function Navbar() {
  const location = useLocation();

  return (
    <header className="border-b border-border bg-background/60 backdrop-blur-2xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="p-2.5 bg-primary text-primary-foreground rounded-2xl group-hover:scale-105 transition-transform shadow-md">
            <Leaf className="w-6 h-6" />
          </div>
          <span className="font-bold text-2xl tracking-tight text-foreground font-editorial">
            AgriRescue AI
          </span>
        </Link>

        {/* Status Badge & Navigation Links */}
        <div className="flex items-center gap-6">
          <span className="hidden sm:inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-secondary text-secondary-foreground border border-border">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Offline Gemma Engine
          </span>

          <Link
            to="/scan"
            className={`text-sm font-semibold transition-colors ${
              location.pathname === "/scan"
                ? "text-primary underline underline-offset-4 decoration-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Inspect Console
          </Link>

          <Link
            to="/dashboard"
            className={`text-sm font-semibold transition-colors ${
              location.pathname === "/dashboard"
                ? "text-primary underline underline-offset-4 decoration-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            History Timeline
          </Link>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

export default Navbar;
