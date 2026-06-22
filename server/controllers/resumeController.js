"use strict";
const Resume    = require("../models/Resume");
const cloudinary = require("../config/cloudinary");
const { analyzeResume } = require("../services/geminiService");

exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "Upload a PDF or DOCX file." });

    const existing = await Resume.findOne({ user: req.user._id });
    if (existing) {
      cloudinary.uploader.destroy(existing.publicId, { resource_type: "raw" }).catch(() => {});
      await Resume.findByIdAndDelete(existing._id);
    }

    const resume = await Resume.create({
      user: req.user._id,
      fileName: req.file.originalname,
      fileUrl: req.file.path,
      publicId: req.file.filename,
      fileSize: req.file.size || 0,
      fileType: (req.file.originalname || "").endsWith(".docx") ? "docx" : "pdf",
    });

    res.status(201).json({ success: true, message: "Resume uploaded.", resume });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.analyzeResume = async (req, res) => {
  try {
    const { resumeText, jobRole } = req.body;
    const resume = await Resume.findOne({ user: req.user._id });
    if (!resume) return res.status(404).json({ success: false, message: "Upload a resume first." });

    const text = resumeText || resume.extractedText || "";
    if (!text || text.length < 50) return res.status(400).json({ success: false, message: "Resume text too short." });

    const ai = await analyzeResume(text, jobRole || "");

    Object.assign(resume, {
      extractedText: text, jobRole: jobRole || "",
      atsScore: ai.atsScore, grammarScore: ai.grammarScore,
      formattingScore: ai.formattingScore, keywordScore: ai.keywordScore,
      overallRating: ai.overallRating, extractedSkills: ai.extractedSkills,
      missingSkills: ai.missingSkills, matchedKeywords: ai.matchedKeywords,
      suggestions: ai.suggestions, grammarIssues: ai.grammarIssues,
      strengths: ai.strengths, improvements: ai.improvements,
      analyzed: true, analyzedAt: new Date(),
    });
    await resume.save();

    res.json({ success: true, message: "Resume analyzed.", resume, analysis: ai });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ user: req.user._id });
    if (!resume) return res.status(404).json({ success: false, message: "No resume found." });
    res.json({ success: true, resume });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ user: req.user._id });
    if (!resume) return res.status(404).json({ success: false, message: "No resume found." });
    cloudinary.uploader.destroy(resume.publicId, { resource_type: "raw" }).catch(() => {});
    await Resume.findByIdAndDelete(resume._id);
    res.json({ success: true, message: "Resume deleted." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
