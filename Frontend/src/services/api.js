import axios from "axios";

// Set base URL to backend domain (or empty string in DEV to use Vite proxy)
const baseURL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? "" : "https://todoproject-q2g9.onrender.com");

const API = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchAllTodosService = async (params = {}) => {
  const response = await API.get("/api/v1/todos", { params });
  return response.data;
};

export const fetchTodoByIdService = async (id) => {
  const response = await API.get(`/api/v1/todos/${id}`);
  return response.data;
};

export const createTodoService = async (todoData) => {
  let config = {};
  let body = todoData;

  if (todoData instanceof FormData) {
    config.headers = { "Content-Type": "multipart/form-data" };
  }

  const response = await API.post("/api/v1/todos", body, config);
  return response.data;
};

export const updateTodoService = async (id, updates) => {
  let config = {};
  let body = updates;

  if (updates instanceof FormData) {
    config.headers = { "Content-Type": "multipart/form-data" };
  }

  const response = await API.patch(`/api/v1/todos/${id}`, body, config);
  return response.data;
};

export const deleteTodoService = async (id) => {
  const response = await API.delete(`/api/v1/todos/${id}`);
  return response.data;
};

export const toggleSubtaskService = async (todoId, subtaskId) => {
  const response = await API.patch(
    `/api/v1/todos/${todoId}/subtasks/${subtaskId}/toggle`
  );
  return response.data;
};

export default API;
