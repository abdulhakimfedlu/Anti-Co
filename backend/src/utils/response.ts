import type { Response } from "express";
import type { ApiSuccess, ApiError } from "../types/index";

export function sendSuccess<T>(
  res: Response,
  data: T,
  statusCode = 200,
  meta?: Record<string, unknown>
): void {
  const body: ApiSuccess<T> = { success: true, data, ...(meta ? { meta } : {}) };
  res.status(statusCode).json(body);
}

export function sendError(
  res: Response,
  message: string,
  statusCode = 400,
  details?: unknown
): void {
  const body: ApiError = {
    success: false,
    error: message,
    ...(details !== undefined ? { details } : {}),
  };
  res.status(statusCode).json(body);
}
