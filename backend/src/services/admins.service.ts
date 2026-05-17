import { db } from "../config/database";
import { admins } from "../db/schema/admins";
import { eq, desc, count, ne } from "drizzle-orm";
import type { NewAdmin } from "../db/schema/admins";

export const AdminsService = {
  async list() {
    const rows = await db
      .select({
        id: admins.id,
        clerkId: admins.clerkId,
        fullName: admins.fullName,
        email: admins.email,
        role: admins.role,
        isActive: admins.isActive,
        createdAt: admins.createdAt,
      })
      .from(admins)
      .orderBy(desc(admins.createdAt));
    return rows;
  },

  async getById(id: string) {
    const [admin] = await db
      .select()
      .from(admins)
      .where(eq(admins.id, id))
      .limit(1);
    return admin ?? null;
  },

  async getByEmail(email: string) {
    const [admin] = await db
      .select()
      .from(admins)
      .where(eq(admins.email, email))
      .limit(1);
    return admin ?? null;
  },

  async getByClerkId(clerkId: string) {
    const [admin] = await db
      .select()
      .from(admins)
      .where(eq(admins.clerkId, clerkId))
      .limit(1);
    return admin ?? null;
  },

  /** Check if email is in the allowlist (i.e., pre-added by Super Admin) */
  async isEmailAllowed(email: string): Promise<{ allowed: boolean; role?: string }> {
    const [admin] = await db
      .select({ id: admins.id, role: admins.role, isActive: admins.isActive, clerkId: admins.clerkId })
      .from(admins)
      .where(eq(admins.email, email.toLowerCase()))
      .limit(1);

    if (!admin) return { allowed: false };
    if (!admin.isActive) return { allowed: false };
    return { allowed: true, role: admin.role };
  },

  async create(data: NewAdmin) {
    // Normalize email
    const normalizedData = { ...data, email: data.email.toLowerCase() };
    const [admin] = await db
      .insert(admins)
      .values(normalizedData)
      .returning({
        id: admins.id,
        clerkId: admins.clerkId,
        fullName: admins.fullName,
        email: admins.email,
        role: admins.role,
        createdAt: admins.createdAt,
      });
    return admin;
  },

  async updateClerkId(email: string, clerkId: string) {
    const [admin] = await db
      .update(admins)
      .set({ clerkId, updatedAt: new Date() })
      .where(eq(admins.email, email.toLowerCase()))
      .returning();
    return admin ?? null;
  },

  async remove(id: string) {
    const [deleted] = await db
      .delete(admins)
      .where(eq(admins.id, id))
      .returning({ id: admins.id });
    return deleted ?? null;
  },

  async toggleActive(id: string) {
    const admin = await AdminsService.getById(id);
    if (!admin) return null;
    const [updated] = await db
      .update(admins)
      .set({ isActive: !admin.isActive, updatedAt: new Date() })
      .where(eq(admins.id, id))
      .returning();
    return updated ?? null;
  },

  /** Transfer Super Admin role: demote fromId to Admin, promote toId to Super Admin */
  async transferRole(fromId: string, toId: string) {
    // Verify fromId is Super Admin
    const from = await AdminsService.getById(fromId);
    if (!from || from.role !== "Super Admin") {
      throw new Error("Only the current Super Admin can transfer the role");
    }
    const to = await AdminsService.getById(toId);
    if (!to) throw new Error("Target admin not found");

    // Execute as two updates (no transaction needed for SQLite; Postgres is fine)
    await db
      .update(admins)
      .set({ role: "Admin", updatedAt: new Date() })
      .where(eq(admins.id, fromId));

    await db
      .update(admins)
      .set({ role: "Super Admin", updatedAt: new Date() })
      .where(eq(admins.id, toId));

    return { from: { ...from, role: "Admin" }, to: { ...to, role: "Super Admin" } };
  },

  async getCount() {
    const [{ total }] = await db.select({ total: count() }).from(admins);
    return Number(total);
  },

  async getSuperAdmin() {
    const [admin] = await db
      .select()
      .from(admins)
      .where(eq(admins.role, "Super Admin"))
      .limit(1);
    return admin ?? null;
  },

  /** Ensure the seed Super Admin exists in the DB */
  async ensureSuperAdmin(email: string, fullName: string) {
    const existing = await AdminsService.getByEmail(email);
    if (!existing) {
      await db.insert(admins).values({
        fullName,
        email: email.toLowerCase(),
        role: "Super Admin",
        isActive: true,
      });
      console.log(`✅ Super Admin seeded: ${email}`);
    } else if (existing.role !== "Super Admin") {
      await db
        .update(admins)
        .set({ role: "Super Admin", updatedAt: new Date() })
        .where(eq(admins.email, email.toLowerCase()));
      console.log(`✅ Super Admin role restored for: ${email}`);
    }
  },
};
