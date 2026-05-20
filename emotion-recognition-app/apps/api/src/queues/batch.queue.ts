import { Queue, Worker, type JobsOptions, type Processor } from "bullmq";
import { Redis } from "ioredis";
import type { Redis as RedisConnection } from "ioredis";

import { env } from "../config/env.js";
import { logger } from "../config/logger.js";
import type { CsvTextRow } from "../services/csv.service.js";

export const BATCH_QUEUE_NAME = "emotion-batch-analysis";

export interface BatchJobPayload {
  jobId: string;
  rows: CsvTextRow[];
}

let queueConnection: RedisConnection | null = null;
let workerConnection: RedisConnection | null = null;
let batchQueue: Queue<BatchJobPayload> | null = null;

function createConnection() {
  if (!env.REDIS_URL) {
    return null;
  }

  return new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  });
}

export function getBatchQueue() {
  if (!env.REDIS_URL) {
    return null;
  }

  if (!batchQueue) {
    queueConnection = createConnection();
    if (!queueConnection) {
      return null;
    }
    batchQueue = new Queue<BatchJobPayload>(BATCH_QUEUE_NAME, { connection: queueConnection });
  }

  return batchQueue;
}

export async function enqueueBatchJob(payload: BatchJobPayload) {
  const queue = getBatchQueue();
  if (!queue) {
    return null;
  }

  const options: JobsOptions = {
    attempts: 2,
    backoff: { type: "exponential", delay: 2_000 },
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 200 },
  };

  return queue.add("process-csv", payload, options);
}

export function createBatchWorker(processor: Processor<BatchJobPayload>) {
  if (!env.REDIS_URL) {
    logger.warn("REDIS_URL is not configured; batch worker will not start.");
    return null;
  }

  workerConnection = createConnection();
  if (!workerConnection) {
    return null;
  }

  const worker = new Worker<BatchJobPayload>(BATCH_QUEUE_NAME, processor, {
    connection: workerConnection,
    concurrency: 2,
  });

  worker.on("completed", (job) => {
    logger.info("Batch job completed", { bullJobId: job.id, jobId: job.data.jobId });
  });

  worker.on("failed", (job, error) => {
    logger.error("Batch job failed", { bullJobId: job?.id, jobId: job?.data.jobId, error });
  });

  return worker;
}

export async function closeBatchQueue() {
  await batchQueue?.close();
  await queueConnection?.quit();
  await workerConnection?.quit();
}
