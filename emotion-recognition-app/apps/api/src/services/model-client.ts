import { predictionSchema, type Prediction } from "@emotion-recognition/shared";

import { env } from "../config/env.js";
import { logger } from "../config/logger.js";
import { AppError } from "../utils/app-error.js";

const MODEL_TIMEOUT_MS = 30_000;

async function readSafeError(response: Response) {
  try {
    const payload = (await response.json()) as { detail?: unknown; message?: unknown };
    return typeof payload.detail === "string"
      ? payload.detail
      : typeof payload.message === "string"
        ? payload.message
        : undefined;
  } catch {
    return undefined;
  }
}

export async function predictEmotion(text: string): Promise<Prediction> {
  const response = await fetch(`${env.MODEL_API_URL}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
    signal: AbortSignal.timeout(MODEL_TIMEOUT_MS),
  }).catch((error: unknown) => {
    logger.error("Model API request failed", {
      modelApiUrl: env.MODEL_API_URL,
      error,
      textLength: text.length,
    });
    throw new AppError(
      503,
      "Unable to analyze the text at the moment. Please try again.",
      "Model API request failed.",
    );
  });

  if (!response.ok) {
    const modelMessage = await readSafeError(response);
    logger.error("Model API returned an error", {
      status: response.status,
      modelMessage,
      textLength: text.length,
    });
    throw new AppError(
      503,
      "Unable to analyze the text at the moment. Please try again.",
      modelMessage,
    );
  }

  const payload = await response.json();
  const parsed = predictionSchema.safeParse(payload);

  if (!parsed.success) {
    logger.error("Model API response schema mismatch", {
      errors: parsed.error.flatten().fieldErrors,
    });
    throw new AppError(
      502,
      "The model returned an unexpected response. Please try again.",
      "Model API response schema mismatch.",
    );
  }

  return parsed.data;
}
