"use strict";
const { Server } = require("socket.io");
const logger = require("../utils/logger");
let io;
const initSocket = (server) => {
  io = new Server(server, {
    cors: { origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true },
    transports: ["websocket", "polling"],
  });
  io.on("connection", (socket) => {
    logger.info(`Socket connected: ${socket.id}`);
    socket.on("join_room", (userId) => socket.join(userId));
    socket.on("interview_frame", (data) => socket.to(data.roomId).emit("frame_received", data));
    socket.on("disconnect", () => logger.info(`Socket disconnected: ${socket.id}`));
  });
  logger.info("Socket.io initialized");
  return io;
};
const getIO = () => { if (!io) throw new Error("Socket not initialized"); return io; };
module.exports = { initSocket, getIO };
