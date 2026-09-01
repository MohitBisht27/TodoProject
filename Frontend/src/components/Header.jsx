import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LayoutGrid, ArrowLeft, Clock } from "lucide-react";

export const Header = ({ title, showBack = false, rightIcon }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between px-6 py-5 bg-transparent">
      {showBack ? (
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
          aria-label="Go Back"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
      ) : (
        <button
          onClick={() => navigate("/categories")}
          className="p-2 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
          aria-label="Categories Grid"
        >
          <LayoutGrid className="w-6 h-6" />
        </button>
      )}

      <h1 className="text-xl font-bold text-gray-800 tracking-tight">{title}</h1>

      <div className="p-2 rounded-xl text-gray-700">
        {rightIcon || <Clock className="w-6 h-6" />}
      </div>
    </div>
  );
};

export default Header;
