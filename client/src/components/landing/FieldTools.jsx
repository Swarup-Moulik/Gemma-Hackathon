import React from "react";

export default function FieldTools() {
  return (
    <section className="features" id="features">
      <div className="wrap">
        <div className="section-head reveal">
          <div className="eyebrow" style={{ color: "var(--wheat)" }}>
            FIELD TOOLS
          </div>
          <h2 style={{ color: "var(--cream)" }}>
            What's actually on the ground.
          </h2>
          <p style={{ color: "rgba(239,232,216,0.65)" }}>
            Six tools an estate manager opens every week — not a features list,
            a routine.
          </p>
        </div>

        <div className="feat-grid">
          {/* Feat 1 */}
          <div className="feat-card reveal">
            <svg
              className="feat-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="12" cy="12" r="9" strokeWidth="1.5" />
              <path
                d="M12 3C12 3 16 7 16 12C16 17 12 21 12 21"
                strokeWidth="1.3"
              />
            </svg>
            <h3>Crop survival analytics</h3>
            <p>
              Recovery probability and yield-loss estimates rendered as a
              progress ring, with an auto-generated urgency capsule — treat in
              24h, inspect in 48h.
            </p>
          </div>

          {/* Feat 2 */}
          <div className="feat-card reveal">
            <svg
              className="feat-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <rect
                x="3"
                y="3"
                width="18"
                height="18"
                rx="1"
                strokeWidth="1.4"
              />
              <path d="M9 3V21M15 3V21M3 9H21M3 15H21" strokeWidth="1.2" />
            </svg>
            <h3>Multispectral field grid</h3>
            <p>
              Drone telemetry maps into a 3×3 grid, sectors F1–F9, color-coded
              by severity so damage is visible at a glance from orbit down to
              the row.
            </p>
            <div className="severity-legend">
              <div className="sev">
                <span
                  className="sev-dot"
                  style={{ background: "#6E8C5C" }}
                ></span>
                Healthy
              </div>
              <div className="sev">
                <span
                  className="sev-dot"
                  style={{ background: "#C9A227" }}
                ></span>
                Recovering
              </div>
              <div className="sev">
                <span
                  className="sev-dot"
                  style={{ background: "#C15832" }}
                ></span>
                Moderate
              </div>
              <div className="sev">
                <span
                  className="sev-dot"
                  style={{ background: "#A64B2A" }}
                ></span>
                Severe
              </div>
            </div>
          </div>

          {/* Feat 3 */}
          <div className="feat-card reveal">
            <svg
              className="feat-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path d="M12 2L2 7L12 12L22 7L12 2Z" strokeWidth="1.4" />
              <path d="M2 17L12 22L22 17" strokeWidth="1.4" />
              <path d="M2 12L12 17L22 12" strokeWidth="1.4" />
            </svg>
            <h3>Emergency rescue mode</h3>
            <p>
              One click outputs a hazard overlay — safe pasture versus breach
              zones — and an evacuation checklist: livestock first, tourist
              entry closed, irrigation inspected.
            </p>
          </div>

          {/* Feat 4 */}
          <div className="feat-card reveal">
            <svg
              className="feat-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <rect
                x="9"
                y="2"
                width="6"
                height="12"
                rx="3"
                strokeWidth="1.4"
              />
              <path
                d="M5 11C5 15.5 8.5 19 12 19C15.5 19 19 15.5 19 11"
                strokeWidth="1.4"
              />
              <path d="M12 19V22" strokeWidth="1.4" />
            </svg>
            <h3>Voice advisor</h3>
            <p>
              Press the mic, ask in your own words, hear the answer spoken back
              — pathogen details, rotation plans, safety guides, no typing
              required.
            </p>
            <div className="lang-list">
              <span>EN</span>
              <span>HI</span>
              <span>ES</span>
              <span>FR</span>
              <span>TE</span>
            </div>
          </div>

          {/* Feat 5 */}
          <div className="feat-card reveal">
            <svg
              className="feat-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                d="M4 21V13C4 13 6 11 8 13C10 15 12 11 14 13C16 15 18 11 20 13V21H4Z"
                strokeWidth="1.4"
              />
              <path d="M4 9L8 3L12 9L16 3L20 9" strokeWidth="1.2" />
            </svg>
            <h3>Organic vs chemical matrix</h3>
            <p>
              Neem oil and compost tea sit beside Mancozeb and copper
              oxychloride in parallel columns, so the choice of cost or
              compliance stays with the farmer.
            </p>
          </div>

          {/* Feat 6 */}
          <div className="feat-card reveal">
            <svg
              className="feat-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                d="M12 3L4 7V11C4 16 7.5 20 12 21C16.5 20 20 16 20 11V7L12 3Z"
                strokeWidth="1.4"
              />
              <path d="M9 12L11 14L15 10" strokeWidth="1.4" />
            </svg>
            <h3>Explainable diagnosis (XAI)</h3>
            <p>
              Gemma's own reasoning is quoted under every scan — "circular brown
              lesions with target-like rings on older leaves" — plus similarity
              scores against look-alike diseases.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
