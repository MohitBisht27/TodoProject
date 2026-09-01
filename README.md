# 📝 Taskify - Full-Stack MERN Todo Management Application

A feature-rich, full-stack **MERN** (MongoDB, Express, React, Node.js) Todo application designed as a responsive **Multi-Page Application (MPA)** styled with **Tailwind CSS v4**.

---

## 🌐 Live Deployed Application

- 🎨 **Live Frontend Web App (Netlify)**: [https://kaamtodo.netlify.app](https://kaamtodo.netlify.app)
- ⚙️ **Live Backend REST API (Render)**: [https://todoproject-q2g9.onrender.com/api/v1/todos](https://todoproject-q2g9.onrender.com/api/v1/todos)

---

## 🌟 Architecture Overview

```text
TodoProject/
├── Backend/   # Express.js REST API server & MongoDB Mongoose models
└── Frontend/  # React 19 + Vite Multi-Page Application UI
```

- **Frontend**: Multi-Page Application (MPA) built with React 19, Vite, Tailwind CSS v4, and React Router v7. Features category hubs, task forms, interactive checklists, real-time search, and a detail popup modal.
- **Backend**: Express v5 REST API with MongoDB/Mongoose v9 data persistence, file attachment uploads, and RESTful CRUD endpoints.

---

## 🚀 Quick Start Guide

### 1. Start Backend Server
```bash
cd Backend
npm install
npm run dev
```
*Backend runs at `http://localhost:8000`*

### 2. Start Frontend App
```bash
cd Frontend
npm install
npm run dev
```
---

## 🧪 Testing Locally Before Pushing to GitHub

Before committing and pushing code updates to GitHub or deploying to production, run these local verification tests:

### 1. Test Frontend Production Build
```bash
cd Frontend
npm run build
```
> Checks for JSX syntax errors, missing module imports, broken routes, and verifies Tailwind asset compilation.

### 2. Test Backend Node.js Syntax
```bash
cd Backend
node --check src/index.js
node --check src/app.js
node --check src/routes/todo.routes.js
node --check src/controller/todo.controller.js
```
> Verifies ES module imports, Express routing setup, and syntax validity without launching full server.

### 3. Run & Verify Full Stack Locally
1. **Start Backend**: `cd Backend && npm run dev` (Runs on `http://localhost:8000`)
2. **Start Frontend**: `cd Frontend && npm run dev` (Runs on `http://localhost:5173`)
3. **Verify API & UI**: Open `http://localhost:5173` to test Creating, Reading, Updating, and Deleting todos.

---

## 📖 Module Documentation

- 🎨 **[Frontend Documentation](Frontend/README.md)**: UI design components, routes, state context, and styling details.
- ⚙️ **[Backend Documentation](Backend/README.md)**: API endpoint specs, database schema definitions, and controllers.

