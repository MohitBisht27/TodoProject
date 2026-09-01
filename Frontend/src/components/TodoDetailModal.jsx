import React from "react";
import { useNavigate } from "react-router-dom";
import { useTasks } from "../context/TaskContext";
import { CATEGORIES, PRIORITIES } from "../constants/constants";
import {
  X,
  Calendar,
  Clock,
  CheckSquare,
  Square,
  Paperclip,
  Edit3,
  Trash2,
  Tag,
  AlertCircle,
} from "lucide-react";

export const TodoDetailModal = ({ todo, onClose }) => {
  const navigate = useNavigate();
  const { toggleTaskStatus, removeTask, toggleSubtask } = useTasks();

  if (!todo) return null;

  const categoryObj = CATEGORIES.find(
    (c) => c.name.toLowerCase() === (todo.category || "general").toLowerCase()
  ) || CATEGORIES[5];
  const CategoryIcon = categoryObj.icon;

  const priorityObj = PRIORITIES.find((p) => p.id === todo.priority) || PRIORITIES[1];

  const formattedDate = todo.dueDate
    ? new Date(todo.dueDate).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "No due date";

  const isCompleted = todo.status === "completed";

  const handleEdit = () => {
    onClose();
    navigate(`/edit-task/${todo._id || todo.id}`);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      await removeTask(todo._id || todo.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-purple-100 z-10 my-8 max-h-[90vh] flex flex-col">
        {/* Color accent bar at top */}
        <div
          className="h-3 w-full"
          style={{ backgroundColor: todo.color || "#9D72FF" }}
        />

        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-gray-100 flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100 text-[#9D72FF] rounded-2xl">
              <CategoryIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-bold rounded-full border border-purple-200">
                  {todo.category || "General"}
                </span>
                <span
                  className={`px-3 py-1 text-xs font-bold rounded-full border ${priorityObj.color}`}
                >
                  {priorityObj.label} Priority
                </span>
              </div>
              <span className="text-xs font-semibold text-gray-400 capitalize">
                Status: <strong className="text-gray-700">{todo.status || "todo"}</strong>
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Title & Status Toggle */}
          <div className="flex items-start justify-between gap-4">
            <h2
              className={`text-2xl font-bold tracking-tight ${
                isCompleted ? "line-through text-gray-400" : "text-gray-900"
              }`}
            >
              {todo.title}
            </h2>

            <button
              onClick={() => toggleTaskStatus(todo._id || todo.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm ${
                isCompleted
                  ? "bg-emerald-600 text-white hover:bg-emerald-700"
                  : "bg-[#9D72FF] text-white hover:bg-purple-700"
              }`}
            >
              {isCompleted ? (
                <>
                  <CheckSquare className="w-4 h-4" />
                  <span>Completed</span>
                </>
              ) : (
                <>
                  <Square className="w-4 h-4" />
                  <span>Mark Complete</span>
                </>
              )}
            </button>
          </div>

          {/* Description */}
          {todo.description && (
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <h4 className="text-xs font-bold uppercase text-gray-400 mb-1">
                Description
              </h4>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {todo.description}
              </p>
            </div>
          )}

          {/* Date & Time Metadata Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center space-x-3 p-3.5 bg-purple-50/60 rounded-2xl border border-purple-100">
              <Calendar className="w-5 h-5 text-[#9D72FF]" />
              <div>
                <p className="text-xs font-semibold text-gray-400">Due Date</p>
                <p className="text-sm font-bold text-gray-800">{formattedDate}</p>
              </div>
            </div>

            {todo.reminder && (
              <div className="flex items-center space-x-3 p-3.5 bg-purple-50/60 rounded-2xl border border-purple-100">
                <Clock className="w-5 h-5 text-[#9D72FF]" />
                <div>
                  <p className="text-xs font-semibold text-gray-400">Time / Reminder</p>
                  <p className="text-sm font-bold text-gray-800">
                    {new Date(todo.reminder).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Subtasks Section with Interactive Toggling */}
          {todo.subtasks && todo.subtasks.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase text-gray-500 tracking-wider">
                  Subtasks ({todo.subtasks.filter((s) => s.completed).length} /{" "}
                  {todo.subtasks.length})
                </h4>
              </div>

              <div className="space-y-2">
                {todo.subtasks.map((st) => (
                  <div
                    key={st._id || st.title}
                    onClick={() => toggleSubtask(todo._id || todo.id, st._id)}
                    className="flex items-center space-x-3 p-3 bg-gray-50 hover:bg-purple-50 rounded-xl cursor-pointer transition-colors border border-gray-100"
                  >
                    {st.completed ? (
                      <CheckSquare className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    ) : (
                      <Square className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        st.completed ? "line-through text-gray-400" : "text-gray-800"
                      }`}
                    >
                      {st.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes Section */}
          {todo.notes && (
            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase text-gray-500 tracking-wider">
                Notes
              </h4>
              <p className="text-sm text-gray-600 bg-amber-50/60 p-3.5 rounded-2xl border border-amber-200/60">
                {todo.notes}
              </p>
            </div>
          )}

          {/* Attachment Preview & Download */}
          {todo.attachment && todo.attachment.url && (
            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase text-gray-500 tracking-wider">
                Attachment
              </h4>
              <a
                href={todo.attachment.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3.5 bg-purple-50 text-[#9D72FF] rounded-2xl border border-purple-200 hover:bg-purple-100 transition-colors group"
              >
                <div className="flex items-center space-x-3 truncate">
                  <Paperclip className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-bold truncate">
                    {todo.attachment.fileName || "View Attachment"}
                  </span>
                </div>
                <span className="text-xs font-bold underline group-hover:text-purple-800">
                  Open File &rarr;
                </span>
              </a>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 px-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-200 rounded-xl transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#9D72FF] hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-200 transition-all"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Task</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoDetailModal;
