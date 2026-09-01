import React, { useMemo } from "react";
import { useTasks } from "../context/TaskContext";

export const DateRibbon = () => {
  const { selectedDate, setSelectedDate } = useTasks();

  const activeDate = selectedDate || new Date();

  // Generate 7 days centered around active selected date or current week
  const days = useMemo(() => {
    const list = [];
    const base = new Date(activeDate);
    // 3 days before, today, 3 days after
    for (let i = -3; i <= 3; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      list.push(d);
    }
    return list;
  }, [activeDate]);

  const isSameDay = (d1, d2) => {
    return (
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear()
    );
  };

  return (
    <div className="flex items-center justify-between gap-2 overflow-x-auto py-2 px-1 scrollbar-none">
      {days.map((dateObj, idx) => {
        const isSelected = isSameDay(dateObj, activeDate);
        const dayName = dateObj.toLocaleDateString("en-US", { weekday: "short" });
        const dayNum = dateObj.getDate();

        return (
          <button
            key={idx}
            onClick={() => setSelectedDate(dateObj)}
            className={`flex flex-col items-center justify-center min-w-[50px] py-2.5 px-3 rounded-2xl transition-all duration-200 ${
              isSelected
                ? "bg-white text-[#9D72FF] font-bold shadow-lg scale-105"
                : "bg-white/10 text-purple-100 hover:bg-white/20 font-medium"
            }`}
          >
            <span className="text-[11px] uppercase tracking-wider opacity-80">{dayName}</span>
            <span className="text-lg font-extrabold mt-0.5">{dayNum}</span>
          </button>
        );
      })}
    </div>
  );
};

export default DateRibbon;
