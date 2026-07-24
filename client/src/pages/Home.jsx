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

function Home() {
  const navigate = useNavigate();
  const [scanMode, setScanMode] = useState("crop"); // 'crop' | 'drone'
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

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

    // Simulate API call to FastAPI backend
    setTimeout(() => {
      setIsAnalyzing(false);
      // Navigate to report page (passing dummy ID or data via state)
      navigate("/report");
    }, 2000);
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
            className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3 ${
              scanMode === "crop"
                ? "bg-secondary border-primary ring-2 ring-ring"
                : "bg-background border-border hover:border-primary/50"
            }`}
          >
            <div
              className={`p-2 rounded-lg ${scanMode === "crop" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
            >
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-sm">Individual Crop Scan</div>
              <div className="text-xs text-muted-foreground mt-0.5">
                Handheld mobile photo for leaves, spot disease & pests
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setScanMode("drone")}
            className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3 ${
              scanMode === "drone"
                ? "bg-secondary border-primary ring-2 ring-ring"
                : "bg-background border-border hover:border-primary/50"
            }`}
          >
            <div
              className={`p-2 rounded-lg ${scanMode === "drone" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
            >
              <Plane className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-sm">
                Post-Disaster Aerial Scan
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                Drone frames to evaluate flood damage & soil growability
              </div>
            </div>
          </button>
        </div>

        {/* Upload Card */}
        <div className="bg-background border border-border rounded-2xl p-6 shadow-sm">
          {!previewUrl ? (
            <label className="border-2 border-dashed border-border hover:border-primary transition-colors rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer group bg-secondary/30">
              <div className="p-4 rounded-full bg-secondary text-primary group-hover:scale-110 transition-transform mb-3">
                <Upload className="w-8 h-8" />
              </div>
              <p className="font-semibold text-sm mb-1">
                Click to upload or drag & drop image
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                Supports PNG, JPG, or WEBP (Max 10MB)
              </p>
              <span className="px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-lg shadow-sm">
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
              <div className="relative rounded-xl overflow-hidden border border-border max-h-80 flex items-center justify-center bg-black/5">
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
                  className="absolute top-3 right-3 px-3 py-1 bg-background/80 backdrop-blur text-foreground border border-border rounded-lg text-xs font-medium hover:bg-background"
                >
                  Change Image
                </button>
              </div>

              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <Cpu className="w-5 h-5 animate-spin" />
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
