import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Camera, Plane, ShieldAlert, Sparkles, ArrowRight, Layers, Compass, HelpCircle, Code2, Users, Database } from "lucide-react";

function Landing() {
  const ringRef = useRef(null);

  useEffect(() => {
    // Add class to body to override global index.css body background
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
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => io.observe(el));

    // Animate progress ring once ticket is visible
    const circumference = 2 * Math.PI * 32;
    const target = 0.72; // 72%
    let animated = false;
    const ringObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !animated && ringRef.current) {
            animated = true;
            ringRef.current.style.transition = "stroke-dashoffset 1.4s cubic-bezier(.22,.61,.36,1)";
            ringRef.current.style.strokeDashoffset = String(circumference * (1 - target));
            ringObserver.disconnect();
          }
        });
      },
      { threshold: 0.4 }
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
    <div className="landing-container relative overflow-hidden">
      {/* CSS Rules directly matching green-praxis-landing.html */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700;9..144,900&family=IBM+Plex+Sans:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        
        body.landing-page-active {
          background-image: none !important;
          background-color: #171D14 !important;
          background: #171D14 !important;
          color: #EFE8D8 !important;
          font-family: 'IBM Plex Sans', sans-serif !important;
          line-height: 1.5;
          -webkit-font-smoothing: antialiased;
        }

        body.landing-page-active header {
          position: sticky;
          top: 0;
          z-index: 50;
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

          --display: 'Fraunces', serif;
          --body: 'IBM Plex Sans', sans-serif;
          --mono: 'IBM Plex Mono', monospace;

          background-color: var(--soil) !important;
          color: var(--paper) !important;
          line-height: 1.5;
        }

        .landing-container h1, 
        .landing-container h2, 
        .landing-container h3 {
          font-family: var(--display) !important;
          font-weight: 600;
          letter-spacing: -0.01em;
        }

        .landing-container .wrap {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 32px;
        }

        .landing-container .eyebrow {
          font-family: var(--mono);
          font-size: 12px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .landing-container .eyebrow::before {
          content: "";
          width: 7px; height: 7px;
          background: var(--moss-bright);
          border-radius: 50%;
          flex-shrink: 0;
        }

        .landing-container .btn {
          font-family: var(--mono);
          font-size: 13px;
          letter-spacing: 0.04em;
          padding: 14px 26px;
          border-radius: 3px;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          border: 1px solid transparent;
          transition: transform .18s ease, background .18s ease, border-color .18s ease;
        }
        .landing-container .btn:hover { transform: translateY(-2px); }
        .landing-container .btn-primary {
          background: var(--moss-bright);
          color: var(--soil);
          font-weight: 600;
        }
        .landing-container .btn-primary:hover { background: #a2c98a; }
        .landing-container .btn-ghost {
          border-color: rgba(239,232,216,0.3);
          color: var(--paper);
        }
        .landing-container .btn-ghost:hover { border-color: var(--wheat); color: var(--wheat); }

        .landing-container .topo {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(143,179,121,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(143,179,121,0.08) 1px, transparent 1px);
          background-size: 64px 64px;
          animation: driftGrid 60s linear infinite;
          pointer-events: none;
        }
        @keyframes driftGrid {
          from { background-position: 0 0; }
          to { background-position: 64px 64px; }
        }

        .landing-container .hero {
          position: relative;
          overflow: hidden;
          padding: 100px 0 120px;
          background: radial-gradient(ellipse at 20% 0%, var(--pine-light) 0%, var(--soil) 55%);
        }
        .landing-container .hero-grid {
          position: relative; z-index: 2;
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 64px;
          align-items: center;
        }
        @media (max-width: 960px) {
          .landing-container .hero-grid { grid-template-columns: 1fr; }
        }
        .landing-container .hero h1 {
          font-size: clamp(34px, 5vw, 58px) !important;
          line-height: 1.08;
          margin: 22px 0 24px;
          color: var(--cream);
        }
        .landing-container .hero h1 em {
          font-style: italic;
          color: var(--moss-bright);
        }
        .landing-container .hero p.lede {
          font-size: 17px;
          color: rgba(239,232,216,0.78);
          max-width: 520px;
          margin-bottom: 36px;
        }
        .landing-container .hero-ctas { display: flex; gap: 14px; flex-wrap: wrap; }

        .landing-container .ticket-wrap { position: relative; }
        .landing-container .ticket {
          background: var(--cream);
          color: var(--ink);
          border-radius: 6px;
          padding: 26px 26px 22px;
          position: relative;
          box-shadow: 0 30px 70px -20px rgba(0,0,0,0.55);
          transform: rotate(1.2deg);
        }
        .landing-container .ticket::before, .landing-container .ticket::after {
          content: "";
          position: absolute;
          width: 22px; height: 22px;
          background: var(--soil);
          border-radius: 50%;
          top: 50%; transform: translateY(-50%);
        }
        .landing-container .ticket::before { left: -11px; }
        .landing-container .ticket::after { right: -11px; }
        .landing-container .ticket-perf {
          position: absolute; left: 0; right: 0; top: 50%;
          border-top: 2px dashed rgba(32,36,26,0.25);
        }
        .landing-container .ticket-top {
          display: flex; justify-content: space-between; align-items: flex-start;
          padding-bottom: 20px;
        }
        .landing-container .ticket-crop {
          font-family: var(--mono);
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--ink-soft);
        }
        .landing-container .ticket-crop strong {
          display: block;
          font-family: var(--display);
          font-size: 19px;
          font-weight: 600;
          color: var(--ink);
          margin-top: 4px;
          text-transform: none;
          letter-spacing: 0;
        }
        .landing-container .ring-wrap { position: relative; width: 76px; height: 76px; flex-shrink: 0; }
        .landing-container .ring-wrap svg { transform: rotate(-90deg); }
        .landing-container .ring-label {
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
          flex-direction: column;
          font-family: var(--mono);
        }
        .landing-container .ring-label b { font-size: 17px; line-height: 1; }
        .landing-container .ring-label span { font-size: 8px; letter-spacing: 0.06em; color: var(--ink-soft); margin-top: 2px; }

        .landing-container .ticket-mid {
          padding-top: 22px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px 20px;
          font-family: var(--mono);
          font-size: 11.5px;
        }
        .landing-container .ticket-field label {
          display: block; color: var(--ink-soft); letter-spacing: 0.06em; text-transform: uppercase; font-size: 9.5px; margin-bottom: 4px;
        }
        .landing-container .stamp {
          display: inline-block;
          font-family: var(--mono);
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
        .landing-container .ticket-foot {
          margin-top: 18px;
          padding-top: 14px;
          border-top: 1px solid rgba(32,36,26,0.12);
          display: flex; justify-content: space-between; align-items: center;
          font-family: var(--mono);
          font-size: 10px;
          color: var(--ink-soft);
        }
        .landing-container .qr-corner { width: 16px; height: 16px; position: relative; }
        .landing-container .qr-corner span { position: absolute; width: 16px; height: 16px; border: 2px solid var(--ink); }
        .landing-container .qr-corner span:nth-child(1) { border-right: 0; border-bottom: 0; top: 0; left: 0; }
        .landing-container .qr-corner span:nth-child(2) { border-left: 0; border-bottom: 0; top: 0; right: -16px; }

        .landing-container .paper-section {
          background: var(--paper);
          color: var(--ink);
          padding: 100px 0;
          position: relative;
        }
        .landing-container .section-head {
          max-width: 640px;
          margin-bottom: 56px;
        }
        .landing-container .section-head .eyebrow { color: var(--rust); }
        .landing-container .section-head .eyebrow::before { background: var(--rust); }
        .landing-container .section-head h2 {
          font-size: clamp(28px, 3.4vw, 40px) !important;
          margin-top: 14px;
          color: var(--ink);
        }
        .landing-container .section-head p {
          margin-top: 14px;
          color: var(--ink-soft);
          font-size: 15.5px;
          max-width: 560px;
        }

        .landing-container .arch-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: rgba(32,36,26,0.14);
          border: 1px solid rgba(32,36,26,0.14);
        }
        @media (max-width: 820px) {
          .landing-container .arch-grid { grid-template-columns: 1fr; }
        }
        .landing-container .arch-card {
          background: var(--cream);
          padding: 34px 30px;
        }
        .landing-container .arch-num {
          font-family: var(--mono); font-size: 11px; color: var(--rust); letter-spacing: 0.06em;
        }
        .landing-container .arch-card h3 {
          font-size: 20px; margin: 14px 0 12px; color: var(--ink);
        }
        .landing-container .arch-card p {
          font-size: 14px; color: var(--ink-soft); line-height: 1.6;
        }

        .landing-container .hackathon-card {
          margin-top: 40px;
          background: var(--ink);
          color: var(--paper);
          border-radius: 6px;
          padding: 28px 32px;
          display: flex; align-items: center; justify-content: space-between; gap: 24px; flex-wrap: wrap;
        }
        .landing-container .hackathon-card .stamp { color: var(--wheat); border-color: var(--wheat); }
        .landing-container .hackathon-left { font-family: var(--mono); font-size: 12px; color: rgba(239,232,216,0.65); letter-spacing: 0.05em; }
        .landing-container .hackathon-left strong { display: block; font-family: var(--display); font-size: 19px; color: var(--cream); font-weight: 600; margin-top: 6px; letter-spacing: 0; }

        .landing-container .features {
          background: var(--soil);
          padding: 110px 0;
          position: relative;
          overflow: hidden;
        }
        .landing-container .feat-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 22px;
        }
        @media (max-width: 960px) { .landing-container .feat-grid { grid-template-columns: repeat(2,1fr); } }
        @media (max-width: 640px) { .landing-container .feat-grid { grid-template-columns: 1fr; } }

        .landing-container .feat-card {
          background: var(--pine);
          border: 1px solid rgba(143,179,121,0.14);
          border-radius: 6px;
          padding: 28px 26px;
          transition: border-color .2s ease, transform .2s ease;
        }
        .landing-container .feat-card:hover { border-color: var(--moss-bright); transform: translateY(-3px); }
        .landing-container .feat-icon {
          width: 40px; height: 40px;
          color: var(--moss-bright);
          margin-bottom: 18px;
        }
        .landing-container .feat-card h3 {
          font-size: 17px; color: var(--cream); margin-bottom: 10px; font-weight: 600;
        }
        .landing-container .feat-card p {
          font-size: 13.5px; color: rgba(239,232,216,0.62); line-height: 1.6;
        }
        .landing-container .severity-legend {
          display: flex; gap: 10px; margin-top: 16px; flex-wrap: wrap;
        }
        .landing-container .sev {
          display: flex; align-items: center; gap: 6px;
          font-family: var(--mono); font-size: 9.5px; color: rgba(239,232,216,0.55);
          text-transform: uppercase;
        }
        .landing-container .sev-dot { width: 8px; height: 8px; border-radius: 2px; }
        .landing-container .lang-list {
          display: flex; gap: 8px; margin-top: 14px; flex-wrap: wrap;
        }
        .landing-container .lang-list span {
          font-family: var(--mono); font-size: 10px; color: var(--wheat);
          border: 1px solid rgba(201,162,39,0.35);
          padding: 3px 8px; border-radius: 3px;
        }

        .landing-container .flow-section {
          background: var(--paper);
          color: var(--ink);
          padding: 100px 0;
        }
        .landing-container .flow-list {
          border-top: 1px solid rgba(32,36,26,0.14);
        }
        .landing-container .flow-item {
          display: grid;
          grid-template-columns: 70px 200px 1fr 140px;
          gap: 24px;
          align-items: center;
          padding: 26px 0;
          border-bottom: 1px solid rgba(32,36,26,0.14);
        }
        @media (max-width: 800px) {
          .landing-container .flow-item { grid-template-columns: 50px 1fr; grid-template-rows: auto auto; row-gap: 8px; }
          .landing-container .flow-path { grid-column: 2; }
          .landing-container .flow-desc { grid-column: 2; }
          .landing-container .flow-tag { grid-column: 2; justify-self: start; }
        }
        .landing-container .flow-index {
          font-family: var(--mono); font-size: 13px; color: var(--rust); font-weight: 600;
        }
        .landing-container .flow-path {
          font-family: var(--mono); font-size: 14px; color: var(--ink); font-weight: 600;
        }
        .landing-container .flow-path span { display: block; font-family: var(--body); font-weight: 600; font-size: 16px; margin-top: 3px; color: var(--ink); }
        .landing-container .flow-desc { font-size: 13.5px; color: var(--ink-soft); max-width: 420px; }
        .landing-container .flow-tag {
          font-family: var(--mono); font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em;
          color: var(--moss); text-align: right;
        }

        .landing-container .closing {
          background: radial-gradient(ellipse at 80% 100%, var(--pine-light) 0%, var(--soil) 60%);
          padding: 120px 0;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .landing-container .closing h2 {
          font-size: clamp(30px, 4.6vw, 50px) !important;
          color: var(--cream);
          max-width: 760px;
          margin: 0 auto 20px;
          position: relative; z-index: 2;
        }
        .landing-container .closing p {
          color: rgba(239,232,216,0.7);
          max-width: 480px;
          margin: 0 auto 36px;
          position: relative; z-index: 2;
        }
        .landing-container .closing-ctas {
          display: flex; gap: 14px; justify-content: center; flex-wrap: wrap;
          position: relative; z-index: 2;
        }

        .landing-container footer {
          background: var(--ink);
          padding: 36px 0;
          border-top: 1px solid rgba(239,232,216,0.08);
        }
        .landing-container footer .wrap {
          display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;
        }
        .landing-container footer p {
          font-family: var(--mono); font-size: 11.5px; color: rgba(239,232,216,0.45);
        }
        .landing-container footer .foot-links { display: flex; gap: 22px; }
        .landing-container footer .foot-links a {
          font-family: var(--mono); font-size: 11.5px; color: rgba(239,232,216,0.45);
        }
        .landing-container footer .foot-links a:hover { color: var(--wheat); }

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

      <main id="top">
        
        {/* HERO SECTION */}
        <section className="hero">
          <div className="topo"></div>
          <div className="wrap hero-grid">
            <div>
              <div className="eyebrow">WEB-CONNECTED FIELD PORTAL · BUILD WITH GEMMA 2026</div>
              <h1>High-fidelity crop diagnostics.<br /><em>Grounded in real-time intelligence.</em></h1>
              <p className="lede">Green Praxis integrates high-precision drone telemetries, real-time crop pathology diagnostics, and interactive AI advisors powered by Google Gemma.</p>
              <div className="hero-ctas">
                <Link to="/scan" className="btn btn-primary">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="inline-block mr-1.5"><path d="M5 3L19 12L5 21V3Z" fill="currentColor"/></svg>
                  Launch Scanner
                </Link>
                <Link to="/chat" className="btn btn-ghost">Ask Gemma Advisor →</Link>
              </div>
            </div>

            <div className="ticket-wrap reveal">
              <div className="ticket text-[#20241A]">
                <div className="ticket-perf"></div>
                <div className="ticket-top">
                  <div className="ticket-crop">
                    Field scan · block F4
                    <strong>Vitis vinifera</strong>
                  </div>
                  <div className="ring-wrap">
                    <svg width="76" height="76" viewBox="0 0 76 76">
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
                    <div className="ring-label"><b>72%</b><span>RECOVERY</span></div>
                  </div>
                </div>
                <div className="ticket-mid">
                  <div className="ticket-field">
                    <label>Diagnosis</label>
                    Early blight
                  </div>
                  <div className="ticket-field">
                    <label>Yield risk</label>
                    18%
                  </div>
                  <div className="ticket-field">
                    <label>Coordinates</label>
                    12.9716°N, 77.5946°E
                  </div>
                  <div className="ticket-field">
                    <label>Urgency</label>
                    <span className="stamp">Treat in 24h</span>
                  </div>
                </div>
                <div className="ticket-foot">
                  <span>SCANNED 04:12 · SYNCED</span>
                  <div className="qr-corner"><span></span><span></span></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* INTEGRATED ARCHITECTURE */}
        <section className="paper-section" id="architecture">
          <div className="wrap">
            <div className="section-head reveal">
              <div className="eyebrow">INTEGRATED SYSTEM</div>
              <h2>Real-time diagnostic routing & cloud records.</h2>
              <p>Everything Green Praxis does — reasoning, listening, remembering — links live drone telemetries to Google Gemma's cloud intelligence.</p>
            </div>

            <div className="arch-grid reveal">
              <div className="arch-card">
                <div className="arch-num">01 / REASONING</div>
                <h3>Gemma AI Reasoning</h3>
                <p>Google's Gemma models analyze pathogen morphology, calculate estimated crop recovery chances, and suggest alternative rotation crops.</p>
              </div>
              <div className="arch-card">
                <div className="arch-num">02 / INTERACTION</div>
                <h3>Voice Synthesis</h3>
                <p>Farmers ask questions aloud and hear answers read back in English, Hindi, Spanish, French, or Telugu synthesized in real-time.</p>
              </div>
              <div className="arch-card">
                <div className="arch-num">03 / LEDGER</div>
                <h3>MongoDB Cloud Sync</h3>
                <p>Every scan, coordinate, and diagnosis is written to a secure cloud-synced MongoDB database, preserving a season-over-season record.</p>
              </div>
            </div>

            <div className="hackathon-card reveal" id="hackathon">
              <div className="hackathon-left">
                Submission · Web Agri-Tech Track
                <strong>Build with Gemma — 2026</strong>
              </div>
              <div className="stamp select-none">Entered</div>
            </div>
          </div>
        </section>

        {/* CORE FEATURES FIELD TOOLS */}
        <section className="features" id="features">
          <div className="wrap">
            <div className="section-head reveal">
              <div className="eyebrow" style={{ color: 'var(--wheat)' }}>FIELD TOOLS</div>
              <h2 style={{ color: 'var(--cream)' }}>What's actually on the ground.</h2>
              <p style={{ color: 'rgba(239,232,216,0.65)' }}>Six tools an estate manager opens every week — not a features list, a routine.</p>
            </div>

            <div className="feat-grid">
              {/* Feat 1 */}
              <div className="feat-card reveal">
                <svg className="feat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" strokeWidth="1.5"/><path d="M12 3C12 3 16 7 16 12C16 17 12 21 12 21" strokeWidth="1.3"/></svg>
                <h3>Crop survival analytics</h3>
                <p>Recovery probability and yield-loss estimates rendered as a progress ring, with an auto-generated urgency capsule — treat in 24h, inspect in 48h.</p>
              </div>
              
              {/* Feat 2 */}
              <div className="feat-card reveal">
                <svg className="feat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="3" width="18" height="18" rx="1" strokeWidth="1.4"/><path d="M9 3V21M15 3V21M3 9H21M3 15H21" strokeWidth="1.2"/></svg>
                <h3>Multispectral field grid</h3>
                <p>Drone telemetry maps into a 3×3 grid, sectors F1–F9, color-coded by severity so damage is visible at a glance from orbit down to the row.</p>
                <div className="severity-legend">
                  <div className="sev"><span className="sev-dot" style={{ background: '#6E8C5C' }}></span>Healthy</div>
                  <div className="sev"><span className="sev-dot" style={{ background: '#C9A227' }}></span>Recovering</div>
                  <div className="sev"><span className="sev-dot" style={{ background: '#C15832' }}></span>Moderate</div>
                  <div className="sev"><span className="sev-dot" style={{ background: '#A64B2A' }}></span>Severe</div>
                </div>
              </div>
              
              {/* Feat 3 */}
              <div className="feat-card reveal">
                <svg className="feat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2L2 7L12 12L22 7L12 2Z" strokeWidth="1.4"/><path d="M2 17L12 22L22 17" strokeWidth="1.4"/><path d="M2 12L12 17L22 12" strokeWidth="1.4"/></svg>
                <h3>Emergency rescue mode</h3>
                <p>One click outputs a hazard overlay — safe pasture versus breach zones — and an evacuation checklist: livestock first, tourist entry closed, irrigation inspected.</p>
              </div>
              
              {/* Feat 4 */}
              <div className="feat-card reveal">
                <svg className="feat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="9" y="2" width="6" height="12" rx="3" strokeWidth="1.4"/><path d="M5 11C5 15.5 8.5 19 12 19C15.5 19 19 15.5 19 11" strokeWidth="1.4"/><path d="M12 19V22" strokeWidth="1.4"/></svg>
                <h3>Voice advisor</h3>
                <p>Press the mic, ask in your own words, hear the answer spoken back — pathogen details, rotation plans, safety guides, no typing required.</p>
                <div className="lang-list">
                  <span>EN</span><span>HI</span><span>ES</span><span>FR</span><span>TE</span>
                </div>
              </div>

              {/* Feat 5 */}
              <div className="feat-card reveal">
                <svg className="feat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 21V13C4 13 6 11 8 13C10 15 12 11 14 13C16 15 18 11 20 13V21H4Z" strokeWidth="1.4"/><path d="M4 9L8 3L12 9L16 3L20 9" strokeWidth="1.2"/></svg>
                <h3>Organic vs chemical matrix</h3>
                <p>Neem oil and compost tea sit beside Mancozeb and copper oxychloride in parallel columns, so the choice of cost or compliance stays with the farmer.</p>
              </div>

              {/* Feat 6 */}
              <div className="feat-card reveal">
                <svg className="feat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 3L4 7V11C4 16 7.5 20 12 21C16.5 20 20 16 20 11V7L12 3Z" strokeWidth="1.4"/><path d="M9 12L11 14L15 10" strokeWidth="1.4"/></svg>
                <h3>Explainable diagnosis (XAI)</h3>
                <p>Gemma's own reasoning is quoted under every scan — "circular brown lesions with target-like rings on older leaves" — plus similarity scores against look-alike diseases.</p>
              </div>
            </div>
          </div>
        </section>

        {/* DYNAMIC SITE LEDGER / PAGE NAVIGATION */}
        <section className="flow-section" id="flow">
          <div className="wrap">
            <div className="section-head reveal">
              <div className="eyebrow">SITE LEDGER</div>
              <h2>Four pages, one season-long record.</h2>
              <p>Each scan moves through the same four rooms — intake, report, conversation, archive — the way a real field note would.</p>
            </div>

            <div className="flow-list">
              {/* Page 1 */}
              <div className="flow-item reveal">
                <div className="flow-index">01</div>
                <div className="flow-path">/scan<span>Field intake</span></div>
                <div className="flow-desc">GPS simulator, mobile-scan or drone-scan toggle, and a drag-and-drop uploader that hands the image straight to the model.</div>
                <div className="flow-tag">
                  <Link to="/scan" className="hover:text-[var(--wheat)] transition-colors flex items-center gap-1">
                    Go to Page <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Page 2 */}
              <div className="flow-item reveal">
                <div className="flow-index">02</div>
                <div className="flow-path">/report<span>Diagnosis report</span></div>
                <div className="flow-desc">Pathology index, treatment matrix, recovery timeline, and a QR code that syncs the report to any phone on the farm's network.</div>
                <div className="flow-tag">
                  <Link to="/report" className="hover:text-[var(--wheat)] transition-colors flex items-center gap-1">
                    Go to Page <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Page 3 */}
              <div className="flow-item reveal">
                <div className="flow-index">03</div>
                <div className="flow-path">/chat<span>Gemma advisor</span></div>
                <div className="flow-desc">A conversational window with quick-question pills — "What is powdery mildew?", "When should I irrigate?" — answered from the knowledge base.</div>
                <div className="flow-tag">
                  <Link to="/chat" className="hover:text-[var(--wheat)] transition-colors flex items-center gap-1">
                    Go to Page <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Page 4 */}
              <div className="flow-item reveal">
                <div className="flow-index">04</div>
                <div className="flow-path">/dashboard<span>Field ledger</span></div>
                <div className="flow-desc">Every past report as a card — crop, diagnosis, severity, coordinates, date — inspectable or deletable from the local MongoDB archive.</div>
                <div className="flow-tag">
                  <Link to="/dashboard" className="hover:text-[var(--wheat)] transition-colors flex items-center gap-1">
                    Go to Page <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT & DEVELOPERS SECTION */}
        <section className="paper-section" id="about" style={{ background: 'var(--cream)' }}>
          <div className="wrap">
            <div className="section-head reveal">
              <div className="eyebrow" style={{ color: 'var(--rust)' }}>ABOUT & TEAM</div>
              <h2>Grounded in agricultural engineering.</h2>
              <p>Green Praxis is a modern agricultural management tool powered by Google Gemma AI, helping extension workers, farm cooperatives, and agronomists evaluate crops securely.</p>
            </div>

            <div className="arch-grid reveal" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
              <div className="arch-card" style={{ background: 'var(--paper)' }}>
                <h3 className="font-display font-semibold text-lg mb-2">The Brand Vision</h3>
                <p style={{ fontSize: '13.5px', color: 'var(--ink-soft)' }} className="leading-relaxed">
                  Green Praxis bridges complex AI reasoning models with day-to-day farming tasks. By structuring diagnosis alerts, providing organic/chemical side-by-side matrices, and mapping coordinates dynamically, we help estate operators navigate environmental stress and pathogen outbreaks safely.
                </p>
                <div className="p-3 border border-black/10 rounded mt-4" style={{ background: 'rgba(0,0,0,0.03)' }}>
                  <span style={{ fontSize: '10px', fontWeight: 'bold', fontFamily: 'var(--mono)', display: 'block', color: 'var(--rust)', textTransform: 'uppercase', marginBottom: '4px' }}>Development Stack</span>
                  <div className="flex gap-2 flex-wrap" style={{ fontFamily: 'var(--mono)', fontSize: '9px', color: 'var(--ink-soft)' }}>
                    <span className="bg-black/5 px-2 py-0.5 rounded">React 18</span>
                    <span className="bg-black/5 px-2 py-0.5 rounded">FastAPI</span>
                    <span className="bg-black/5 px-2 py-0.5 rounded">MongoDB</span>
                    <span className="bg-black/5 px-2 py-0.5 rounded">Web Speech API</span>
                    <span className="bg-black/5 px-2 py-0.5 rounded">Google Gemma</span>
                  </div>
                </div>
              </div>

              <div className="arch-card" style={{ background: 'var(--paper)' }}>
                <h3 className="font-display font-semibold text-lg mb-4">Core Contributors</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <strong style={{ display: 'block', fontSize: '11px', color: 'var(--rust)', fontFamily: 'var(--mono)', textTransform: 'uppercase' }}>Lead Engineer</strong>
                    <p style={{ fontSize: '10.5px', color: 'var(--ink-soft)', marginTop: '2px' }} className="leading-relaxed">Full-stack interface, MERN timeline, and multi-language transcription helpers.</p>
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '11px', color: 'var(--rust)', fontFamily: 'var(--mono)', textTransform: 'uppercase' }}>AI Specialist</strong>
                    <p style={{ fontSize: '10.5px', color: 'var(--ink-soft)', marginTop: '2px' }} className="leading-relaxed">Gemma reasoning dialog flows, explainability rationales, and diagnostics.</p>
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '11px', color: 'var(--rust)', fontFamily: 'var(--mono)', textTransform: 'uppercase' }}>UI Designer</strong>
                    <p style={{ fontSize: '10.5px', color: 'var(--ink-soft)', marginTop: '2px' }} className="leading-relaxed">Serif layout design system, progress indicators, and custom palette formatting.</p>
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '11px', color: 'var(--rust)', fontFamily: 'var(--mono)', textTransform: 'uppercase' }}>Coordinator</strong>
                    <p style={{ fontSize: '10.5px', color: 'var(--ink-soft)', marginTop: '2px' }} className="leading-relaxed">Drone simulation testing tracks, user workflow operations, and QA checks.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CLOSING BANNER */}
        <section className="closing">
          <div className="topo"></div>
          <div className="wrap">
            <h2 className="reveal">Connect your fields to the future.</h2>
            <p className="reveal">Inspect diagnostic reports, recovery plans, and safety maps immediately over the web.</p>
            <div className="closing-ctas reveal">
              <Link to="/scan" className="btn btn-primary">Launch Scanner</Link>
              <Link to="/chat" className="btn btn-ghost">Ask Gemma Advisor</Link>
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer>
        <div className="wrap">
          <p>Green Praxis — Modern Agricultural Management.</p>
          <div className="foot-links">
            <a href="#architecture">Architecture</a>
            <a href="#features">Field Tools</a>
            <a href="#flow">Pages</a>
            <a href="#about">About & Team</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
