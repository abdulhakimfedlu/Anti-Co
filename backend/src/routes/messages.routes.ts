import { Router } from "express";
import { MessagesController } from "../controllers/messages.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { validate, validateQuery } from "../middleware/validate.middleware";
import { submitMessageSchema, messageFilterSchema } from "../types/index";

const router = Router();

// Public — submit a complaint
router.post("/", validate(submitMessageSchema), MessagesController.submit);

// Admin protected (temporarily public)
router.get("/stats", MessagesController.stats);
router.get("/", validateQuery(messageFilterSchema), MessagesController.list);
router.get("/:id", MessagesController.getOne);
router.patch("/:id/resolve", MessagesController.resolve);
router.delete("/:id", MessagesController.remove);

export default router;
