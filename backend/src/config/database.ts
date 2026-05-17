import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env } from "./env";
import * as schema from "../db/schema";

const pool = new Pool({
  connectionString: env.databaseUrl,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});

pool.on("error", (err) => {
  console.error("❌ PostgreSQL pool error:", err.message);
});

export const db = drizzle(pool, { schema });

export async function testConnection(): Promise<void> {
  const client = await pool.connect();
  await client.query("SELECT 1");
  client.release();
  console.log("✅ Database connected successfully");
}
