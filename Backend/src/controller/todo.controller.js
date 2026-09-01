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

const getAllTodos = asyncHandler(async (req, res) => {
  const { status, priority, category, search, sortBy, order } = req.query;
  const query = { isDeleted: false };
  if (status) query.status = status;
  if (priority) query.priority = priority;
  if (category) query.category = category;

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  const sortOptions = {};
  if (sortBy) {
    sortOptions[sortBy] = order === "desc" ? -1 : 1;
  } else {
    sortOptions.createdAt = -1;
  }

  const todos = await Todo.find(query).sort(sortOptions);

  return res
    .status(200)
    .json(new ApiResponse(200, todos, "Todos fetched successfully"));
});
const getTodoById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const todo = await Todo.findOne({ _id: id, isDeleted: false });

  if (!todo) {
    throw new ApiError(404, "Todo not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, todo, "Todo fetched successfully"));
});

export { createTodo, getAllTodos, getTodoById };
