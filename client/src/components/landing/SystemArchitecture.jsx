import React from "react";

export default function SystemArchitecture() {
  const pillars = [
    {
      num: "01 / REASONING",
      title: "Gemma AI Reasoning",
      desc: "Google's Gemma models analyze pathogen morphology, calculate estimated crop recovery chances, and suggest alternative rotation crops.",
    },
    {
      num: "02 / INTERACTION",
      title: "Voice Synthesis",
      desc: "Farmers ask questions aloud and hear answers read back in English, Hindi, Spanish, French, or Telugu synthesized in real-time.",
    },
    {
      num: "03 / LEDGER",
      title: "MongoDB Cloud Sync",
      desc: "Every scan, coordinate, and diagnosis is written to a secure cloud-synced MongoDB database, preserving a season-over-season record.",
    },
  ];

  return (
    <section className="paper-section" id="architecture">
      <div className="wrap">
        <div className="section-head reveal">
          <div className="eyebrow">INTEGRATED SYSTEM</div>
          <h2>Real-time diagnostic routing & cloud records.</h2>
          <p>
            Everything Green Praxis does — reasoning, listening, remembering —
            links live drone telemetries to Google Gemma's cloud intelligence.
          </p>
        </div>

        <div className="arch-grid reveal">
          {pillars.map((item, idx) => (
            <div key={idx} className="arch-card">
              <div className="arch-num">{item.num}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
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
  );
}
