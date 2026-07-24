import React from "react";
import { Camera, Plane } from "lucide-react";

function ScanModeSelector({ scanMode, setScanMode }) {
  const modes = [
    {
      id: "crop",
      title: "Plant Health Checker",
      description: "Foliage pathogen diagnosis",
      icon: Camera,
    },
    {
      id: "drone",
      title: "Disaster Field Checker",
      description: "Aerial terrain grid scan",
      icon: Plane,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-5">
      {modes.map((mode) => {
        const Icon = mode.icon;
        const isActive = scanMode === mode.id;

        return (
          <button
            key={mode.id}
            type="button"
            onClick={() => setScanMode(mode.id)}
            className={`p-6 rounded-3xl text-left transition-all flex items-start gap-4 cursor-pointer border ${
              isActive
                ? "leaf-glass-card border-primary/50 text-foreground shadow-2xl ring-2 ring-primary/30"
                : "bg-secondary/40 border-border text-muted-foreground hover:border-border/80"
            }`}
          >
            <div
              className={`p-2.5 rounded-2xl ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-sm sm:text-base text-foreground">
                {mode.title}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {mode.description}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default ScanModeSelector;
