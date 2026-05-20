import winston from "winston";

import { env } from "./env.js";

export const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  transports: [new winston.transports.Console()],
});

export const httpLogStream = {
  write(message: string) {
    logger.http(message.trim());
  },
};
