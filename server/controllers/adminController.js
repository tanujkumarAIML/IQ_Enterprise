"use strict";
const User      = require("../models/User");
const Interview = require("../models/Interview");
const Resume    = require("../models/Resume");

exports.getAdminDashboard = async (req, res) => {
  try {
    const sixAgo = new Date(); sixAgo.setMonth(sixAgo.getMonth() - 6);
    const [totalUsers, totalInterviews, totalResumes, completed, recentUsers, recentInterviews, monthlySignups] = await Promise.all([
      User.countDocuments(),
      Interview.countDocuments(),
      Resume.countDocuments(),
      Interview.countDocuments({ status: "Completed" }),
      User.find().sort({ createdAt: -1 }).limit(10).select("name email role plan createdAt lastLogin totalInterviews"),
      Interview.find().sort({ createdAt: -1 }).limit(10).populate("user", "name email"),
      User.aggregate([
        { $match: { createdAt: { $gte: sixAgo } } },
        { $group: { _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } }, count: { $sum: 1 } } },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]),
    ]);

    res.json({ success: true, dashboard: { stats: { totalUsers, totalInterviews, totalResumes, completedInterviews: completed }, recentUsers, recentInterviews, monthlySignups } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, role } = req.query;
    const filter = {};
    if (search) filter.$or = [{ name: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }];
    if (role) filter.role = role;
    const skip  = (parseInt(page) - 1) * parseInt(limit);
    const total = await User.countDocuments(filter);
    const users = await User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)).select("-password");
    res.json({ success: true, total, page: parseInt(page), users });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.updateUser = async (req, res) => {
  try {
    const { role, isActive, plan } = req.body;
    const update = {};
    if (role     !== undefined) update.role     = role;
    if (isActive !== undefined) update.isActive = isActive;
    if (plan     !== undefined) update.plan     = plan;
    const user = await User.findByIdAndUpdate(req.params.id, { $set: update }, { new: true }).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found." });
    res.json({ success: true, message: "User updated.", user });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found." });
    await Promise.all([Interview.deleteMany({ user: req.params.id }), Resume.deleteMany({ user: req.params.id })]);
    res.json({ success: true, message: "User and data deleted." });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getAnalytics = async (req, res) => {
  try {
    const [totalUsers, totalInterviews, avgScoreArr, planBreak] = await Promise.all([
      User.countDocuments(),
      Interview.countDocuments({ status: "Completed" }),
      Interview.aggregate([{ $group: { _id: null, avg: { $avg: "$overallScore" } } }]),
      User.aggregate([{ $group: { _id: "$plan", count: { $sum: 1 } } }]),
    ]);
    res.json({ success: true, analytics: { totalUsers, totalInterviews, avgScore: Math.round(avgScoreArr[0]?.avg || 0), planBreakdown: planBreak } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
