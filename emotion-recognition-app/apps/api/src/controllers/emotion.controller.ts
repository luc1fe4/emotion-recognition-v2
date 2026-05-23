import { DEFAULT_LANGUAGE, analyzeTextRequestSchema, languageSchema } from "@emotion-recognition/shared";
import type { RequestHandler } from "express";

import { createBatchFromCsv } from "../services/batch.service.js";
import { analyzeText, listHistory } from "../services/emotion.service.js";
import { AppError } from "../utils/app-error.js";

export const analyzeEmotion: RequestHandler = async (req, res) => {
  const payload = analyzeTextRequestSchema.parse(req.body);
  const result = await analyzeText(payload);
  res.json({ success: true, data: result });
};

export const getEmotionHistory: RequestHandler = async (req, res) => {
  const limit = req.query.limit ? Number(req.query.limit) : 20;
  const cursor = typeof req.query.cursor === "string" ? req.query.cursor : undefined;
  const result = await listHistory(Number.isFinite(limit) ? limit : 20, cursor);
  res.json({ success: true, data: result });
};

export const uploadEmotionBatch: RequestHandler = async (req, res) => {
  if (!req.file) {
    throw new AppError(400, "Please upload a CSV file.");
  }

  const language = languageSchema.parse(
    typeof req.body.language === "string" && req.body.language.trim()
      ? req.body.language.trim().toLowerCase()
      : DEFAULT_LANGUAGE,
  );
  const result = await createBatchFromCsv(req.file, language);
  res.status(202).json({ success: true, data: result });
};
