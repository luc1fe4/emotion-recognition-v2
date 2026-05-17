import { Prisma, PrismaClient } from "@prisma/client";

import { logger } from "./logger.js";

export const prisma = new PrismaClient({
  log: [
    { emit: "event", level: "error" },
    { emit: "event", level: "warn" },
  ],
});

prisma.$on("error", (event: Prisma.LogEvent) => {
  logger.error("Prisma error", { target: event.target, message: event.message });
});

prisma.$on("warn", (event: Prisma.LogEvent) => {
  logger.warn("Prisma warning", { target: event.target, message: event.message });
});

export async function disconnectPrisma() {
  await prisma.$disconnect();
}
