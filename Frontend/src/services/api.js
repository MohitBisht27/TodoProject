import axios from "axios";

const API = axios.create({
  baseURL: "/api/v1/todos",
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchAllTodosService = async (params = {}) => {
  const response = await API.get("/", { params });
  return response.data;
};

export const fetchTodoByIdService = async (id) => {
  const response = await API.get(`/${id}`);
  return response.data;
};

export const createTodoService = async (todoData) => {
  let config = {};
  let body = todoData;

  if (todoData instanceof FormData) {
    config.headers = { "Content-Type": "multipart/form-data" };
  }

  const response = await API.post("/", body, config);
  return response.data;
};

export const updateTodoService = async (id, updates) => {
  let config = {};
  let body = updates;

  if (updates instanceof FormData) {
    config.headers = { "Content-Type": "multipart/form-data" };
  }

  const response = await API.patch(`/${id}`, body, config);
  return response.data;
};

export const deleteTodoService = async (id) => {
  const response = await API.delete(`/${id}`);
  return response.data;
};

export const toggleSubtaskService = async (todoId, subtaskId) => {
  const response = await API.patch(`/${todoId}/subtasks/${subtaskId}/toggle`);
  return response.data;
};

export default API;
