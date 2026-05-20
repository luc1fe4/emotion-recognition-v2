import type { RequestHandler } from "express";
import type { AnyZodObject } from "zod";

export function validateBody(schema: AnyZodObject): RequestHandler {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      next(result.error);
      return;
    }
    req.body = result.data;
    next();
  };
}
