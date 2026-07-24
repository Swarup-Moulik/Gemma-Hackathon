import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ScanModeSelector from "../components/home/ScanModeSelector";
import ImageUploader from "../components/home/ImageUploader";

function Home() {
  const navigate = useNavigate();
  const [scanMode, setScanMode] = useState("crop"); // 'crop' | 'drone'
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [coords, setCoords] = useState({
    latitude: 26.2006,
    longitude: 92.4005,
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        },
        () =>
          console.warn(
            "Location permission denied. Using base agricultural coordinates.",
          ),
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

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
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

      const response = await axios.post(
        "http://localhost:8000/api/analyze",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      setIsAnalyzing(false);
      navigate(`/report?id=${response.data.id}`);
    } catch (err) {
      console.error("Gemma 4 Analysis failed:", err);
      setIsAnalyzing(false);
      alert(
        "Error: Local AI Service is offline. Check if your FastAPI server is running.",
      );
    }
  };

  return (
    <div className="min-h-screen text-foreground flex flex-col">
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-10 space-y-8">
        {/* Title */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold font-editorial sm:text-6xl text-foreground">
            Crop & Field Inspection Console
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto font-normal">
            Detect leaf pathogens or evaluate drone aerial telemetry using local
            Gemma 4 AI.
          </p>
        </div>

        {/* Components */}
        <ScanModeSelector scanMode={scanMode} setScanMode={setScanMode} />

        <ImageUploader
          previewUrl={previewUrl}
          onFileChange={handleFileChange}
          onReset={handleReset}
          onAnalyze={handleAnalyze}
          isAnalyzing={isAnalyzing}
        />
      </main>
    </div>
  );
}

export default Home;
