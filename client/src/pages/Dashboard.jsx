import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Leaf,
  Plus,
  Search,
  Calendar,
  MapPin,
  ChevronRight,
  AlertCircle,
  TrendingUp,
} from "lucide-react";

function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const BACKEND_URL = "http://localhost:8000";

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/reports`)
      .then((res) => {
        setReports(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load reports from MongoDB:", err);
        setLoading(false);
      });
  }, []);

  const filteredReports = reports.filter((r) => {
    const crop = r.analysis?.crop || "";
    const issue = r.analysis?.probable_issue || "";
    return (
      crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Farm Health Timeline & History
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Historical crop disease reports and drone assessments saved in
              MongoDB.
            </p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-1 px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:opacity-90 shadow-sm w-max"
          >
            <Plus className="w-4 h-4" />
            New Inspection
          </Link>
        </div>

        {/* Insight Banner */}
        <div className="bg-secondary/50 border border-border rounded-xl p-4 flex items-start gap-3">
          <TrendingUp className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <span className="font-semibold text-foreground">
              Gemma 4 Pattern Insight:
            </span>
            <p className="text-muted-foreground">
              {reports.length > 0 ? (
                `Logged ${reports.length} total inspections on the edge. High severity outbreaks have been tracked. Improve drainage channels and isolate flagged areas to secure Guest walkways.`
              ) : (
                "No inspections recorded. Scan a leaf or upload a disaster drone flight profile to generate real-time local agronomist tips."
              )}
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search reports by crop or disease name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Reports List */}
        {loading ? (
          <div className="text-center py-12 text-sm text-muted-foreground animate-pulse">
            Loading timeline from MongoDB...
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-border rounded-2xl flex flex-col items-center justify-center gap-2">
            <Leaf className="w-8 h-8 text-muted-foreground animate-bounce" />
            <p className="text-sm font-semibold text-foreground">No reports found</p>
            <p className="text-xs text-muted-foreground">Try adjusting your query or perform a new scan.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredReports.map((report) => (
              <div
                key={report.id}
                className="bg-background border border-border hover:border-primary/50 transition-colors rounded-xl p-4 flex items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-sm">
                      {report.analysis?.probable_issue || "Foliage Inspection"}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-secondary text-secondary-foreground border border-border">
                      {report.analysis?.crop || "Paddy field"}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-medium bg-primary/10 text-primary uppercase border border-primary/20">
                      {report.type === "crop" ? "Plant Health Checker" : "Disaster Field Checker"}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(report.created_at).toLocaleDateString()}
                    </span>
                    {report.coordinates && (
                      <span className="flex items-center gap-1 font-mono">
                        <MapPin className="w-3.5 h-3.5" />
                        {report.coordinates.latitude.toFixed(4)}, {report.coordinates.longitude.toFixed(4)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      report.analysis?.severity === "High" || report.analysis?.severity === "Severe"
                        ? "bg-destructive/10 text-destructive border border-destructive/20"
                        : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                    }`}
                  >
                    {report.analysis?.severity || "Mild"}
                  </span>

                  <Link
                    to={`/report?id=${report.id}`}
                    className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
