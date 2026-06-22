"use strict";
const Analytics = require("../models/Analytics");

const track = async (userId, event, data = {}) => {
  try {
    await Analytics.create({ user: userId, event, data });
  } catch (err) {
    // Non-critical: don't throw
  }
};

const getUserAnalytics = async (userId, days = 30) => {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  return Analytics.find({ user: userId, date: { $gte: since } }).sort({ date: -1 }).limit(500);
};

module.exports = { track, getUserAnalytics };
