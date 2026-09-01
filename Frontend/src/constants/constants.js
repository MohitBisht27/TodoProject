import { Lightbulb, Utensils, ClipboardList, Dumbbell, Music, Bookmark, Calendar, CheckSquare, Clock, Plus } from "lucide-react";

export const CATEGORIES = [
  {
    id: "Idea",
    name: "Idea",
    icon: Lightbulb,
    bgColor: "bg-purple-100",
    textColor: "text-purple-600",
    iconColor: "text-purple-500",
  },
  {
    id: "Food",
    name: "Food",
    icon: Utensils,
    bgColor: "bg-purple-100",
    textColor: "text-purple-600",
    iconColor: "text-purple-500",
  },
  {
    id: "Work",
    name: "Work",
    icon: ClipboardList,
    bgColor: "bg-purple-100",
    textColor: "text-purple-600",
    iconColor: "text-purple-500",
  },
  {
    id: "Sport",
    name: "Sport",
    icon: Dumbbell,
    bgColor: "bg-purple-100",
    textColor: "text-purple-600",
    iconColor: "text-purple-500",
  },
  {
    id: "Music",
    name: "Music",
    icon: Music,
    bgColor: "bg-purple-100",
    textColor: "text-purple-600",
    iconColor: "text-purple-500",
  },
  {
    id: "General",
    name: "General",
    icon: Bookmark,
    bgColor: "bg-purple-100",
    textColor: "text-purple-600",
    iconColor: "text-purple-500",
  },
];

export const PRIORITIES = [
  { id: "low", label: "Low", color: "bg-emerald-100 text-emerald-700 border-emerald-300" },
  { id: "medium", label: "Medium", color: "bg-amber-100 text-amber-700 border-amber-300" },
  { id: "high", label: "High", color: "bg-rose-100 text-rose-700 border-rose-300" },
];

export const STATUSES = [
  { id: "todo", label: "To Do" },
  { id: "in-progress", label: "In Progress" },
  { id: "completed", label: "Completed" },
];

export const COLOR_PALETTE = [
  "#9D72FF", // Lavender Purple
  "#3B82F6", // Blue
  "#10B981", // Emerald Green
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#EC4899", // Pink
  "#8B5CF6", // Violet
];
