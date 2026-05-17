




import { Router } from "express";
import { AdminsController, AuthController } from "../controllers/admins.controller";
import { requireAuth, requireRole } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { createAdminSchema, transferRoleSchema } from "../types/index";

const router = Router();

// ─── Auth routes ─────────────────────────────────────────────
// Returns current signed-in admin profile
router.get("/auth/me", requireAuth, AuthController.me);

// Self-link Clerk ID to admin profile (used on first login when webhook unavailable)
// This route uses a lighter auth check — only verifies Clerk JWT, not DB profile
router.post("/auth/sync-me", AdminsController.syncMe);

// ─── Public Admin Check (no auth needed) ─────────────────────
// Used by signup page to verify email is pre-approved
router.get("/admins/check-email", AdminsController.checkEmail);

// ─── Admin Management (Super Admin only for write ops) ───────
router.get("/admins", requireAuth, AdminsController.list);

router.post(
  "/admins",
  requireAuth,
  requireRole("Super Admin"),
  validate(createAdminSchema),
  AdminsController.create
);

router.delete(
  "/admins/:id",
  requireAuth,
  requireRole("Super Admin"),
  AdminsController.remove
);

router.patch(
  "/admins/:id/toggle-active",
  requireAuth,
  requireRole("Super Admin"),
  AdminsController.toggleActive
);

router.patch(
  "/admins/:id/transfer-role",
  requireAuth,
  requireRole("Super Admin"),
  AdminsController.transferRole
);

export default router;
