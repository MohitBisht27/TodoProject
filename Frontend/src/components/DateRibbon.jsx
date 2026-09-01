import React from "react";
import { useTasks } from "../context/TaskContext";

export const DateRibbon = () => {
  const { selectedDate, setSelectedDate } = useTasks();

  // Generate 7 consecutive days centered or starting around selected date / today
  const getDaysArray = () => {
    const days = [];
    const base = new Date(selectedDate || new Date());
    // Display 7 days centered around selected date
    for (let i = -3; i <= 3; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      days.push(d);
    }
    return days;
  };

  const days = getDaysArray();

  const isSameDay = (d1, d2) => {
    if (!d1 || !d2) return false;
    return (
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear()
    );
  };

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="flex items-center justify-between gap-3 overflow-x-auto py-2 no-scrollbar px-1">
      {days.map((dateObj) => {
        const active = isSameDay(dateObj, selectedDate);
        return (
          <button
            key={dateObj.toISOString()}
            onClick={() => setSelectedDate(new Date(dateObj))}
            className={`flex flex-col items-center justify-center min-w-[70px] py-4 px-3 rounded-2xl transition-all duration-200 cursor-pointer ${
              active
                ? "bg-[#9D72FF] text-white shadow-lg shadow-purple-200 scale-105 font-bold"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 font-medium"
            }`}
          >
            <span className="text-lg leading-tight">{dateObj.getDate()}</span>
            <span className={`text-xs mt-1 ${active ? "text-purple-100" : "text-gray-400"}`}>
              {dayNames[dateObj.getDay()]}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default DateRibbon;
