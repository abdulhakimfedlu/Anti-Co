import type { Request, Response, NextFunction } from "express";
import { ServicesService } from "../services/services.service";
import { sendSuccess, sendError } from "../utils/response";

export const ServicesController = {
  // GET /api/services — public (active) or admin (all with ?all=true)
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const includeHidden = req.query.all === "true";
      const data = await ServicesService.list(includeHidden);
      sendSuccess(res, data, 200, { total: data.length });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/services/popular — public
  async popular(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await ServicesService.getPopular();
      sendSuccess(res, data);
    } catch (err) {
      next(err);
    }
  },

  // GET /api/services/:id — public
  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const svc = await ServicesService.getById(req.params.id);
      if (!svc) { sendError(res, "Service not found", 404); return; }
      sendSuccess(res, svc);
    } catch (err) {
      next(err);
    }
  },

  // POST /api/services — admin
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const svc = await ServicesService.create(req.body);
      sendSuccess(res, svc, 201);
    } catch (err) {
      next(err);
    }
  },

  // PATCH /api/services/:id — admin
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const svc = await ServicesService.update(req.params.id, req.body);
      if (!svc) { sendError(res, "Service not found", 404); return; }
      sendSuccess(res, svc);
    } catch (err) {
      next(err);
    }
  },

  // DELETE /api/services/:id — admin
  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const deleted = await ServicesService.delete(req.params.id);
      if (!deleted) { sendError(res, "Service not found", 404); return; }
      sendSuccess(res, { id: req.params.id });
    } catch (err) {
      next(err);
    }
  },
};
