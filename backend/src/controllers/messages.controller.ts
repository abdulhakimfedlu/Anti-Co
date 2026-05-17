import type { Request, Response, NextFunction } from "express";
import { MessagesService } from "../services/messages.service";
import { sendSuccess, sendError } from "../utils/response";
import { broadcast } from "@/websocket";

export const MessagesController = {
  // POST /api/messages — public
  async submit(req: Request, res: Response, next: NextFunction) {
    try {
      const msg = await MessagesService.create(req.body);
      // Broadcast to all connected admin WebSocket clients
      broadcast({ type: "NEW_MESSAGE", payload: msg });
      sendSuccess(res, msg, 201);
    } catch (err) {
      next(err);
    }
  },

  // GET /api/messages — admin
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await MessagesService.list(req.query as unknown as {
        status?: "new" | "resolved";
        page: number;
        limit: number;
      });
      sendSuccess(res, result.data, 200, { pagination: result.pagination });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/messages/stats — admin
  async stats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await MessagesService.getStats();
      sendSuccess(res, stats);
    } catch (err) {
      next(err);
    }
  },

  // GET /api/messages/:id — admin
  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const msg = await MessagesService.getById(req.params.id);
      if (!msg) { sendError(res, "Message not found", 404); return; }
      sendSuccess(res, msg);
    } catch (err) {
      next(err);
    }
  },

  // PATCH /api/messages/:id/resolve — admin
  async resolve(req: Request, res: Response, next: NextFunction) {
    try {
      const msg = await MessagesService.resolve(req.params.id);
      if (!msg) { sendError(res, "Message not found or already resolved", 404); return; }
      broadcast({ type: "MESSAGE_RESOLVED", payload: { id: req.params.id } });
      sendSuccess(res, msg);
    } catch (err) {
      next(err);
    }
  },

  // DELETE /api/messages/:id — admin (resolved only)
  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const deleted = await MessagesService.delete(req.params.id);
      if (!deleted) { sendError(res, "Message not found or not yet resolved", 404); return; }
      sendSuccess(res, { id: req.params.id });
    } catch (err) {
      next(err);
    }
  },
};
