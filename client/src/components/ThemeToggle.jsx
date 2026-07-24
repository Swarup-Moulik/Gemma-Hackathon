import React, { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    // Default to dark mode unless explicitly set to light
    if (savedTheme === "dark" || (!savedTheme && prefersDark) || !savedTheme) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-secondary border border-border text-foreground hover:bg-muted transition-colors shadow-sm cursor-pointer"
      aria-label="Toggle Dark Mode"
    >
      {isDark ? (
        <Sun size={18} className="text-amber-400" />
      ) : (
        <Moon size={18} className="text-slate-700" />
      )}
    </button>
  );
};

export default ThemeToggle;
