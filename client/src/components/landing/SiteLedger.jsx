import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function SiteLedger() {
  const pages = [
    {
      index: "01",
      path: "/scan",
      title: "Field intake",
      desc: "GPS simulator, mobile-scan or drone-scan toggle, and a drag-and-drop uploader that hands the image straight to the model.",
    },
    {
      index: "02",
      path: "/report",
      title: "Diagnosis report",
      desc: "Pathology index, treatment matrix, recovery timeline, and a QR code that syncs the report to any phone on the farm's network.",
    },
    {
      index: "03",
      path: "/chat",
      title: "Gemma advisor",
      desc: "A conversational window with quick-question pills — 'What is powdery mildew?', 'When should I irrigate?' — answered from the knowledge base.",
    },
    {
      index: "04",
      path: "/dashboard",
      title: "Field ledger",
      desc: "Every past report as a card — crop, diagnosis, severity, coordinates, date — inspectable or deletable from the local MongoDB archive.",
    },
  ];

  return (
    <section className="flow-section" id="flow">
      <div className="wrap">
        <div className="section-head reveal">
          <div className="eyebrow">SITE LEDGER</div>
          <h2>Four pages, one season-long record.</h2>
          <p>
            Each scan moves through the same four rooms — intake, report,
            conversation, archive — the way a real field note would.
          </p>
        </div>

        <div className="flow-list">
          {pages.map((item) => (
            <div key={item.index} className="flow-item reveal">
              <div className="flow-index">{item.index}</div>
              <div className="flow-path">
                <span>{item.title}</span>
              </div>
              <div className="flow-desc">{item.desc}</div>
              <div className="flow-tag">
                <Link
                  to={item.path}
                  className="hover:text-[var(--wheat)] transition-colors flex items-center gap-1 justify-end"
                >
                  Go to Page <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
