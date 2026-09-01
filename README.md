# 📝 Taskify - Full-Stack MERN Todo Management Application

A feature-rich, full-stack **MERN** (MongoDB, Express, React, Node.js) Todo application designed as a responsive **Multi-Page Application (MPA)** styled with **Tailwind CSS v4**.

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
*Frontend runs at `http://localhost:5174` (or `http://localhost:5173`)*

---

## 📖 Module Documentation

- 🎨 **[Frontend Documentation](Frontend/README.md)**: UI design components, routes, state context, and styling details.
- ⚙️ **[Backend Documentation](Backend/README.md)**: API endpoint specs, database schema definitions, and controllers.
