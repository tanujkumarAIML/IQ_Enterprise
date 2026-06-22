"use strict";
const dns = require("node:dns");
dns.setServers([
  "1.1.1.1",
  "8.8.8.8"
]);
require("dotenv").config();

const http    = require("http");
const app     = require("./app");
const connectDB = require("./config/db");
const { initSocket } = require("./config/socket");
const logger  = require("./utils/logger");

// ── Connect Database ──────────────────────────────────────
connectDB();

const PORT   = process.env.PORT || 5000;
const server = http.createServer(app);

// ── Socket.io ─────────────────────────────────────────────
initSocket(server);

server.listen(PORT, () => {
  logger.info("==========================================");
  logger.info("🚀  InterviewIQ AI Enterprise Backend");
  logger.info(`🌐  http://localhost:${PORT}`);
  logger.info(`📦  Env: ${process.env.NODE_ENV || "development"}`);
  logger.info("==========================================");
});

// ── Graceful Shutdown ─────────────────────────────────────
const shutdown = (signal) => {
  logger.warn(`${signal} received. Shutting down...`);
  server.close(() => {
    logger.info("Server closed.");
    process.exit(0);
  });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT",  () => shutdown("SIGINT"));
process.on("unhandledRejection", (err) => {
  logger.error("Unhandled Rejection:", err.message);
  server.close(() => process.exit(1));
});
process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception:", err.message);
  process.exit(1);
});
