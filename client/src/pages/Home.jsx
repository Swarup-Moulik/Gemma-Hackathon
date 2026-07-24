import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Camera,
  Upload,
  Plane,
  Leaf,
  ArrowRight,
  ShieldCheck,
  Cpu,
} from "lucide-react";

import axios from "axios";

function Home() {
  const navigate = useNavigate();
  const [scanMode, setScanMode] = useState("crop"); // 'crop' | 'drone'
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [coords, setCoords] = useState({ latitude: 26.2006, longitude: 92.4005 });

  React.useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude
          });
        },
        (err) => console.warn("Location permission denied. Using base agricultural coordinates.")
      );
    }
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("scanMode", scanMode);
      formData.append("latitude", coords.latitude);
      formData.append("longitude", coords.longitude);

      const response = await axios.post("http://localhost:8000/api/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setIsAnalyzing(false);
      // Navigate to report page passing the newly saved MongoDB report ID
      navigate(`/report?id=${response.data.id}`);
    } catch (err) {
      console.error("Gemma 4 Analysis failed:", err);
      setIsAnalyzing(false);
      alert("Error: Local AI Service is offline. Check if uvicorn main:app is running.");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        {/* Title Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl mb-2">
            Autonomous Agritourism Crop & Field Guardian
          </h1>
          <p className="text-muted-foreground text-base max-w-xl mx-auto">
            Detect crop diseases, evaluate post-disaster fields, and protect
            guest safety using local multimodal AI.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button
            type="button"
            onClick={() => setScanMode("crop")}
            className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
              scanMode === "crop"
                ? "frosted-glass border-white/30 shadow-emerald-500/10 shadow-lg text-white"
                : "bg-black/20 border-white/5 text-slate-400 hover:border-white/10"
            }`}
          >
            <div
              className={`p-2 rounded-lg ${scanMode === "crop" ? "bg-white/10 text-white" : "bg-black/20 text-slate-500"}`}
            >
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm">Plant Health Checker</div>
              <div className="text-xs text-slate-400 mt-0.5">
                Handheld crop photo analysis for leaves & pathogens
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setScanMode("drone")}
            className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
              scanMode === "drone"
                ? "frosted-glass border-white/30 shadow-emerald-500/10 shadow-lg text-white"
                : "bg-black/20 border-white/5 text-slate-400 hover:border-white/10"
            }`}
          >
            <div
              className={`p-2 rounded-lg ${scanMode === "drone" ? "bg-white/10 text-white" : "bg-black/20 text-slate-500"}`}
            >
              <Plane className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm">
                Disaster Field Checker
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                Drone grid scan to evaluate flood soil Growability
              </div>
            </div>
          </button>
        </div>

        {/* Upload Card */}
        <div className="frosted-glass border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-950/10 via-transparent to-transparent pointer-events-none"></div>
          {!previewUrl ? (
            <label className="border border-dashed border-white/15 hover:border-white/30 transition-colors rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer group bg-white/5">
              <div className="p-4 rounded-full bg-white/5 text-white group-hover:scale-110 transition-transform mb-3 border border-white/5 shadow-md">
                <Upload className="w-8 h-8" />
              </div>
              <p className="font-semibold text-sm mb-1 text-white">
                Click to upload or drag & drop image
              </p>
              <p className="text-xs text-slate-400 mb-5">
                Supports PNG, JPG, or WEBP (Max 10MB)
              </p>
              <span className="btn-pill-primary cursor-pointer">
                Select Photo
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          ) : (
            <div className="space-y-4">
              <div className="relative rounded-xl overflow-hidden border border-white/10 max-h-80 flex items-center justify-center bg-black/30">
                <img
                  src={previewUrl}
                  alt="Crop preview"
                  className="object-contain h-full w-full max-h-80"
                />
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl(null);
                  }}
                  className="absolute top-3 right-3 btn-pill-secondary text-xs py-1.5 px-3 bg-black/60 hover:bg-black/80 font-bold border border-white/20"
                >
                  Change Image
                </button>
              </div>

              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="w-full btn-pill-primary py-3.5 flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <Cpu className="w-5 h-5 animate-spin text-emerald-950" />
                    Running Gemma 4 Multimodal Analysis...
                  </>
                ) : (
                  <>
                    Analyze with Gemma 4
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Home;
