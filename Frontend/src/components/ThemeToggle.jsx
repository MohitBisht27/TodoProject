import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export const ThemeToggle = ({ className = "" }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`p-2.5 rounded-2xl transition-all duration-300 flex items-center justify-center cursor-pointer ${
        isDark
          ? "bg-gray-800 text-amber-300 hover:bg-gray-700 shadow-md border border-gray-700"
          : "bg-purple-50 text-purple-700 hover:bg-purple-100 shadow-xs border border-purple-200"
      } ${className}`}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {isDark ? (
        <Sun className="w-5 h-5 transform rotate-0 transition-transform duration-300 ease-in-out" />
      ) : (
        <Moon className="w-5 h-5 transform rotate-0 transition-transform duration-300 ease-in-out" />
      )}
    </button>
  );
};

export default ThemeToggle;
