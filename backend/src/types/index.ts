import { z } from "zod";

// ─── Message Schemas ─────────────────────────────────────────
export const submitMessageSchema = z.object({
  senderName: z.string().min(1).max(200).optional().nullable(),
  senderEmail: z.string().max(100).optional().nullable(),
  isAnonymous: z.boolean().default(false),
  subject: z.string().min(3).max(300),
  body: z.string().min(10).max(5000),
  category: z.string().min(1).max(100),
  priority: z.enum(["Low", "Medium", "High", "Urgent"]).default("Medium"),
  woreda: z.string().max(100).optional().nullable(),
  subcity: z.string().max(100).optional().nullable(),
  houseNumber: z.string().max(100).optional().nullable(),
  specificPlace: z.string().max(200).optional().nullable(),
  gender: z.string().max(50).optional().nullable(),
  age: z.string().max(50).optional().nullable(),
  educationLevel: z.string().max(100).optional().nullable(),
  incidentLocation: z.string().max(300).optional().nullable(),
  suspectName: z.string().max(200).optional().nullable(),
});

export const messageFilterSchema = z.object({
  status: z.enum(["new", "resolved"]).optional(),
  category: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

// ─── Service Schemas ─────────────────────────────────────────
export const createServiceSchema = z.object({
  title: z.string().min(2).max(200),
  titleAm: z.string().max(200).optional(),
  description: z.string().max(2000).optional(),
  descriptionAm: z.string().max(2000).optional(),
  category: z.string().min(1).max(100),
  status: z.enum(["active", "hidden"]).default("active"),
  isPopular: z.boolean().default(false),
  sortOrder: z.coerce.number().int().min(0).default(0),
});

export const updateServiceSchema = createServiceSchema.partial();

// ─── Admin Schemas ───────────────────────────────────────────
export const createAdminSchema = z.object({
  fullName: z.string().min(2).max(200),
  email: z.string().email(),
  role: z.enum(["Super Admin", "Admin", "Viewer"]).default("Admin"),
});

export const transferRoleSchema = z.object({
  targetAdminId: z.string().uuid(),
});

// ─── API Response Types ──────────────────────────────────────
export interface ApiSuccess<T = unknown> {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
}

export interface ApiError {
  success: false;
  error: string;
  details?: unknown;
}

export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError;
