import React from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

function DashboardHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-4xl font-bold font-editorial text-foreground">
          Farm Health Timeline
        </h1>
        <p className="text-sm text-muted-foreground mt-1 font-normal">
          Historical crop inspections saved locally in MongoDB.
        </p>
      </div>
      <Link
        to="/scan"
        className="btn-pill-primary text-sm font-bold flex items-center gap-2 cursor-pointer shadow-md w-max"
      >
        <Plus className="w-4 h-4" />
        New Inspection
      </Link>
    </div>
  );
}

export default DashboardHeader;
