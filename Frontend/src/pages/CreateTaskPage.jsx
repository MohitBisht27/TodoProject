import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "../components/Header";
import { ThemeToggle } from "../components/ThemeToggle";
import { CATEGORIES, PRIORITIES, COLOR_PALETTE } from "../constants/constants";
import { useTasks } from "../context/TaskContext";
import {
  ChevronDown,
  Plus,
  Trash2,
  Paperclip,
  Loader2,
  Calendar as CalendarIcon,
  ArrowLeft,
  CheckCircle2,
  CheckSquare,
  Square,
} from "lucide-react";

export const CreateTaskPage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // If editing
  const { addTask, editTask, todos } = useTasks();

  const existingTask = id
    ? todos.find((t) => t._id === id || t.id === id)
    : null;

  // Form State matching Backend Schema
  const [title, setTitle] = useState(existingTask?.title || "");
  const [description, setDescription] = useState(
    existingTask?.description || "",
  );
  const [category, setCategory] = useState(existingTask?.category || "Idea");
  const [priority, setPriority] = useState(existingTask?.priority || "medium");
  const [dueDate, setDueDate] = useState(
    existingTask?.dueDate ? new Date(existingTask.dueDate) : new Date(),
  );
  const [reminder, setReminder] = useState(
    existingTask?.reminder ? existingTask.reminder.substring(11, 16) : "09:00",
  );
  const [notes, setNotes] = useState(existingTask?.notes || "");
  const [color, setColor] = useState(existingTask?.color || "#9D72FF");
  const [subtasks, setSubtasks] = useState(existingTask?.subtasks || []);
  const [subtaskInput, setSubtaskInput] = useState("");
  const [attachment, setAttachment] = useState(null);

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Simple Month Calendar Grid State
  const [currentYearMonth, setCurrentYearMonth] = useState({
    year: dueDate.getFullYear(),
    month: dueDate.getMonth(),
  });

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const daysOfWeek = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    let day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const renderCalendarDays = () => {
    const totalDays = getDaysInMonth(
      currentYearMonth.year,
      currentYearMonth.month,
    );
    const startDay = getFirstDayOfMonth(
      currentYearMonth.year,
      currentYearMonth.month,
    );

    const cells = [];
    for (let i = 0; i < startDay; i++) {
      cells.push(<div key={`empty-${i}`} className="h-9"></div>);
    }

    for (let d = 1; d <= totalDays; d++) {
      const isSelected =
        dueDate.getDate() === d &&
        dueDate.getMonth() === currentYearMonth.month &&
        dueDate.getFullYear() === currentYearMonth.year;

      cells.push(
        <button
          key={d}
          type="button"
          onClick={() => {
            const newD = new Date(
              currentYearMonth.year,
              currentYearMonth.month,
              d,
            );
            setDueDate(newD);
          }}
          className={`h-9 w-9 mx-auto flex items-center justify-center rounded-xl text-sm font-semibold transition-all cursor-pointer ${
            isSelected
              ? "bg-[#9D72FF] text-white shadow-md shadow-purple-200 dark:shadow-none scale-105"
              : "text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-gray-800"
          }`}
        >
          {d}
        </button>,
      );
    }
    return cells;
  };

  const handleAddSubtask = () => {
    if (!subtaskInput.trim()) return;
    setSubtasks([
      ...subtasks,
      { title: subtaskInput.trim(), completed: false },
    ]);
    setSubtaskInput("");
  };

  const handleRemoveSubtask = (index) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  const handleToggleSubtask = (index) => {
    setSubtasks((prev) =>
      prev.map((st, i) => (i === index ? { ...st, completed: !st.completed } : st))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg("Please enter a task name");
      return;
    }

    setErrorMsg("");
    setIsSubmitting(true);

    try {
      if (attachment) {
        const formData = new FormData();
        formData.append("title", title.trim());
        formData.append("description", description.trim());
        formData.append("category", category);
        formData.append("priority", priority);
        formData.append("dueDate", dueDate.toISOString());
        formData.append("notes", notes.trim());
        formData.append("color", color);
        formData.append("subtasks", JSON.stringify(subtasks));
        formData.append("attachment", attachment);

        if (id) {
          await editTask(id, formData);
        } else {
          await addTask(formData);
        }
      } else {
        const payload = {
          title: title.trim(),
          description: description.trim(),
          category,
          priority,
          dueDate: dueDate.toISOString(),
          notes: notes.trim(),
          color,
          subtasks,
        };

        if (id) {
          await editTask(id, payload);
        } else {
          await addTask(payload);
        }
      }

      navigate("/tasks");
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || "Failed to save task");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCategoryObj =
    CATEGORIES.find((c) => c.name.toLowerCase() === category.toLowerCase()) ||
    CATEGORIES[0];
  const CategoryIcon = selectedCategoryObj.icon;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 pb-28 transition-colors">
      {/* Top Banner */}
      <div className="bg-[#9D72FF] dark:bg-purple-950/80 text-white shadow-xl border-b border-purple-400/20">
        <div className="max-w-6xl mx-auto px-6 pt-6 pb-12">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2.5 rounded-2xl bg-white/10 dark:bg-white/15 hover:bg-white/20 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <span className="text-sm font-bold uppercase tracking-wider text-purple-100">
                Task Form
              </span>
            </div>
            <ThemeToggle />
          </div>
          <h1 className="text-4xl font-black tracking-tight">
            {id ? "Edit Task Details" : "Create New Task"}
          </h1>
          <p className="text-sm font-semibold text-purple-100 dark:text-purple-200 mt-1">
            Fill out the details below to schedule your task directly.
          </p>
        </div>
      </div>

      {/* Main Responsive Form Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {errorMsg && (
            <div className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-2xl text-sm font-bold shadow-xs">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column (Desktop 5 cols): Calendar Widget + Category Selection */}
            <div className="lg:col-span-5 space-y-6">
              {/* Calendar Widget */}
              <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-xl border border-purple-50 dark:border-gray-800 transition-colors">
                <h3 className="text-sm font-bold uppercase text-gray-400 dark:text-gray-500 mb-4 tracking-wider">
                  Select Target Date
                </h3>
                <div className="flex items-center justify-between mb-4">
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentYearMonth((prev) => {
                        let m = prev.month - 1;
                        let y = prev.year;
                        if (m < 0) {
                          m = 11;
                          y -= 1;
                        }
                        return { month: m, year: y };
                      })
                    }
                    className="p-2 rounded-xl text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                  >
                    &lt;
                  </button>

                  <span className="px-4 py-1.5 bg-gray-900 dark:bg-purple-900 text-white rounded-xl text-xs font-bold tracking-wide">
                    {months[currentYearMonth.month]} {currentYearMonth.year}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setCurrentYearMonth((prev) => {
                        let m = prev.month + 1;
                        let y = prev.year;
                        if (m > 11) {
                          m = 0;
                          y += 1;
                        }
                        return { month: m, year: y };
                      })
                    }
                    className="p-2 rounded-xl text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                  >
                    &gt;
                  </button>
                </div>

                <div className="grid grid-cols-7 text-center text-xs font-bold text-gray-400 dark:text-gray-500 mb-2">
                  {daysOfWeek.map((day) => (
                    <span key={day}>{day}</span>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-y-1 text-center">
                  {renderCalendarDays()}
                </div>
              </div>

              {/* Category Selector Card */}
              <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-xl border border-purple-50 dark:border-gray-800 relative transition-colors">
                <h3 className="text-sm font-bold uppercase text-gray-400 dark:text-gray-500 mb-3 tracking-wider">
                  Category Activity
                </h3>

                <div
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  className="flex items-center justify-between p-4 bg-[#F5EEFF] dark:bg-gray-800 hover:bg-[#EFE2FF] dark:hover:bg-gray-700/80 rounded-2xl cursor-pointer transition-all border border-purple-100 dark:border-gray-700"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 bg-white dark:bg-gray-900 rounded-xl text-[#9D72FF] dark:text-purple-400 shadow-xs">
                      <CategoryIcon className="w-6 h-6" />
                    </div>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {category}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-purple-600 dark:text-purple-400 transition-transform ${
                      isCategoryOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>

                {isCategoryOpen && (
                  <div className="absolute top-full left-6 right-6 mt-2 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-purple-100 dark:border-gray-700 z-50 p-2 space-y-1">
                    {CATEGORIES.map((cat) => {
                      const IconComp = cat.icon;
                      return (
                        <div
                          key={cat.id}
                          onClick={() => {
                            setCategory(cat.name);
                            setIsCategoryOpen(false);
                          }}
                          className="flex items-center space-x-3 p-3 rounded-xl hover:bg-purple-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                        >
                          <IconComp className="w-5 h-5 text-[#9D72FF] dark:text-purple-400" />
                          <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
                            {cat.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column (Desktop 7 cols): Main Form Fields */}
            <div className="lg:col-span-7 bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-purple-50 dark:border-gray-800 space-y-6 transition-colors">
              {/* Task Name */}
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Task Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Team Sync Meeting / Exercise"
                  className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-purple-300 focus:bg-white dark:focus:bg-gray-800 rounded-2xl text-base font-semibold text-gray-900 dark:text-white focus:outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500"
                  required
                />
              </div>

              {/* Task Description */}
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your task goals, context, or instructions..."
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-purple-300 focus:bg-white dark:focus:bg-gray-800 rounded-2xl text-sm font-medium text-gray-800 dark:text-white focus:outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500 resize-none"
                />
              </div>

              {/* Priority & Color Tag */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Priority Level
                  </label>
                  <div className="flex gap-2">
                    {PRIORITIES.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setPriority(p.id)}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          priority === p.id
                            ? `${p.color} ring-2 ring-purple-400 shadow-xs`
                            : "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Color Tag Accent
                  </label>
                  <div className="flex items-center gap-3 pt-1">
                    {COLOR_PALETTE.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setColor(c)}
                        style={{ backgroundColor: c }}
                        className={`w-7 h-7 rounded-full transition-transform cursor-pointer ${
                          color === c
                            ? "scale-125 ring-2 ring-purple-600 ring-offset-2 dark:ring-offset-gray-900 shadow-xs"
                            : "hover:scale-110"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Subtasks Section */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Subtask Checklist
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={subtaskInput}
                    onChange={(e) => setSubtaskInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddSubtask();
                      }
                    }}
                    placeholder="Add subtask step..."
                    className="flex-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl text-sm border border-gray-200 dark:border-gray-700 focus:outline-none focus:bg-white dark:focus:bg-gray-800 placeholder-gray-400 dark:placeholder-gray-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddSubtask}
                    className="px-5 py-2.5 bg-purple-100 dark:bg-purple-900/60 text-[#9D72FF] dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900 rounded-xl text-sm font-bold transition-colors cursor-pointer"
                  >
                    Add
                  </button>
                </div>

                {subtasks.length > 0 && (
                  <div className="space-y-2 pt-2">
                    {subtasks.map((st, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 px-4 py-2.5 rounded-xl text-sm border border-gray-100 dark:border-gray-700"
                      >
                        <button
                          type="button"
                          onClick={() => handleToggleSubtask(idx)}
                          className="flex items-center space-x-3 cursor-pointer flex-1 min-w-0 pr-2 text-left"
                        >
                          {st.completed ? (
                            <CheckSquare className="w-5 h-5 text-[#9D72FF] dark:text-purple-400 flex-shrink-0" />
                          ) : (
                            <Square className="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                          )}
                          <span
                            className={
                              st.completed
                                ? "line-through text-gray-400 dark:text-gray-500 font-medium truncate"
                                : "text-gray-800 dark:text-gray-200 font-medium truncate"
                            }
                          >
                            {st.title}
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveSubtask(idx)}
                          className="text-gray-400 dark:text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 p-1 cursor-pointer flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* File Attachment */}
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  File Attachment
                </label>
                <label className="flex items-center justify-center gap-2 border-2 border-dashed border-purple-200 dark:border-gray-700 p-4 rounded-2xl cursor-pointer hover:bg-purple-50 dark:hover:bg-gray-800 text-purple-600 dark:text-purple-400 transition-colors">
                  <Paperclip className="w-5 h-5" />
                  <span className="text-xs font-bold truncate">
                    {attachment ? attachment.name : "Upload Attachment File"}
                  </span>
                  <input
                    type="file"
                    onChange={(e) => setAttachment(e.target.files[0])}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#9D72FF] hover:bg-purple-700 active:scale-[0.99] text-white font-bold rounded-2xl shadow-xl shadow-purple-200 dark:shadow-none transition-all flex items-center justify-center space-x-2 text-base cursor-pointer mt-4"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Saving to Database...</span>
                  </>
                ) : (
                  <span>{id ? "Update Task Details" : "Create Task"}</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskPage;
