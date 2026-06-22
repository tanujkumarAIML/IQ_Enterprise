"use strict";
const { getIO } = require("../config/socket");
const logger    = require("../utils/logger");

const emitToUser = (userId, event, data) => {
  try {
    const io = getIO();
    io.to(String(userId)).emit(event, data);
  } catch (err) {
    logger.warn("Socket emit failed:", err.message);
  }
};

const emitNotification = (userId, message, type = "info") => {
  emitToUser(userId, "notification", { message, type, timestamp: new Date() });
};

module.exports = { emitToUser, emitNotification };
