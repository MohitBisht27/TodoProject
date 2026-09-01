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

const updateTodo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const todo = await Todo.findOne({ _id: id, isDeleted: false });

  if (!todo) {
    throw new ApiError(404, "Todo not found");
  }

  if (updates.status === "completed" && todo.status !== "completed") {
    todo.completedAt = new Date();
  } else if (updates.status && updates.status !== "completed") {
    todo.completedAt = null;
  }

  if (req.file) {
    if (todo.attachment && todo.attachment.publicId) {
      await deleteFromCloudinary(todo.attachment.publicId);
    }

    const uploadedFile = await uploadOnCloudinary(req.file.path);
    if (!uploadedFile)
      throw new ApiError(500, "Failed to upload new attachment");

    todo.attachment = {
      url: uploadedFile.secure_url,
      publicId: uploadedFile.public_id,
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      uploadedAt: new Date(),
    };
  }

  if (updates.removeAttachment === "true" && todo.attachment?.publicId) {
    await deleteFromCloudinary(todo.attachment.publicId);
    todo.attachment = null;
  }

  const allowedUpdates = [
    "title",
    "description",
    "status",
    "priority",
    "dueDate",
    "category",
    "notes",
    "color",
    "reminder",
  ];

  allowedUpdates.forEach((field) => {
    if (updates[field] !== undefined) todo[field] = updates[field];
  });

  if (updates.tags)
    todo.tags =
      typeof updates.tags === "string"
        ? JSON.parse(updates.tags)
        : updates.tags;
  if (updates.subtasks)
    todo.subtasks =
      typeof updates.subtasks === "string"
        ? JSON.parse(updates.subtasks)
        : updates.subtasks;

  await todo.save();

  return res
    .status(200)
    .json(new ApiResponse(200, todo, "Todo updated successfully"));
});

const deleteTodo = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const todo = await Todo.findOne({ _id: id, isDeleted: false });

  if (!todo) {
    throw new ApiError(404, "Todo not found");
  }

  todo.isDeleted = true;
  todo.deletedAt = new Date();
  await todo.save();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Todo moved to trash successfully"));
});

const toggleSubtask = asyncHandler(async (req, res) => {
  const { id, subtaskId } = req.params;
  const todo = await Todo.findOne({ _id: id, isDeleted: false });
  if (!todo) throw new ApiError(404, "Todo not found");

  const subtask = todo.subtasks.id(subtaskId);
  if (!subtask) throw new ApiError(404, "Subtask not found");

  subtask.completed = !subtask.completed;
  await todo.save();

  return res
    .status(200)
    .json(new ApiResponse(200, todo, "Subtask status updated"));
});

export {
  createTodo,
  getAllTodos,
  getTodoById,
  updateTodo,
  deleteTodo,
  toggleSubtask,
};
