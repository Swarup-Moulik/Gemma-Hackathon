import React from "react";
import { MapPin } from "lucide-react";

function ReportHeader({ analysis, coordinates, isDrone }) {
  const isSevere =
    analysis?.severity === "Severe" || analysis?.severity === "High";

  return (
    <div className="leaf-glass-card border border-border p-8 shadow-2xl">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
        <div>
          <span className="text-xs font-bold text-primary uppercase tracking-widest">
            {isDrone ? "Disaster Field Checker" : "Plant Health Checker"}
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold font-editorial text-foreground mt-1">
            {analysis?.probable_issue}
          </h1>
          <p className="text-sm text-muted-foreground mt-1 font-normal">
            Target: {analysis?.crop}
          </p>
        </div>

        <span
          className={`px-4 py-1.5 rounded-full text-sm font-bold border ${
            isSevere
              ? "bg-destructive/10 text-destructive border-destructive/20"
              : "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20"
          }`}
        >
          Severity: {analysis?.severity}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-border text-sm text-muted-foreground font-normal">
        <div>
          <span>Confidence Score:</span>{" "}
          <span className="font-semibold text-foreground">
            {analysis?.confidence}
          </span>
        </div>
        <div>
          <span>Engine:</span>{" "}
          <span className="font-semibold text-foreground">Offline Gemma 4</span>
        </div>
        {coordinates && (
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="font-semibold text-foreground font-mono">
              {coordinates.latitude.toFixed(4)},{" "}
              {coordinates.longitude.toFixed(4)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReportHeader;
