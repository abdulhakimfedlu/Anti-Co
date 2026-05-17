import type { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/response";
import { db } from "../config/database";
import { admins } from "../db/schema/admins";
import { eq } from "drizzle-orm";
import { requireAuth as clerkRequireAuth, getAuth } from "@clerk/express";

export interface AuthRequest extends Request {
  admin?: {
    id: string;
    clerkId: string;
    email: string;
    role: string;
    fullName: string;
  };
}

// 1. Clerk's built-in middleware ensures a valid session token exists
export const requireClerkAuth = clerkRequireAuth({
  signInUrl: "/sign-in"
});

// 2. Our custom middleware to load the admin from our database using the Clerk ID/Email
export const loadAdminProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const auth = getAuth(req);
    const clerkId = auth?.userId;
    
    if (!clerkId) {
      sendError(res, "Unauthorized", 401);
      return;
    }

    // We can also sync the user's email from Clerk if needed via the Clerk API or JWT claims,
    // but typically we match by clerkId if it exists. 
    // For this prototype, we'll assume the admin was created with their clerkId matching.
    const [admin] = await db
      .select()
      .from(admins)
      .where(eq(admins.clerkId, clerkId))
      .limit(1);

    if (!admin) {
      // If the admin isn't found by Clerk ID, they might not be authorized or their Clerk ID isn't synced yet.
      // In a real app, you might sync this via webhooks.
      sendError(res, "Admin profile not found or unauthorized", 403);
      return;
    }

    if (!admin.isActive) {
      sendError(res, "Admin account is disabled", 403);
      return;
    }

    req.admin = {
      id: admin.id,
      clerkId: admin.clerkId!,
      email: admin.email,
      role: admin.role,
      fullName: admin.fullName,
    };

    next();
  } catch (err) {
    next(err);
  }
};

export const requireAuth = [requireClerkAuth, loadAdminProfile];

export function requireRole(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.admin || !roles.includes(req.admin.role)) {
      sendError(res, "Insufficient permissions", 403);
      return;
    }
    next();
  };
}
