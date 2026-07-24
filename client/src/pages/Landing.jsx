import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Camera, Plane, ShieldAlert, Sparkles, ArrowRight, Layers, Compass, HelpCircle, FileText, CheckCircle, Code2, Users, Database } from "lucide-react";

function Landing() {
  const ringRef = useRef(null);

  useEffect(() => {
    // Add landing page class to override global body background
    document.body.classList.add("landing-page-active");

    // Scroll reveal animation
    const revealEls = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    revealEls.forEach((el) => io.observe(el));

    // Animate progress ring
    const circumference = 2 * Math.PI * 32;
    const target = 0.72; // 72%
    const ringObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && ringRef.current) {
            ringRef.current.style.transition = "stroke-dashoffset 1.4s cubic-bezier(.22,.61,.36,1)";
            ringRef.current.style.strokeDashoffset = String(circumference * (1 - target));
            ringObserver.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );

    const ticketEl = document.querySelector(".ticket");
    if (ticketEl) {
      ringObserver.observe(ticketEl);
    }

    return () => {
      document.body.classList.remove("landing-page-active");
      io.disconnect();
      ringObserver.disconnect();
    };
  }, []);

  return (
    <div className="landing-container min-h-screen relative overflow-hidden">
      {/* Dynamic Font & Variable CSS Import */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700;9..144,900&family=IBM+Plex+Sans:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        
        body.landing-page-active {
          background-image: none !important;
          background-color: #171D14 !important;
          background: #171D14 !important;
          color: #EFE8D8 !important;
          font-family: 'IBM Plex Sans', sans-serif !important;
        }

        body.landing-page-active header {
          background: rgba(23, 29, 20, 0.88) !important;
          backdrop-filter: blur(10px) !important;
          border-bottom: 1px solid rgba(239,232,216,0.08) !important;
        }

        .landing-container {
          --soil: #171D14;
          --pine: #24371F;
          --pine-light: #2E4527;
          --moss: #6E8C5C;
          --moss-bright: #8FB379;
          --wheat: #C9A227;
          --rust: #A64B2A;
          --rust-bright: #C15832;
          --paper: #EFE8D8;
          --paper-dim: #E4DBC6;
          --ink: #20241A;
          --ink-soft: #4A5040;
          --cream: #F7F3E8;

          background-color: var(--soil) !important;
          color: var(--paper) !important;
          font-family: 'IBM Plex Sans', sans-serif !important;
        }

        .font-display {
          font-family: 'Fraunces', serif !important;
        }

        .font-mono-tag {
          font-family: 'IBM Plex Mono', monospace !important;
        }

        .eyebrow {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .eyebrow::before {
          content: "";
          width: 7px;
          height: 7px;
          background: var(--moss-bright);
          border-radius: 50%;
          flex-shrink: 0;
        }

        .btn-green-primary {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 13px;
          letter-spacing: 0.04em;
          padding: 14px 26px;
          border-radius: 3px;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: var(--moss-bright);
          color: var(--soil);
          font-weight: 600;
          transition: transform .18s ease, background .18s ease;
        }
        .btn-green-primary:hover {
          transform: translateY(-2px);
          background: #a2c98a;
        }

        .btn-green-ghost {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 13px;
          letter-spacing: 0.04em;
          padding: 14px 26px;
          border-radius: 3px;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          border: 1px solid rgba(239,232,216,0.3);
          color: var(--paper);
          transition: transform .18s ease, border-color .18s ease, color .18s ease;
        }
        .btn-green-ghost:hover {
          transform: translateY(-2px);
          border-color: var(--wheat);
          color: var(--wheat);
        }

        /* Topo Grid Line Overlay */
        .topo-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(143,179,121,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(143,179,121,0.04) 1px, transparent 1px);
          background-size: 64px 64px;
          animation: driftGrid 60s linear infinite;
          pointer-events: none;
        }
        @keyframes driftGrid {
          from { background-position: 0 0; }
          to { background-position: 64px 64px; }
        }

        /* Ticket Design */
        .ticket {
          background: var(--cream);
          color: var(--ink);
          border-radius: 6px;
          padding: 26px;
          position: relative;
          box-shadow: 0 30px 70px -20px rgba(0,0,0,0.55);
          transform: rotate(1.2deg);
        }
        .ticket::before, .ticket::after {
          content: "";
          position: absolute;
          width: 22px;
          height: 22px;
          background: var(--soil);
          border-radius: 50%;
          top: 50%;
          transform: translateY(-50%);
        }
        .ticket::before { left: -11px; }
        .ticket::after { right: -11px; }

        .ticket-perf {
          position: absolute;
          left: 0;
          right: 0;
          top: 50%;
          border-top: 2px dashed rgba(32,36,26,0.15);
        }

        .stamp-urgency {
          display: inline-block;
          font-family: 'IBM Plex Mono', monospace;
          font-weight: 600;
          font-size: 11px;
          letter-spacing: 0.05em;
          color: var(--rust);
          border: 1.5px solid var(--rust);
          border-radius: 3px;
          padding: 4px 8px;
          transform: rotate(-2deg);
          text-transform: uppercase;
        }

        .paper-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: rgba(32,36,26,0.14);
          border: 1px solid rgba(32,36,26,0.14);
        }
        @media (max-width: 820px) {
          .paper-grid { grid-template-columns: 1fr; }
        }

        /* Scroll Reveal Utility */
        .reveal {
          opacity: 0;
          transform: translateY(18px);
          transition: opacity .7s ease, transform .7s ease;
        }
        .reveal.in {
          opacity: 1;
          transform: translateY(0);
        }
      ` }} />

      {/* Topo background */}
      <div className="topo-grid"></div>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-20 pb-24 border-b border-white/5 bg-gradient-to-b from-[#24371F]/40 via-[#171D14] to-[#171D14]">
        <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
          <div className="grid md:grid-cols-12 gap-12 items-center">
            
            {/* Left Col Info */}
            <div className="md:col-span-7 space-y-6">
              <div className="eyebrow">FIELD CONSOLE · GOOGLE BUILD WITH GEMMA 2026</div>
              <h1 className="text-4xl sm:text-6xl font-semibold font-display tracking-tight text-white leading-tight">
                High-fidelity crop diagnostics.<br />
                <span className="italic font-normal text-[#8FB379]">Grounded in real-time intelligence.</span>
              </h1>
              <p className="text-[#EFE8D8]/80 text-base sm:text-lg max-w-xl font-light leading-relaxed">
                Green Praxis integrates high-precision drone telemetries, real-time crop pathology diagnostics, and interactive voice-enabled AI advisors to protect crop yield and coordinate estate management over the web.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link to="/scan" className="btn-green-primary">
                  <Sparkles className="w-4 h-4" />
                  Launch Scanner
                </Link>
                <Link to="/chat" className="btn-green-ghost">
                  Ask Gemma Advisor →
                </Link>
              </div>
            </div>

            {/* Right Col Visual Ticket */}
            <div className="md:col-span-5 ticket-wrap reveal">
              <div className="ticket text-[#20241A]">
                <div className="ticket-perf"></div>
                <div className="flex justify-between items-start pb-5">
                  <div className="font-mono-tag text-xs text-[#4A5040] uppercase tracking-wider">
                    FIELD SCAN · BLOCK F4
                    <strong className="block font-display text-2xl font-bold text-[#20241A] mt-1 normal-case tracking-normal">
                      Vitis vinifera
                    </strong>
                  </div>
                  <div className="relative w-20 h-20 flex-shrink-0">
                    <svg width="80" height="80" viewBox="0 0 76 76" className="transform -rotate-90">
                      <circle cx="38" cy="38" r="32" stroke="#E4DBC6" stroke-width="6" fill="none" />
                      <circle
                        ref={ringRef}
                        cx="38"
                        cy="38"
                        r="32"
                        stroke="#6E8C5C"
                        stroke-width="6"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray="201"
                        strokeDashoffset="201"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center font-mono-tag">
                      <b className="text-lg leading-none font-bold">72%</b>
                      <span className="text-[7px] tracking-widest text-[#4A5040] mt-1">RECOVERY</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 grid grid-cols-2 gap-x-5 gap-y-4 font-mono-tag text-[11px]">
                  <div>
                    <label className="block text-[9px] uppercase tracking-wider text-[#4A5040] mb-1">DIAGNOSIS</label>
                    <span className="font-semibold text-sm">Early blight</span>
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase tracking-wider text-[#4A5040] mb-1">YIELD LOSS RISK</label>
                    <span className="font-semibold text-sm">18%</span>
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase tracking-wider text-[#4A5040] mb-1">COORDINATES</label>
                    <span className="font-semibold text-xs">12.9716° N, 77.5946° E</span>
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase tracking-wider text-[#4A5040] mb-1">URGENCY</label>
                    <span className="stamp-urgency">TREAT IN 24H</span>
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-[#32241a]/10 flex justify-between items-center font-mono-tag text-[10px] text-[#4A5040]">
                  <span>SCANNED 04:12 · SYNCED</span>
                  <div className="flex gap-1">
                    <span className="w-2.5 h-2.5 bg-[#20241A] rounded-sm"></span>
                    <span className="w-2.5 h-2.5 bg-[#6E8C5C] rounded-sm"></span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CLOUD & INTELLIGENCE INTEGRATION SECTION */}
      <section className="bg-[#EFE8D8] text-[#20241A] py-24 relative" id="architecture">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="max-w-2xl mb-16 reveal">
            <div className="eyebrow text-[#A64B2A] before:bg-[#A64B2A]">INTEGRATED ARCHITECTURE</div>
            <h2 className="text-3xl sm:text-5xl font-semibold font-display tracking-tight text-[#20241A] mt-4">
              Real-time diagnostic routing & cloud records.
            </h2>
            <p className="text-[#4A5040] text-base mt-4">
              Green Praxis operates on modern cloud infrastructure, securely linking field drone telemetries and crop images with intelligent reasoning agents.
            </p>
          </div>

          <div className="paper-grid reveal">
            <div className="bg-[#F7F3E8] p-8 space-y-4">
              <span className="font-mono-tag text-[#A64B2A] text-xs">01 / REASONING</span>
              <h3 className="text-xl font-semibold font-display text-[#20241A]">Gemma AI Engines</h3>
              <p className="text-[#4A5040] text-xs leading-relaxed">
                Structured crop diagnostics utilize Google Gemma models, analyzing plant morphology, blight severity, and safe crop replanting patterns.
              </p>
            </div>
            <div className="bg-[#F7F3E8] p-8 space-y-4 border-t md:border-t-0 md:border-l border-black/5">
              <span className="font-mono-tag text-[#A64B2A] text-xs">02 / INTERACTIVE SPEECH</span>
              <h3 className="text-xl font-semibold font-display text-[#20241A]">Web Voice Synthesis</h3>
              <p className="text-[#4A5040] text-xs leading-relaxed">
                Seamless spoken queries and spoken answer translations let operators communicate hands-free in English, Hindi, Spanish, French, or Telugu.
              </p>
            </div>
            <div className="bg-[#F7F3E8] p-8 space-y-4 border-t md:border-t-0 md:border-l border-black/5">
              <span className="font-mono-tag text-[#A64B2A] text-xs">03 / DATABASE SYNC</span>
              <h3 className="text-xl font-semibold font-display text-[#20241A]">MongoDB Ledger</h3>
              <p className="text-[#4A5040] text-xs leading-relaxed">
                Every scanned crop, path diagnostic, and coordinates matrix is compiled chronologically, preserving secure season-over-season reports.
              </p>
            </div>
          </div>

          <div className="mt-10 bg-[#20241A] text-[#EFE8D8] rounded-md p-6 flex flex-wrap items-center justify-between gap-6 reveal">
            <div className="font-mono-tag text-xs text-[#EFE8D8]/70">
              HACKATHON ENTRY · COMPREHENSIVE WEB AGRI-TECH
              <strong className="block font-display text-xl text-[#F7F3E8] font-semibold mt-1">
                Google Build with Gemma Submission — 2026
              </strong>
            </div>
            <span className="stamp-urgency border-[#C9A227] text-[#C9A227] select-none">SUBMITTED</span>
          </div>
        </div>
      </section>

      {/* CORE FEATURES FIELD TOOLS */}
      <section className="bg-[#171D14] py-24 border-t border-white/5" id="features">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="max-w-2xl mb-16 reveal">
            <div className="eyebrow text-[#C9A227] before:bg-[#C9A227]">FIELD UTILITIES</div>
            <h2 className="text-3xl sm:text-5xl font-semibold font-display tracking-tight text-[#EFE8D8] mt-4">
              Complete Field Diagnostics Suite
            </h2>
            <p className="text-[#EFE8D8]/60 text-base mt-4">
              Integrated toolsets configured for instant web-based diagnostics.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feat 1 */}
            <div className="bg-[#24371F] border border-white/10 rounded-md p-6 hover:border-[#8FB379] transition-all duration-300 reveal space-y-4">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#8FB379]">
                <Camera className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold font-display text-[#EFE8D8]">Plant Disease Identifier</h3>
              <p className="text-[#EFE8D8]/60 text-xs leading-relaxed">
                Upload crop leaves to evaluate disease, yield loss risk, recovery percentage, and receive customized organic or chemical matrices.
              </p>
            </div>

            {/* Feat 2 */}
            <div className="bg-[#24371F] border border-white/10 rounded-md p-6 hover:border-[#8FB379] transition-all duration-300 reveal space-y-4">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#8FB379]">
                <Plane className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold font-display text-[#EFE8D8]">Drone Multispectral Grid</h3>
              <p className="text-[#EFE8D8]/60 text-xs leading-relaxed">
                Converts crop flight profiles into an interactive 3x3 coordinate matrix (`F1` to `F9`) color-coded by severity indices.
              </p>
              <div className="flex gap-2 flex-wrap pt-2">
                <span className="flex items-center gap-1 text-[8.5px] uppercase font-mono text-[#EFE8D8]/50"><span className="w-2 h-2 rounded bg-emerald-600"></span> H</span>
                <span className="flex items-center gap-1 text-[8.5px] uppercase font-mono text-[#EFE8D8]/50"><span className="w-2 h-2 rounded bg-yellow-500"></span> REC</span>
                <span className="flex items-center gap-1 text-[8.5px] uppercase font-mono text-[#EFE8D8]/50"><span className="w-2 h-2 rounded bg-orange-500"></span> MOD</span>
                <span className="flex items-center gap-1 text-[8.5px] uppercase font-mono text-[#EFE8D8]/50"><span className="w-2 h-2 rounded bg-red-600"></span> SEV</span>
              </div>
            </div>

            {/* Feat 3 */}
            <div className="bg-[#24371F] border border-white/10 rounded-md p-6 hover:border-[#8FB379] transition-all duration-300 reveal space-y-4">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#8FB379]">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold font-display text-[#EFE8D8]">Emergency Rescue Mode</h3>
              <p className="text-[#EFE8D8]/60 text-xs leading-relaxed">
                Instant hazard reporting maps pasture safe-zones vs breach boundaries, outputting print-ready soil reclamation manuals.
              </p>
            </div>

            {/* Feat 4 */}
            <div className="bg-[#24371F] border border-white/10 rounded-md p-6 hover:border-[#8FB379] transition-all duration-300 reveal space-y-4">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#8FB379]">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold font-display text-[#EFE8D8]">Organic vs Chemical Matrix</h3>
              <p className="text-[#EFE8D8]/60 text-xs leading-relaxed">
                Direct side-by-side treatments, mapping organic solutions (Neem oil, Baking soda) against chemical options (Mancozeb) for easy agricultural comparison.
              </p>
            </div>

            {/* Feat 5 */}
            <div className="bg-[#24371F] border border-white/10 rounded-md p-6 hover:border-[#8FB379] transition-all duration-300 reveal space-y-4">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#8FB379]">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold font-display text-[#EFE8D8]">Explainable Diagnosis (XAI)</h3>
              <p className="text-[#EFE8D8]/60 text-xs leading-relaxed">
                Ensures transparency by showing the structural observations leading to crop diagnosis, detailing similarity looks-likes.
              </p>
            </div>

            {/* Feat 6 */}
            <div className="bg-[#24371F] border border-white/10 rounded-md p-6 hover:border-[#8FB379] transition-all duration-300 reveal space-y-4">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#8FB379]">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold font-display text-[#EFE8D8]">Crop Recommender & QR</h3>
              <p className="text-[#EFE8D8]/60 text-xs leading-relaxed">
                Recommends water-tolerant alternative crop rotations post-flood, with QR codes mapping data across smartphones.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DYNAMIC SITE LEDGER / PAGE NAVIGATION */}
      <section className="bg-[#EFE8D8] text-[#20241A] py-24 border-t border-black/5" id="flow">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="max-w-2xl mb-16 reveal">
            <div className="eyebrow text-[#A64B2A] before:bg-[#A64B2A]">PORTAL NAVIGATION</div>
            <h2 className="text-3xl sm:text-5xl font-semibold font-display text-[#20241A] mt-4">
              Four workflows, connected.
            </h2>
            <p className="text-[#4A5040] text-base mt-2">
              Navigate directly to any section of the Green Praxis workspace.
            </p>
          </div>

          <div className="border-t border-[#32241a]/10 divide-y divide-[#32241a]/10 reveal">
            
            {/* Page 1 */}
            <div className="grid md:grid-cols-12 gap-6 py-6 items-center hover:bg-[#F7F3E8]/50 px-2 transition-colors">
              <div className="md:col-span-1 font-mono-tag text-lg text-[#A64B2A] font-bold">01</div>
              <div className="md:col-span-3">
                <span className="block font-mono-tag text-xs text-[#4A5040] uppercase tracking-wider">INTAKE SCANS</span>
                <Link to="/scan" className="text-lg font-bold font-display hover:text-[#A64B2A] transition-colors flex items-center gap-1.5 mt-0.5">
                  /scan <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="md:col-span-6 text-[#4A5040] text-xs">
                Upload crop leaves, configure latitude/longitude GPS data, and trigger drone grid processing directly to the backend.
              </div>
              <div className="md:col-span-2 text-right md:text-right font-mono-tag text-xs text-[#6E8C5C] font-semibold">
                ACTIVE
              </div>
            </div>

            {/* Page 2 */}
            <div className="grid md:grid-cols-12 gap-6 py-6 items-center hover:bg-[#F7F3E8]/50 px-2 transition-colors">
              <div className="md:col-span-1 font-mono-tag text-lg text-[#A64B2A] font-bold">02</div>
              <div className="md:col-span-3">
                <span className="block font-mono-tag text-xs text-[#4A5040] uppercase tracking-wider">LATEST REPORT</span>
                <Link to="/report" className="text-lg font-bold font-display hover:text-[#A64B2A] transition-colors flex items-center gap-1.5 mt-0.5">
                  /report <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="md:col-span-6 text-[#4A5040] text-xs">
                Review estimated survival statistics, detailed recovery timelines, drone severity overlays, and voice-assisted translations.
              </div>
              <div className="md:col-span-2 text-right md:text-right font-mono-tag text-xs text-[#6E8C5C] font-semibold">
                ACTIVE
              </div>
            </div>

            {/* Page 3 */}
            <div className="grid md:grid-cols-12 gap-6 py-6 items-center hover:bg-[#F7F3E8]/50 px-2 transition-colors">
              <div className="md:col-span-1 font-mono-tag text-lg text-[#A64B2A] font-bold">03</div>
              <div className="md:col-span-3">
                <span className="block font-mono-tag text-xs text-[#4A5040] uppercase tracking-wider">CHAT ADVISOR</span>
                <Link to="/chat" className="text-lg font-bold font-display hover:text-[#A64B2A] transition-colors flex items-center gap-1.5 mt-0.5">
                  /chat <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="md:col-span-6 text-[#4A5040] text-xs">
                Query the intelligent agricultural advisor directly. Preloaded with common blights and crop management schedules.
              </div>
              <div className="md:col-span-2 text-right md:text-right font-mono-tag text-xs text-[#6E8C5C] font-semibold">
                ACTIVE
              </div>
            </div>

            {/* Page 4 */}
            <div className="grid md:grid-cols-12 gap-6 py-6 items-center hover:bg-[#F7F3E8]/50 px-2 transition-colors">
              <div className="md:col-span-1 font-mono-tag text-lg text-[#A64B2A] font-bold">04</div>
              <div className="md:col-span-3">
                <span className="block font-mono-tag text-xs text-[#4A5040] uppercase tracking-wider">MERN TIMELINE</span>
                <Link to="/dashboard" className="text-lg font-bold font-display hover:text-[#A64B2A] transition-colors flex items-center gap-1.5 mt-0.5">
                  /dashboard <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="md:col-span-6 text-[#4A5040] text-xs">
                Inspect historical scans cached in MongoDB, search reports by coordinate or crop metadata, and manage archival data.
              </div>
              <div className="md:col-span-2 text-right md:text-right font-mono-tag text-xs text-[#A64B2A] font-semibold">
                ARCHIVE
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ABOUT & DEVELOPERS SECTION */}
      <section className="bg-[#171D14] py-24 border-t border-white/5" id="about">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          
          <div className="grid md:grid-cols-12 gap-12">
            
            {/* About Vision */}
            <div className="md:col-span-5 space-y-6 reveal">
              <div className="eyebrow text-[#8FB379] before:bg-[#8FB379]">THE BRAND VISION</div>
              <h2 className="text-3xl sm:text-4xl font-semibold font-display text-white">
                Green Praxis
              </h2>
              <p className="text-[#EFE8D8]/70 text-xs sm:text-sm leading-relaxed font-light">
                Developed as a modern agronomist assistant, Green Praxis bridges complex AI reasoning models with day-to-day farming tasks. By structuring diagnosis alerts, providing local organic/chemical side-by-side matrices, and mapping coordinates dynamically, we help estate operators navigate environmental stress and pathogen outbreaks safely.
              </p>
              <div className="p-4 border border-white/10 rounded-md bg-[#24371F]/40 space-y-2">
                <span className="font-mono-tag text-[#8FB379] text-[10px] block uppercase tracking-wider">Development Stack</span>
                <div className="flex gap-2 flex-wrap font-mono-tag text-[9px] text-[#EFE8D8]/60">
                  <span className="bg-white/5 px-2 py-1 rounded">React 18</span>
                  <span className="bg-white/5 px-2 py-1 rounded">FastAPI</span>
                  <span className="bg-white/5 px-2 py-1 rounded">MongoDB</span>
                  <span className="bg-white/5 px-2 py-1 rounded">Web Speech API</span>
                  <span className="bg-white/5 px-2 py-1 rounded">Google Gemma</span>
                </div>
              </div>
            </div>

            {/* Developers / Team Section */}
            <div className="md:col-span-7 space-y-6 reveal">
              <div className="eyebrow text-[#C9A227] before:bg-[#C9A227]">PROJECT DEVELOPERS</div>
              <h2 className="text-3xl sm:text-4xl font-semibold font-display text-white">
                Core Contributors
              </h2>
              
              <div className="grid sm:grid-cols-2 gap-4">
                
                {/* Dev 1 */}
                <div className="border border-white/10 rounded-md p-4 bg-[#24371F]/20 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-[#8FB379]/10 flex items-center justify-center text-[#8FB379]">
                      <Code2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white font-mono-tag">Lead Engineer</h4>
                      <span className="text-[10px] text-[#EFE8D8]/60">Full-Stack & FastAPI Integration</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-[#EFE8D8]/60 leading-relaxed">
                    Engineered client routes, MERN timeline syncing, and multi-language transcription helpers.
                  </p>
                </div>

                {/* Dev 2 */}
                <div className="border border-white/10 rounded-md p-4 bg-[#24371F]/20 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-[#8FB379]/10 flex items-center justify-center text-[#8FB379]">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white font-mono-tag">AI Specialist</h4>
                      <span className="text-[10px] text-[#EFE8D8]/60">Gemma Model Optimization</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-[#EFE8D8]/60 leading-relaxed">
                    Configured natural language dialog flows, explainability rationales, and structured disease lookups.
                  </p>
                </div>

                {/* Dev 3 */}
                <div className="border border-white/10 rounded-md p-4 bg-[#24371F]/20 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-[#8FB379]/10 flex items-center justify-center text-[#8FB379]">
                      <Compass className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white font-mono-tag">UI Designer</h4>
                      <span className="text-[10px] text-[#EFE8D8]/60">Aesthetic Layouts & Interactions</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-[#EFE8D8]/60 leading-relaxed">
                    Designed the high-fidelity serif layout systems, interactive progressive tickers, and custom palette values.
                  </p>
                </div>

                {/* Dev 4 */}
                <div className="border border-white/10 rounded-md p-4 bg-[#24371F]/20 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-[#8FB379]/10 flex items-center justify-center text-[#8FB379]">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white font-mono-tag">Project Coordinator</h4>
                      <span className="text-[10px] text-[#EFE8D8]/60">Operations & QA Testing</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-[#EFE8D8]/60 leading-relaxed">
                    Coordinated drone mapping flight simulators and managed user workflows testing.
                  </p>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* CLOSING BANNER */}
      <section className="relative overflow-hidden py-24 text-center border-t border-white/5 bg-gradient-to-b from-[#171D14] to-[#24371F]/30">
        <div className="topo-grid"></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-semibold font-display text-white reveal">
            Protect your yield from anywhere.
          </h2>
          <p className="text-[#EFE8D8]/70 text-sm sm:text-base max-w-xl mx-auto reveal font-light leading-relaxed">
            Connect your fields to the future. Inspect diagnostic reports, recovery plans, and safety maps immediately over the web.
          </p>
          <div className="flex gap-4 justify-center flex-wrap pt-2 reveal">
            <Link to="/scan" className="btn-green-primary">Launch Scanner</Link>
            <Link to="/chat" className="btn-green-ghost">Ask Gemma Advisor</Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#20241A] py-10 border-t border-white/5 relative z-10 text-[#EFE8D8]/40">
        <div className="max-w-7xl mx-auto px-6 md:px-8 flex flex-col sm:flex-row justify-between items-center gap-6">
          <p className="font-mono-tag text-xs">
            Green Praxis — Modern Agricultural Management.
          </p>
          <div className="flex gap-6 font-mono-tag text-xs">
            <a href="#architecture" className="hover:text-white transition-colors">Architecture</a>
            <a href="#features" className="hover:text-white transition-colors">Field Tools</a>
            <a href="#flow" className="hover:text-white transition-colors">Pages</a>
            <a href="#about" className="hover:text-white transition-colors">About & Team</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
