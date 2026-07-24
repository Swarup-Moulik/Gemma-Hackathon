import React from "react";
import { Link } from "react-router-dom";
import { Camera, Plane, ShieldAlert, Sparkles, ArrowRight, Layers, Compass, HelpCircle } from "lucide-react";

function Landing() {
  return (
    <div className="min-h-screen text-slate-100 flex flex-col relative overflow-hidden">
      {/* Editorial Decorative Background overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/20 via-transparent to-transparent pointer-events-none"></div>
      <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-emerald-700/5 rounded-full blur-[120px] pointer-events-none"></div>

