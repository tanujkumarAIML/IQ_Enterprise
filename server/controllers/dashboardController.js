"use strict";
const Interview = require("../models/Interview");
const Resume    = require("../models/Resume");
const User      = require("../models/User");

exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user._id;
    const [total, completed, pending, resumes, recent, resume, user, scoreTrend, typeBreak] = await Promise.all([
      Interview.countDocuments({ user: userId }),
      Interview.countDocuments({ user: userId, status: "Completed" }),
      Interview.countDocuments({ user: userId, status: { $in: ["Pending","In Progress"] } }),
      Resume.countDocuments({ user: userId }),
      Interview.find({ user: userId }).sort({ createdAt: -1 }).limit(6),
      Resume.findOne({ user: userId }),
      User.findById(userId),
      Interview.find({ user: userId, status: "Completed" }).sort({ createdAt: -1 }).limit(8).select("overallScore createdAt jobRole"),
      Interview.aggregate([
        { $match: { user: userId } },
        { $group: { _id: "$interviewType", count: { $sum: 1 } } },
      ]),
    ]);

    res.json({
      success: true,
      dashboard: {
        stats: {
          totalInterviews: total, completedInterviews: completed,
          pendingInterviews: pending, totalResumes: resumes,
          avgScore: user?.avgScore || 0, bestScore: user?.bestScore || 0,
        },
        latestInterviews: recent, latestResume: resume,
        scoreTrend: scoreTrend.reverse(),
        typeBreakdown: typeBreak,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
