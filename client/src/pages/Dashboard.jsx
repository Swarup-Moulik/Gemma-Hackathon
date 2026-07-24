import React, { useState } from "react";
import { Link } from "react-router-dom";
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

  // Dummy past inspections (fetched from MongoDB via FastAPI)
  const mockReports = [
    {
      id: "1",
      date: "2026-07-22",
      crop: "Tomato",
      issue: "Early Blight",
      severity: "Moderate",
      location: "East Vineyard Plot B",
      type: "Handheld",
    },
    {
      id: "2",
      date: "2026-07-18",
      crop: "Tea Plantation",
      issue: "Red Spider Mite",
      severity: "High",
      location: "Guest Trail Sector 1",
      type: "Handheld",
    },
    {
      id: "3",
      date: "2026-07-10",
      crop: "Soil / Paddy",
      issue: "Silt Saturated (Flood Recovery)",
      severity: "Low",
      location: "Lower Valley Field",
      type: "Drone Aerial",
    },
  ];

  const filteredReports = mockReports.filter(
    (r) =>
      r.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.issue.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Farm Health Timeline & History
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Historical crop disease reports and drone assessments saved in
            MongoDB.
          </p>
        </div>

        {/* Insight Banner */}
        <div className="bg-secondary/50 border border-border rounded-xl p-4 flex items-start gap-3">
          <TrendingUp className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <span className="font-semibold text-foreground">
              AI Pattern Insight:
            </span>
            <p className="text-muted-foreground">
              Fungal blight symptoms recurred twice in July following monsoon
              rainfall. Improving soil drainage in East Vineyard Plot B is
              recommended.
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
        <div className="space-y-3">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="bg-background border border-border hover:border-primary/50 transition-colors rounded-xl p-4 flex items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">{report.issue}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-secondary text-secondary-foreground border border-border">
                    {report.crop}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {report.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {report.location}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    report.severity === "High"
                      ? "bg-destructive/10 text-destructive border border-destructive/20"
                      : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                  }`}
                >
                  {report.severity}
                </span>

                <Link
                  to="/report"
                  className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary"
                >
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
