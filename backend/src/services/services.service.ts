import { db } from "../config/database";
import { services } from "../db/schema/services";
import { eq, asc, desc, count } from "drizzle-orm";
import type { NewService } from "../db/schema/services";

export const ServicesService = {
  async list(includeHidden = false) {
    const rows = await db
      .select()
      .from(services)
      .where(includeHidden ? undefined : eq(services.status, "active"))
      .orderBy(asc(services.sortOrder), asc(services.createdAt));
    return rows;
  },

  async getById(id: string) {
    const [svc] = await db
      .select()
      .from(services)
      .where(eq(services.id, id))
      .limit(1);
    return svc ?? null;
  },

  async create(data: NewService) {
    const [svc] = await db.insert(services).values(data).returning();
    return svc;
  },

  async update(id: string, data: Partial<NewService>) {
    const [svc] = await db
      .update(services)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(services.id, id))
      .returning();
    return svc ?? null;
  },

  async delete(id: string) {
    const [deleted] = await db
      .delete(services)
      .where(eq(services.id, id))
      .returning();
    return deleted ?? null;
  },

  async getPopular() {
    return db
      .select()
      .from(services)
      .where(eq(services.isPopular, true))
      .orderBy(desc(services.createdAt));
  },

  async getCount() {
    const [{ total }] = await db.select({ total: count() }).from(services);
    return Number(total);
  },
};
