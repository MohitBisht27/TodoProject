import React, { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DateRibbon } from "../components/DateRibbon";
import { TodoDetailModal } from "../components/TodoDetailModal";
import { ThemeToggle } from "../components/ThemeToggle";
import { useTasks } from "../context/TaskContext";
import { CATEGORIES } from "../constants/constants";
import {
  LayoutGrid,
  Clock,
  Plus,
  CheckSquare,
  Square,
  Trash2,
  Edit3,
  Loader2,
  Paperclip,
  Calendar,
  Search,
  X,
} from "lucide-react";

export const TasksPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get("category");

  const {
    todos,
    loading,
    selectedDate,
    toggleTaskStatus,
    removeTask,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
  } = useTasks();

  // Modal State for viewing full details of a todo item
  const [selectedTodoForModal, setSelectedTodoForModal] = useState(null);

  const isSameDay = (d1, d2) => {
    if (!d1 || !d2) return false;
    const date1 = new Date(d1);
    const date2 = new Date(d2);
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  // Filter tasks based on search query, category, and date
  const filteredTodos = useMemo(() => {
    return todos.filter((t) => {
      // Search filter across title, description, category, and notes
      if (searchQuery && searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = t.title?.toLowerCase().includes(q);
        const matchDesc = t.description?.toLowerCase().includes(q);
        const matchCat = t.category?.toLowerCase().includes(q);
        const matchNotes = t.notes?.toLowerCase().includes(q);

        if (!matchTitle && !matchDesc && !matchCat && !matchNotes) {
          return false;
        }
        // When searching, bypass strict date filter so user can find matching tasks anywhere
        return true;
      }

      let matchesCategory = true;
      const activeCat = categoryFilter || selectedCategory;
      if (activeCat) {
        matchesCategory = t.category?.toLowerCase() === activeCat.toLowerCase();
      }

      let matchesDate = true;
      if (t.dueDate) {
        matchesDate = isSameDay(t.dueDate, selectedDate);
      }

      return matchesCategory && matchesDate;
    });
  }, [todos, categoryFilter, selectedCategory, selectedDate, searchQuery]);

  // Format header date string e.g. "14 Sept"
  const formattedHeaderDate = useMemo(() => {
    const d = selectedDate || new Date();
    const day = d.getDate();
    const month = d.toLocaleString("default", { month: "short" });
    return `${day} ${month}`;
  }, [selectedDate]);

  // Generate fallback formatted time slot if reminder/due date time is not set
  const getTimeSlot = (todo, index) => {
    if (todo.reminder) {
      const dateObj = new Date(todo.reminder);
      const hours = dateObj.getHours();
      const mins = dateObj.getMinutes();
      const formattedStart = `${hours}:${mins < 10 ? "0" : ""}${mins}`;
      const formattedEnd = `${(hours + 1) % 24}:${mins < 10 ? "0" : ""}${mins}`;
      return `${formattedStart} - ${formattedEnd}`;
    }

    const defaultSlots = [
      "06:00 - 07:30",
      "07:30 - 08:00",
      "08:00 - 10:00",
      "10:00 - 11:00",
      "11:00 - 13:00",
      "13:00 - 14:30",
      "15:00 - 16:30",
      "17:00 - 18:30",
    ];
    return defaultSlots[index % defaultSlots.length];
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 pb-28 transition-colors">
      {/* Web Header Hero Section */}
      <div className="bg-[#9D72FF] dark:bg-purple-950/80 text-white shadow-xl border-b border-purple-400/20">
        <div className="max-w-6xl mx-auto px-6 pt-6 pb-12">
          {/* Top Row */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate("/categories")}
                className="p-2.5 rounded-2xl bg-white/10 dark:bg-white/15 hover:bg-white/20 transition-colors cursor-pointer"
                aria-label="Categories"
              >
                <LayoutGrid className="w-5 h-5 text-white" />
              </button>
              <div className="flex items-center space-x-2 bg-white/15 dark:bg-white/20 px-3 py-1.5 rounded-xl text-xs font-bold">
                <Calendar className="w-4 h-4" />
                <span>{formattedHeaderDate}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <ThemeToggle />
              <button
                onClick={() => navigate("/create-task")}
                className="px-6 py-2.5 bg-white text-[#9D72FF] hover:bg-purple-50 font-bold rounded-2xl shadow-lg transition-all hover:scale-105 active:scale-95 text-sm flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Task</span>
              </button>
            </div>
          </div>

          {/* Hero Banner Text */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                {searchQuery
                  ? "Search Results"
                  : categoryFilter
                  ? `${categoryFilter} Tasks`
                  : "Today's Schedule"}
              </h1>
              <p className="text-sm font-semibold text-purple-100 dark:text-purple-200 mt-2">
                {searchQuery
                  ? `Found ${filteredTodos.length} ${filteredTodos.length === 1 ? "match" : "matches"} for "${searchQuery}"`
                  : `Managing ${filteredTodos.length} ${filteredTodos.length === 1 ? "Task" : "Tasks"} for ${formattedHeaderDate}`}
              </p>
            </div>

            {/* Category Quick Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  navigate("/tasks");
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  !categoryFilter && !selectedCategory
                    ? "bg-white text-[#9D72FF] shadow-sm"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                All
              </button>
              {CATEGORIES.map((c) => {
                const isActive = (categoryFilter || selectedCategory)?.toLowerCase() === c.name.toLowerCase();
                return (
                  <button
                    key={c.id}
                    onClick={() => {
                      setSelectedCategory(c.name);
                      navigate(`/tasks?category=${encodeURIComponent(c.name)}`);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      isActive
                        ? "bg-white text-[#9D72FF] shadow-sm"
                        : "bg-white/20 text-white hover:bg-white/30"
                    }`}
                  >
                    {c.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Container - Overlapping Card */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-6">
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-purple-50 dark:border-gray-800 space-y-8 transition-colors">
          {/* Active Search Banner Indicator */}
          {searchQuery && (
            <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/60 rounded-2xl">
              <div className="flex items-center space-x-3 text-purple-900 dark:text-purple-200">
                <Search className="w-5 h-5 text-[#9D72FF] dark:text-purple-400" />
                <span className="text-sm font-bold">
                  Searching for: <strong className="text-[#9D72FF] dark:text-purple-300">"{searchQuery}"</strong>
                </span>
              </div>
              <button
                onClick={() => setSearchQuery("")}
                className="flex items-center space-x-1 px-3 py-1 bg-white dark:bg-gray-800 hover:bg-purple-100 dark:hover:bg-gray-700 text-[#9D72FF] dark:text-purple-300 rounded-xl text-xs font-bold border border-purple-200 dark:border-gray-700 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
                <span>Clear Search</span>
              </button>
            </div>
          )}

          {/* Date Ribbon (Hidden during global search mode) */}
          {!searchQuery && (
            <div>
              <DateRibbon />
            </div>
          )}

          {/* Section Heading */}
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              {searchQuery ? "Matching Todos" : "Task Checklist"}
            </h2>
            <span className="text-xs font-bold text-gray-400 dark:text-gray-500">
              Click task for full details
            </span>
          </div>

          {/* Tasks List / Grid */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-purple-600 dark:text-purple-400">
              <Loader2 className="w-10 h-10 animate-spin mb-3" />
              <p className="text-sm font-semibold">Syncing tasks with MongoDB server...</p>
            </div>
          ) : filteredTodos.length === 0 ? (
            <div className="text-center py-20 bg-purple-50/40 dark:bg-gray-800/40 rounded-3xl border-2 border-dashed border-purple-200 dark:border-gray-700 px-6">
              <Search className="w-16 h-16 text-purple-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                {searchQuery ? `No tasks found matching "${searchQuery}"` : "No tasks scheduled for this date"}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-md mx-auto">
                {searchQuery
                  ? "Try checking your spelling or clearing the search query."
                  : "Create a task to keep track of your activities and goals."}
              </p>
              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-6 px-6 py-3 bg-[#9D72FF] hover:bg-purple-700 text-white font-bold rounded-2xl shadow-md text-sm transition-all cursor-pointer"
                >
                  Clear Search Filter
                </button>
              ) : (
                <button
                  onClick={() => navigate("/create-task")}
                  className="mt-6 px-6 py-3 bg-[#9D72FF] hover:bg-purple-700 text-white font-bold rounded-2xl shadow-md text-sm transition-all cursor-pointer"
                >
                  + Create New Task
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTodos.map((todo, idx) => {
                const isCompleted = todo.status === "completed";
                const timeSlot = getTimeSlot(todo, idx);

                return (
                  <div
                    key={todo._id || todo.id}
                    onClick={() => setSelectedTodoForModal(todo)}
                    className={`group relative flex items-center justify-between p-5 rounded-2xl cursor-pointer transition-all duration-200 border shadow-xs hover:shadow-md hover:-translate-y-0.5 ${
                      isCompleted
                        ? "bg-[#9D72FF] dark:bg-purple-900 text-white border-purple-500 dark:border-purple-700"
                        : "bg-[#F5EEFF] dark:bg-gray-800/90 hover:bg-[#EFE2FF] dark:hover:bg-gray-800 text-gray-800 dark:text-gray-100 border-purple-100 dark:border-gray-700"
                    }`}
                  >
                    {/* Left: Time slot + Task info */}
                    <div className="flex items-start space-x-4 flex-1 min-w-0 pr-3">
                      <span
                        className={`text-xs font-bold whitespace-nowrap px-2.5 py-1 rounded-lg mt-0.5 ${
                          isCompleted
                            ? "bg-white/20 text-white"
                            : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 shadow-2xs"
                        }`}
                      >
                        {timeSlot}
                      </span>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                              isCompleted
                                ? "bg-white/20 text-white"
                                : "bg-purple-200 dark:bg-purple-900/60 text-purple-800 dark:text-purple-300"
                            }`}
                          >
                            {todo.category || "General"}
                          </span>
                        </div>

                        <h3
                          className={`text-base font-bold leading-snug truncate ${
                            isCompleted
                              ? "line-through text-purple-100 dark:text-purple-200"
                              : "text-gray-900 dark:text-white"
                          }`}
                        >
                          {todo.title}
                        </h3>

                        {todo.description && (
                          <p
                            className={`text-xs font-medium mt-1 truncate ${
                              isCompleted
                                ? "text-purple-200 dark:text-purple-300"
                                : "text-gray-500 dark:text-gray-400"
                            }`}
                          >
                            {todo.description}
                          </p>
                        )}

                        {todo.attachment?.url && (
                          <div
                            className={`flex items-center gap-1 mt-2 text-xs font-bold ${
                              isCompleted
                                ? "text-purple-100 dark:text-purple-200"
                                : "text-[#9D72FF] dark:text-purple-400"
                            }`}
                          >
                            <Paperclip className="w-3.5 h-3.5" />
                            <span>Attachment included</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Actions & Interactive Checkbox */}
                    <div
                      className="flex items-center space-x-2 flex-shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => navigate(`/edit-task/${todo._id || todo.id}`)}
                        className={`p-2 rounded-xl transition-colors cursor-pointer ${
                          isCompleted
                            ? "text-purple-200 hover:text-white hover:bg-white/10"
                            : "text-gray-400 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-300 hover:bg-white dark:hover:bg-gray-700"
                        }`}
                        title="Edit Task"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => removeTask(todo._id || todo.id)}
                        className={`p-2 rounded-xl transition-colors cursor-pointer ${
                          isCompleted
                            ? "text-purple-200 hover:text-white hover:bg-white/10"
                            : "text-gray-400 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-white dark:hover:bg-gray-700"
                        }`}
                        title="Delete Task"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      {/* Interactive Completion Checkbox */}
                      <button
                        onClick={() => toggleTaskStatus(todo._id || todo.id)}
                        className={`p-1 rounded-xl transition-transform active:scale-90 cursor-pointer ${
                          isCompleted ? "text-white" : "text-[#9D72FF]"
                        }`}
                        title="Toggle Status"
                      >
                        {isCompleted ? (
                          <div className="w-7 h-7 bg-white dark:bg-purple-200 rounded-lg flex items-center justify-center text-[#9D72FF] font-bold shadow-xs">
                            ✓
                          </div>
                        ) : (
                          <div className="w-7 h-7 border-2 border-[#9D72FF] dark:border-purple-400 rounded-lg bg-white dark:bg-gray-900 shadow-2xs"></div>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Todo Details Popup Modal */}
      {selectedTodoForModal && (
        <TodoDetailModal
          todo={selectedTodoForModal}
          onClose={() => setSelectedTodoForModal(null)}
        />
      )}
    </div>
  );
};

export default TasksPage;
