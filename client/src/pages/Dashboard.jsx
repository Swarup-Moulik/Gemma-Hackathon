import React, { useState, useEffect } from "react";
import axios from "axios";
import { Leaf } from "lucide-react";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import InsightCard from "../components/dashboard/InsightCard";
import SearchBar from "../components/dashboard/SearchBar";
import ReportCard from "../components/dashboard/ReportCard";

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
        console.error("Failed to load reports:", err);
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
    <div className="min-h-screen text-foreground flex flex-col">
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-8 space-y-6">
        <DashboardHeader />

        <InsightCard reportCount={reports.length} />

        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        {/* Reports Container State */}
        {loading ? (
          <div className="text-center py-12 text-sm text-muted-foreground animate-pulse">
            Loading timeline from MongoDB...
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-border rounded-3xl flex flex-col items-center justify-center gap-2 bg-secondary/20">
            <Leaf className="w-8 h-8 text-muted-foreground animate-bounce" />
            <p className="text-sm font-semibold text-foreground">
              No reports found
            </p>
            <p className="text-xs text-muted-foreground">
              Try adjusting your search query.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
