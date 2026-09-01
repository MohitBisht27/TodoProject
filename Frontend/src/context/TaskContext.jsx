import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
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
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Fetch todos from backend without triggering global blocking loader after initial mount
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

  const addTask = useCallback(async (todoData) => {
    setLoading(true);
    try {
      const res = await createTodoService(todoData);
      if (res.success && res.data) {
        setTodos((prev) => [res.data, ...prev]);
        return res.data;
      }
    } catch (err) {
      console.error("Failed to create todo:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const editTask = useCallback(async (id, updates) => {
    try {
      const res = await updateTodoService(id, updates);
      if (res.success && res.data) {
        setTodos((prev) =>
          prev.map((t) => (t._id === id || t.id === id ? res.data : t))
        );
        return res.data;
      }
    } catch (err) {
      console.error("Failed to edit todo:", err);
      throw err;
    }
  }, []);

  const toggleTaskStatus = useCallback(async (id) => {
    setTodos((prev) => {
      const target = prev.find((t) => t._id === id || t.id === id);
      if (!target) return prev;
      const newStatus = target.status === "completed" ? "todo" : "completed";

      // Async update in background
      updateTodoService(id, { status: newStatus }).catch((err) => {
        console.error("Failed to toggle status:", err);
        // Revert on error
        setTodos((latest) =>
          latest.map((t) =>
            t._id === id || t.id === id ? { ...t, status: target.status } : t
          )
        );
      });

      return prev.map((t) =>
        t._id === id || t.id === id ? { ...t, status: newStatus } : t
      );
    });
  }, []);

  const removeTask = useCallback(async (id) => {
    // Optimistic deletion
    setTodos((prev) => prev.filter((t) => t._id !== id && t.id !== id));
    try {
      await deleteTodoService(id);
    } catch (err) {
      console.error("Failed to delete task:", err);
      setError("Failed to delete task");
      // Re-fetch to sync
      fetchTodos(false);
    }
  }, [fetchTodos]);

  const toggleSubtask = useCallback(async (todoId, subtaskId) => {
    setTodos((prev) =>
      prev.map((t) => {
        if (t._id !== todoId && t.id !== todoId) return t;
        const updatedSubtasks = (t.subtasks || []).map((s) =>
          s._id === subtaskId || s.id === subtaskId
            ? { ...s, completed: !s.completed }
            : s
        );
        return { ...t, subtasks: updatedSubtasks };
      })
    );

    try {
      const res = await toggleSubtaskService(todoId, subtaskId);
      if (res.success && res.data) {
        setTodos((prev) =>
          prev.map((t) => (t._id === todoId || t.id === todoId ? res.data : t))
        );
      }
    } catch (err) {
      console.error("Failed to toggle subtask:", err);
      fetchTodos(false);
    }
  }, [fetchTodos]);

  // Memoize context value object to prevent re-rendering all child components on every frame
  const contextValue = useMemo(
    () => ({
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
    }),
    [
      todos,
      loading,
      error,
      selectedDate,
      selectedCategory,
      searchQuery,
      statusFilter,
      fetchTodos,
      addTask,
      editTask,
      toggleTaskStatus,
      removeTask,
      toggleSubtask,
    ]
  );

  return (
    <TaskContext.Provider value={contextValue}>
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
