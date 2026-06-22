"use strict";
/**
 * Question Controller
 * Questions generated LIVE from Gemini AI based on role + resume.
 * No pre-loaded question bank needed.
 */
const { generateResumeAwareQuestions } = require("../services/geminiService");
const Resume = require("../models/Resume");
const logger = require("../utils/logger");

// Interview categories (for UI display only)
const CATEGORIES = [
  "HR","Behavioral","Technical","DSA","System Design",
  "Java","Python","JavaScript","React","Node.js","MongoDB","SQL",
  "OS","CN","DBMS","OOP","Cloud","DevOps","AI","ML","DS","Security","Aptitude",
];

const COMPANIES = [
  "Google","Amazon","Microsoft","Meta","Apple","Netflix","Adobe","Uber",
  "Oracle","Infosys","TCS","Wipro","Accenture","Cognizant","Capgemini","Deloitte","IBM",
];

/* ─── Generate Questions on-demand via Gemini ─────────────── */
exports.generateQuestions = async (req, res) => {
  try {
    const {
      jobRole   = "Software Engineer",
      category  = "Technical",
      difficulty = "Medium",
      company    = "",
      count      = 10,
    } = req.query;

    // Fetch user's resume for personalized questions
    let resumeText = "";
    let skills     = [];
    try {
      const resume = await Resume.findOne({ user: req.user._id });
      if (resume) {
        resumeText = resume.extractedText   || "";
        skills     = resume.extractedSkills || [];
      }
    } catch {}

    logger.info(`Generating ${count} ${category} questions for ${jobRole}`);

    const questions = await generateResumeAwareQuestions({
      jobRole,
      interviewType: category,
      difficulty,
      company,
      resumeText,
      skills,
      count: Math.min(Number(count) || 10, 20),
    });

    res.json({
      success:   true,
      questions,
      count:     questions.length,
      category,
      jobRole,
      aiGenerated: true,
      resumePersonalized: !!resumeText,
    });
  } catch (err) {
    logger.error("generateQuestions error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ─── Get available categories ────────────────────────────── */
exports.getCategories = (_req, res) => {
  res.json({ success: true, categories: CATEGORIES, companies: COMPANIES });
};
