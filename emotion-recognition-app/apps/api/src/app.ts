import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";

import { corsOrigins, env } from "./config/env.js";
import { httpLogStream } from "./config/logger.js";
import { errorHandler } from "./middleware/error-handler.js";
import { notFoundHandler } from "./middleware/not-found.js";
import emotionRoutes from "./routes/emotion.routes.js";
import jobRoutes from "./routes/jobs.routes.js";

export const app = express();

// Trust Railway's reverse proxy so express-rate-limit can read the real
// client IP from the X-Forwarded-For header instead of throwing ERR_ERL_UNEXPECTED_X_FORWARDED_FOR.
app.set("trust proxy", 1);

app.disable("x-powered-by");
app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || corsOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error("Not allowed by CORS"));
    },
  }),
);
app.use(
  rateLimit({
    windowMs: 60_000,
    limit: env.NODE_ENV === "production" ? 60 : 300,
    standardHeaders: "draft-7",
    legacyHeaders: false,
  }),
);
app.use(express.json({ limit: "1mb" }));
app.use(morgan("combined", { stream: httpLogStream }));

app.get("/health", (_req, res) => {
  res.json({
    success: true,
    service: "emotion-recognition-api",
    status: "ok",
    modelApiUrl: env.MODEL_API_URL,
  });
});

app.use("/api/emotions", emotionRoutes);
app.use("/api/jobs", jobRoutes);

app.use(notFoundHandler);
app.use(errorHandler);
