import type { BatchResult as SharedBatchResult, BatchStatus } from "@emotion-recognition/shared";

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
    totalRows: job.totalRows,
    processedRows: job.processedRows,
    failedRows: job.failedRows,
    createdAt: job.createdAt.toISOString(),
    updatedAt: job.updatedAt.toISOString(),
  };
}

export async function createBatchFromCsv(file: Express.Multer.File) {
  if (!file) {
    throw new AppError(400, "Please upload a CSV file.");
  }

  const rows = parseCsvTextRows(file.buffer);

  const batchJob = await prisma.batchJob.create({
    data: {
      status: "queued",
      fileName: file.originalname,
      totalRows: rows.length,
    },
  });

  try {
    const queuedJob = await enqueueBatchJob({ jobId: batchJob.id, rows });
    if (queuedJob) {
      return {
        ...toIsoJob(batchJob),
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
    if (!row.text || row.text.length > env.MAX_TEXT_LENGTH) {
      failedRows += 1;
      processedRows += 1;
      const errorMessage = !row.text
        ? "Text is required."
        : `Text must be ${env.MAX_TEXT_LENGTH} characters or fewer.`;
      await prisma.batchResult.create({
        data: {
          batchJobId: jobId,
          rowIndex: row.rowIndex,
          inputText: row.text,
          errorMessage,
        },
      });
      await updateBatchProgress(jobId, processedRows, failedRows, rows.length);
      continue;
    }

    try {
      const prediction = await predictEmotion(row.text);

      await prisma.$transaction([
        prisma.batchResult.create({
          data: {
            batchJobId: jobId,
            rowIndex: row.rowIndex,
            inputText: row.text,
            predictedLabel: prediction.predictedLabel,
            displayLabelVi: prediction.displayLabelVi,
            emoji: prediction.emoji,
            confidence: prediction.confidence,
            scoresJson: prediction.scores,
          },
        }),
        prisma.emotionAnalysis.create({
          data: {
            inputText: row.text,
            predictedLabel: prediction.predictedLabel,
            displayLabelVi: prediction.displayLabelVi,
            emoji: prediction.emoji,
            confidence: prediction.confidence,
            scoresJson: prediction.scores,
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
    displayLabelVi: row.displayLabelVi,
    emoji: row.emoji,
    confidence: row.confidence,
    scores: row.scoresJson as SharedBatchResult["scores"],
    errorMessage: row.errorMessage,
    createdAt: row.createdAt.toISOString(),
  }));
}
