import React from "react";
import { Link } from "react-router-dom";

export default function LandingFooter() {
  return (
    <>
      <section className="closing">
        <div className="topo"></div>
        <div className="wrap">
          <h2 className="reveal">Connect your fields to the future.</h2>
          <p className="reveal">
            Inspect diagnostic reports, recovery plans, and safety maps
            immediately over the web.
          </p>
          <div className="closing-ctas reveal">
            <Link to="/scan" className="btn btn-primary">
              Launch Scanner
            </Link>
            <Link to="/chat" className="btn btn-ghost">
              Ask Gemma Advisor
            </Link>
          </div>
        </div>
      </section>

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
    </>
  );
}
