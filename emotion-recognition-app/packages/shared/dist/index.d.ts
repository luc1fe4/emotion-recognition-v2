import { z } from "zod";
export declare const SUPPORTED_LANGUAGES: readonly ["vi", "en"];
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];
export declare const DEFAULT_LANGUAGE: SupportedLanguage;
export declare const MODEL_NAMES: Record<SupportedLanguage, string>;
export declare const LANGUAGE_LABELS: Record<SupportedLanguage, string>;
export declare const EMOTION_LABELS: readonly ["Sadness", "Surprise", "Disgust", "Fear", "Anger", "Other", "Enjoyment"];
export type EmotionLabel = (typeof EMOTION_LABELS)[number];
export declare const EMOTION_METADATA: Record<string, {
    displayLabel: string;
    displayLabelVi: string;
    emoji: string;
}>;
export declare const MAX_TEXT_LENGTH = 700;
export declare const languageSchema: z.ZodEnum<["vi", "en"]>;
export declare const emotionLabelSchema: z.ZodEnum<["Sadness", "Surprise", "Disgust", "Fear", "Anger", "Other", "Enjoyment"]>;
export declare const analysisSourceSchema: z.ZodDefault<z.ZodEnum<["web", "api", "csv"]>>;
export declare const analyzeTextRequestSchema: z.ZodObject<{
    text: z.ZodString;
    language: z.ZodDefault<z.ZodEnum<["vi", "en"]>>;
    source: z.ZodOptional<z.ZodDefault<z.ZodEnum<["web", "api", "csv"]>>>;
}, "strip", z.ZodTypeAny, {
    text: string;
    language: "vi" | "en";
    source?: "web" | "api" | "csv" | undefined;
}, {
    text: string;
    language?: "vi" | "en" | undefined;
    source?: "web" | "api" | "csv" | undefined;
}>;
export declare const scoreItemSchema: z.ZodObject<{
    label: z.ZodString;
    displayLabel: z.ZodString;
    displayLabelVi: z.ZodString;
    emoji: z.ZodString;
    score: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    label: string;
    displayLabel: string;
    displayLabelVi: string;
    emoji: string;
    score: number;
}, {
    label: string;
    displayLabel: string;
    displayLabelVi: string;
    emoji: string;
    score: number;
}>;
export declare const scoreMapSchema: z.ZodRecord<z.ZodString, z.ZodNumber>;
export declare const predictionSchema: z.ZodObject<{
    label: z.ZodString;
    predictedLabel: z.ZodString;
    displayLabel: z.ZodString;
    displayLabelVi: z.ZodString;
    emoji: z.ZodString;
    confidence: z.ZodNumber;
    scores: z.ZodRecord<z.ZodString, z.ZodNumber>;
    scoreItems: z.ZodArray<z.ZodObject<{
        label: z.ZodString;
        displayLabel: z.ZodString;
        displayLabelVi: z.ZodString;
        emoji: z.ZodString;
        score: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        label: string;
        displayLabel: string;
        displayLabelVi: string;
        emoji: string;
        score: number;
    }, {
        label: string;
        displayLabel: string;
        displayLabelVi: string;
        emoji: string;
        score: number;
    }>, "many">;
    language: z.ZodEnum<["vi", "en"]>;
    modelName: z.ZodString;
    modelVersion: z.ZodString;
}, "strip", z.ZodTypeAny, {
    language: "vi" | "en";
    label: string;
    displayLabel: string;
    displayLabelVi: string;
    emoji: string;
    predictedLabel: string;
    confidence: number;
    scores: Record<string, number>;
    scoreItems: {
        label: string;
        displayLabel: string;
        displayLabelVi: string;
        emoji: string;
        score: number;
    }[];
    modelName: string;
    modelVersion: string;
}, {
    language: "vi" | "en";
    label: string;
    displayLabel: string;
    displayLabelVi: string;
    emoji: string;
    predictedLabel: string;
    confidence: number;
    scores: Record<string, number>;
    scoreItems: {
        label: string;
        displayLabel: string;
        displayLabelVi: string;
        emoji: string;
        score: number;
    }[];
    modelName: string;
    modelVersion: string;
}>;
export declare const analysisResultSchema: z.ZodObject<{
    label: z.ZodString;
    predictedLabel: z.ZodString;
    displayLabel: z.ZodString;
    displayLabelVi: z.ZodString;
    emoji: z.ZodString;
    confidence: z.ZodNumber;
    scores: z.ZodRecord<z.ZodString, z.ZodNumber>;
    scoreItems: z.ZodArray<z.ZodObject<{
        label: z.ZodString;
        displayLabel: z.ZodString;
        displayLabelVi: z.ZodString;
        emoji: z.ZodString;
        score: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        label: string;
        displayLabel: string;
        displayLabelVi: string;
        emoji: string;
        score: number;
    }, {
        label: string;
        displayLabel: string;
        displayLabelVi: string;
        emoji: string;
        score: number;
    }>, "many">;
    language: z.ZodEnum<["vi", "en"]>;
    modelName: z.ZodString;
    modelVersion: z.ZodString;
} & {
    id: z.ZodOptional<z.ZodString>;
    inputText: z.ZodString;
    source: z.ZodOptional<z.ZodDefault<z.ZodEnum<["web", "api", "csv"]>>>;
    createdAt: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    language: "vi" | "en";
    label: string;
    displayLabel: string;
    displayLabelVi: string;
    emoji: string;
    predictedLabel: string;
    confidence: number;
    scores: Record<string, number>;
    scoreItems: {
        label: string;
        displayLabel: string;
        displayLabelVi: string;
        emoji: string;
        score: number;
    }[];
    modelName: string;
    modelVersion: string;
    inputText: string;
    source?: "web" | "api" | "csv" | undefined;
    id?: string | undefined;
    createdAt?: string | undefined;
}, {
    language: "vi" | "en";
    label: string;
    displayLabel: string;
    displayLabelVi: string;
    emoji: string;
    predictedLabel: string;
    confidence: number;
    scores: Record<string, number>;
    scoreItems: {
        label: string;
        displayLabel: string;
        displayLabelVi: string;
        emoji: string;
        score: number;
    }[];
    modelName: string;
    modelVersion: string;
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
        label: z.ZodString;
        predictedLabel: z.ZodString;
        displayLabel: z.ZodString;
        displayLabelVi: z.ZodString;
        emoji: z.ZodString;
        confidence: z.ZodNumber;
        scores: z.ZodRecord<z.ZodString, z.ZodNumber>;
        scoreItems: z.ZodArray<z.ZodObject<{
            label: z.ZodString;
            displayLabel: z.ZodString;
            displayLabelVi: z.ZodString;
            emoji: z.ZodString;
            score: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            label: string;
            displayLabel: string;
            displayLabelVi: string;
            emoji: string;
            score: number;
        }, {
            label: string;
            displayLabel: string;
            displayLabelVi: string;
            emoji: string;
            score: number;
        }>, "many">;
        language: z.ZodEnum<["vi", "en"]>;
        modelName: z.ZodString;
        modelVersion: z.ZodString;
    } & {
        id: z.ZodOptional<z.ZodString>;
        inputText: z.ZodString;
        source: z.ZodOptional<z.ZodDefault<z.ZodEnum<["web", "api", "csv"]>>>;
        createdAt: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        language: "vi" | "en";
        label: string;
        displayLabel: string;
        displayLabelVi: string;
        emoji: string;
        predictedLabel: string;
        confidence: number;
        scores: Record<string, number>;
        scoreItems: {
            label: string;
            displayLabel: string;
            displayLabelVi: string;
            emoji: string;
            score: number;
        }[];
        modelName: string;
        modelVersion: string;
        inputText: string;
        source?: "web" | "api" | "csv" | undefined;
        id?: string | undefined;
        createdAt?: string | undefined;
    }, {
        language: "vi" | "en";
        label: string;
        displayLabel: string;
        displayLabelVi: string;
        emoji: string;
        predictedLabel: string;
        confidence: number;
        scores: Record<string, number>;
        scoreItems: {
            label: string;
            displayLabel: string;
            displayLabelVi: string;
            emoji: string;
            score: number;
        }[];
        modelName: string;
        modelVersion: string;
        inputText: string;
        source?: "web" | "api" | "csv" | undefined;
        id?: string | undefined;
        createdAt?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    success: true;
    data: {
        language: "vi" | "en";
        label: string;
        displayLabel: string;
        displayLabelVi: string;
        emoji: string;
        predictedLabel: string;
        confidence: number;
        scores: Record<string, number>;
        scoreItems: {
            label: string;
            displayLabel: string;
            displayLabelVi: string;
            emoji: string;
            score: number;
        }[];
        modelName: string;
        modelVersion: string;
        inputText: string;
        source?: "web" | "api" | "csv" | undefined;
        id?: string | undefined;
        createdAt?: string | undefined;
    };
}, {
    success: true;
    data: {
        language: "vi" | "en";
        label: string;
        displayLabel: string;
        displayLabelVi: string;
        emoji: string;
        predictedLabel: string;
        confidence: number;
        scores: Record<string, number>;
        scoreItems: {
            label: string;
            displayLabel: string;
            displayLabelVi: string;
            emoji: string;
            score: number;
        }[];
        modelName: string;
        modelVersion: string;
        inputText: string;
        source?: "web" | "api" | "csv" | undefined;
        id?: string | undefined;
        createdAt?: string | undefined;
    };
}>;
export declare const historyItemSchema: z.ZodObject<{
    label: z.ZodString;
    predictedLabel: z.ZodString;
    displayLabel: z.ZodString;
    displayLabelVi: z.ZodString;
    emoji: z.ZodString;
    confidence: z.ZodNumber;
    scores: z.ZodRecord<z.ZodString, z.ZodNumber>;
    scoreItems: z.ZodArray<z.ZodObject<{
        label: z.ZodString;
        displayLabel: z.ZodString;
        displayLabelVi: z.ZodString;
        emoji: z.ZodString;
        score: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        label: string;
        displayLabel: string;
        displayLabelVi: string;
        emoji: string;
        score: number;
    }, {
        label: string;
        displayLabel: string;
        displayLabelVi: string;
        emoji: string;
        score: number;
    }>, "many">;
    language: z.ZodEnum<["vi", "en"]>;
    modelName: z.ZodString;
    modelVersion: z.ZodString;
    inputText: z.ZodString;
    source: z.ZodOptional<z.ZodDefault<z.ZodEnum<["web", "api", "csv"]>>>;
} & {
    id: z.ZodString;
    createdAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    language: "vi" | "en";
    label: string;
    displayLabel: string;
    displayLabelVi: string;
    emoji: string;
    predictedLabel: string;
    confidence: number;
    scores: Record<string, number>;
    scoreItems: {
        label: string;
        displayLabel: string;
        displayLabelVi: string;
        emoji: string;
        score: number;
    }[];
    modelName: string;
    modelVersion: string;
    id: string;
    inputText: string;
    createdAt: string;
    source?: "web" | "api" | "csv" | undefined;
}, {
    language: "vi" | "en";
    label: string;
    displayLabel: string;
    displayLabelVi: string;
    emoji: string;
    predictedLabel: string;
    confidence: number;
    scores: Record<string, number>;
    scoreItems: {
        label: string;
        displayLabel: string;
        displayLabelVi: string;
        emoji: string;
        score: number;
    }[];
    modelName: string;
    modelVersion: string;
    id: string;
    inputText: string;
    createdAt: string;
    source?: "web" | "api" | "csv" | undefined;
}>;
export declare const historyResponseSchema: z.ZodObject<{
    success: z.ZodLiteral<true>;
    data: z.ZodObject<{
        items: z.ZodArray<z.ZodObject<{
            label: z.ZodString;
            predictedLabel: z.ZodString;
            displayLabel: z.ZodString;
            displayLabelVi: z.ZodString;
            emoji: z.ZodString;
            confidence: z.ZodNumber;
            scores: z.ZodRecord<z.ZodString, z.ZodNumber>;
            scoreItems: z.ZodArray<z.ZodObject<{
                label: z.ZodString;
                displayLabel: z.ZodString;
                displayLabelVi: z.ZodString;
                emoji: z.ZodString;
                score: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                label: string;
                displayLabel: string;
                displayLabelVi: string;
                emoji: string;
                score: number;
            }, {
                label: string;
                displayLabel: string;
                displayLabelVi: string;
                emoji: string;
                score: number;
            }>, "many">;
            language: z.ZodEnum<["vi", "en"]>;
            modelName: z.ZodString;
            modelVersion: z.ZodString;
            inputText: z.ZodString;
            source: z.ZodOptional<z.ZodDefault<z.ZodEnum<["web", "api", "csv"]>>>;
        } & {
            id: z.ZodString;
            createdAt: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            language: "vi" | "en";
            label: string;
            displayLabel: string;
            displayLabelVi: string;
            emoji: string;
            predictedLabel: string;
            confidence: number;
            scores: Record<string, number>;
            scoreItems: {
                label: string;
                displayLabel: string;
                displayLabelVi: string;
                emoji: string;
                score: number;
            }[];
            modelName: string;
            modelVersion: string;
            id: string;
            inputText: string;
            createdAt: string;
            source?: "web" | "api" | "csv" | undefined;
        }, {
            language: "vi" | "en";
            label: string;
            displayLabel: string;
            displayLabelVi: string;
            emoji: string;
            predictedLabel: string;
            confidence: number;
            scores: Record<string, number>;
            scoreItems: {
                label: string;
                displayLabel: string;
                displayLabelVi: string;
                emoji: string;
                score: number;
            }[];
            modelName: string;
            modelVersion: string;
            id: string;
            inputText: string;
            createdAt: string;
            source?: "web" | "api" | "csv" | undefined;
        }>, "many">;
        nextCursor: z.ZodNullable<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        items: {
            language: "vi" | "en";
            label: string;
            displayLabel: string;
            displayLabelVi: string;
            emoji: string;
            predictedLabel: string;
            confidence: number;
            scores: Record<string, number>;
            scoreItems: {
                label: string;
                displayLabel: string;
                displayLabelVi: string;
                emoji: string;
                score: number;
            }[];
            modelName: string;
            modelVersion: string;
            id: string;
            inputText: string;
            createdAt: string;
            source?: "web" | "api" | "csv" | undefined;
        }[];
        nextCursor: string | null;
    }, {
        items: {
            language: "vi" | "en";
            label: string;
            displayLabel: string;
            displayLabelVi: string;
            emoji: string;
            predictedLabel: string;
            confidence: number;
            scores: Record<string, number>;
            scoreItems: {
                label: string;
                displayLabel: string;
                displayLabelVi: string;
                emoji: string;
                score: number;
            }[];
            modelName: string;
            modelVersion: string;
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
            language: "vi" | "en";
            label: string;
            displayLabel: string;
            displayLabelVi: string;
            emoji: string;
            predictedLabel: string;
            confidence: number;
            scores: Record<string, number>;
            scoreItems: {
                label: string;
                displayLabel: string;
                displayLabelVi: string;
                emoji: string;
                score: number;
            }[];
            modelName: string;
            modelVersion: string;
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
            language: "vi" | "en";
            label: string;
            displayLabel: string;
            displayLabelVi: string;
            emoji: string;
            predictedLabel: string;
            confidence: number;
            scores: Record<string, number>;
            scoreItems: {
                label: string;
                displayLabel: string;
                displayLabelVi: string;
                emoji: string;
                score: number;
            }[];
            modelName: string;
            modelVersion: string;
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
    language: z.ZodEnum<["vi", "en"]>;
    totalRows: z.ZodNumber;
    processedRows: z.ZodNumber;
    failedRows: z.ZodNumber;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    language: "vi" | "en";
    status: "queued" | "processing" | "completed" | "failed" | "completed_with_errors";
    id: string;
    createdAt: string;
    fileName: string | null;
    totalRows: number;
    processedRows: number;
    failedRows: number;
    updatedAt: string;
}, {
    language: "vi" | "en";
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
    displayLabel: z.ZodNullable<z.ZodString>;
    displayLabelVi: z.ZodNullable<z.ZodString>;
    emoji: z.ZodNullable<z.ZodString>;
    confidence: z.ZodNullable<z.ZodNumber>;
    scores: z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodNumber>>;
    scoreItems: z.ZodNullable<z.ZodArray<z.ZodObject<{
        label: z.ZodString;
        displayLabel: z.ZodString;
        displayLabelVi: z.ZodString;
        emoji: z.ZodString;
        score: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        label: string;
        displayLabel: string;
        displayLabelVi: string;
        emoji: string;
        score: number;
    }, {
        label: string;
        displayLabel: string;
        displayLabelVi: string;
        emoji: string;
        score: number;
    }>, "many">>;
    language: z.ZodEnum<["vi", "en"]>;
    modelName: z.ZodNullable<z.ZodString>;
    modelVersion: z.ZodNullable<z.ZodString>;
    errorMessage: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    language: "vi" | "en";
    displayLabel: string | null;
    displayLabelVi: string | null;
    emoji: string | null;
    predictedLabel: string | null;
    confidence: number | null;
    scores: Record<string, number> | null;
    scoreItems: {
        label: string;
        displayLabel: string;
        displayLabelVi: string;
        emoji: string;
        score: number;
    }[] | null;
    modelName: string | null;
    modelVersion: string | null;
    id: string;
    inputText: string;
    createdAt: string;
    batchJobId: string;
    rowIndex: number;
    errorMessage: string | null;
}, {
    language: "vi" | "en";
    displayLabel: string | null;
    displayLabelVi: string | null;
    emoji: string | null;
    predictedLabel: string | null;
    confidence: number | null;
    scores: Record<string, number> | null;
    scoreItems: {
        label: string;
        displayLabel: string;
        displayLabelVi: string;
        emoji: string;
        score: number;
    }[] | null;
    modelName: string | null;
    modelVersion: string | null;
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