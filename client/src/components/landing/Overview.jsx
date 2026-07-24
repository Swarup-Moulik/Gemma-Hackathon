import React from "react";
import { HelpCircle, Layers, Compass } from "lucide-react";

function Overview() {
  const metadata = [
    { label: "Hackathon Event", value: "Google Build with Gemma" },
    { label: "AI Intelligence Engine", value: "Gemma 4 Multimodal Pipeline" },
    { label: "Deployment Context", value: "Offline Local WLAN Hotspot" },
  ];

  const pillars = [
    {
      icon: HelpCircle,
      title: "01. The Cause",
      text: "Remote agritourism estates, organic farms, and boutique vineyards are highly susceptible to crop damage. When blights or flooding strike, there is typically no internet connectivity and no agricultural expert nearby. AgriRescue AI lets operators run expert diagnoses and verify terrain safety immediately.",
    },
    {
      icon: Layers,
      title: "02. The AI Architecture",
      text: "Leveraging Google's Gemma 4 multimodal models, the app runs entirely at the edge. By processing leaf images (Plant Health Checker) or drone flight frames (Disaster Field Checker), Gemma 4 diagnoses crop illnesses and estimates soil reclamation roadmaps.",
    },
    {
      icon: Compass,
      title: "03. The Event Focus",
      text: "Designed for the Google Build with Gemma Hackathon, this project demonstrates lightweight, edge-compatible generative models in real-world scenarios.",
    },
  ];

  return (
    <section className="leaf-glass-card border border-border p-8 md:p-10 shadow-2xl relative overflow-hidden">
      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Metadata Sidebar */}
        <div className="md:col-span-1 space-y-6 md:border-r md:border-border md:pr-8">
          <div>
            <span className="text-xs font-bold text-muted-foreground tracking-widest uppercase">
              Overview
            </span>
            <h2 className="text-4xl font-bold font-editorial text-foreground mt-1">
              AgriRescue <br />
              <span className="italic text-primary">Project Console</span>
            </h2>
          </div>

          <div className="space-y-3 text-sm">
            {metadata.map((item, idx) => (
              <div key={idx} className="border-t border-border pt-3">
                <span className="text-muted-foreground block font-medium">
                  {item.label}
                </span>
                <span className="text-foreground font-bold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Pillars List */}
        <div className="md:col-span-2 space-y-6 md:pl-4">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className={`space-y-1.5 ${idx > 0 ? "border-t border-border pt-4" : ""}`}
              >
                <h3 className="text-sm font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                  <Icon className="w-4 h-4 text-primary" />
                  {pillar.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {pillar.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Overview;
