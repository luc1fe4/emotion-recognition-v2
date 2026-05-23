import { z } from "zod";
export const EMOTION_LABELS = [
    "Sadness",
    "Surprise",
    "Disgust",
    "Fear",
    "Anger",
    "Other",
    "Enjoyment",
];
export const EMOTION_METADATA = {
    Sadness: { displayLabelVi: "Buồn", emoji: "😢" },
    Surprise: { displayLabelVi: "Ngạc nhiên", emoji: "😮" },
    Disgust: { displayLabelVi: "Ghê tởm", emoji: "🤢" },
    Fear: { displayLabelVi: "Sợ hãi", emoji: "😨" },
    Anger: { displayLabelVi: "Tức giận", emoji: "😡" },
    Other: { displayLabelVi: "Khác", emoji: "😐" },
    Enjoyment: { displayLabelVi: "Vui vẻ", emoji: "😊" },
};
export const MAX_TEXT_LENGTH = 700;
export const emotionLabelSchema = z.enum(EMOTION_LABELS);
export const analysisSourceSchema = z.enum(["web", "api", "csv"]).default("web");
export const analyzeTextRequestSchema = z.object({
    text: z
        .string()
        .trim()
        .min(1, "Text is required.")
        .max(MAX_TEXT_LENGTH, `Text must be ${MAX_TEXT_LENGTH} characters or fewer.`),
    source: analysisSourceSchema.optional(),
});
export const scoreItemSchema = z.object({
    label: emotionLabelSchema.or(z.string().min(1)),
    displayLabelVi: z.string().min(1),
    emoji: z.string().min(1),
    score: z.number().min(0).max(1),
});
export const predictionSchema = z.object({
    predictedLabel: emotionLabelSchema.or(z.string().min(1)),
    displayLabelVi: z.string().min(1),
    emoji: z.string().min(1),
    confidence: z.number().min(0).max(1),
    scores: z.array(scoreItemSchema).min(1),
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
export const batchJobSchema = z.object({
    id: z.string(),
    status: batchStatusSchema,
    fileName: z.string().nullable(),
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
    displayLabelVi: z.string().nullable(),
    emoji: z.string().nullable(),
    confidence: z.number().nullable(),
    scores: z.array(scoreItemSchema).nullable(),
    errorMessage: z.string().nullable(),
    createdAt: z.string(),
});
//# sourceMappingURL=index.js.map