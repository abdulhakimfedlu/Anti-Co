import * as dotenv from "dotenv";
dotenv.config({ override: true });

const required = [
  "DATABASE_URL",
  "CLERK_PUBLISHABLE_KEY",
  "CLERK_SECRET_KEY",
  "CLERK_WEBHOOK_SECRET",
] as const;

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`❌ Missing required environment variable: ${key}\n   Copy .env.example to .env and fill in the values.`);
  }
}

export const env = {
  port: parseInt(process.env.PORT ?? "4000", 10),
  nodeEnv: process.env.NODE_ENV ?? "development",
  isDev: (process.env.NODE_ENV ?? "development") === "development",

  databaseUrl: process.env.DATABASE_URL!,

  clerkPublishableKey: process.env.CLERK_PUBLISHABLE_KEY!,
  clerkSecretKey: process.env.CLERK_SECRET_KEY!,
  clerkWebhookSecret: process.env.CLERK_WEBHOOK_SECRET!,

  allowedOrigins: (process.env.ALLOWED_ORIGINS ?? "http://localhost:3000,http://localhost:3001")
    .split(",")
    .map((o) => o.trim()),

  seed: {
    adminEmail: process.env.SEED_ADMIN_EMAIL ?? "fedluabdulhakim7@gmail.com",
    adminPassword: process.env.SEED_ADMIN_PASSWORD ?? "Adidig@#123",
    adminName: process.env.SEED_ADMIN_NAME ?? "Fedlu Abdulhakim",
  },
} as const;
