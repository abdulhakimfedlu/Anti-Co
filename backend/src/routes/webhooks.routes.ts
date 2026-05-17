import { Router, Request, Response } from "express";
import { Webhook } from "svix";
import { env } from "../config/env";
import { AdminsService } from "../services/admins.service";

const router = Router();

/**
 * POST /api/webhooks/clerk
 * 
 * Receives Clerk webhook events and syncs user data to our database.
 * Clerk sends events like user.created, user.updated, user.deleted.
 * 
 * IMPORTANT: This route requires raw body (not JSON-parsed) for signature verification.
 * The raw body middleware is configured in app.ts for this path.
 */
router.post("/clerk", async (req: Request, res: Response) => {
  const secret = env.clerkWebhookSecret;

  // Skip webhook processing if secret is not configured (dev mode without ngrok)
  if (!secret || secret.startsWith("whsec_placeholder")) {
    console.warn("⚠️  Clerk webhook secret not configured — skipping webhook verification");
    res.status(200).json({ received: true });
    return;
  }

  const wh = new Webhook(secret);

  // Get headers for verification
  const svix_id = req.headers["svix-id"] as string;
  const svix_timestamp = req.headers["svix-timestamp"] as string;
  const svix_signature = req.headers["svix-signature"] as string;

  if (!svix_id || !svix_timestamp || !svix_signature) {
    res.status(400).json({ error: "Missing Svix headers" });
    return;
  }

  let event: any;
  try {
    event = wh.verify(req.body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("❌ Clerk webhook signature verification failed:", err);
    res.status(400).json({ error: "Invalid signature" });
    return;
  }

  const { type, data } = event;
  console.log(`📬 Clerk webhook: ${type}`, data?.id);

  try {
    if (type === "user.created" || type === "user.updated") {
      const clerkId: string = data.id;
      const email: string | undefined = data.email_addresses?.[0]?.email_address;

      if (email) {
        // Link clerkId to the pre-approved admin record
        const admin = await AdminsService.updateClerkId(email, clerkId);
        if (admin) {
          console.log(`✅ Linked Clerk ID for ${email}`);
        } else {
          console.log(`ℹ️  No admin record found for ${email} (might be a regular user)`);
        }
      }
    }

    if (type === "user.deleted") {
      const clerkId: string = data.id;
      const admin = await AdminsService.getByClerkId(clerkId);
      if (admin) {
        await AdminsService.toggleActive(admin.id);
        console.log(`⚠️  Deactivated admin ${admin.email} (Clerk user deleted)`);
      }
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error("❌ Error processing Clerk webhook:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
