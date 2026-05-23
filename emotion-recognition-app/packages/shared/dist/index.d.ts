import { z } from "zod";
export declare const EMOTION_LABELS: readonly ["Sadness", "Surprise", "Disgust", "Fear", "Anger", "Other", "Enjoyment"];
export type EmotionLabel = (typeof EMOTION_LABELS)[number];
export declare const EMOTION_METADATA: Record<EmotionLabel, {
    displayLabelVi: string;
    emoji: string;
}>;
export declare const MAX_TEXT_LENGTH = 700;
export declare const emotionLabelSchema: z.ZodEnum<["Sadness", "Surprise", "Disgust", "Fear", "Anger", "Other", "Enjoyment"]>;
export declare const analysisSourceSchema: z.ZodDefault<z.ZodEnum<["web", "api", "csv"]>>;
export declare const analyzeTextRequestSchema: z.ZodObject<{
    text: z.ZodString;
    source: z.ZodOptional<z.ZodDefault<z.ZodEnum<["web", "api", "csv"]>>>;
}, "strip", z.ZodTypeAny, {
    text: string;
    source?: "web" | "api" | "csv" | undefined;
}, {
    text: string;
    source?: "web" | "api" | "csv" | undefined;
}>;
export declare const scoreItemSchema: z.ZodObject<{
    label: z.ZodUnion<[z.ZodEnum<["Sadness", "Surprise", "Disgust", "Fear", "Anger", "Other", "Enjoyment"]>, z.ZodString]>;
    displayLabelVi: z.ZodString;
    emoji: z.ZodString;
    score: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    label: string;
    displayLabelVi: string;
    emoji: string;
    score: number;
}, {
    label: string;
    displayLabelVi: string;
    emoji: string;
    score: number;
}>;
export declare const predictionSchema: z.ZodObject<{
    predictedLabel: z.ZodUnion<[z.ZodEnum<["Sadness", "Surprise", "Disgust", "Fear", "Anger", "Other", "Enjoyment"]>, z.ZodString]>;
    displayLabelVi: z.ZodString;
    emoji: z.ZodString;
    confidence: z.ZodNumber;
    scores: z.ZodArray<z.ZodObject<{
        label: z.ZodUnion<[z.ZodEnum<["Sadness", "Surprise", "Disgust", "Fear", "Anger", "Other", "Enjoyment"]>, z.ZodString]>;
        displayLabelVi: z.ZodString;
        emoji: z.ZodString;
        score: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        label: string;
        displayLabelVi: string;
        emoji: string;
        score: number;
    }, {
        label: string;
        displayLabelVi: string;
        emoji: string;
        score: number;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    displayLabelVi: string;
    emoji: string;
    predictedLabel: string;
    confidence: number;
    scores: {
        label: string;
        displayLabelVi: string;
        emoji: string;
        score: number;
    }[];
}, {
    displayLabelVi: string;
    emoji: string;
    predictedLabel: string;
    confidence: number;
    scores: {
        label: string;
        displayLabelVi: string;
        emoji: string;
        score: number;
    }[];
}>;
export declare const analysisResultSchema: z.ZodObject<{
    predictedLabel: z.ZodUnion<[z.ZodEnum<["Sadness", "Surprise", "Disgust", "Fear", "Anger", "Other", "Enjoyment"]>, z.ZodString]>;
    displayLabelVi: z.ZodString;
    emoji: z.ZodString;
    confidence: z.ZodNumber;
    scores: z.ZodArray<z.ZodObject<{
        label: z.ZodUnion<[z.ZodEnum<["Sadness", "Surprise", "Disgust", "Fear", "Anger", "Other", "Enjoyment"]>, z.ZodString]>;
        displayLabelVi: z.ZodString;
        emoji: z.ZodString;
        score: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        label: string;
        displayLabelVi: string;
        emoji: string;
        score: number;
    }, {
        label: string;
        displayLabelVi: string;
        emoji: string;
        score: number;
    }>, "many">;
} & {
    id: z.ZodOptional<z.ZodString>;
    inputText: z.ZodString;
    source: z.ZodOptional<z.ZodDefault<z.ZodEnum<["web", "api", "csv"]>>>;
    createdAt: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    displayLabelVi: string;
    emoji: string;
    predictedLabel: string;
    confidence: number;
    scores: {
        label: string;
        displayLabelVi: string;
        emoji: string;
        score: number;
    }[];
    inputText: string;
    source?: "web" | "api" | "csv" | undefined;
    id?: string | undefined;
    createdAt?: string | undefined;
}, {
    displayLabelVi: string;
    emoji: string;
    predictedLabel: string;
    confidence: number;
    scores: {
        label: string;
        displayLabelVi: string;
        emoji: string;
        score: number;
    }[];
    inputText: string;
    source?: "web" | "api" | "csv" | undefined;
    id?: string | undefined;
    createdAt?: string | undefined;
}>;
export declare const apiErrorSchema: z.ZodObject<{
    success: z.ZodLiteral<false>;
    message: z.ZodString;
}, "strip", z.ZodTypeAny, {
    message: string;
    success: false;
}, {
    message: string;
    success: false;
}>;
export declare const analyzeTextResponseSchema: z.ZodObject<{
    success: z.ZodLiteral<true>;
    data: z.ZodObject<{
        predictedLabel: z.ZodUnion<[z.ZodEnum<["Sadness", "Surprise", "Disgust", "Fear", "Anger", "Other", "Enjoyment"]>, z.ZodString]>;
        displayLabelVi: z.ZodString;
        emoji: z.ZodString;
        confidence: z.ZodNumber;
        scores: z.ZodArray<z.ZodObject<{
            label: z.ZodUnion<[z.ZodEnum<["Sadness", "Surprise", "Disgust", "Fear", "Anger", "Other", "Enjoyment"]>, z.ZodString]>;
            displayLabelVi: z.ZodString;
            emoji: z.ZodString;
            score: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            label: string;
            displayLabelVi: string;
            emoji: string;
            score: number;
        }, {
            label: string;
            displayLabelVi: string;
            emoji: string;
            score: number;
        }>, "many">;
    } & {
        id: z.ZodOptional<z.ZodString>;
        inputText: z.ZodString;
        source: z.ZodOptional<z.ZodDefault<z.ZodEnum<["web", "api", "csv"]>>>;
        createdAt: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        displayLabelVi: string;
        emoji: string;
        predictedLabel: string;
        confidence: number;
        scores: {
            label: string;
            displayLabelVi: string;
            emoji: string;
            score: number;
        }[];
        inputText: string;
        source?: "web" | "api" | "csv" | undefined;
        id?: string | undefined;
        createdAt?: string | undefined;
    }, {
        displayLabelVi: string;
        emoji: string;
        predictedLabel: string;
        confidence: number;
        scores: {
            label: string;
            displayLabelVi: string;
            emoji: string;
            score: number;
        }[];
        inputText: string;
        source?: "web" | "api" | "csv" | undefined;
        id?: string | undefined;
        createdAt?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    success: true;
    data: {
        displayLabelVi: string;
        emoji: string;
        predictedLabel: string;
        confidence: number;
        scores: {
            label: string;
            displayLabelVi: string;
            emoji: string;
            score: number;
        }[];
        inputText: string;
        source?: "web" | "api" | "csv" | undefined;
        id?: string | undefined;
        createdAt?: string | undefined;
    };
}, {
    success: true;
    data: {
        displayLabelVi: string;
        emoji: string;
        predictedLabel: string;
        confidence: number;
        scores: {
            label: string;
            displayLabelVi: string;
            emoji: string;
            score: number;
        }[];
        inputText: string;
        source?: "web" | "api" | "csv" | undefined;
        id?: string | undefined;
        createdAt?: string | undefined;
    };
}>;
export declare const historyItemSchema: z.ZodObject<{
    predictedLabel: z.ZodUnion<[z.ZodEnum<["Sadness", "Surprise", "Disgust", "Fear", "Anger", "Other", "Enjoyment"]>, z.ZodString]>;
    displayLabelVi: z.ZodString;
    emoji: z.ZodString;
    confidence: z.ZodNumber;
    scores: z.ZodArray<z.ZodObject<{
        label: z.ZodUnion<[z.ZodEnum<["Sadness", "Surprise", "Disgust", "Fear", "Anger", "Other", "Enjoyment"]>, z.ZodString]>;
        displayLabelVi: z.ZodString;
        emoji: z.ZodString;
        score: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        label: string;
        displayLabelVi: string;
        emoji: string;
        score: number;
    }, {
        label: string;
        displayLabelVi: string;
        emoji: string;
        score: number;
    }>, "many">;
    inputText: z.ZodString;
    source: z.ZodOptional<z.ZodDefault<z.ZodEnum<["web", "api", "csv"]>>>;
} & {
    id: z.ZodString;
    createdAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    displayLabelVi: string;
    emoji: string;
    predictedLabel: string;
    confidence: number;
    scores: {
        label: string;
        displayLabelVi: string;
        emoji: string;
        score: number;
    }[];
    id: string;
    inputText: string;
    createdAt: string;
    source?: "web" | "api" | "csv" | undefined;
}, {
    displayLabelVi: string;
    emoji: string;
    predictedLabel: string;
    confidence: number;
    scores: {
        label: string;
        displayLabelVi: string;
        emoji: string;
        score: number;
    }[];
    id: string;
    inputText: string;
    createdAt: string;
    source?: "web" | "api" | "csv" | undefined;
}>;
export declare const historyResponseSchema: z.ZodObject<{
    success: z.ZodLiteral<true>;
    data: z.ZodObject<{
        items: z.ZodArray<z.ZodObject<{
            predictedLabel: z.ZodUnion<[z.ZodEnum<["Sadness", "Surprise", "Disgust", "Fear", "Anger", "Other", "Enjoyment"]>, z.ZodString]>;
            displayLabelVi: z.ZodString;
            emoji: z.ZodString;
            confidence: z.ZodNumber;
            scores: z.ZodArray<z.ZodObject<{
                label: z.ZodUnion<[z.ZodEnum<["Sadness", "Surprise", "Disgust", "Fear", "Anger", "Other", "Enjoyment"]>, z.ZodString]>;
                displayLabelVi: z.ZodString;
                emoji: z.ZodString;
                score: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                label: string;
                displayLabelVi: string;
                emoji: string;
                score: number;
            }, {
                label: string;
                displayLabelVi: string;
                emoji: string;
                score: number;
            }>, "many">;
            inputText: z.ZodString;
            source: z.ZodOptional<z.ZodDefault<z.ZodEnum<["web", "api", "csv"]>>>;
        } & {
            id: z.ZodString;
            createdAt: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            displayLabelVi: string;
            emoji: string;
            predictedLabel: string;
            confidence: number;
            scores: {
                label: string;
                displayLabelVi: string;
                emoji: string;
                score: number;
            }[];
            id: string;
            inputText: string;
            createdAt: string;
            source?: "web" | "api" | "csv" | undefined;
        }, {
            displayLabelVi: string;
            emoji: string;
            predictedLabel: string;
            confidence: number;
            scores: {
                label: string;
                displayLabelVi: string;
                emoji: string;
                score: number;
            }[];
            id: string;
            inputText: string;
            createdAt: string;
            source?: "web" | "api" | "csv" | undefined;
        }>, "many">;
        nextCursor: z.ZodNullable<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        items: {
            displayLabelVi: string;
            emoji: string;
            predictedLabel: string;
            confidence: number;
            scores: {
                label: string;
                displayLabelVi: string;
                emoji: string;
                score: number;
            }[];
            id: string;
            inputText: string;
            createdAt: string;
            source?: "web" | "api" | "csv" | undefined;
        }[];
        nextCursor: string | null;
    }, {
        items: {
            displayLabelVi: string;
            emoji: string;
            predictedLabel: string;
            confidence: number;
            scores: {
                label: string;
                displayLabelVi: string;
                emoji: string;
                score: number;
            }[];
            id: string;
            inputText: string;
            createdAt: string;
            source?: "web" | "api" | "csv" | undefined;
        }[];
        nextCursor: string | null;
    }>;
}, "strip", z.ZodTypeAny, {
    success: true;
    data: {
        items: {
            displayLabelVi: string;
            emoji: string;
            predictedLabel: string;
            confidence: number;
            scores: {
                label: string;
                displayLabelVi: string;
                emoji: string;
                score: number;
            }[];
            id: string;
            inputText: string;
            createdAt: string;
            source?: "web" | "api" | "csv" | undefined;
        }[];
        nextCursor: string | null;
    };
}, {
    success: true;
    data: {
        items: {
            displayLabelVi: string;
            emoji: string;
            predictedLabel: string;
            confidence: number;
            scores: {
                label: string;
                displayLabelVi: string;
                emoji: string;
                score: number;
            }[];
            id: string;
            inputText: string;
            createdAt: string;
            source?: "web" | "api" | "csv" | undefined;
        }[];
        nextCursor: string | null;
    };
}>;
export declare const batchStatusSchema: z.ZodEnum<["queued", "processing", "completed", "failed", "completed_with_errors"]>;
export type BatchStatus = z.infer<typeof batchStatusSchema>;
export declare const batchJobSchema: z.ZodObject<{
    id: z.ZodString;
    status: z.ZodEnum<["queued", "processing", "completed", "failed", "completed_with_errors"]>;
    fileName: z.ZodNullable<z.ZodString>;
    totalRows: z.ZodNumber;
    processedRows: z.ZodNumber;
    failedRows: z.ZodNumber;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    status: "queued" | "processing" | "completed" | "failed" | "completed_with_errors";
    id: string;
    createdAt: string;
    fileName: string | null;
    totalRows: number;
    processedRows: number;
    failedRows: number;
    updatedAt: string;
}, {
    status: "queued" | "processing" | "completed" | "failed" | "completed_with_errors";
    id: string;
    createdAt: string;
    fileName: string | null;
    totalRows: number;
    processedRows: number;
    failedRows: number;
    updatedAt: string;
}>;
export declare const batchResultSchema: z.ZodObject<{
    id: z.ZodString;
    batchJobId: z.ZodString;
    rowIndex: z.ZodNumber;
    inputText: z.ZodString;
    predictedLabel: z.ZodNullable<z.ZodString>;
    displayLabelVi: z.ZodNullable<z.ZodString>;
    emoji: z.ZodNullable<z.ZodString>;
    confidence: z.ZodNullable<z.ZodNumber>;
    scores: z.ZodNullable<z.ZodArray<z.ZodObject<{
        label: z.ZodUnion<[z.ZodEnum<["Sadness", "Surprise", "Disgust", "Fear", "Anger", "Other", "Enjoyment"]>, z.ZodString]>;
        displayLabelVi: z.ZodString;
        emoji: z.ZodString;
        score: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        label: string;
        displayLabelVi: string;
        emoji: string;
        score: number;
    }, {
        label: string;
        displayLabelVi: string;
        emoji: string;
        score: number;
    }>, "many">>;
    errorMessage: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    displayLabelVi: string | null;
    emoji: string | null;
    predictedLabel: string | null;
    confidence: number | null;
    scores: {
        label: string;
        displayLabelVi: string;
        emoji: string;
        score: number;
    }[] | null;
    id: string;
    inputText: string;
    createdAt: string;
    batchJobId: string;
    rowIndex: number;
    errorMessage: string | null;
}, {
    displayLabelVi: string | null;
    emoji: string | null;
    predictedLabel: string | null;
    confidence: number | null;
    scores: {
        label: string;
        displayLabelVi: string;
        emoji: string;
        score: number;
    }[] | null;
    id: string;
    inputText: string;
    createdAt: string;
    batchJobId: string;
    rowIndex: number;
    errorMessage: string | null;
}>;
export type AnalyzeTextRequest = z.infer<typeof analyzeTextRequestSchema>;
export type ScoreItem = z.infer<typeof scoreItemSchema>;
export type Prediction = z.infer<typeof predictionSchema>;
export type AnalysisResult = z.infer<typeof analysisResultSchema>;
export type HistoryItem = z.infer<typeof historyItemSchema>;
export type BatchJob = z.infer<typeof batchJobSchema>;
export type BatchResult = z.infer<typeof batchResultSchema>;
//# sourceMappingURL=index.d.ts.map