import { WebSocketServer, WebSocket } from "ws";
import type { IncomingMessage } from "http";
import type { Server } from "http";
import { logger } from "./utils/logger";

interface WsClient extends WebSocket {
  isAlive: boolean;
}

let wss: WebSocketServer | null = null;

export function initWebSocket(server: Server): WebSocketServer {
  wss = new WebSocketServer({ server, path: "/ws" });

  wss.on("connection", (ws: WsClient, req: IncomingMessage) => {
    ws.isAlive = true;
    const ip = req.socket.remoteAddress ?? "unknown";
    logger.info(`WebSocket client connected from ${ip}. Total: ${wss!.clients.size}`);

    ws.on("pong", () => { ws.isAlive = true; });

    ws.on("close", () => {
      logger.info(`WebSocket client disconnected. Total: ${wss!.clients.size}`);
    });

    ws.on("error", (err) => {
      logger.error("WebSocket client error:", err.message);
    });

    // Send welcome message
    ws.send(JSON.stringify({ type: "CONNECTED", payload: { message: "Admin WS connected" } }));
  });

  // Heartbeat — ping every 30s, close dead connections
  const interval = setInterval(() => {
    wss!.clients.forEach((client) => {
      const ws = client as WsClient;
      if (!ws.isAlive) { ws.terminate(); return; }
      ws.isAlive = false;
      ws.ping();
    });
  }, 30_000);

  wss.on("close", () => clearInterval(interval));

  logger.info("✅ WebSocket server initialized on /ws");
  return wss;
}

/**
 * Broadcast a JSON message to all connected admin WebSocket clients.
 */
export function broadcast(payload: { type: string; payload: unknown }): void {
  if (!wss) return;
  const msg = JSON.stringify(payload);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(msg);
    }
  });
  logger.debug(`WS broadcast: ${payload.type} → ${wss.clients.size} clients`);
}
