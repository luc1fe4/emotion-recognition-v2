"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.batchResultSchema = exports.batchJobSchema = exports.batchStatusSchema = exports.historyResponseSchema = exports.historyItemSchema = exports.analyzeTextResponseSchema = exports.apiErrorSchema = exports.analysisResultSchema = exports.predictionSchema = exports.scoreMapSchema = exports.scoreItemSchema = exports.analyzeTextRequestSchema = exports.analysisSourceSchema = exports.emotionLabelSchema = exports.languageSchema = exports.MAX_TEXT_LENGTH = exports.EMOTION_METADATA = exports.EMOTION_LABELS = exports.LANGUAGE_LABELS = exports.MODEL_NAMES = exports.DEFAULT_LANGUAGE = exports.SUPPORTED_LANGUAGES = void 0;
const zod_1 = require("zod");
exports.SUPPORTED_LANGUAGES = ["vi", "en"];
exports.DEFAULT_LANGUAGE = "vi";
exports.MODEL_NAMES = {
    vi: "tazuneru/baseline-phobert-vsmec-emotion-recognition",
    en: "tazuneru/roberta-emotion-english",
};
exports.LANGUAGE_LABELS = {
    vi: "Vietnamese",
    en: "English",
};
exports.EMOTION_LABELS = [
    "Sadness",
    "Surprise",
    "Disgust",
    "Fear",
    "Anger",
    "Other",
    "Enjoyment",
];
exports.EMOTION_METADATA = {
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
exports.MAX_TEXT_LENGTH = 700;
exports.languageSchema = zod_1.z.enum(exports.SUPPORTED_LANGUAGES);
exports.emotionLabelSchema = zod_1.z.enum(exports.EMOTION_LABELS);
exports.analysisSourceSchema = zod_1.z.enum(["web", "api", "csv"]).default("web");
exports.analyzeTextRequestSchema = zod_1.z.object({
    text: zod_1.z
        .string()
        .trim()
        .min(1, "Text is required.")
        .max(exports.MAX_TEXT_LENGTH, `Text must be ${exports.MAX_TEXT_LENGTH} characters or fewer.`),
    language: exports.languageSchema.default(exports.DEFAULT_LANGUAGE),
    source: exports.analysisSourceSchema.optional(),
});
exports.scoreItemSchema = zod_1.z.object({
    label: zod_1.z.string().min(1),
    displayLabel: zod_1.z.string().min(1),
    displayLabelVi: zod_1.z.string().min(1),
    emoji: zod_1.z.string().min(1),
    score: zod_1.z.number().min(0).max(1),
});
exports.scoreMapSchema = zod_1.z.record(zod_1.z.number().min(0).max(1));
exports.predictionSchema = zod_1.z.object({
    label: zod_1.z.string().min(1),
    predictedLabel: zod_1.z.string().min(1),
    displayLabel: zod_1.z.string().min(1),
    displayLabelVi: zod_1.z.string().min(1),
    emoji: zod_1.z.string().min(1),
    confidence: zod_1.z.number().min(0).max(1),
    scores: exports.scoreMapSchema,
    scoreItems: zod_1.z.array(exports.scoreItemSchema).min(1),
    language: exports.languageSchema,
    modelName: zod_1.z.string().min(1),
    modelVersion: zod_1.z.string().min(1),
});
exports.analysisResultSchema = exports.predictionSchema.extend({
    id: zod_1.z.string().optional(),
    inputText: zod_1.z.string(),
    source: exports.analysisSourceSchema.optional(),
    createdAt: zod_1.z.string().optional(),
});
exports.apiErrorSchema = zod_1.z.object({
    success: zod_1.z.literal(false),
    message: zod_1.z.string(),
});
exports.analyzeTextResponseSchema = zod_1.z.object({
    success: zod_1.z.literal(true),
    data: exports.analysisResultSchema,
});
exports.historyItemSchema = exports.analysisResultSchema.extend({
    id: zod_1.z.string(),
    createdAt: zod_1.z.string(),
});
exports.historyResponseSchema = zod_1.z.object({
    success: zod_1.z.literal(true),
    data: zod_1.z.object({
        items: zod_1.z.array(exports.historyItemSchema),
        nextCursor: zod_1.z.string().nullable(),
    }),
});
exports.batchStatusSchema = zod_1.z.enum([
    "queued",
    "processing",
    "completed",
    "failed",
    "completed_with_errors",
]);
exports.batchJobSchema = zod_1.z.object({
    id: zod_1.z.string(),
    status: exports.batchStatusSchema,
    fileName: zod_1.z.string().nullable(),
    language: exports.languageSchema,
    totalRows: zod_1.z.number().int().nonnegative(),
    processedRows: zod_1.z.number().int().nonnegative(),
    failedRows: zod_1.z.number().int().nonnegative(),
    createdAt: zod_1.z.string(),
    updatedAt: zod_1.z.string(),
});
exports.batchResultSchema = zod_1.z.object({
    id: zod_1.z.string(),
    batchJobId: zod_1.z.string(),
    rowIndex: zod_1.z.number().int().nonnegative(),
    inputText: zod_1.z.string(),
    predictedLabel: zod_1.z.string().nullable(),
    displayLabel: zod_1.z.string().nullable(),
    displayLabelVi: zod_1.z.string().nullable(),
    emoji: zod_1.z.string().nullable(),
    confidence: zod_1.z.number().nullable(),
    scores: exports.scoreMapSchema.nullable(),
    scoreItems: zod_1.z.array(exports.scoreItemSchema).nullable(),
    language: exports.languageSchema,
    modelName: zod_1.z.string().nullable(),
    modelVersion: zod_1.z.string().nullable(),
    errorMessage: zod_1.z.string().nullable(),
    createdAt: zod_1.z.string(),
});
//# sourceMappingURL=index.js.map