import http from "http";
import app from "./app";
import { env } from "./config/env";
import { testConnection } from "./config/database";
import { initWebSocket } from "./websocket";
import { seed } from "./db/seed";
import { logger } from "./utils/logger";

async function bootstrap() {
  // 1. Verify DB connection
  await testConnection();

  // 2. Seed initial data (super admin + default services)
  await seed();

  // 3. Create HTTP server from Express app
  const server = http.createServer(app);

  // 4. Attach WebSocket server
  initWebSocket(server);

  // 5. Start listening
  server.listen(env.port, () => {
    logger.info(`🚀 API server running on http://localhost:${env.port}`);
    logger.info(`🔌 WebSocket ready on ws://localhost:${env.port}/ws`);
    logger.info(`🌍 Environment: ${env.nodeEnv}`);
  });

  // Graceful shutdown
  process.on("SIGTERM", () => {
    logger.info("SIGTERM received — shutting down gracefully");
    server.close(() => {
      logger.info("HTTP server closed");
      process.exit(0);
    });
  });

  process.on("SIGINT", () => {
    logger.info("SIGINT received — shutting down");
    server.close(() => process.exit(0));
  });
}

bootstrap().catch((err) => {
  logger.error("❌ Failed to start server:", err);
  process.exit(1);
});
