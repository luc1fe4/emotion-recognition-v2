import { logger } from "./config/logger.js";
import { disconnectPrisma } from "./config/prisma.js";
import { closeBatchQueue, createBatchWorker } from "./queues/batch.queue.js";
import { processBatchRows } from "./services/batch.service.js";

const worker = createBatchWorker(async (job) => {
  await processBatchRows(job.data.jobId, job.data.rows);
});

if (worker) {
  logger.info("Batch worker started");
}

async function shutdown(signal: string) {
  logger.info("Shutting down batch worker", { signal });
  await worker?.close();
  await closeBatchQueue();
  await disconnectPrisma();
  process.exit(0);
}

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));
