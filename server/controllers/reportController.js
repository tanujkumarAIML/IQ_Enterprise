"use strict";
const Interview = require("../models/Interview");

exports.getAllReports = async (req, res) => {
  try {
    const reports = await Interview.find({ user: req.user._id, status: "Completed" })
      .sort({ createdAt: -1 }).select("jobRole interviewType difficulty overallScore technicalScore communicationScore createdAt duration company");
    res.json({ success: true, count: reports.length, reports });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getReport = async (req, res) => {
  try {
    const report = await Interview.findOne({ _id: req.params.id, user: req.user._id });
    if (!report) return res.status(404).json({ success: false, message: "Report not found." });
    if (report.status !== "Completed") return res.status(400).json({ success: false, message: "Interview not completed." });
    res.json({ success: true, report });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getReportPDF = async (req, res) => {
  try {
    const iv = await Interview.findOne({ _id: req.params.id, user: req.user._id }).populate("user","name email");
    if (!iv) return res.status(404).json({ success: false, message: "Report not found." });
    res.json({
      success: true,
      reportData: {
        candidate: { name: iv.user?.name, email: iv.user?.email },
        interview: { jobRole: iv.jobRole, company: iv.company, type: iv.interviewType, difficulty: iv.difficulty, date: iv.createdAt, duration: iv.duration },
        scores: { overall: iv.overallScore, technical: iv.technicalScore, communication: iv.communicationScore, confidence: iv.confidenceScore, hr: iv.hrScore, grammar: iv.grammarScore },
        feedback: iv.aiFeedback, strengths: iv.strengths, weaknesses: iv.weaknesses, suggestions: iv.suggestions, answers: iv.answers,
      },
    });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
