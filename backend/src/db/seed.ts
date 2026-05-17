import { db } from "../config/database";
import { admins } from "./schema/admins";
import { services } from "./schema/services";
import { env } from "../config/env";
import { eq } from "drizzle-orm";

export async function seed() {
  console.log("🌱 Seeding database...");

  // ── Seed super admin ───────────────────────────────────────
  const existing = await db
    .select()
    .from(admins)
    .where(eq(admins.email, env.seed.adminEmail))
    .limit(1);

  if (existing.length === 0) {
    await db.insert(admins).values({
      fullName: env.seed.adminName,
      email: env.seed.adminEmail,
      role: "Super Admin",
    });
    console.log(`✅ Super admin created: ${env.seed.adminEmail}`);
  } else {
    console.log("⏭  Super admin already exists, skipping.");
  }

  console.log("✅ Seeding complete");
}
