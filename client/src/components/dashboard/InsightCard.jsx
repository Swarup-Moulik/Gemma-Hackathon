import React from "react";
import { TrendingUp } from "lucide-react";

function InsightCard({ reportCount }) {
  return (
    <div className="leaf-glass-card border border-border p-6 flex items-start gap-4 shadow-lg">
      <TrendingUp className="w-6 h-6 text-primary shrink-0 mt-0.5" />
      <div className="text-sm space-y-1">
        <span className="font-semibold text-foreground">
          Gemma 4 Pattern Insight:
        </span>
        <p className="text-muted-foreground font-normal">
          {reportCount > 0
            ? `Logged ${reportCount} total inspections. High severity outbreaks are tracked across fields.`
            : "No inspections recorded. Perform a scan to log your first field diagnosis."}
        </p>
      </div>
    </div>
  );
}

export default InsightCard;
