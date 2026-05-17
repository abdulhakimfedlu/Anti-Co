import { db } from "../config/database";
import { messages } from "../db/schema/messages";
import { eq, desc, count, and, sql } from "drizzle-orm";
import type { NewMessage } from "../db/schema/messages";

export const MessagesService = {
  async create(data: NewMessage) {
    const [msg] = await db.insert(messages).values(data).returning();
    return msg;
  },

  async list(filter: { status?: "new" | "resolved"; page: number; limit: number }) {
    const { status, page, limit } = filter;
    const offset = (page - 1) * limit;

    const where = status ? eq(messages.status, status) : undefined;

    const [rows, [{ total }]] = await Promise.all([
      db
        .select()
        .from(messages)
        .where(where)
        .orderBy(desc(messages.createdAt))
        .limit(limit)
        .offset(offset),
      db
        .select({ total: count() })
        .from(messages)
        .where(where),
    ]);

    return {
      data: rows,
      pagination: {
        total: Number(total),
        page,
        limit,
        pages: Math.ceil(Number(total) / limit),
      },
    };
  },

  async getById(id: string) {
    const [msg] = await db
      .select()
      .from(messages)
      .where(eq(messages.id, id))
      .limit(1);
    return msg ?? null;
  },

  async resolve(id: string) {
    const [msg] = await db
      .update(messages)
      .set({
        status: "resolved",
        resolvedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(and(eq(messages.id, id), eq(messages.status, "new")))
      .returning();
    return msg ?? null;
  },

  async delete(id: string) {
    const [deleted] = await db
      .delete(messages)
      .where(and(eq(messages.id, id), eq(messages.status, "resolved")))
      .returning();
    return deleted ?? null;
  },

  async getStats() {
    const [stats] = await db
      .select({
        total: count(),
        newCount: sql<number>`count(*) filter (where status = 'new')`,
        resolvedCount: sql<number>`count(*) filter (where status = 'resolved')`,
      })
      .from(messages);
    return {
      total: Number(stats.total),
      new: Number(stats.newCount),
      resolved: Number(stats.resolvedCount),
    };
  },
};
