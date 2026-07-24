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

        {/* ABOUT INFO PANEL - Inspired by Monstera Wikipedia Card Layout */}
        <section className="frosted-glass border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/10 via-transparent to-transparent pointer-events-none"></div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Left Column: Title & Metadata style */}
            <div className="md:col-span-1 space-y-6 md:border-r md:border-white/10 md:pr-8">
              <div>
                <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Overview</span>
                <h2 className="text-3xl font-bold font-serif-editorial text-white mt-1">
                  AgriRescue <br />
                  <span className="italic text-emerald-400">Project Console</span>
                </h2>
              </div>

              {/* Layout Details list mimicking reference card */}
              <div className="space-y-4 text-xs">
                <div className="border-t border-white/5 pt-3">
                  <span className="text-slate-400 block font-semibold">Hackathon Event</span>
                  <span className="text-white font-bold">Google Build with Gemma</span>
                </div>
                <div className="border-t border-white/5 pt-3">
                  <span className="text-slate-400 block font-semibold">AI Intelligence Model</span>
                  <span className="text-white font-bold">Gemma 4 Multimodal Pipeline</span>
                </div>
                <div className="border-t border-white/5 pt-3">
                  <span className="text-slate-400 block font-semibold">Deployment Context</span>
                  <span className="text-white font-bold">Offline Local WLAN Hotspot</span>
                </div>
                <div className="border-t border-white/5 pt-3">
                  <span className="text-slate-400 block font-semibold">Visual Palette System</span>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#051f0b] border border-white/10" title="Dark Green"></span>
                    <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 border border-white/10" title="Soft Green"></span>
                    <span className="w-3.5 h-3.5 rounded-full bg-white border border-white/10" title="Light Accent"></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Three Core Pillars (Cause, AI, Event) */}
            <div className="md:col-span-2 space-y-6 md:pl-4">
              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-emerald-300 uppercase tracking-widest flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-emerald-400" />
                  01. The Cause
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed font-light">
                  Remote agritourism estates, organic farms, and boutique vineyards are highly susceptible to crop damage. When blights or flooding strike, there is typically no internet connectivity and no agricultural expert nearby. AgriRescue AI solves this urgent problem by letting farm operators run expert diagnoses and verify terrain safety immediately, even without cellular networks.
                </p>
              </div>

              <div className="space-y-1.5 border-t border-white/5 pt-4">
                <h3 className="text-sm font-bold text-emerald-300 uppercase tracking-widest flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  02. The AI Architecture
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed font-light">
                  Leveraging Google's **Gemma 4** multimodal models, the app runs entirely at the edge. By processing leaf images (Plant Health Checker) or drone flight frames (Disaster Field Checker), Gemma 4 diagnoses crop illnesses, estimates soil reclamation roadmaps, and checks coordinates to generate guest hazard alerts.
                </p>
              </div>

              <div className="space-y-1.5 border-t border-white/5 pt-4">
                <h3 className="text-sm font-bold text-emerald-300 uppercase tracking-widest flex items-center gap-2">
                  <Compass className="w-4 h-4 text-emerald-400" />
                  03. The Event Focus
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed font-light">
                  Designed for the **Google Build with Gemma Hackathon**, this project demonstrates the powerful application of lightweight, edge-compatible generative models in real-world scenarios. By removing dependencies on external servers or heavy cloud infrastructures, it brings critical tools to underserved agricultural communities.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURE TIMELINE SECTION - Inspired by Numbered Grid Reference */}
        <section className="space-y-8">
          <div className="text-center space-y-1.5">
            <span className="text-[10px] font-bold text-emerald-400 tracking-widest uppercase">Features</span>
            <h2 className="text-3xl font-bold font-serif-editorial text-white">
              Core Modules & Workflows
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Module 1 */}
            <div className="border border-white/10 rounded-2xl p-5 bg-black/10 relative hover:border-white/20 transition-all flex flex-col justify-between h-[230px]">
              <div>
                <span className="text-3xl font-extrabold text-white/10 font-serif-editorial">01</span>
                <h4 className="text-base font-bold text-white font-serif-editorial mt-1">Plant Health Checker</h4>
                <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                  Analyze handheld crop foliage captures. Instantly detect pathogen anomalies (early blight, powdery mildew) and receive organic treatment roadmaps.
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-400 mt-4">
                <Camera className="w-3.5 h-3.5" /> Mobile Scan Mode
              </div>
            </div>

            {/* Module 2 */}
            <div className="border border-white/10 rounded-2xl p-5 bg-black/10 relative hover:border-white/20 transition-all flex flex-col justify-between h-[230px]">
              <div>
                <span className="text-3xl font-extrabold text-white/10 font-serif-editorial">02</span>
                <h4 className="text-base font-bold text-white font-serif-editorial mt-1">Disaster Field Checker</h4>
                <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                  Process flight telemetry profiles. Map 2D grid coordinates for silt levels, evaluate estimated crop damage, and view reclamation roadmaps.
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-400 mt-4">
                <Plane className="w-3.5 h-3.5" /> Aerial Drone Grid
              </div>
            </div>

            {/* Module 3 */}
            <div className="border border-white/10 rounded-2xl p-5 bg-black/10 relative hover:border-white/20 transition-all flex flex-col justify-between h-[230px] md:col-span-2 lg:col-span-1">
              <div>
                <span className="text-3xl font-extrabold text-white/10 font-serif-editorial">03</span>
                <h4 className="text-base font-bold text-white font-serif-editorial mt-1">Guest Zone Safeguards</h4>
                <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                  Correlate crop contamination GPS maps with walking paths to secure public agritourism routes and guest safety zones immediately.
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-semibold text-rose-400 mt-4">
                <ShieldAlert className="w-3.5 h-3.5" /> Hazard Safeguards
              </div>
            </div>

          </div>
        </section>

        {/* BOTTOM CALL TO ACTION */}
        <section className="text-center py-6">
          <p className="text-[10px] tracking-widest text-slate-400 uppercase font-bold">Get Started</p>
          <div className="mt-4 flex justify-center gap-4">
            <Link to="/scan" className="btn-pill-primary text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-lg">
              Launch Console
            </Link>
            <Link to="/dashboard" className="btn-pill-secondary text-xs font-bold cursor-pointer">
              Timeline Dashboard
            </Link>
          </div>
        </section>

      </main>
    </div>
  );
}

export default Landing;
