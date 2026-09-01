import { Todo } from "../models/todo.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";

const createTodo = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    status,
    priority,
    dueDate,
    category,
    tags,
    notes,
    color,
    reminder,
    subtasks,
  } = req.body;

  if (!title || !title.trim()) {
    throw new ApiError(400, "Todo title is required");
  }

  let attachmentData = null;
  if (req.file) {
    const uploadedFile = await uploadOnCloudinary(req.file.path);
    if (!uploadedFile) {
      throw new ApiError(500, "Failed to upload attachment");
    }

    attachmentData = {
      url: uploadedFile.secure_url,
      publicId: uploadedFile.public_id,
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      uploadedAt: new Date(),
    };
  }

  let parsedTags = [];
  if (tags) parsedTags = typeof tags === "string" ? JSON.parse(tags) : tags;

  let parsedSubtasks = [];
  if (subtasks)
    parsedSubtasks =
      typeof subtasks === "string" ? JSON.parse(subtasks) : subtasks;

  const todo = await Todo.create({
    title: title.trim(),
    description: description?.trim() || "",
    status: status || "todo",
    priority: priority || "medium",
    dueDate: dueDate || null,
    category: category?.trim() || "General",
    tags: parsedTags,
    subtasks: parsedSubtasks,
    notes: notes?.trim() || "",
    color: color || null,
    reminder: reminder || null,
    attachment: attachmentData,
    completedAt: status === "completed" ? new Date() : null,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, todo, "Todo created successfully"));
});

export { createTodo };
