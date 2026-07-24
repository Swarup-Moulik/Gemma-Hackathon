import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";

function Hero() {
  return (
    <section className="text-center space-y-6 max-w-3xl mx-auto py-6">
      <h1 className="text-6xl sm:text-8xl font-light tracking-tight text-foreground font-editorial leading-tight">
        Guardians of the <br />
        <span className="italic font-normal text-primary">Off-Grid Fields</span>
      </h1>

      <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto font-normal leading-relaxed">
        AgriRescue AI safeguards remote agritourism sites, vineyards, and tea
        estates by deploying local Gemma 4 intelligence completely offline.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-5 pt-2">
        <Link
          to="/scan"
          className="btn-pill-primary text-sm font-bold tracking-wide flex items-center gap-2 cursor-pointer"
        >
          Launch Inspect Console
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          to="/dashboard"
          className="btn-pill-secondary text-sm font-bold tracking-wide cursor-pointer"
        >
          View History Timeline
        </Link>
      </div>
    </section>
  );
}

export default Hero;
