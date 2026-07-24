import React from "react";
import { Camera, Plane, ShieldAlert } from "lucide-react";
import Hero from "../components/landing/Hero";
import Overview from "../components/landing/Overview";
import FeatureCard from "../components/landing/FeatureCard";

function Landing() {
  const modules = [
    {
      number: "01",
      title: "Plant Health Checker",
      description:
        "Analyze handheld crop foliage captures. Instantly detect pathogen anomalies and receive organic treatment roadmaps.",
      icon: Camera,
      badgeText: "Mobile Scan Mode",
      badgeColor: "text-primary",
    },
    {
      number: "02",
      title: "Disaster Field Checker",
      description:
        "Process drone flight profiles. Map 2D grid coordinates for silt levels and evaluate soil growability.",
      icon: Plane,
      badgeText: "Aerial Grid Scan",
      badgeColor: "text-primary",
    },
    {
      number: "03",
      title: "Guest Zone Safeguards",
      description:
        "Correlate crop contamination GPS maps with walking paths to secure public agritourism routes immediately.",
      icon: ShieldAlert,
      badgeText: "Hazard Safeguards",
      badgeColor: "text-destructive",
    },
  ];

  return (
    <div className="min-h-screen text-foreground flex flex-col relative overflow-hidden">
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-12 md:py-16 space-y-16 relative z-10">
        <Hero />
        <Overview />

        {/* Feature Grid */}
        <section className="space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold text-primary tracking-widest uppercase">
              Modules
            </span>
            <h2 className="text-4xl font-bold font-editorial text-foreground">
              Core Capabilities
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {modules.map((mod, idx) => (
              <FeatureCard key={idx} {...mod} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Landing;
