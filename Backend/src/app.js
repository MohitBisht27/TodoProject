import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import todoRouter from "./routes/todo.routes.js";

const app = express();

app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = (process.env.CORS_ORIGIN || "")
        .split(",")
        .map((allowedOrigin) => allowedOrigin.trim())
        .filter(Boolean);

      if (
        !origin ||
        allowedOrigins.includes("*") ||
        allowedOrigins.includes(origin)
      ) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Root Health Check Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Taskify Backend API is running smoothly",
  });
});

app.use("/api/v1/todos/", todoRouter);

// Global Express Error Handling Middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    statusCode,
    success: false,
    message,
    errors: err.errors || [],
  });
});

export { app };
