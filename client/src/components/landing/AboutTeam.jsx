import React from "react";

export default function AboutTeam() {
  const stack = [
    "React 18",
    "FastAPI",
    "MongoDB",
    "Web Speech API",
    "Google Gemma",
  ];

  const contributors = [
    {
      role: "Lead Engineer",
      desc: "Full-stack interface, MERN timeline, and multi-language transcription helpers.",
    },
    {
      role: "AI Specialist",
      desc: "Gemma reasoning dialog flows, explainability rationales, and diagnostics.",
    },
    {
      role: "UI Designer",
      desc: "Serif layout design system, progress indicators, and custom palette formatting.",
    },
    {
      role: "Coordinator",
      desc: "Drone simulation testing tracks, user workflow operations, and QA checks.",
    },
  ];

  return (
    <section
      className="paper-section"
      id="about"
      style={{ background: "var(--cream)" }}
    >
      <div className="wrap">
        <div className="section-head reveal">
          <div className="eyebrow" style={{ color: "var(--rust)" }}>
            ABOUT & TEAM
          </div>
          <h2>Grounded in agricultural engineering.</h2>
          <p>
            Green Praxis is a modern agricultural management tool powered by
            Google Gemma AI, helping extension workers, farm cooperatives, and
            agronomists evaluate crops securely.
          </p>
        </div>

        <div
          className="arch-grid reveal"
          style={{ gridTemplateColumns: "repeat(2, 1fr)" }}
        >
          <div className="arch-card" style={{ background: "var(--paper)" }}>
            <h3 className="font-display font-semibold text-lg mb-2">
              The Brand Vision
            </h3>
            <p
              style={{ fontSize: "13.5px", color: "var(--ink-soft)" }}
              className="leading-relaxed"
            >
              Green Praxis bridges complex AI reasoning models with day-to-day
              farming tasks. By structuring diagnosis alerts, providing
              organic/chemical side-by-side matrices, and mapping coordinates
              dynamically, we help estate operators navigate environmental
              stress and pathogen outbreaks safely.
            </p>
            <div
              className="p-3 border border-black/10 rounded mt-4"
              style={{ background: "rgba(0,0,0,0.03)" }}
            >
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: "bold",
                  fontFamily: "var(--mono)",
                  display: "block",
                  color: "var(--rust)",
                  textTransform: "uppercase",
                  marginBottom: "4px",
                }}
              >
                Development Stack
              </span>
              <div
                className="flex gap-2 flex-wrap"
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: "9px",
                  color: "var(--ink-soft)",
                }}
              >
                {stack.map((item, i) => (
                  <span key={i} className="bg-black/5 px-2 py-0.5 rounded">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="arch-card" style={{ background: "var(--paper)" }}>
            <h3 className="font-display font-semibold text-lg mb-4">
              Core Contributors
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {contributors.map((c, idx) => (
                <div key={idx}>
                  <strong
                    style={{
                      display: "block",
                      fontSize: "11px",
                      color: "var(--rust)",
                      fontFamily: "var(--mono)",
                      textTransform: "uppercase",
                    }}
                  >
                    {c.role}
                  </strong>
                  <p
                    style={{
                      fontSize: "10.5px",
                      color: "var(--ink-soft)",
                      marginTop: "2px",
                    }}
                    className="leading-relaxed"
                  >
                    {c.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
