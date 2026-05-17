import { Router } from "express";
import messagesRouter from "./messages.routes";
import servicesRouter from "./services.routes";
import adminRouter from "./admins.routes";
import webhooksRouter from "./webhooks.routes";

const router = Router();

// Health check
router.get("/health", (_req, res) => {
  res.json({ success: true, data: { status: "ok", timestamp: new Date().toISOString() } });
});

router.use("/messages", messagesRouter);
router.use("/services", servicesRouter);
router.use("/", adminRouter);           // auth/me, admins CRUD
router.use("/webhooks", webhooksRouter); // Clerk webhook events

export default router;
