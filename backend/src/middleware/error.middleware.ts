

import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { sendError } from "../utils/response";
import { logger } from "../utils/logger";
import { env } from "../config/env";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Zod validation error
  if (err instanceof ZodError) {
    sendError(res, "Validation failed", 422, err.flatten().fieldErrors);
    return;
  }

  // Standard Error
  if (err instanceof Error) {
    logger.error(err.message, err.stack);

    // Duplicate key (PostgreSQL)
    if ((err as NodeJS.ErrnoException).code === "23505") {
      sendError(res, "A record with that value already exists", 409);
      return;
    }

    const message = env.isDev ? err.message : "An unexpected error occurred";
    sendError(res, message, 500);
    return;
  }

  sendError(res, "An unexpected error occurred", 500);
}

export function notFoundHandler(_req: Request, res: Response): void {
  sendError(res, `Route not found`, 404);
}
