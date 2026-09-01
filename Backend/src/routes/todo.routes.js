import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
  createTodo,
  getAllTodos,
  getTodoById,
} from "../controller/todo.controller.js";

const router = Router();

router.post("/", upload.single("attachment"), createTodo);
router.get("/", getAllTodos);
router.get("/:id", getTodoById);

export default router;
