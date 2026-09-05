import React, { useState, useEffect } from "react";
import { useSearchParams, useParams, useNavigate, Link } from "react-router-dom";
import { Header } from "../components/Header";
import { useTasks } from "../context/TaskContext";
import { fetchTodoByIdService, getAttachmentUrl } from "../services/api";
import {
  Calendar,
  Clock,
  Tag,
  Paperclip,
  CheckSquare,
  Square,
  ArrowLeft,
  Edit3,
  Trash2,
  CheckCircle2,
  Circle,
  FileText,
  AlertCircle,
  Loader2,
  Share2,
} from "lucide-react";

export const SingleTodoPage = () => {
  const [searchParams] = useSearchParams();
  const params = useParams();
  const navigate = useNavigate();
  const { toggleTaskStatus, removeTask, toggleSubtask } = useTasks();

  // Support receiving todo ID either via query parameter (?id=...) OR path param (/todo/:id)
  const todoId = searchParams.get("id") || params.id;

  const [todo, setTodo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!todoId) {
      setError("No Todo ID provided in URL query parameters.");
      setLoading(false);
      return;
    }

    const loadSingleTodo = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchTodoByIdService(todoId);
        if (response.success && response.data) {
          setTodo(response.data);
        } else {
          setError("Todo item not found.");
        }
      } catch (err) {
        console.error("Failed to load todo:", err);
        setError(
          err.response?.data?.message || "Failed to retrieve todo details from backend server."
        );
      } finally {
        setLoading(false);
      }
    };

    loadSingleTodo();
  }, [todoId]);

  const handleToggleStatus = async () => {
    if (!todo) return;
    const newStatus = todo.status === "completed" ? "todo" : "completed";
    setTodo((prev) => ({ ...prev, status: newStatus }));
    try {
      await toggleTaskStatus(todo._id || todo.id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubtaskToggle = async (subtaskId) => {
    if (!todo) return;
    setTodo((prev) => ({
      ...prev,
      subtasks: (prev.subtasks || []).map((s) =>
        String(s._id || s.id) === String(subtaskId) ? { ...s, completed: !s.completed } : s
      ),
    }));
    try {
      const updatedTodo = await toggleSubtask(todo._id || todo.id, subtaskId);
      if (updatedTodo) {
        setTodo(updatedTodo);
      }
    } catch (err) {
      console.error("Error toggling subtask:", err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this todo item?")) {
      try {
        await removeTask(todo._id || todo.id);
        navigate("/tasks");
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col justify-center items-center p-6 text-gray-900 dark:text-gray-100">
        <Loader2 className="w-10 h-10 text-[#9D72FF] dark:text-purple-400 animate-spin mb-3" />
        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">Loading Todo item details...</p>
      </div>
    );
  }

  if (error || !todo) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20 text-gray-900 dark:text-gray-100">
        <Header title="Single Todo Details" showBack={true} />
        <div className="max-w-xl mx-auto mt-12 px-6">
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 text-center shadow-lg border border-red-100 dark:border-red-900/40">
            <div className="w-14 h-14 bg-red-50 dark:bg-red-950/50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Todo Not Found</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{error || "Unable to display todo item."}</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => navigate("/tasks")}
                className="px-6 py-2.5 bg-[#9D72FF] text-white font-bold text-sm rounded-2xl shadow-md hover:bg-[#8b5cf6] transition-all cursor-pointer"
              >
                Go to Tasks List
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isCompleted = todo.status === "completed";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 pb-28 transition-colors">
      {/* Top Header Bar */}
      <Header
        title="Todo Overview"
        showBack={true}
        rightAction={
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigate(`/edit-task/${todo._id || todo.id}`)}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-[#9D72FF] dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-gray-800 rounded-xl transition-all cursor-pointer"
              title="Edit Task"
            >
              <Edit3 className="w-5 h-5" />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-all cursor-pointer"
              title="Delete Task"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        }
      />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Main Todo Card */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden border border-purple-50 dark:border-gray-800 transition-colors">
          {/* Top Accent Strip */}
          <div
            className="h-3 w-full"
            style={{ backgroundColor: todo.color || "#9D72FF" }}
          />

          <div className="p-6 sm:p-8 space-y-6">
            {/* Meta Tags Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-100 dark:border-gray-800">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3.5 py-1 bg-purple-100 dark:bg-purple-900/60 text-[#9D72FF] dark:text-purple-300 text-xs font-bold rounded-full uppercase tracking-wider">
                  {todo.category || "General"}
                </span>

                <span
                  className={`px-3.5 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${
                    todo.priority === "high"
                      ? "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300"
                      : todo.priority === "low"
                      ? "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300"
                      : "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300"
                  }`}
                >
                  Priority: {todo.priority || "medium"}
                </span>
              </div>

              {/* URL Query Param badge indicator */}
              <div className="text-[11px] font-mono text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                ID: {todo._id || todo.id}
              </div>
            </div>

            {/* Title & Interactive Completion Toggle */}
            <div className="flex items-start justify-between gap-4">
              <h1
                className={`text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white leading-tight ${
                  isCompleted ? "line-through text-gray-400 dark:text-gray-500" : ""
                }`}
              >
                {todo.title}
              </h1>

              <button
                onClick={handleToggleStatus}
                className={`flex-shrink-0 p-3 rounded-2xl transition-all shadow-sm cursor-pointer ${
                  isCompleted
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "bg-purple-50 dark:bg-gray-800 text-[#9D72FF] dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-gray-700"
                }`}
                title={isCompleted ? "Mark as Incomplete" : "Mark as Complete"}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : (
                  <Circle className="w-6 h-6" />
                )}
              </button>
            </div>

            {/* Description */}
            {todo.description ? (
              <div className="text-gray-700 dark:text-gray-200 text-base leading-relaxed bg-gray-50/70 dark:bg-gray-800/70 p-4 rounded-2xl border border-gray-100 dark:border-gray-700">
                {todo.description}
              </div>
            ) : (
              <p className="text-gray-400 dark:text-gray-500 text-sm italic">No description provided.</p>
            )}

            {/* Date & Time Metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {todo.dueDate && (
                <div className="flex items-center space-x-3 bg-purple-50/50 dark:bg-gray-800/50 p-4 rounded-2xl border border-purple-100 dark:border-gray-700">
                  <div className="p-2.5 bg-white dark:bg-gray-900 text-[#9D72FF] dark:text-purple-300 rounded-xl shadow-xs">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-400 dark:text-gray-400 uppercase tracking-wider">
                      Due Date
                    </div>
                    <div className="text-sm font-bold text-gray-900 dark:text-white">
                      {new Date(todo.dueDate).toLocaleDateString("en-US", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                </div>
              )}

              {todo.reminder && (
                <div className="flex items-center space-x-3 bg-purple-50/50 dark:bg-gray-800/50 p-4 rounded-2xl border border-purple-100 dark:border-gray-700">
                  <div className="p-2.5 bg-white dark:bg-gray-900 text-[#9D72FF] dark:text-purple-300 rounded-xl shadow-xs">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-400 dark:text-gray-400 uppercase tracking-wider">
                      Reminder
                    </div>
                    <div className="text-sm font-bold text-gray-900 dark:text-white">
                      {new Date(todo.reminder).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Subtasks Section */}
            {Array.isArray(todo.subtasks) && todo.subtasks.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                    Subtasks Checklist
                  </h3>
                  <span className="text-xs font-bold text-[#9D72FF] dark:text-purple-300 bg-purple-100 dark:bg-purple-950 px-2.5 py-1 rounded-full">
                    {todo.subtasks.filter((s) => s.completed).length} of{" "}
                    {todo.subtasks.length} Completed
                  </span>
                </div>

                <div className="space-y-2">
                  {todo.subtasks.map((subtask) => (
                    <div
                      key={subtask._id || subtask.id}
                      onClick={() => handleSubtaskToggle(subtask._id || subtask.id)}
                      className="flex items-center space-x-3 p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/60 hover:bg-purple-50 dark:hover:bg-gray-800 cursor-pointer transition-colors border border-gray-100 dark:border-gray-700"
                    >
                      {subtask.completed ? (
                        <CheckSquare className="w-5 h-5 text-[#9D72FF] dark:text-purple-400 flex-shrink-0" />
                      ) : (
                        <Square className="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                      )}
                      <span
                        className={`text-sm font-medium ${
                          subtask.completed
                            ? "line-through text-gray-400 dark:text-gray-500"
                            : "text-gray-800 dark:text-gray-200"
                        }`}
                      >
                        {subtask.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notes Section */}
            {todo.notes && (
              <div className="space-y-2 pt-2">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#9D72FF] dark:text-purple-400" /> Additional Notes
                </h3>
                <div className="p-4 bg-amber-50/60 dark:bg-amber-950/40 rounded-2xl border border-amber-100 dark:border-amber-900/50 text-sm text-amber-900 dark:text-amber-200 whitespace-pre-wrap">
                  {todo.notes}
                </div>
              </div>
            )}

            {/* Attachment Section */}
            {todo.attachment?.url && (
              <div className="space-y-3 pt-2">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Paperclip className="w-4 h-4 text-[#9D72FF] dark:text-purple-400" /> File Attachment
                </h3>
                <div className="p-4 bg-purple-50/70 dark:bg-gray-800/70 rounded-2xl border border-purple-100 dark:border-gray-700 space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center space-x-3 overflow-hidden">
                      <div className="p-2.5 bg-white dark:bg-gray-900 rounded-xl text-[#9D72FF] dark:text-purple-300 shadow-xs flex-shrink-0">
                        <Paperclip className="w-5 h-5" />
                      </div>
                      <div className="truncate">
                        <div className="text-sm font-bold text-gray-900 dark:text-white truncate">
                          {todo.attachment.fileName || "Download Attachment"}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {todo.attachment.fileType || "File"}
                          {todo.attachment.fileSize
                            ? ` • ${(todo.attachment.fileSize / 1024).toFixed(1)} KB`
                            : ""}
                        </div>
                      </div>
                    </div>

                    <a
                      href={getAttachmentUrl(todo.attachment.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-[#9D72FF] hover:bg-[#8b5cf6] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex-shrink-0"
                    >
                      View File
                    </a>
                  </div>

                  {/* Inline Image Preview */}
                  {(todo.attachment.fileType?.startsWith("image/") ||
                    /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(todo.attachment.url)) && (
                    <div className="mt-2 rounded-2xl overflow-hidden border border-purple-200 dark:border-gray-700 bg-black/5 dark:bg-black/40 max-h-80 flex justify-center items-center">
                      <img
                        src={getAttachmentUrl(todo.attachment.url)}
                        alt={todo.attachment.fileName || "Attachment Preview"}
                        className="max-h-80 object-contain w-full rounded-2xl"
                        onError={(e) => {
                          console.error("Failed to render attachment preview image");
                          e.target.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Footer Timestamps & Controls */}
            <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400 dark:text-gray-500">
              <div>
                Created: {new Date(todo.createdAt || Date.now()).toLocaleString()}
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => navigate(`/edit-task/${todo._id || todo.id}`)}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit Todo
                </button>
                <button
                  onClick={() => navigate("/tasks")}
                  className="px-4 py-2 bg-[#9D72FF] hover:bg-[#8b5cf6] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Tasks
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SingleTodoPage;
