import type { ErrorRequestHandler } from "express";
import multer from "multer";
import { ZodError } from "zod";

import { logger } from "../config/logger.js";
import { AppError } from "../utils/app-error.js";

function isZodLikeError(error: unknown): error is ZodError {
  return (
    error instanceof ZodError ||
    (typeof error === "object" &&
      error !== null &&
      "issues" in error &&
      Array.isArray((error as { issues?: unknown }).issues) &&
      typeof (error as { flatten?: unknown }).flatten === "function")
  );
}

export const errorHandler: ErrorRequestHandler = (error, req, res, _next) => {
  if (error instanceof AppError) {
    logger.warn("Handled application error", {
      path: req.path,
      method: req.method,
      statusCode: error.statusCode,
      message: error.message,
    });
    res.status(error.statusCode).json({ success: false, message: error.publicMessage });
    return;
  }

  if (isZodLikeError(error)) {
    logger.warn("Request validation failed", {
      path: req.path,
      method: req.method,
      errors: error.flatten().fieldErrors,
    });
    res.status(400).json({ success: false, message: "Please check your input and try again." });
    return;
  }

  if (error instanceof multer.MulterError) {
    logger.warn("CSV upload failed", { path: req.path, code: error.code, message: error.message });
    const message =
      error.code === "LIMIT_FILE_SIZE"
        ? "The CSV file is too large. Please upload a smaller file."
        : "Unable to upload the CSV file. Please check the file and try again.";
    res.status(400).json({ success: false, message });
    return;
  }

  logger.error("Unhandled API error", {
    path: req.path,
    method: req.method,
    error,
  });

  res.status(500).json({
    success: false,
    message: "Something went wrong. Please try again in a moment.",
  });
};
