import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { TaskProvider } from "./context/TaskContext";
import CategoriesPage from "./pages/CategoriesPage";
import CreateTaskPage from "./pages/CreateTaskPage";
import TasksPage from "./pages/TasksPage";
import Navbar from "./components/Navbar";

export function App() {
  return (
    <TaskProvider>
      <Router>
        <div className="min-h-screen bg-gray-100 font-sans antialiased text-gray-900 selection:bg-purple-200">
          <Routes>
            <Route path="/" element={<Navigate to="/categories" replace />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/create-task" element={<CreateTaskPage />} />
            <Route path="/edit-task/:id" element={<CreateTaskPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="*" element={<Navigate to="/categories" replace />} />
          </Routes>

          {/* Persistent MPA Navigation Bar */}
          <Navbar />
        </div>
      </Router>
    </TaskProvider>
  );
}

export default App;
