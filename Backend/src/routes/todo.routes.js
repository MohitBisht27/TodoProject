import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
  createTodo,
  getAllTodos,
  getTodoById,
  updateTodo,
  deleteTodo,
  toggleSubtask,
} from "../controller/todo.controller.js";

const router = Router();

router.post("/", upload.single("attachment"), createTodo);
router.get("/", getAllTodos);
router.get("/:id", getTodoById);
router.patch("/:id", upload.single("attachment"), updateTodo);
router.delete("/:id", deleteTodo);
router.patch("/:id/subtasks/:subtaskId/toggle", toggleSubtask);

export default router;
