import React from "react";
import { Link } from "react-router-dom";
import { Camera, Plane, ShieldAlert, Sparkles, ArrowRight, Layers, Compass, HelpCircle } from "lucide-react";

function Landing() {
  return (
    <div className="min-h-screen text-slate-100 flex flex-col relative overflow-hidden">
      {/* Editorial Decorative Background overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/20 via-transparent to-transparent pointer-events-none"></div>
      <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-emerald-700/5 rounded-full blur-[120px] pointer-events-none"></div>

<main className="flex-1 max-w-5xl mx-auto w-full px-6 py-12 md:py-16 space-y-20 relative z-10">
        
        {/* HERO SECTION - Inspired by Cover Leaf Reference */}
        <section className="text-center space-y-6 max-w-3xl mx-auto py-8">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase bg-white/5 border border-white/10 text-emerald-400">
            <Sparkles className="w-3 h-3" />
            Google Build with Gemma Hackathon
          </div>
          
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-white font-serif-editorial leading-tight">
            Guardians of the <br />
            <span className="italic text-emerald-300">Off-Grid Fields</span>
          </h1>
          
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto font-light leading-relaxed">
            AgriRescue AI safeguards remote agritourism sites, vineyards, and tea estates by deploying local Gemma 4 intelligence completely offline.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link to="/scan" className="btn-pill-primary text-xs font-bold tracking-wide flex items-center gap-1.5 shadow-lg">
              Launch Inspect Console
              <ArrowRight className="w-4 h-4 text-emerald-950" />
            </Link>
            <Link to="/dashboard" className="btn-pill-secondary text-xs font-bold tracking-wide">
              View History Timeline
            </Link>
          </div>
        </section>
