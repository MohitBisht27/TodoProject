import React from "react";
import { useNavigate } from "react-router-dom";
import { DateRibbon } from "../components/DateRibbon";
import { ThemeToggle } from "../components/ThemeToggle";
import { CATEGORIES } from "../constants/constants";
import { useTasks } from "../context/TaskContext";
import { ChevronRight, Plus, Loader2, LayoutGrid } from "lucide-react";

export const CategoriesPage = () => {
  const navigate = useNavigate();
  const { todos, loading, setSelectedCategory } = useTasks();

  // Calculate task counts per category dynamically from real backend array
  const getCategoryCount = (categoryName) => {
    return todos.filter((t) => t.category?.toLowerCase() === categoryName.toLowerCase()).length;
  };

  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName);
    navigate(`/tasks?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 pb-28 transition-colors">
      {/* Top Banner / Hero */}
      <div className="bg-[#9D72FF] dark:bg-purple-950/80 text-white shadow-xl border-b border-purple-400/20">
        <div className="max-w-6xl mx-auto px-6 pt-8 pb-12">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-white/10 dark:bg-white/15 rounded-2xl">
                <LayoutGrid className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-bold uppercase tracking-wider text-purple-100">
                Category Hub
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <ThemeToggle />
              <button
                onClick={() => navigate("/create-task")}
                className="px-5 py-2.5 bg-white text-[#9D72FF] hover:bg-purple-50 font-bold rounded-2xl shadow-md transition-all hover:scale-105 active:scale-95 text-sm flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>New Task</span>
              </button>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-black tracking-tight">Activity Categories</h1>
          <p className="text-sm font-semibold text-purple-100 dark:text-purple-200 mt-2">
            Organize and manage your todos by category
          </p>
        </div>
      </div>

      {/* Main Responsive Grid Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-6">
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-purple-50 dark:border-gray-800 space-y-8 transition-colors">
          {/* Date Ribbon */}
          <div>
            <DateRibbon />
          </div>

          {/* Section Heading */}
          <div className="border-b border-gray-100 dark:border-gray-800 pb-4 flex items-center justify-between">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Choose Activity</h2>
            <span className="text-xs font-bold text-gray-400 dark:text-gray-500">
              Total {todos.length} Active {todos.length === 1 ? "Task" : "Tasks"}
            </span>
          </div>

          {/* Categories Grid (1 col on mobile, 2 on tablet, 3 on desktop) */}
          {loading && todos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-purple-600 dark:text-purple-400">
              <Loader2 className="w-10 h-10 animate-spin mb-3" />
              <p className="text-sm font-semibold">Fetching activities from server...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {CATEGORIES.map((cat) => {
                const IconComponent = cat.icon;
                const count = getCategoryCount(cat.name);

                return (
                  <div
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.name)}
                    className="group flex items-center justify-between p-6 bg-[#F5EEFF] dark:bg-gray-800/80 hover:bg-[#EFE2FF] dark:hover:bg-gray-800 rounded-2xl cursor-pointer transition-all duration-200 shadow-xs hover:shadow-md hover:-translate-y-0.5 border border-purple-100 dark:border-gray-700"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-3.5 bg-white dark:bg-gray-900 rounded-2xl text-[#9D72FF] dark:text-purple-400 shadow-xs group-hover:scale-110 transition-transform">
                        <IconComponent className="w-7 h-7" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 leading-snug">
                          {cat.name}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mt-0.5">
                          {count} {count === 1 ? "Task" : "Tasks"}
                        </p>
                      </div>
                    </div>

                    <div className="text-purple-400 dark:text-purple-400 group-hover:text-purple-700 dark:group-hover:text-purple-300 group-hover:translate-x-1 transition-all">
                      <ChevronRight className="w-6 h-6" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
