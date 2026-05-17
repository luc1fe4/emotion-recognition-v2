import "dotenv/config";

import { z } from "zod";

const numberFromEnv = (fallback: number) =>
  z.preprocess((value) => {
    if (value === undefined || value === "") {
      return fallback;
    }
    const parsed = Number(value);
    return Number.isNaN(parsed) ? value : parsed;
  }, z.number().int().positive());

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: numberFromEnv(4000),
  CORS_ORIGIN: z.string().default("http://localhost:3000"),
  MODEL_API_URL: z.string().url().default("http://localhost:8000"),
  DATABASE_URL: z.string().optional(),
  REDIS_URL: z.string().optional(),
  LOG_LEVEL: z.string().default("info"),
  MAX_TEXT_LENGTH: numberFromEnv(700),
  CSV_MAX_FILE_SIZE_MB: numberFromEnv(5),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid API environment configuration", parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;

export const corsOrigins = env.CORS_ORIGIN.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
