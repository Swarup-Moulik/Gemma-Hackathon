import React, { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, AlertTriangle, Cpu, Share2, Trash2 } from "lucide-react";

import ReportHeader from "../components/report/ReportHeader";
import ReportMediaPanel from "../components/report/ReportMediaPanel";
import ReportAnalysisContent from "../components/report/ReportAnalysisContent";

function Report() {
  const [searchParams] = useSearchParams();
  const reportId = searchParams.get("id");
  const navigate = useNavigate();

  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFrame, setActiveFrame] = useState(null);

  const BACKEND_URL = "http://localhost:8000";

  useEffect(() => {
    if (!reportId) {
      setError("No report ID provided.");
      setLoading(false);
      return;
    }

    axios
      .get(`${BACKEND_URL}/api/reports/${reportId}`)
      .then((res) => {
        setReportData(res.data);
        if (
          res.data.type === "drone" &&
          res.data.analysis?.individualFrameAnalyses?.length > 0
        ) {
          setActiveFrame(res.data.analysis.individualFrameAnalyses[0]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to retrieve report from MongoDB.");
        setLoading(false);
      });
  }, [reportId]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this report?")) return;
    try {
      await axios.delete(`${BACKEND_URL}/api/reports/${reportId}`);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Failed to delete the report.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-muted-foreground">
        <Cpu className="w-8 h-8 text-primary animate-spin" />
        <p className="text-sm font-medium animate-pulse">
          Loading Gemma 4 Assessment...
        </p>
      </div>
    );
  }

  if (error || !reportData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="leaf-glass-card border border-border p-8 rounded-3xl text-center space-y-4 max-w-md w-full">
          <AlertTriangle className="w-8 h-8 text-destructive mx-auto" />
          <h2 className="text-lg font-bold text-foreground">
            Report Not Found
          </h2>
          <p className="text-sm text-muted-foreground">{error}</p>
          <Link
            to="/"
            className="btn-pill-primary text-sm font-bold inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const analysis = reportData.analysis;
  const isDrone = reportData.type === "drone";

  return (
    <div className="min-h-screen text-foreground flex flex-col">
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-8 space-y-6">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <button
            type="button"
            onClick={handleDelete}
            className="inline-flex items-center gap-1.5 text-sm text-destructive hover:text-destructive/80 font-medium cursor-pointer"
          >
            <Trash2 className="w-4 h-4" /> Delete Report
          </button>
        </div>

        {/* Component: Header Card */}
        <ReportHeader
          analysis={analysis}
          coordinates={reportData.coordinates}
          isDrone={isDrone}
        />

        {/* Component Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <ReportMediaPanel
            imageUrl={reportData.image_url}
            isDrone={isDrone}
            individualFrameAnalyses={analysis?.individualFrameAnalyses}
            activeFrame={activeFrame}
            setActiveFrame={setActiveFrame}
            backendUrl={BACKEND_URL}
          />

          <ReportAnalysisContent analysis={analysis} />
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-border">
          <Link
            to="/dashboard"
            className="btn-pill-secondary font-semibold text-sm"
          >
            Timeline Dashboard
          </Link>
          <button
            type="button"
            onClick={() => window.print()}
            className="btn-pill-primary text-sm font-bold flex items-center gap-2 cursor-pointer"
          >
            <Share2 className="w-4 h-4" /> Print / Export
          </button>
        </div>
      </main>
    </div>
  );
}

export default Report;
