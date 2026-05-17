import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import { disconnectPrisma } from "./config/prisma.js";
import { app } from "./app.js";
import { closeBatchQueue } from "./queues/batch.queue.js";

const server = app.listen(env.PORT, () => {
  logger.info("Emotion recognition API is running", {
    port: env.PORT,
    environment: env.NODE_ENV,
  });
});

async function shutdown(signal: string) {
  logger.info("Shutting down API server", { signal });
  server.close(async () => {
    await closeBatchQueue();
    await disconnectPrisma();
    process.exit(0);
  });
}

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));
