import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { LayoutGrid, CheckSquare, PlusCircle, CheckCircle2 } from "lucide-react";

export const Navbar = () => {
  const location = useLocation();

  const navItems = [
    {
      name: "Categories",
      path: "/categories",
      icon: LayoutGrid,
    },
    {
      name: "Tasks List",
      path: "/tasks",
      icon: CheckSquare,
    },
    {
      name: "New Task",
      path: "/create-task",
      icon: PlusCircle,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-lg border-t border-purple-100 shadow-lg">
      <div className="max-w-lg mx-auto px-6 h-16 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center space-y-1 transition-all duration-200 ${
                isActive
                  ? "text-[#9D72FF] scale-105 font-bold"
                  : "text-gray-400 hover:text-gray-600 font-medium"
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-colors ${
                  isActive ? "bg-purple-100/70" : "bg-transparent"
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-xs">{item.name}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default Navbar;
