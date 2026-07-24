import React from "react";
import { Link } from "react-router-dom";
import DiagnosticTicket from "./DiagnosticTicket";

export default function LandingHero({ ringRef }) {
  return (
    <section className="hero">
      <div className="topo"></div>
      <div className="wrap hero-grid">
        <div>
          <div className="eyebrow">
            WEB-CONNECTED FIELD PORTAL · BUILD WITH GEMMA 2026
          </div>
          <h1>
            High-fidelity crop diagnostics.
            <br />
            <em>Grounded in real-time intelligence.</em>
          </h1>
          <p className="lede">
            Green Praxis integrates high-precision drone telemetries, real-time
            crop pathology diagnostics, and interactive AI advisors powered by
            Google Gemma.
          </p>
          <div className="hero-ctas">
            <Link to="/scan" className="btn btn-primary">
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                className="inline-block mr-1.5"
              >
                <path d="M5 3L19 12L5 21V3Z" fill="currentColor" />
              </svg>
              Launch Scanner
            </Link>
            <Link to="/chat" className="btn btn-ghost">
              Ask Gemma Advisor →
            </Link>
          </div>
        </div>

        <DiagnosticTicket ringRef={ringRef} />
      </div>
    </section>
  );
}
