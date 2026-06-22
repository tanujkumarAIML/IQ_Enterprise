"use strict";
const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  date: { type: Date, default: Date.now },
  event: { type: String, required: true },
  data: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

analyticsSchema.index({ user: 1, date: -1 });
analyticsSchema.index({ event: 1 });

module.exports = mongoose.model("Analytics", analyticsSchema);
