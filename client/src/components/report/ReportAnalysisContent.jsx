import React from "react";
import { ShieldAlert, CheckCircle2, AlertTriangle, Leaf } from "lucide-react";

function ReportAnalysisContent({ analysis }) {
  return (
    <div className="md:col-span-3 space-y-6">
      {/* Tourist Safety Alert */}
      {analysis?.tourist_safety?.hazard_detected ? (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-3xl p-5 flex items-start gap-3 leaf-glass-card">
          <ShieldAlert className="w-6 h-6 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-base text-foreground">
              Guest Safety Warning
            </h3>
            <p className="text-sm mt-0.5 text-muted-foreground font-normal">
              {analysis.tourist_safety.message}
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-primary/10 border border-primary/20 text-primary rounded-3xl p-5 flex items-start gap-3 leaf-glass-card">
          <CheckCircle2 className="w-6 h-6 shrink-0" />
          <div>
            <h3 className="font-bold text-base text-foreground">
              Guest Zone Clear
            </h3>
            <p className="text-sm mt-0.5 text-muted-foreground font-normal">
              {analysis?.tourist_safety?.message ||
                "No safety hazards detected."}
            </p>
          </div>
        </div>
      )}

      {/* Causes & Remedies Grid */}
      <div className="grid sm:grid-cols-2 gap-5">
        {/* Environmental Causes */}
        <div className="leaf-glass-card border border-border p-6 space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-foreground uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-amber-500" /> Environmental
            Causes
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground font-normal">
            {analysis?.likely_causes?.map((cause, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground shrink-0 mt-2"></span>
                <span>{cause}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Organic Treatment */}
        <div className="leaf-glass-card border border-border p-6 space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-foreground uppercase tracking-wider">
            <Leaf className="w-4 h-4 text-primary" /> Organic Treatment
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground font-normal">
            {analysis?.organic_options?.map((option, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2"></span>
                <span>{option}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recommended Actions */}
      <div className="leaf-glass-card border border-border p-6 space-y-3">
        <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
          Recommended Immediate Actions
        </h3>
        <ol className="space-y-2 text-sm text-muted-foreground font-normal list-decimal list-inside leading-relaxed">
          {analysis?.recommended_actions?.map((action, idx) => (
            <li key={idx}>
              <span className="text-foreground">{action}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export default ReportAnalysisContent;
