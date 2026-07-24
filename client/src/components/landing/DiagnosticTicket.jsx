import React from "react";

export default function DiagnosticTicket({ ringRef }) {
  return (
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
              <circle
                cx="38"
                cy="38"
                r="32"
                stroke="#E4DBC6"
                strokeWidth="6"
                fill="none"
              />
              <circle
                ref={ringRef}
                cx="38"
                cy="38"
                r="32"
                stroke="#6E8C5C"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="201"
                strokeDashoffset="201"
              />
            </svg>
            <div className="ring-label">
              <b>72%</b>
              <span>RECOVERY</span>
            </div>
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
          <div className="qr-corner">
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </div>
  );
}
