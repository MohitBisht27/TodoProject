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
} from "lucide-react";
import { useTasks } from "../context/TaskContext";

export const TodoDetailModal = ({ todo, onClose }) => {
  const navigate = useNavigate();
  const { toggleSubtask } = useTasks();

  if (!todo) return null;

  const todoId = todo._id || todo.id;

  const handleOpenFullPage = () => {
    onClose();
    navigate(`/todo?id=${todoId}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-purple-100 animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Strip */}
        <div
          className="h-3 w-full"
          style={{ backgroundColor: todo.color || "#9D72FF" }}
        />

        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="px-3 py-1 bg-purple-100 text-[#9D72FF] text-xs font-bold rounded-full uppercase tracking-wider">
                  {todo.category || "General"}
                </span>
                <span
                  className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${
                    todo.priority === "high"
                      ? "bg-red-100 text-red-700"
                      : todo.priority === "low"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {todo.priority || "medium"}
                </span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 leading-snug">
                {todo.title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Description */}
          {todo.description && (
            <p className="mt-3 text-gray-600 text-sm leading-relaxed">
              {todo.description}
            </p>
          )}

          {/* Key Details Grid */}
          <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-gray-600">
            {todo.dueDate && (
              <div className="flex items-center space-x-2 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                <Calendar className="w-4 h-4 text-[#9D72FF]" />
                <span>
                  <strong>Due:</strong>{" "}
                  {new Date(todo.dueDate).toLocaleDateString()}
                </span>
              </div>
            )}
            {todo.reminder && (
              <div className="flex items-center space-x-2 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                <Clock className="w-4 h-4 text-[#9D72FF]" />
                <span>
                  <strong>Reminder:</strong>{" "}
                  {new Date(todo.reminder).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            )}
          </div>

          {/* Subtasks */}
          {Array.isArray(todo.subtasks) && todo.subtasks.length > 0 && (
            <div className="mt-4">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Subtasks ({todo.subtasks.filter((s) => s.completed).length}/
                {todo.subtasks.length})
              </h4>
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {todo.subtasks.map((subtask) => (
                  <div
                    key={subtask._id || subtask.id}
                    onClick={() => toggleSubtask(todoId, subtask._id || subtask.id)}
                    className="flex items-center space-x-2 p-2 rounded-xl bg-gray-50 hover:bg-purple-50 cursor-pointer transition-colors text-xs"
                  >
                    {subtask.completed ? (
                      <CheckSquare className="w-4 h-4 text-[#9D72FF]" />
                    ) : (
                      <Square className="w-4 h-4 text-gray-400" />
                    )}
                    <span
                      className={
                        subtask.completed
                          ? "line-through text-gray-400"
                          : "text-gray-800"
                      }
                    >
                      {subtask.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Attachment */}
          {todo.attachment?.url && (
            <div className="mt-4 p-3 bg-purple-50/60 rounded-2xl border border-purple-100 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs text-purple-900 font-medium truncate">
                <Paperclip className="w-4 h-4 text-[#9D72FF] flex-shrink-0" />
                <span className="truncate">
                  {todo.attachment.fileName || "Attachment"}
                </span>
              </div>
              <a
                href={todo.attachment.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#9D72FF] hover:underline font-bold"
              >
                View
              </a>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 flex items-center gap-3">
            <button
              onClick={handleOpenFullPage}
              className="flex-1 py-2.5 px-4 bg-[#9D72FF] hover:bg-[#8b5cf6] text-white font-bold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Open Single Page
            </button>
            <button
              onClick={() => {
                onClose();
                navigate(`/edit-task/${todoId}`);
              }}
              className="py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm rounded-2xl transition-all flex items-center gap-2"
            >
              <Edit3 className="w-4 h-4" />
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoDetailModal;
