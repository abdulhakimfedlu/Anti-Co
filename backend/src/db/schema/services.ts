import {
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
  pgEnum,
  integer,
} from "drizzle-orm/pg-core";

export const serviceStatusEnum = pgEnum("service_status", ["active", "hidden"]);

export const services = pgTable("services", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  titleAm: text("title_am"),                           // Amharic translation
  description: text("description"),
  descriptionAm: text("description_am"),
  category: text("category").notNull(),
  status: serviceStatusEnum("status").default("active").notNull(),
  isPopular: boolean("is_popular").default(false).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Service = typeof services.$inferSelect;
export type NewService = typeof services.$inferInsert;
