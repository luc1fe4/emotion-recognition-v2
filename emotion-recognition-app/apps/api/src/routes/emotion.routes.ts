import { Router } from "express";
import multer from "multer";

import { env } from "../config/env.js";
import { analyzeEmotion, getEmotionHistory, uploadEmotionBatch } from "../controllers/emotion.controller.js";
import { asyncHandler } from "../middleware/async-handler.js";
import { validateBody } from "../middleware/validate.js";
import { analyzeTextRequestSchema } from "@emotion-recognition/shared";
import { AppError } from "../utils/app-error.js";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: env.CSV_MAX_FILE_SIZE_MB * 1024 * 1024,
    files: 1,
  },
  fileFilter: (_req, file, callback) => {
    const isCsv =
      file.mimetype === "text/csv" ||
      file.mimetype === "application/vnd.ms-excel" ||
      file.originalname.toLowerCase().endsWith(".csv");

    if (!isCsv) {
      callback(new AppError(400, "Please upload a valid CSV file."));
      return;
    }

    callback(null, true);
  },
});

router.post("/analyze", validateBody(analyzeTextRequestSchema), asyncHandler(analyzeEmotion));
router.post("/batch", upload.single("file"), asyncHandler(uploadEmotionBatch));
router.get("/history", asyncHandler(getEmotionHistory));

export default router;
