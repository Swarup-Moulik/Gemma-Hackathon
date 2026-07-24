import React from "react";
import { Compass } from "lucide-react";

function ReportMediaPanel({
  imageUrl,
  isDrone,
  individualFrameAnalyses,
  activeFrame,
  setActiveFrame,
  backendUrl,
}) {
  return (
    <div className="md:col-span-2 space-y-6">
      {/* Captured Image Frame */}
      <div className="leaf-glass-card border border-border p-5 rounded-3xl space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Captured Frame
        </h3>
        <div className="rounded-2xl overflow-hidden border border-border bg-secondary/40 aspect-square flex items-center justify-center">
          <img
            src={`${backendUrl}${imageUrl}`}
            alt="Captured scan"
            className="object-cover w-full h-full"
          />
        </div>
      </div>

      {/* Interactive Frame Grid for Drone Mode */}
      {isDrone && individualFrameAnalyses && (
        <div className="leaf-glass-card border border-border p-5 rounded-3xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-primary" /> Multispectral Grid
            </h3>
          </div>

          <div className="grid grid-cols-3 gap-2.5 max-w-[220px] mx-auto p-2 bg-secondary/30 rounded-2xl border border-border">
            {individualFrameAnalyses.map((frame, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setActiveFrame(frame)}
                className={`p-2.5 rounded-xl border text-sm font-bold font-mono transition-transform cursor-pointer ${
                  activeFrame?.timestamp === frame.timestamp
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-secondary/50 text-foreground border-border hover:bg-secondary"
                }`}
              >
                F{index + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ReportMediaPanel;
