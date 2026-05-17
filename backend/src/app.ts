
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env";
import apiRouter from "./routes/index";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware";
import { AdminsService } from "./services/admins.service";

const app = express();

// ─── Security ─────────────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: (origin, cb) => {
      // Allow requests with no origin (Postman, mobile) or allowed origins
      if (!origin || env.allowedOrigins.includes(origin)) {
        cb(null, true);
      } else {
        cb(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ─── Raw body for Clerk webhook signature verification ────────
// Must come BEFORE express.json() for the webhook path
app.use(
  "/api/webhooks/clerk",
  express.raw({ type: "application/json" })
);

// ─── Parsing & Logging ────────────────────────────────────────
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(env.isDev ? "dev" : "combined"));

// ─── Routes ───────────────────────────────────────────────────
app.use("/api", apiRouter);

// ─── Error Handling ───────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

// ─── Seed Super Admin on startup ──────────────────────────────
(async () => {
  try {
    await AdminsService.ensureSuperAdmin(env.seed.adminEmail, env.seed.adminName);
  } catch (err) {
    console.warn("⚠️  Could not seed Super Admin (DB might not be ready):", err);
  }
})();

export default app;
