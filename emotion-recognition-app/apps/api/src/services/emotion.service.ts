import type { AnalysisResult, AnalyzeTextRequest } from "@emotion-recognition/shared";

import { prisma } from "../config/prisma.js";
import { logger } from "../config/logger.js";
import { predictEmotion } from "./model-client.js";

export async function analyzeText(input: AnalyzeTextRequest): Promise<AnalysisResult> {
  const source = input.source ?? "web";
  const prediction = await predictEmotion(input.text);

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
        displayLabelVi: prediction.displayLabelVi,
        emoji: prediction.emoji,
        confidence: prediction.confidence,
        scoresJson: prediction.scores,
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
    predictedLabel: record.predictedLabel,
    displayLabelVi: record.displayLabelVi,
    emoji: record.emoji,
    confidence: record.confidence,
    scores: record.scoresJson as AnalysisResult["scores"],
    source: record.source as AnalysisResult["source"],
    createdAt: record.createdAt.toISOString(),
  }));

  return {
    items,
    nextCursor: hasMore ? items[items.length - 1]?.createdAt ?? null : null,
  };
}
