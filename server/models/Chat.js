"use strict";
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ["user","assistant","system"], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
}, { _id: false });

const chatSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  title: { type: String, default: "New Chat" },
  type: { type: String, enum: ["career","resume","coding","interview","hr","general"], default: "general" },
  messages: [messageSchema],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

chatSchema.index({ user: 1, updatedAt: -1 });

module.exports = mongoose.model("Chat", chatSchema);
