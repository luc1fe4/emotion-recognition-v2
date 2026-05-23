"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.batchResultSchema = exports.batchJobSchema = exports.batchStatusSchema = exports.historyResponseSchema = exports.historyItemSchema = exports.analyzeTextResponseSchema = exports.apiErrorSchema = exports.analysisResultSchema = exports.predictionSchema = exports.scoreItemSchema = exports.analyzeTextRequestSchema = exports.analysisSourceSchema = exports.emotionLabelSchema = exports.MAX_TEXT_LENGTH = exports.EMOTION_METADATA = exports.EMOTION_LABELS = void 0;
const zod_1 = require("zod");
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
    Sadness: { displayLabelVi: "Buồn", emoji: "😢" },
    Surprise: { displayLabelVi: "Ngạc nhiên", emoji: "😮" },
    Disgust: { displayLabelVi: "Ghê tởm", emoji: "🤢" },
    Fear: { displayLabelVi: "Sợ hãi", emoji: "😨" },
    Anger: { displayLabelVi: "Tức giận", emoji: "😡" },
    Other: { displayLabelVi: "Khác", emoji: "😐" },
    Enjoyment: { displayLabelVi: "Vui vẻ", emoji: "😊" },
};
exports.MAX_TEXT_LENGTH = 700;
exports.emotionLabelSchema = zod_1.z.enum(exports.EMOTION_LABELS);
exports.analysisSourceSchema = zod_1.z.enum(["web", "api", "csv"]).default("web");
exports.analyzeTextRequestSchema = zod_1.z.object({
    text: zod_1.z
        .string()
        .trim()
        .min(1, "Text is required.")
        .max(exports.MAX_TEXT_LENGTH, `Text must be ${exports.MAX_TEXT_LENGTH} characters or fewer.`),
    source: exports.analysisSourceSchema.optional(),
});
exports.scoreItemSchema = zod_1.z.object({
    label: exports.emotionLabelSchema.or(zod_1.z.string().min(1)),
    displayLabelVi: zod_1.z.string().min(1),
    emoji: zod_1.z.string().min(1),
    score: zod_1.z.number().min(0).max(1),
});
exports.predictionSchema = zod_1.z.object({
    predictedLabel: exports.emotionLabelSchema.or(zod_1.z.string().min(1)),
    displayLabelVi: zod_1.z.string().min(1),
    emoji: zod_1.z.string().min(1),
    confidence: zod_1.z.number().min(0).max(1),
    scores: zod_1.z.array(exports.scoreItemSchema).min(1),
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
    displayLabelVi: zod_1.z.string().nullable(),
    emoji: zod_1.z.string().nullable(),
    confidence: zod_1.z.number().nullable(),
    scores: zod_1.z.array(exports.scoreItemSchema).nullable(),
    errorMessage: zod_1.z.string().nullable(),
    createdAt: zod_1.z.string(),
});
//# sourceMappingURL=index.js.map