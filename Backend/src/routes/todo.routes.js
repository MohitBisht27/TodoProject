import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { createTodo } from "../controller/todo.controller.js";

const router = Router();

router.post("/", upload.single("attachment"), createTodo);

export default router;
