import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authrouter from "./routes/auth.routes.js";
import NotesRouter from "./routes/notes.routes.js";
import authenticate from "./middlewares/auth.middleware.js";
const app = express();

// Cors setup


// Allowed origins array (Local Vite Dev Server + Env Variable)
const allowedOrigins = [
  process.env.CORS_ALLOW_ORIGIN,
  "http://localhost:5173", // Standard Vite React Port
  "http://localhost:3000",
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like Mobile apps, Postman, server-to-server)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS policy violation: Origin not allowed"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

// setup the json and url and for static files to get the data

app.use(express.json({ limit: "12kb" }));
app.use(express.urlencoded({ extended: true, limit: "12kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.get("/health", async function (req, res) {
  return res.status(200).json({
    message: "Api is healthy",
  });
});

/**
 * @name="route for authentication"
 */
app.use("/api/auth", authrouter);

/**
 * @name="routes for notes"
 */
app.use("/api/notes", NotesRouter);

export default app;
