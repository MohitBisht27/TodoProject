import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export const Header = ({ title = "Taskify", showBack = true, rightAction = null }) => {
  const navigate = useNavigate();

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30 shadow-sm transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {showBack && (
            <button
              onClick={() => navigate(-1)}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-gray-800 rounded-xl transition-all"
              title="Go Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">{title}</h1>
        </div>

        <div className="flex items-center space-x-3">
          {rightAction && <div>{rightAction}</div>}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
