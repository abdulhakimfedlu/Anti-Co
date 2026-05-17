import type { Request, Response, NextFunction } from "express";
import { AdminsService } from "../services/admins.service";
import { sendSuccess, sendError } from "../utils/response";
import type { AuthRequest } from "../middleware/auth.middleware";

export const AdminsController = {
  // GET /api/admins — all authenticated admins
  async list(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AdminsService.list();
      sendSuccess(res, data);
    } catch (err) {
      next(err);
    }
  },

  // POST /api/admins — Super Admin only
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      // Check if email already exists
      const existing = await AdminsService.getByEmail(req.body.email);
      if (existing) {
        sendError(res, "An admin with this email already exists", 409);
        return;
      }
      const admin = await AdminsService.create(req.body);
      sendSuccess(res, admin, 201);
    } catch (err) {
      next(err);
    }
  },

  // DELETE /api/admins/:id — Super Admin only
  async remove(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      // Prevent self-deletion
      if (req.admin?.id === req.params.id) {
        sendError(res, "You cannot remove your own account", 400);
        return;
      }
      // Prevent removing another Super Admin
      const target = await AdminsService.getById(req.params.id);
      if (!target) {
        sendError(res, "Admin not found", 404);
        return;
      }
      if (target.role === "Super Admin") {
        sendError(res, "Cannot remove the Super Admin. Transfer the role first.", 400);
        return;
      }
      const deleted = await AdminsService.remove(req.params.id);
      if (!deleted) { sendError(res, "Admin not found", 404); return; }
      sendSuccess(res, { id: req.params.id });
    } catch (err) {
      next(err);
    }
  },

  // PATCH /api/admins/:id/toggle-active — Super Admin only
  async toggleActive(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (req.admin?.id === req.params.id) {
        sendError(res, "You cannot deactivate your own account", 400);
        return;
      }
      const updated = await AdminsService.toggleActive(req.params.id);
      if (!updated) { sendError(res, "Admin not found", 404); return; }
      sendSuccess(res, updated);
    } catch (err) {
      next(err);
    }
  },

  // PATCH /api/admins/:id/transfer-role — Super Admin only
  async transferRole(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const fromId = req.admin!.id;
      const toId = req.params.id;
      if (fromId === toId) {
        sendError(res, "Cannot transfer role to yourself", 400);
        return;
      }
      const result = await AdminsService.transferRole(fromId, toId);
      sendSuccess(res, result);
    } catch (err: any) {
      if (err.message) {
        sendError(res, err.message, 400);
        return;
      }
      next(err);
    }
  },

  // GET /api/admins/check-email?email=... — Public endpoint
  async checkEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const email = (req.query.email as string)?.toLowerCase()?.trim();
      if (!email) {
        sendError(res, "Email is required", 400);
        return;
      }
      const result = await AdminsService.isEmailAllowed(email);
      sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  },

  // POST /api/auth/sync-me — Links Clerk ID to admin profile on first login
  async syncMe(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { clerkId, email } = req.body;
      if (!clerkId || !email) {
        sendError(res, "clerkId and email are required", 400);
        return;
      }
      const admin = await AdminsService.updateClerkId(email.toLowerCase(), clerkId);
      if (!admin) {
        sendError(res, "No admin record found for this email. Contact your Super Admin.", 403);
        return;
      }
      sendSuccess(res, {
        id: admin.id,
        email: admin.email,
        fullName: admin.fullName,
        role: admin.role,
        clerkId: admin.clerkId,
      });
    } catch (err) {
      next(err);
    }
  },
};

export const AuthController = {
  // GET /api/auth/me — Returns current admin profile
  async me(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      sendSuccess(res, req.admin);
    } catch (err) {
      next(err);
    }
  },
};
