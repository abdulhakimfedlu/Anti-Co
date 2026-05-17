import { Router } from "express";
import { ServicesController } from "../controllers/services.controller";
import { requireAuth, requireRole } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { createServiceSchema, updateServiceSchema } from "../types/index";

const router = Router();

// Public
router.get("/", ServicesController.list);
router.get("/popular", ServicesController.popular);
router.get("/:id", ServicesController.getOne);

// Admin protected (temporarily public)
router.post("/", validate(createServiceSchema), ServicesController.create);
router.patch("/:id", validate(updateServiceSchema), ServicesController.update);
router.delete(
  "/:id",
  ServicesController.remove
);

export default router;
