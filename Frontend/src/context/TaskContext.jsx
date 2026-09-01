import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  fetchAllTodosService,
  createTodoService,
  updateTodoService,
  deleteTodoService,
  toggleSubtaskService,
} from "../services/api";

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filters
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Fetch todos from backend without setting full-page blocking loader during real-time typing
  const fetchTodos = useCallback(async (isInitial = true) => {
    if (isInitial) setLoading(true);
    setError(null);
    try {
      const params = {};
      if (selectedCategory) params.category = selectedCategory;
      if (statusFilter) params.status = statusFilter;

      const res = await fetchAllTodosService(params);
      if (res.success && Array.isArray(res.data)) {
        setTodos(res.data);
      } else {
        setTodos([]);
      }
    } catch (err) {
      console.error("Failed to fetch todos:", err);
      setError(err.response?.data?.message || "Failed to load tasks from server");
    } finally {
      if (isInitial) setLoading(false);
    }
  }, [selectedCategory, statusFilter]);

  useEffect(() => {
    fetchTodos(true);
  }, [fetchTodos]);

  const addTask = async (todoData) => {
    setLoading(true);
    try {
      const res = await createTodoService(todoData);
      if (res.success) {
        await fetchTodos(false);
        return res.data;
      }
    } catch (err) {
      console.error("Failed to create todo:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const editTask = async (id, updates) => {
    try {
      const res = await updateTodoService(id, updates);
      if (res.success) {
        setTodos((prev) =>
          prev.map((t) => (t._id === id || t.id === id ? res.data : t))
        );
        return res.data;
      }
    } catch (err) {
      console.error("Failed to edit todo:", err);
      throw err;
    }
  };

  const toggleTaskStatus = async (id) => {
    const targetTodo = todos.find((t) => t._id === id || t.id === id);
    if (!targetTodo) return;

    const newStatus = targetTodo.status === "completed" ? "todo" : "completed";

    // Optimistic UI update
    setTodos((prev) =>
      prev.map((t) =>
        t._id === id || t.id === id ? { ...t, status: newStatus } : t
      )
    );

    try {
      await updateTodoService(id, { status: newStatus });
    } catch (err) {
      console.error("Failed to toggle status:", err);
      // Revert optimistic update on failure
      setTodos((prev) =>
        prev.map((t) =>
          t._id === id || t.id === id ? { ...t, status: targetTodo.status } : t
        )
      );
      setError("Failed to update task status");
    }
  };

  const removeTask = async (id) => {
    try {
      await deleteTodoService(id);
      setTodos((prev) => prev.filter((t) => t._id !== id && t.id !== id));
    } catch (err) {
      console.error("Failed to delete task:", err);
      setError("Failed to delete task");
    }
  };

  const toggleSubtask = async (todoId, subtaskId) => {
    try {
      const res = await toggleSubtaskService(todoId, subtaskId);
      if (res.success) {
        setTodos((prev) =>
          prev.map((t) => (t._id === todoId ? res.data : t))
        );
      }
    } catch (err) {
      console.error("Failed to toggle subtask:", err);
      setError("Failed to update subtask");
    }
  };

  return (
    <TaskContext.Provider
      value={{
        todos,
        loading,
        error,
        selectedDate,
        setSelectedDate,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        statusFilter,
        setStatusFilter,
        fetchTodos,
        addTask,
        editTask,
        toggleTaskStatus,
        removeTask,
        toggleSubtask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
};
