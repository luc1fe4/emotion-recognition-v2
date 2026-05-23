import { z } from "zod";

export const SUPPORTED_LANGUAGES = ["vi", "en"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const DEFAULT_LANGUAGE: SupportedLanguage = "vi";

export const MODEL_NAMES: Record<SupportedLanguage, string> = {
  vi: "tazuneru/baseline-phobert-vsmec-emotion-recognition",
  en: "tazuneru/roberta-emotion-english",
};

export const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  vi: "Vietnamese",
  en: "English",
};

export const EMOTION_LABELS = [
  "Sadness",
  "Surprise",
  "Disgust",
  "Fear",
  "Anger",
  "Other",
  "Enjoyment",
] as const;

export type EmotionLabel = (typeof EMOTION_LABELS)[number];

export const EMOTION_METADATA: Record<
  string,
  {
    displayLabel: string;
    displayLabelVi: string;
    emoji: string;
  }
> = {
  Sadness: { displayLabel: "Sadness", displayLabelVi: "Bu\u1ed3n", emoji: "\ud83d\ude22" },
  sadness: { displayLabel: "Sadness", displayLabelVi: "Bu\u1ed3n", emoji: "\ud83d\ude22" },
  Surprise: { displayLabel: "Surprise", displayLabelVi: "Ng\u1ea1c nhi\u00ean", emoji: "\ud83d\ude2e" },
  surprise: { displayLabel: "Surprise", displayLabelVi: "Ng\u1ea1c nhi\u00ean", emoji: "\ud83d\ude2e" },
  Disgust: { displayLabel: "Disgust", displayLabelVi: "Gh\u00ea t\u1edfm", emoji: "\ud83e\udd22" },
  disgust: { displayLabel: "Disgust", displayLabelVi: "Gh\u00ea t\u1edfm", emoji: "\ud83e\udd22" },
  Fear: { displayLabel: "Fear", displayLabelVi: "S\u1ee3 h\u00e3i", emoji: "\ud83d\ude28" },
  fear: { displayLabel: "Fear", displayLabelVi: "S\u1ee3 h\u00e3i", emoji: "\ud83d\ude28" },
  Anger: { displayLabel: "Anger", displayLabelVi: "T\u1ee9c gi\u1eadn", emoji: "\ud83d\ude21" },
  anger: { displayLabel: "Anger", displayLabelVi: "T\u1ee9c gi\u1eadn", emoji: "\ud83d\ude21" },
  Other: { displayLabel: "Other", displayLabelVi: "Kh\u00e1c", emoji: "\ud83d\ude10" },
  other: { displayLabel: "Other", displayLabelVi: "Kh\u00e1c", emoji: "\ud83d\ude10" },
  neutral: { displayLabel: "Neutral", displayLabelVi: "Kh\u00e1c", emoji: "\ud83d\ude10" },
  Enjoyment: { displayLabel: "Enjoyment", displayLabelVi: "Vui v\u1ebb", emoji: "\ud83d\ude0a" },
  joy: { displayLabel: "Joy", displayLabelVi: "Vui v\u1ebb", emoji: "\ud83d\ude0a" },
  love: { displayLabel: "Love", displayLabelVi: "Y\u00eau th\u00edch", emoji: "\u2764\ufe0f" },
};

export const MAX_TEXT_LENGTH = 700;

export const languageSchema = z.enum(SUPPORTED_LANGUAGES);

export const emotionLabelSchema = z.enum(EMOTION_LABELS);

export const analysisSourceSchema = z.enum(["web", "api", "csv"]).default("web");

export const analyzeTextRequestSchema = z.object({
  text: z
    .string()
    .trim()
    .min(1, "Text is required.")
    .max(MAX_TEXT_LENGTH, `Text must be ${MAX_TEXT_LENGTH} characters or fewer.`),
  language: languageSchema.default(DEFAULT_LANGUAGE),
  source: analysisSourceSchema.optional(),
});

export const scoreItemSchema = z.object({
  label: z.string().min(1),
  displayLabel: z.string().min(1),
  displayLabelVi: z.string().min(1),
  emoji: z.string().min(1),
  score: z.number().min(0).max(1),
});

export const scoreMapSchema = z.record(z.number().min(0).max(1));

export const predictionSchema = z.object({
  label: z.string().min(1),
  predictedLabel: z.string().min(1),
  displayLabel: z.string().min(1),
  displayLabelVi: z.string().min(1),
  emoji: z.string().min(1),
  confidence: z.number().min(0).max(1),
  scores: scoreMapSchema,
  scoreItems: z.array(scoreItemSchema).min(1),
  language: languageSchema,
  modelName: z.string().min(1),
  modelVersion: z.string().min(1),
});

export const analysisResultSchema = predictionSchema.extend({
  id: z.string().optional(),
  inputText: z.string(),
  source: analysisSourceSchema.optional(),
  createdAt: z.string().optional(),
});

export const apiErrorSchema = z.object({
  success: z.literal(false),
  message: z.string(),
});

export const analyzeTextResponseSchema = z.object({
  success: z.literal(true),
  data: analysisResultSchema,
});

export const historyItemSchema = analysisResultSchema.extend({
  id: z.string(),
  createdAt: z.string(),
});

export const historyResponseSchema = z.object({
  success: z.literal(true),
  data: z.object({
    items: z.array(historyItemSchema),
    nextCursor: z.string().nullable(),
  }),
});

export const batchStatusSchema = z.enum([
  "queued",
  "processing",
  "completed",
  "failed",
  "completed_with_errors",
]);

export type BatchStatus = z.infer<typeof batchStatusSchema>;

export const batchJobSchema = z.object({
  id: z.string(),
  status: batchStatusSchema,
  fileName: z.string().nullable(),
  language: languageSchema,
  totalRows: z.number().int().nonnegative(),
  processedRows: z.number().int().nonnegative(),
  failedRows: z.number().int().nonnegative(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const batchResultSchema = z.object({
  id: z.string(),
  batchJobId: z.string(),
  rowIndex: z.number().int().nonnegative(),
  inputText: z.string(),
  predictedLabel: z.string().nullable(),
  displayLabel: z.string().nullable(),
  displayLabelVi: z.string().nullable(),
  emoji: z.string().nullable(),
  confidence: z.number().nullable(),
  scores: scoreMapSchema.nullable(),
  scoreItems: z.array(scoreItemSchema).nullable(),
  language: languageSchema,
  modelName: z.string().nullable(),
  modelVersion: z.string().nullable(),
  errorMessage: z.string().nullable(),
  createdAt: z.string(),
});

export type AnalyzeTextRequest = z.infer<typeof analyzeTextRequestSchema>;
export type ScoreItem = z.infer<typeof scoreItemSchema>;
export type Prediction = z.infer<typeof predictionSchema>;
export type AnalysisResult = z.infer<typeof analysisResultSchema>;
export type HistoryItem = z.infer<typeof historyItemSchema>;
export type BatchJob = z.infer<typeof batchJobSchema>;
export type BatchResult = z.infer<typeof batchResultSchema>;
