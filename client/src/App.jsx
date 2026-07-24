import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Report from "./pages/Report";

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Global Navigation Header */}
      <Navbar />

      {/* Main Page Routing */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/scan" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/report" element={<Report />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
