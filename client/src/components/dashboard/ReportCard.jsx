import React from "react";
import { Link } from "react-router-dom";
import { Calendar, MapPin, ChevronRight } from "lucide-react";

function ReportCard({ report }) {
  const isSevere =
    report.analysis?.severity === "High" ||
    report.analysis?.severity === "Severe";

  return (
    <div className="leaf-glass-card border border-border hover:border-primary/40 transition-all p-5 flex items-center justify-between gap-4 shadow-md">
      <div className="space-y-1">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-bold text-sm sm:text-base text-foreground">
            {report.analysis?.probable_issue || "Foliage Inspection"}
          </span>
          <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-secondary text-secondary-foreground border border-border">
            {report.analysis?.crop || "Crop"}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground font-normal">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(report.created_at).toLocaleDateString()}
          </span>
          {report.coordinates && (
            <span className="flex items-center gap-1 font-mono">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              {report.coordinates.latitude.toFixed(4)},{" "}
              {report.coordinates.longitude.toFixed(4)}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span
          className={`px-3.5 py-1 rounded-full text-xs font-bold border ${
            isSevere
              ? "bg-destructive/10 text-destructive border-destructive/20"
              : "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20"
          }`}
        >
          {report.analysis?.severity || "Mild"}
        </span>

        <Link
          to={`/report?id=${report.id}`}
          className="p-2 text-muted-foreground hover:text-foreground rounded-xl hover:bg-secondary"
        >
          <ChevronRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}

export default ReportCard;
