import React, { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { LayoutGrid, CheckSquare, Plus, CheckCircle2, Search, X } from "lucide-react";
import { useTasks } from "../context/TaskContext";

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { searchQuery, setSearchQuery } = useTasks();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const handleSearchFocus = () => {
    if (location.pathname !== "/tasks") {
      navigate("/tasks");
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (location.pathname !== "/tasks") {
      navigate("/tasks");
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <>
      {/* Desktop Web Application Top Header Navigation Bar */}
      <header className="hidden md:block bg-white border-b border-purple-100 sticky top-0 z-40 shadow-xs">
        <div className="max-w-6xl mx-auto px-6 h-18 flex items-center justify-between">
          {/* Logo & Brand */}
          <div
            onClick={() => navigate("/categories")}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 bg-[#9D72FF] rounded-2xl flex items-center justify-center text-white shadow-md shadow-purple-200 group-hover:scale-105 transition-transform">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black text-gray-900 tracking-tight leading-none">
                Taskify<span className="text-[#9D72FF]">.</span>
              </h1>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                Task Management
              </p>
            </div>
          </div>

          {/* Desktop Search Input with Focus Redirect & Clear Button */}
          <div className="flex-1 max-w-md mx-8 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onFocus={handleSearchFocus}
              onChange={handleSearchChange}
              placeholder="Search tasks by title, category, or description..."
              className="w-full pl-10 pr-9 py-2 bg-gray-50 hover:bg-gray-100 focus:bg-white rounded-xl text-sm font-medium text-gray-800 border border-gray-200 focus:border-purple-300 focus:outline-none transition-all placeholder-gray-400"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Web App Navigation Links */}
          <nav className="flex items-center space-x-6">
            <NavLink
              to="/categories"
              className={({ isActive }) =>
                `flex items-center space-x-2 text-sm font-bold transition-all py-2 px-3 rounded-xl ${
                  isActive
                    ? "text-[#9D72FF] bg-purple-50"
                    : "text-gray-600 hover:text-purple-600 hover:bg-gray-50"
                }`
              }
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Categories</span>
            </NavLink>

            <NavLink
              to="/tasks"
              className={({ isActive }) =>
                `flex items-center space-x-2 text-sm font-bold transition-all py-2 px-3 rounded-xl ${
                  isActive
                    ? "text-[#9D72FF] bg-purple-50"
                    : "text-gray-600 hover:text-purple-600 hover:bg-gray-50"
                }`
              }
            >
              <CheckSquare className="w-4 h-4" />
              <span>Today's Tasks</span>
            </NavLink>

            <button
              onClick={() => navigate("/create-task")}
              className="flex items-center space-x-2 px-5 py-2.5 bg-[#9D72FF] hover:bg-purple-700 text-white rounded-xl text-sm font-bold shadow-md shadow-purple-200 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Task</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile Sticky Top Header with Search Button */}
      <div className="md:hidden sticky top-0 z-30 bg-white border-b border-purple-50 px-4 py-3 flex items-center justify-between shadow-xs">
        <div onClick={() => navigate("/categories")} className="flex items-center space-x-2 cursor-pointer">
          <div className="w-8 h-8 bg-[#9D72FF] rounded-xl flex items-center justify-center text-white font-bold">
            T
          </div>
          <span className="font-bold text-gray-900 text-base">Taskify</span>
        </div>

        <div className="flex-1 max-w-[200px] relative mx-2">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onFocus={handleSearchFocus}
            onChange={handleSearchChange}
            placeholder="Search..."
            className="w-full pl-8 pr-7 py-1.5 bg-gray-50 focus:bg-white rounded-lg text-xs font-medium border border-gray-200 focus:outline-none"
          />
          {searchQuery && (
            <button onClick={clearSearch} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-purple-50 px-6 py-3 shadow-2xl flex justify-around items-center z-40 rounded-t-3xl">
        <NavLink
          to="/categories"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 transition-colors ${
              isActive ? "text-[#9D72FF] font-bold" : "text-gray-400 hover:text-gray-600"
            }`
          }
        >
          <LayoutGrid className="w-6 h-6" />
          <span className="text-xs">Categories</span>
        </NavLink>

        <NavLink
          to="/create-task"
          className="flex items-center justify-center w-12 h-12 bg-[#9D72FF] text-white rounded-2xl shadow-lg shadow-purple-300 hover:bg-purple-600 transition-all hover:scale-105 active:scale-95 -mt-6"
          aria-label="Create Task"
        >
          <Plus className="w-7 h-7" />
        </NavLink>

        <NavLink
          to="/tasks"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 transition-colors ${
              isActive ? "text-[#9D72FF] font-bold" : "text-gray-400 hover:text-gray-600"
            }`
          }
        >
          <CheckSquare className="w-6 h-6" />
          <span className="text-xs">Today's Tasks</span>
        </NavLink>
      </nav>
    </>
  );
};

export default Navbar;
