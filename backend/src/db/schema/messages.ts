import {
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";

export const messageStatusEnum = pgEnum("message_status", ["new", "resolved"]);
export const messagePriorityEnum = pgEnum("message_priority", [
  "Low",
  "Medium",
  "High",
  "Urgent",
]);

export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  senderName: text("sender_name"),                     // null = anonymous
  senderEmail: text("sender_email"),
  isAnonymous: boolean("is_anonymous").default(false).notNull(),
  subject: text("subject").notNull(),
  body: text("body").notNull(),
  category: text("category").notNull().default("General"),
  priority: messagePriorityEnum("priority").default("Medium").notNull(),
  status: messageStatusEnum("status").default("new").notNull(),
  resolvedAt: timestamp("resolved_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;
