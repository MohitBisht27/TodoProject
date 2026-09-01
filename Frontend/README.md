# 🚀 Taskify Frontend - React + Vite + Tailwind CSS

A modern, responsive Multi-Page Application (MPA) Todo management user interface built with **React 19**, **Vite**, **Tailwind CSS v4**, and **React Router v7**, fully integrated with the MongoDB/Express REST API.

---

## 🌐 Live Application Link

- 🎨 **Deployed Web App**: [https://kaamtodo.netlify.app](https://kaamtodo.netlify.app)
- ⚙️ **Connected Backend API**: [https://todoproject-q2g9.onrender.com](https://todoproject-q2g9.onrender.com)

---

## ✨ Features

- **📂 Activity Categories Hub (`/categories`)**:
  - Grid view of activity categories (*Idea*, *Food*, *Work*, *Sport*, *Music*, *General*).
  - Dynamic, real-time task counters calculated directly from backend MongoDB data.
  - Interactive top horizontal `DateRibbon` to filter tasks by day.

- **📝 Task Creation & Edit Form (`/create-task` & `/edit-task/:id`)**:
  - Interactive month calendar grid date selector.
  - Category dropdown selector with custom Lucide icons.
  - Comprehensive field support: Title, Description, Priority (*Low*, *Medium*, *High*), Color tag palette, Subtask list adder, and File Attachment upload.

- **📅 Today's Tasks & Checklist (`/tasks`)**:
  - Vibrant purple hero header (`#9D72FF`) displaying formatted active date and task count.
  - Quick category filter chips (*All*, *Idea*, *Food*, etc.).
  - Task cards with formatted start/end time slots (`06:00 - 07:30`, etc.).
  - **Interactive Checkbox**: Toggles task status between `completed` and `todo` with instant backend synchronization.

- **🔍 Todo Details Popup Modal**:
  - Backdrop-blurred modal displaying full task metadata (category, priority badge, due date, time slot, notes, subtask checklist, and file attachment preview link).
  - Enables subtask toggling, status updates, editing, and task deletion directly within the popup view.

- **⚡ Real-time Non-blocking Search**:
  - Integrated search input in desktop and mobile header bars.
  - Automatic focus redirection to `/tasks` page.
  - Real-time zero-lag multi-field filtering across title, description, category, and notes.

---

## 🌐 Netlify Deployment Settings

The repository includes a pre-configured `netlify.toml` file handling SPA rewrite rules and build settings.

- **Deployed URL**: [https://kaamtodo.netlify.app](https://kaamtodo.netlify.app)
- **Base directory**: `Frontend`
- **Build command**: `npm run build`
- **Publish directory**: `dist`

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) via `@tailwindcss/vite`
- **Iconography**: [Lucide React](https://lucide.dev/)
- **HTTP Client**: [Axios](https://axios-http.com/)

---

## ⚡ Getting Started

### 1. Installation
Navigate to the `Frontend` directory and install dependencies:
```bash
cd Frontend
npm install
```

### 2. Running Dev Server
Start the Vite development server:
```bash
npm run dev
```
The application will open locally at `http://localhost:5174` (or `http://localhost:5173`).

### 3. Building for Production
Create an optimized production bundle:
```bash
npm run build
```
The output files will be generated inside the `dist/` directory.
