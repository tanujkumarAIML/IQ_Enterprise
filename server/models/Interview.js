"use strict";
const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, default: "" },
  feedback: { type: String, default: "" },
  score: { type: Number, default: 0, min: 0, max: 100 },
  technicalScore: { type: Number, default: 0 },
  communicationScore: { type: Number, default: 0 },
  confidenceScore: { type: Number, default: 0 },
  grammarScore: { type: Number, default: 0 },
  keywords: [{ type: String }],
  betterAnswer: { type: String, default: "" },
}, { _id: false });

const interviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  jobRole: { type: String, required: true, trim: true },
  company: { type: String, default: "", trim: true },
  experience: { type: Number, default: 0 },
  interviewType: {
    type: String,
    enum: ["HR","Technical","Behavioral","System Design","DSA","Mixed",
           "Java","Python","JavaScript","React","Node.js","MongoDB","SQL",
           "OS","CN","DBMS","OOP","Cloud","DevOps","AI","ML","DS","Security"],
    default: "Mixed",
  },
  difficulty: { type: String, enum: ["Easy","Medium","Hard"], default: "Medium" },
  questions: [{ type: String }],
  answers: [answerSchema],
  // AI Scores
  overallScore: { type: Number, default: 0 },
  technicalScore: { type: Number, default: 0 },
  communicationScore: { type: Number, default: 0 },
  confidenceScore: { type: Number, default: 0 },
  bodyLanguageScore: { type: Number, default: 0 },
  grammarScore: { type: Number, default: 0 },
  hrScore: { type: Number, default: 0 },
  eyeContactScore: { type: Number, default: 0 },
  // AI Insights
  aiFeedback: { type: String, default: "" },
  strengths: [{ type: String }],
  weaknesses: [{ type: String }],
  suggestions: [{ type: String }],
  recommendation: { type: String, default: "" },
  status: { type: String, enum: ["Pending","In Progress","Completed"], default: "Pending" },
  duration: { type: Number, default: 0 },
  voiceEnabled: { type: Boolean, default: false },
  videoEnabled: { type: Boolean, default: false },
}, { timestamps: true });

interviewSchema.index({ user: 1, createdAt: -1 });
interviewSchema.index({ user: 1, status: 1 });
interviewSchema.index({ interviewType: 1 });

module.exports = mongoose.model("Interview", interviewSchema);
