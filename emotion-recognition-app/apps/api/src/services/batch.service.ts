import type {
  BatchResult as SharedBatchResult,
  BatchStatus,
  ScoreItem,
  SupportedLanguage,
} from "@emotion-recognition/shared";

import { env } from "../config/env.js";
import { prisma } from "../config/prisma.js";
import { logger } from "../config/logger.js";
import { AppError } from "../utils/app-error.js";
import { parseCsvTextRows, type CsvTextRow } from "./csv.service.js";
import { predictEmotion } from "./model-client.js";
import { enqueueBatchJob } from "../queues/batch.queue.js";

function toIsoJob(job: {
  id: string;
  status: string;
  fileName: string | null;
  language: string;
  totalRows: number;
  processedRows: number;
  failedRows: number;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: job.id,
    status: job.status as BatchStatus,
    fileName: job.fileName,
    language: job.language as SupportedLanguage,
    totalRows: job.totalRows,
    processedRows: job.processedRows,
    failedRows: job.failedRows,
    createdAt: job.createdAt.toISOString(),
    updatedAt: job.updatedAt.toISOString(),
  };
}

export async function createBatchFromCsv(file: Express.Multer.File, language: SupportedLanguage) {
  if (!file) {
    throw new AppError(400, "Please upload a CSV file.");
  }

  const rows = parseCsvTextRows(file.buffer, language);

  const batchJob = await prisma.batchJob.create({
    data: {
      status: "queued",
      fileName: file.originalname,
      language,
      totalRows: rows.length,
    },
  });

  try {
    const queuedJob = await enqueueBatchJob({ jobId: batchJob.id, rows });
    if (queuedJob) {
      return {
        ...toIsoJob(batchJob),
        jobId: batchJob.id,
        queueMode: "redis" as const,
      };
    }
  } catch (error) {
    logger.error("Failed to enqueue batch job; processing synchronously", {
      error,
      jobId: batchJob.id,
    });
  }

  await processBatchRows(batchJob.id, rows);
  const refreshedJob = await prisma.batchJob.findUniqueOrThrow({ where: { id: batchJob.id } });

  return {
    ...toIsoJob(refreshedJob),
    jobId: refreshedJob.id,
    queueMode: "synchronous" as const,
  };
}

export async function processBatchRows(jobId: string, rows: CsvTextRow[]) {
  await prisma.batchJob.update({
    where: { id: jobId },
    data: { status: "processing", totalRows: rows.length },
  });

  let processedRows = 0;
  let failedRows = 0;

  for (const row of rows) {
    if (row.errorMessage || !row.text || row.text.length > env.MAX_TEXT_LENGTH) {
      failedRows += 1;
      processedRows += 1;
      const errorMessage =
        row.errorMessage ??
        (!row.text ? "Text is required." : `Text must be ${env.MAX_TEXT_LENGTH} characters or fewer.`);
      await prisma.batchResult.create({
        data: {
          batchJobId: jobId,
          rowIndex: row.rowIndex,
          inputText: row.text,
          language: row.language,
          errorMessage,
        },
      });
      await updateBatchProgress(jobId, processedRows, failedRows, rows.length);
      continue;
    }

    try {
      const prediction = await predictEmotion(row.text, row.language);

      await prisma.$transaction([
        prisma.batchResult.create({
          data: {
            batchJobId: jobId,
            rowIndex: row.rowIndex,
            inputText: row.text,
            predictedLabel: prediction.predictedLabel,
            displayLabel: prediction.displayLabel,
            displayLabelVi: prediction.displayLabelVi,
            emoji: prediction.emoji,
            confidence: prediction.confidence,
            scoresJson: prediction.scores,
            scoreItemsJson: prediction.scoreItems,
            language: prediction.language,
            modelName: prediction.modelName,
            modelVersion: prediction.modelVersion,
          },
        }),
        prisma.emotionAnalysis.create({
          data: {
            inputText: row.text,
            predictedLabel: prediction.predictedLabel,
            displayLabel: prediction.displayLabel,
            displayLabelVi: prediction.displayLabelVi,
            emoji: prediction.emoji,
            confidence: prediction.confidence,
            scoresJson: prediction.scores,
            language: prediction.language,
            modelName: prediction.modelName,
            modelVersion: prediction.modelVersion,
            source: "csv",
          },
        }),
      ]);
    } catch (error) {
      failedRows += 1;
      logger.error("Failed to process CSV row", {
        error,
        jobId,
        rowIndex: row.rowIndex,
        textLength: row.text.length,
      });
      await prisma.batchResult.create({
        data: {
          batchJobId: jobId,
          rowIndex: row.rowIndex,
          inputText: row.text,
          language: row.language,
          errorMessage: "Unable to analyze this row. Please try again later.",
        },
      });
    }

    processedRows += 1;
    await updateBatchProgress(jobId, processedRows, failedRows, rows.length);
  }

  const status: BatchStatus =
    failedRows === 0 ? "completed" : failedRows === rows.length ? "failed" : "completed_with_errors";

  await prisma.batchJob.update({
    where: { id: jobId },
    data: { status, processedRows, failedRows },
  });
}

async function updateBatchProgress(jobId: string, processedRows: number, failedRows: number, totalRows: number) {
  await prisma.batchJob.update({
    where: { id: jobId },
    data: {
      processedRows,
      failedRows,
      status: processedRows >= totalRows ? "completed" : "processing",
    },
  });
}

export async function getBatchJob(jobId: string) {
  const job = await prisma.batchJob.findUnique({ where: { id: jobId } });
  if (!job) {
    throw new AppError(404, "Batch job not found.");
  }
  return toIsoJob(job);
}

export async function getBatchResults(jobId: string) {
  await getBatchJob(jobId);
  const rows = await prisma.batchResult.findMany({
    where: { batchJobId: jobId },
    orderBy: { rowIndex: "asc" },
  });

  return rows.map<SharedBatchResult>((row) => ({
    id: row.id,
    batchJobId: row.batchJobId,
    rowIndex: row.rowIndex,
    inputText: row.inputText,
    predictedLabel: row.predictedLabel,
    displayLabel: row.displayLabel,
    displayLabelVi: row.displayLabelVi,
    emoji: row.emoji,
    confidence: row.confidence,
    scores: scoreMapFromStoredScores(row.scoresJson),
    scoreItems: scoreItemsFromStoredScores(row.scoreItemsJson ?? row.scoresJson),
    language: row.language as SupportedLanguage,
    modelName: row.modelName,
    modelVersion: row.modelVersion,
    errorMessage: row.errorMessage,
    createdAt: row.createdAt.toISOString(),
  }));
}

function scoreMapFromStoredScores(scoresJson: unknown): SharedBatchResult["scores"] {
  if (Array.isArray(scoresJson)) {
    return Object.fromEntries((scoresJson as ScoreItem[]).map((score) => [score.label, score.score]));
  }

  if (!scoresJson || typeof scoresJson !== "object") {
    return null;
  }

  return scoresJson as SharedBatchResult["scores"];
}

function scoreItemsFromStoredScores(scoresJson: unknown): SharedBatchResult["scoreItems"] {
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
    return null;
  }

  return Object.entries(scoresJson as Record<string, number>).map(([label, score]) => ({
    label,
    displayLabel: label,
    displayLabelVi: label,
    emoji: "\ud83d\ude10",
    score,
  }));
}
