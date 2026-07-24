import React from "react";
import { Link } from "react-router-dom";
import {
  Leaf,
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Cpu,
  Share2,
} from "lucide-react";

function Report() {
  // Dummy report response (structured JSON from Gemma 4)
  const reportData = {
    crop: "Tomato (Solanum lycopersicum)",
    probable_issue: "Early Blight (Alternaria solani)",
    confidence: "High (94%)",
    severity: "Moderate",
    likely_causes: [
      "High humidity following recent heavy monsoon rainfall",
      "Insufficient air circulation between dense leaf canopy",
    ],
    recommended_actions: [
      "Prune and safely destroy infected lower leaves immediately.",
      "Avoid overhead sprinkler irrigation; apply water directly at root level.",
    ],
    organic_options: [
      "Apply copper-based organic fungicide or neem oil solution every 7 days.",
      "Spray liquid compost tea to introduce beneficial microbes.",
    ],
    tourist_safety: {
      hazard_detected: false,
      message: "No immediate hazards detected near guest walking paths.",
    },
    expert_advice:
      "If symptoms spread to more than 40% of foliage within 48 hours, contact local agriculture extension officer.",
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 space-y-6">
        {/* Header Card */}
        <div className="bg-background border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <div>
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                Crop Diagnosis
              </span>
              <h1 className="text-2xl font-bold tracking-tight mt-1">
                {reportData.probable_issue}
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Target Crop: {reportData.crop}
              </p>
            </div>

            <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              Severity: {reportData.severity}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border text-xs">
            <div>
              <span className="text-muted-foreground">Confidence Score:</span>
              <span className="font-semibold ml-1.5">
                {reportData.confidence}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Engine:</span>
              <span className="font-semibold ml-1.5">
                Offline Gemma 4 (Kaggle Pipeline)
              </span>
            </div>
          </div>
        </div>

        {/* Tourist Safety Card */}
        {reportData.tourist_safety.hazard_detected ? (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-xl p-4 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-sm">
                Guest & Tourist Safety Hazard Detected
              </h3>
              <p className="text-xs mt-0.5">
                {reportData.tourist_safety.message}
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 rounded-xl p-4 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-sm">Guest Zone Safe</h3>
              <p className="text-xs mt-0.5">
                {reportData.tourist_safety.message}
              </p>
            </div>
          </div>
        )}

        {/* Actionable Remedies Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Likely Causes */}
          <div className="bg-background border border-border rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Likely Environmental Causes
            </div>
            <ul className="space-y-2 text-xs text-muted-foreground">
              {reportData.likely_causes.map((cause, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground shrink-0 mt-1.5"></span>
                  {cause}
                </li>
              ))}
            </ul>
          </div>

          {/* Organic Options */}
          <div className="bg-background border border-border rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Leaf className="w-4 h-4 text-primary" />
              Organic Treatment Plan
            </div>
            <ul className="space-y-2 text-xs text-muted-foreground">
              {reportData.organic_options.map((option, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5"></span>
                  {option}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Step-by-step Actions */}
        <div className="bg-background border border-border rounded-xl p-5 shadow-sm space-y-3">
          <h3 className="text-sm font-semibold">
            Recommended Immediate Actions
          </h3>
          <ol className="space-y-2 text-xs text-muted-foreground list-decimal list-inside">
            {reportData.recommended_actions.map((action, idx) => (
              <li key={idx} className="leading-relaxed">
                <span className="text-foreground font-medium">{action}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <Link
            to="/dashboard"
            className="px-4 py-2 bg-secondary text-secondary-foreground text-xs font-semibold rounded-lg hover:bg-secondary/80 transition-colors"
          >
            Save to Dashboard
          </Link>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-lg flex items-center gap-1.5 hover:opacity-90"
          >
            <Share2 className="w-3.5 h-3.5" />
            Export / Print Report
          </button>
        </div>
      </main>
    </div>
  );
}

export default Report;
