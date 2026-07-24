import React from "react";
import { Search } from "lucide-react";

function SearchBar({ searchTerm, setSearchTerm }) {
  return (
    <div className="relative">
      <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
      <input
        type="text"
        placeholder="Filter reports by crop or pathogen..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-12 pr-4 py-3 bg-secondary/50 border border-border rounded-2xl text-sm focus:outline-none focus:border-primary text-foreground placeholder-muted-foreground"
      />
    </div>
  );
}

export default SearchBar;
