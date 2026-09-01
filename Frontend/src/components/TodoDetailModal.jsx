import React from "react";
import { useNavigate } from "react-router-dom";
import {
  X,
  Calendar,
  Clock,
  Tag,
  Paperclip,
  CheckSquare,
  Square,
  ExternalLink,
  Edit3,
  CheckCircle2,
  Circle,
  FileText,
  Trash2,
} from "lucide-react";
import { useTasks } from "../context/TaskContext";
import { getAttachmentUrl } from "../services/api";

export const TodoDetailModal = React.memo(({ todo, onClose }) => {
  const navigate = useNavigate();
  const { toggleSubtask, toggleTaskStatus, removeTask } = useTasks();

  if (!todo) return null;

  const todoId = todo._id || todo.id;
  const isCompleted = todo.status === "completed";

  const attachmentUrl = getAttachmentUrl(todo.attachment?.url);
  const isImageAttachment =
    todo.attachment?.url &&
    (todo.attachment.fileType?.startsWith("image/") ||
      /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(todo.attachment.url));

  const handleOpenFullPage = () => {
    onClose();
    navigate(`/todo?id=${todoId}`);
  };

  const completedSubtasks = Array.isArray(todo.subtasks)
    ? todo.subtasks.filter((s) => s.completed).length
    : 0;
  const totalSubtasks = Array.isArray(todo.subtasks) ? todo.subtasks.length : 0;
  const subtaskProgress =
    totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs transition-opacity duration-200 transform-gpu"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-purple-100 dark:border-gray-800 transform-gpu transition-all duration-200 text-gray-900 dark:text-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Bar */}
        <div
          className="h-3.5 w-full flex-shrink-0"
          style={{ backgroundColor: todo.color || "#9D72FF" }}
        />

        {/* Scrollable Content Container */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 scrollbar-thin scrollbar-thumb-purple-200 dark:scrollbar-thumb-gray-700">
          {/* Top Header & Badges */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3.5 py-1 bg-purple-100 dark:bg-purple-900/60 text-[#9D72FF] dark:text-purple-300 text-xs font-extrabold rounded-full uppercase tracking-wider shadow-2xs">
                {todo.category || "General"}
              </span>
              <span
                className={`px-3.5 py-1 text-xs font-extrabold rounded-full uppercase tracking-wider shadow-2xs ${
                  todo.priority === "high"
                    ? "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300"
                    : todo.priority === "low"
                    ? "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300"
                    : "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300"
                }`}
              >
                {todo.priority || "medium"} Priority
              </span>

              <span
                className={`px-3.5 py-1 text-xs font-extrabold rounded-full uppercase tracking-wider ${
                  isCompleted
                    ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                }`}
              >
                {isCompleted ? "Completed" : "In Progress"}
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-gray-400 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all flex-shrink-0 cursor-pointer"
              title="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Title & Interactive Quick Status Toggle */}
          <div className="flex items-start justify-between gap-4 pt-1">
            <h2
              className={`text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white leading-snug tracking-tight ${
                isCompleted ? "line-through text-gray-400 dark:text-gray-500" : ""
              }`}
            >
              {todo.title}
            </h2>

            <button
              onClick={() => toggleTaskStatus(todoId)}
              className={`p-3 rounded-2xl transition-all shadow-sm flex-shrink-0 cursor-pointer ${
                isCompleted
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : "bg-purple-50 dark:bg-gray-800 text-[#9D72FF] dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-gray-700 border border-purple-200 dark:border-gray-700"
              }`}
              title={isCompleted ? "Mark Incomplete" : "Mark Complete"}
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
            <div className="bg-gray-50/80 dark:bg-gray-800/80 p-4 sm:p-5 rounded-2xl border border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-200 text-base leading-relaxed">
              {todo.description}
            </div>
          ) : (
            <p className="text-gray-400 dark:text-gray-500 text-sm italic">No description provided for this todo item.</p>
          )}

          {/* Key Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
            {todo.dueDate && (
              <div className="flex items-center space-x-3 bg-purple-50/60 dark:bg-gray-800/60 p-3.5 rounded-2xl border border-purple-100 dark:border-gray-700 shadow-2xs">
                <div className="p-2 bg-white dark:bg-gray-900 text-[#9D72FF] dark:text-purple-300 rounded-xl shadow-2xs">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <span className="block font-bold text-gray-400 dark:text-gray-400 uppercase tracking-wider text-[10px]">
                    Due Date
                  </span>
                  <span className="font-extrabold text-gray-900 dark:text-white text-sm">
                    {new Date(todo.dueDate).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            )}

            {todo.reminder && (
              <div className="flex items-center space-x-3 bg-purple-50/60 dark:bg-gray-800/60 p-3.5 rounded-2xl border border-purple-100 dark:border-gray-700 shadow-2xs">
                <div className="p-2 bg-white dark:bg-gray-900 text-[#9D72FF] dark:text-purple-300 rounded-xl shadow-2xs">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="block font-bold text-gray-400 dark:text-gray-400 uppercase tracking-wider text-[10px]">
                    Reminder Time
                  </span>
                  <span className="font-extrabold text-gray-900 dark:text-white text-sm">
                    {new Date(todo.reminder).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Subtasks Section with Progress Bar */}
          {totalSubtasks > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-extrabold text-gray-900 dark:text-white uppercase tracking-wider">
                  Subtasks Checklist
                </h3>
                <span className="text-xs font-bold text-[#9D72FF] dark:text-purple-300 bg-purple-100 dark:bg-purple-950 px-3 py-0.5 rounded-full">
                  {completedSubtasks} / {totalSubtasks} ({subtaskProgress}%)
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#9D72FF] h-full rounded-full transition-all duration-300"
                  style={{ width: `${subtaskProgress}%` }}
                />
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {todo.subtasks.map((subtask) => (
                  <div
                    key={subtask._id || subtask.id}
                    onClick={() => toggleSubtask(todoId, subtask._id || subtask.id)}
                    className="flex items-center space-x-3 p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/60 hover:bg-purple-50 dark:hover:bg-gray-800 cursor-pointer transition-colors border border-gray-100 dark:border-gray-700 text-sm"
                  >
                    {subtask.completed ? (
                      <CheckSquare className="w-5 h-5 text-[#9D72FF] dark:text-purple-400 flex-shrink-0" />
                    ) : (
                      <Square className="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                    )}
                    <span
                      className={
                        subtask.completed
                          ? "line-through text-gray-400 dark:text-gray-500 font-medium"
                          : "text-gray-800 dark:text-gray-200 font-medium"
                      }
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
            <div className="space-y-2 pt-1">
              <h3 className="text-xs font-extrabold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#9D72FF] dark:text-purple-400" /> Notes
              </h3>
              <div className="p-4 bg-amber-50/70 dark:bg-amber-950/40 rounded-2xl border border-amber-100 dark:border-amber-900/50 text-sm text-amber-900 dark:text-amber-200 leading-relaxed whitespace-pre-wrap">
                {todo.notes}
              </div>
            </div>
          )}

          {/* Attachment */}
          {attachmentUrl && (
            <div className="space-y-2 pt-1">
              <h3 className="text-xs font-extrabold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <Paperclip className="w-4 h-4 text-[#9D72FF] dark:text-purple-400" /> Attachment
              </h3>

              <div className="p-4 bg-purple-50/80 dark:bg-gray-800/80 rounded-2xl border border-purple-100 dark:border-gray-700 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center space-x-3 text-sm text-purple-900 dark:text-purple-200 font-semibold truncate">
                    <div className="p-2.5 bg-white dark:bg-gray-900 rounded-xl text-[#9D72FF] dark:text-purple-300 shadow-2xs flex-shrink-0">
                      <Paperclip className="w-5 h-5" />
                    </div>
                    <div className="truncate">
                      <span className="block truncate font-bold text-gray-900 dark:text-white">
                        {todo.attachment.fileName || "Attachment"}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">
                        {todo.attachment.fileType || "File"}
                        {todo.attachment.fileSize
                          ? ` • ${(todo.attachment.fileSize / 1024).toFixed(1)} KB`
                          : ""}
                      </span>
                    </div>
                  </div>

                  <a
                    href={attachmentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-[#9D72FF] hover:bg-[#8b5cf6] text-white font-bold text-xs rounded-xl shadow-sm transition-all flex-shrink-0 flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> View File
                  </a>
                </div>

                {/* Inline Image Preview */}
                {isImageAttachment && (
                  <div className="mt-2 rounded-xl overflow-hidden border border-purple-200/60 dark:border-gray-700 bg-black/5 dark:bg-black/40 max-h-64 flex justify-center items-center">
                    <img
                      src={attachmentUrl}
                      alt={todo.attachment.fileName || "Attachment Preview"}
                      className="max-h-64 object-contain rounded-xl w-full"
                      onError={(e) => {
                        console.error("Failed to load attachment image:", attachmentUrl);
                        e.target.style.display = "none";
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
          <button
            onClick={() => {
              if (window.confirm("Delete this todo item?")) {
                removeTask(todoId);
                onClose();
              }
            }}
            className="py-2.5 px-4 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 font-bold text-xs rounded-2xl transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" /> Delete
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                onClose();
                navigate(`/edit-task/${todoId}`);
              }}
              className="py-2.5 px-5 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 font-bold text-sm rounded-2xl transition-all shadow-2xs flex items-center gap-2 cursor-pointer"
            >
              <Edit3 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              Edit
            </button>

            <button
              onClick={handleOpenFullPage}
              className="py-2.5 px-6 bg-[#9D72FF] hover:bg-[#8b5cf6] text-white font-extrabold text-sm rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              Open Full Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default TodoDetailModal;

