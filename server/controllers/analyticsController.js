"use strict";
const Interview = require("../models/Interview");

exports.getUserAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;
    const { days = 30 } = req.query;
    const since = new Date(Date.now() - parseInt(days) * 24 * 60 * 60 * 1000);

    const [scoreHistory, typeBreak, diffBreak, monthlyTrend] = await Promise.all([
      Interview.find({ user: userId, status: "Completed", createdAt: { $gte: since } })
        .sort({ createdAt: 1 }).select("overallScore technicalScore communicationScore createdAt jobRole"),
      Interview.aggregate([{ $match: { user: userId } }, { $group: { _id: "$interviewType", count: { $sum: 1 }, avgScore: { $avg: "$overallScore" } } }]),
      Interview.aggregate([{ $match: { user: userId } }, { $group: { _id: "$difficulty", count: { $sum: 1 } } }]),
      Interview.aggregate([
        { $match: { user: userId, status: "Completed" } },
        { $group: { _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } }, count: { $sum: 1 }, avgScore: { $avg: "$overallScore" } } },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]),
    ]);

    res.json({ success: true, analytics: { scoreHistory, typeBreakdown: typeBreak, difficultyBreakdown: diffBreak, monthlyTrend } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
