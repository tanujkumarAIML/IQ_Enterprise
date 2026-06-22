"use strict";
const mongoose = require("mongoose");

const versionSchema = new mongoose.Schema({
  fileName: String, fileUrl: String, publicId: String,
  atsScore: Number, overallRating: Number, createdAt: { type: Date, default: Date.now },
}, { _id: false });

const resumeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  fileName: { type: String, required: true },
  fileUrl: { type: String, required: true },
  publicId: { type: String, required: true },
  fileSize: { type: Number, default: 0 },
  fileType: { type: String, default: "pdf" },
  extractedText: { type: String, default: "" },
  atsScore: { type: Number, default: 0 },
  grammarScore: { type: Number, default: 0 },
  formattingScore: { type: Number, default: 0 },
  keywordScore: { type: Number, default: 0 },
  overallRating: { type: Number, default: 0 },
  extractedSkills: [{ type: String }],
  missingSkills: [{ type: String }],
  matchedKeywords: [{ type: String }],
  suggestions: [{ type: String }],
  grammarIssues: [{ type: String }],
  strengths: [{ type: String }],
  improvements: [{ type: String }],
  jobRole: { type: String, default: "" },
  analyzed: { type: Boolean, default: false },
  analyzedAt: { type: Date, default: null },
  versions: [versionSchema],
}, { timestamps: true });

module.exports = mongoose.model("Resume", resumeSchema);
