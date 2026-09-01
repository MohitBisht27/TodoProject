import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import todoRouter from "./routes/todo.routes.js";

const app = express();

const allowedOrigins = [
  "https://kaamtodo.netlify.app",
  "http://localhost:5173",
  "http://localhost:5174",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin) || process.env.CORS_ORIGIN === "*") {
        callback(null, true);
      } else {
        callback(null, true);
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

export { app };
