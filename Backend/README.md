# ⚙️ Taskify Backend - Node.js + Express + MongoDB REST API

A scalable **Node.js** and **Express v5** RESTful API backing the Taskify Todo Application, featuring **Mongoose v9** data modeling, **Multer** file handling, **Cloudinary** attachment storage, and soft-delete capabilities.

---

## 🌐 Deployment Instructions

### 🚀 Deploying to Render
The repository contains `render.yaml` for zero-configuration deployments on Render.

1. Log into **Render** and click **New + -> Blueprint**.
2. Connect your Git repository.
3. Render will automatically parse [render.yaml](file:///c:/Users/HP/OneDrive/Desktop/Project/TodoProject/render.yaml) and configure your **Web Service**.
4. In the Render Dashboard, add your environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas Connection String
   - `CORS_ORIGIN`: Your Frontend URL (e.g. `https://your-app.netlify.app`)

---

## 🛠️ Tech Stack

- **Runtime**: [Node.js](https://nodejs.org/) (ES Modules)
- **Framework**: [Express v5](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) via [Mongoose v9](https://mongoosejs.com/)
- **Middleware**: CORS, Cookie Parser, Multer
- **File Storage**: Cloudinary integration for task attachments

---

## 📊 Mongoose Schema Specification (`Todo`)

```javascript
{
  title: String,        // Required, 3 - 300 chars
  description: String,  // Max 2000 chars
  status: String,       // Enum: ["todo", "in-progress", "completed"] (default: "todo")
  priority: String,     // Enum: ["low", "medium", "high"] (default: "medium")
  dueDate: Date,        // Target due date timestamp
  completedAt: Date,    // Timestamp when status changed to "completed"
  category: String,     // Trimmed category string (default: "General")
  tags: [String],       // Array of tag strings (max 10)
  color: String,        // Hex color format (e.g., "#FF5733")
  reminder: Date,       // Reminder timestamp
  notes: String,        // Extra notes (max 1000 chars)
  subtasks: [           // Embedded subtask documents
    {
      title: String,
      completed: Boolean,
      createdAt: Date
    }
  ],
  attachment: {         // File attachment metadata
    url: String,
    publicId: String,
    fileName: String,
    fileType: String,
    fileSize: Number,
    uploadedAt: Date
  },
  isDeleted: Boolean    // Soft delete indicator
}
```

---

## 📡 API Endpoints

### Base URL: `/api/v1/todos`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **POST** | `/` | Create a new todo item (Supports JSON & `multipart/form-data` for file uploads) |
| **GET** | `/` | Get all todos (Query params: `status`, `priority`, `category`, `search`, `sortBy`, `order`) |
| **GET** | `/:id` | Fetch a single todo by MongoDB ObjectId |
| **PATCH** | `/:id` | Update an existing todo (Supports status updates, file updates, subtasks array) |
| **DELETE** | `/:id` | Soft delete a todo (sets `isDeleted: true`) |
| **PATCH** | `/:id/subtasks/:subtaskId/toggle` | Toggle subtask completion status |

---

## 📁 Directory Structure

```text
Backend/
├── render.yaml                 # Render deployment configuration
├── src/
│   ├── controller/
│   │   └── todo.controller.js  # Async route handlers for CRUD & subtask operations
│   ├── db/
│   │   └── db.js               # MongoDB Mongoose connection handler
│   ├── middlewares/
│   │   └── multer.middleware.js # File upload middleware
│   ├── models/
│   │   └── todo.model.js       # Mongoose Todo & Subtask schemas
│   ├── routes/
│   │   └── todo.routes.js      # Express router definitions
│   ├── utils/
│   │   ├── ApiError.js         # Custom API error class
│   │   ├── ApiResponse.js      # Standardized JSON response wrapper
│   │   ├── asyncHandler.js     # Promise wrapper for async controllers
│   │   └── cloudinary.js       # Cloudinary upload & delete helpers
│   ├── app.js                  # Express application setup
│   └── index.js                # Server entry point & DB connection initialization
├── .env                        # Environment configuration variables
└── package.json
```

---

## ⚙️ Environment Variables (`.env`)

Create a `.env` file in the `Backend/` directory with the following variables:

```env
PORT=8000
MONGODB_URI=mongodb://localhost:27017/todoproject
CORS_ORIGIN=*

# Cloudinary Storage Credentials (Optional)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## ⚡ Getting Started

### 1. Installation
Navigate to the `Backend` directory and install dependencies:
```bash
cd Backend
npm install
```

### 2. Run in Development Mode
Start the development server using `nodemon`:
```bash
npm run dev
```
The server will run at `http://localhost:8000`.
