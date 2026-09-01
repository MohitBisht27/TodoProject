import mongoose, { Schema } from "mongoose";

const subtaskSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Subtask title is required"],
      trim: true,
      maxlength: [200, "Subtask title cannot exceed 200 characters"],
    },
    completed: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true },
);

const attachmentSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      default: null,
    },
    fileName: {
      type: String,
      default: "Attachment",
    },
    fileType: {
      type: String,
      default: null,
    },
    fileSize: {
      type: Number,
      default: null,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false },
);

const todoSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Todo title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [300, "Title cannot exceed 300 characters"],
      index: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
      default: "",
    },

    status: {
      type: String,
      enum: {
        values: ["todo", "in-progress", "completed"],
        message:
          "{VALUE} is not a valid status. Use: todo, in-progress, or completed",
      },
      default: "todo",
      index: true,
    },

    priority: {
      type: String,
      enum: {
        values: ["low", "medium", "high"],
        message: "{VALUE} is not a valid priority. Use: low, medium, or high",
      },
      default: "medium",
      index: true,
    },

    dueDate: {
      type: Date,
      default: null,
      index: true,
    },

    completedAt: {
      type: Date,
      default: null,
    },

    category: {
      type: String,
      trim: true,
      maxlength: [100, "Category cannot exceed 100 characters"],
      default: "General",
      index: true,
    },

    tags: {
      type: [String],
      default: [],
      validate: {
        validator: function (tags) {
          return tags.length <= 10;
        },
        message: "A todo cannot have more than 10 tags",
      },
    },

    attachment: {
      type: attachmentSchema,
      default: null,
    },

    subtasks: {
      type: [subtaskSchema],
      default: [],
      validate: {
        validator: function (subtasks) {
          return subtasks.length <= 20;
        },
        message: "A todo cannot have more than 20 subtasks",
      },
    },

    notes: {
      type: String,
      trim: true,
      maxlength: [1000, "Notes cannot exceed 1000 characters"],
      default: "",
    },

    color: {
      type: String,
      default: null,
      validate: {
        validator: function (v) {
          if (!v) return true;
          return /^#[0-9A-F]{6}$/i.test(v);
        },
        message: "Invalid color format. Use hex format (e.g., #FF5733)",
      },
    },

    reminder: {
      type: Date,
      default: null,
    },

    isDeleted: {
      type: Boolean,
      default: false,
      select: false,
    },

    deletedAt: {
      type: Date,
      default: null,
      select: false,
    },
  },
  {
    timestamps: true,

    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

export const Todo = mongoose.model("Todo", todoSchema);
