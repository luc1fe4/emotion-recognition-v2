import type { AnalysisResult, AnalyzeTextRequest } from "@emotion-recognition/shared";

import { prisma } from "../config/prisma.js";
import { logger } from "../config/logger.js";
import { predictEmotion } from "./model-client.js";

export async function analyzeText(input: AnalyzeTextRequest): Promise<AnalysisResult> {
  const source = input.source ?? "web";
  const prediction = await predictEmotion(input.text, input.language);

  const result: AnalysisResult = {
    inputText: input.text,
    source,
    ...prediction,
    createdAt: new Date().toISOString(),
  };

  try {
    const saved = await prisma.emotionAnalysis.create({
      data: {
        inputText: input.text,
        predictedLabel: prediction.predictedLabel,
        displayLabel: prediction.displayLabel,
        displayLabelVi: prediction.displayLabelVi,
        emoji: prediction.emoji,
        confidence: prediction.confidence,
        scoresJson: prediction.scores,
        language: prediction.language,
        modelName: prediction.modelName,
        modelVersion: prediction.modelVersion,
        source,
      },
    });

    result.id = saved.id;
    result.createdAt = saved.createdAt.toISOString();
  } catch (error) {
    logger.error("Failed to persist emotion analysis history", {
      error,
      source,
      textLength: input.text.length,
      language: input.language,
    });
  }

  return result;
}

export async function listHistory(limit: number, cursor?: string) {
  const take = Math.min(Math.max(limit, 1), 100);
  const records = await prisma.emotionAnalysis.findMany({
    take: take + 1,
    orderBy: { createdAt: "desc" },
    where: cursor ? { createdAt: { lt: new Date(cursor) } } : undefined,
  });

  const hasMore = records.length > take;
  const items = records.slice(0, take).map((record) => ({
    id: record.id,
    inputText: record.inputText,
    label: record.predictedLabel,
    predictedLabel: record.predictedLabel,
    displayLabel: record.displayLabel || record.predictedLabel,
    displayLabelVi: record.displayLabelVi,
    emoji: record.emoji,
    confidence: record.confidence,
    scores: scoreMapFromStoredScores(record.scoresJson),
    scoreItems: scoreItemsFromStoredScores(record.scoresJson),
    language: record.language as AnalysisResult["language"],
    modelName: record.modelName,
    modelVersion: record.modelVersion,
    source: record.source as AnalysisResult["source"],
    createdAt: record.createdAt.toISOString(),
  }));

  return {
    items,
    nextCursor: hasMore ? items[items.length - 1]?.createdAt ?? null : null,
  };
}

function scoreMapFromStoredScores(scoresJson: unknown): AnalysisResult["scores"] {
  if (Array.isArray(scoresJson)) {
    return Object.fromEntries(
      (scoresJson as AnalysisResult["scoreItems"]).map((score) => [score.label, score.score]),
    );
  }

  if (!scoresJson || typeof scoresJson !== "object") {
    return {};
  }

  return scoresJson as AnalysisResult["scores"];
}

function scoreItemsFromStoredScores(scoresJson: unknown): AnalysisResult["scoreItems"] {
  if (Array.isArray(scoresJson)) {
    return (scoresJson as Array<{ label: string; displayLabel?: string; displayLabelVi?: string; emoji?: string; score: number }>).map(
      (score) => ({
        label: score.label,
        displayLabel: score.displayLabel ?? score.label,
        displayLabelVi: score.displayLabelVi ?? score.label,
        emoji: score.emoji ?? "\ud83d\ude10",
        score: score.score,
      }),
    );
  }

  if (!scoresJson || typeof scoresJson !== "object") {
    return [];
  }

  return Object.entries(scoresJson as Record<string, number>).map(([label, score]) => ({
    label,
    displayLabel: label,
    displayLabelVi: label,
    emoji: "\ud83d\ude10",
    score,
  }));
}
