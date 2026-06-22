"use strict";
/**
 * Interview Controller
 * Questions generated LIVE from Gemini using resume + role context.
 * No pre-loaded question bank.
 */
const Interview = require("../models/Interview");
const Resume    = require("../models/Resume");
const User      = require("../models/User");
const {
  generateResumeAwareQuestions,
  evaluateAllAnswers,
  evaluateSingleAnswer,
  generateInterviewReport,
} = require("../services/geminiService");
const logger = require("../utils/logger");

/* ─── Create Interview + Generate AI Questions ─────────────── */
exports.createInterview = async (req, res) => {
  try {
    const {
      jobRole, experience, interviewType, difficulty,
      company, questionCount = 10,
    } = req.body;

    if (!jobRole?.trim()) {
      return res.status(400).json({ success: false, message: "Job role is required." });
    }

    // Fetch candidate's resume for personalized questions
    let resumeText = "";
    let skills     = [];
    try {
      const resume = await Resume.findOne({ user: req.user._id });
      if (resume) {
        resumeText = resume.extractedText || "";
        skills     = resume.extractedSkills || [];
      }
    } catch (err) {
      logger.warn("Resume fetch failed (non-critical):", err.message);
    }

    logger.info(`Generating ${questionCount} questions for: ${jobRole} | ${interviewType} | ${difficulty} | resume: ${!!resumeText}`);

    // Generate questions live from Gemini using resume context
    const questions = await generateResumeAwareQuestions({
      jobRole:       jobRole.trim(),
      experience:    Number(experience) || 0,
      interviewType: interviewType || "Mixed",
      difficulty:    difficulty    || "Medium",
      company:       company       || "",
      resumeText,
      skills,
      count: Math.min(Math.max(Number(questionCount) || 10, 5), 20),
    });

    if (!questions?.length) {
      return res.status(500).json({
        success: false,
        message: "AI failed to generate questions. Check your GEMINI_API_KEY and try again.",
      });
    }

    const interview = await Interview.create({
      user:          req.user._id,
      jobRole:       jobRole.trim(),
      experience:    Number(experience) || 0,
      interviewType: interviewType || "Mixed",
      difficulty:    difficulty    || "Medium",
      company:       company       || "",
      questions,
      status:        "In Progress",
      voiceEnabled:  req.body.voiceEnabled  || false,
      videoEnabled:  req.body.videoEnabled  || false,
    });

    res.status(201).json({
      success:   true,
      message:   "Interview created with AI-generated questions.",
      interview,
      meta: {
        questionsGenerated: questions.length,
        resumeUsed:         !!resumeText,
        skillsUsed:         skills.length,
      },
    });
  } catch (err) {
    logger.error("createInterview error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ─── List User's Interviews ───────────────────────────────── */
exports.getInterviews = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, type, difficulty } = req.query;
    const filter = { user: req.user._id };
    if (status)     filter.status        = status;
    if (type)       filter.interviewType = type;
    if (difficulty) filter.difficulty    = difficulty;

    const skip  = (parseInt(page) - 1) * parseInt(limit);
    const total = await Interview.countDocuments(filter);
    const interviews = await Interview.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select("-answers.betterAnswer"); // trim payload

    res.json({
      success:    true,
      count:      interviews.length,
      total,
      page:       parseInt(page),
      pages:      Math.ceil(total / parseInt(limit)),
      interviews,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ─── Single Interview ─────────────────────────────────────── */
exports.getInterview = async (req, res) => {
  try {
    const iv = await Interview.findOne({ _id: req.params.id, user: req.user._id });
    if (!iv) return res.status(404).json({ success: false, message: "Interview not found." });
    res.json({ success: true, interview: iv });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ─── Submit Interview — Batch AI Evaluation ───────────────── */
exports.submitInterview = async (req, res) => {
  try {
    const { answers, duration, bodyLanguageScore, eyeContactScore } = req.body;
    const iv = await Interview.findOne({ _id: req.params.id, user: req.user._id });

    if (!iv)                         return res.status(404).json({ success: false, message: "Interview not found." });
    if (iv.status === "Completed")   return res.status(400).json({ success: false, message: "Already submitted." });

    // Get resume text for context-aware evaluation
    let resumeText = "";
    try {
      const resume = await Resume.findOne({ user: req.user._id });
      if (resume) resumeText = resume.extractedText || "";
    } catch {}

    const texts = (answers || []).map((a) => (typeof a === "string" ? a : a?.answer || ""));

    logger.info(`Evaluating ${iv.questions.length} answers for: ${iv.jobRole}`);

    // Single Gemini call evaluates ALL answers holistically
    const ai = await evaluateAllAnswers(iv.questions, texts, iv.jobRole, resumeText);

    // Build detailed answer objects
    iv.answers = iv.questions.map((q, i) => ({
      question:           q,
      answer:             texts[i] || "",
      feedback:           ai.answerFeedback?.[i]  || "",
      betterAnswer:       ai.betterAnswers?.[i]   || "",
      score:              ai.answerScores?.[i]    || 0,
      technicalScore:     0,
      communicationScore: 0,
      confidenceScore:    0,
      grammarScore:       0,
      keywords:           ai.keywords             || [],
    }));

    iv.overallScore       = ai.overallScore       || 0;
    iv.technicalScore     = ai.technicalScore     || 0;
    iv.communicationScore = ai.communicationScore || 0;
    iv.confidenceScore    = ai.confidenceScore    || 0;
    iv.hrScore            = ai.hrScore            || 0;
    iv.grammarScore       = ai.grammarScore       || 0;
    iv.bodyLanguageScore  = bodyLanguageScore     || ai.bodyLanguageScore || 70;
    iv.eyeContactScore    = eyeContactScore       || 75;
    iv.strengths          = ai.strengths          || [];
    iv.weaknesses         = ai.weaknesses         || [];
    iv.suggestions        = ai.suggestions        || [];
    iv.aiFeedback         = ai.feedback           || "";
    iv.recommendation     = ai.recommendation     || "";
    iv.status             = "Completed";
    iv.duration           = duration              || 0;
    await iv.save();

    // Update user statistics
    const allCompleted = await Interview.find({ user: req.user._id, status: "Completed" });
    await User.findByIdAndUpdate(req.user._id, {
      totalInterviews:     await Interview.countDocuments({ user: req.user._id }),
      completedInterviews: allCompleted.length,
      avgScore:            Math.round(allCompleted.reduce((s, x) => s + x.overallScore, 0) / allCompleted.length),
      bestScore:           Math.max(...allCompleted.map((x) => x.overallScore)),
    });

    // Generate improvement plan (async, non-blocking)
    generateInterviewReport({
      jobRole:    iv.jobRole,
      scores: {
        overall:       iv.overallScore,
        technical:     iv.technicalScore,
        communication: iv.communicationScore,
        confidence:    iv.confidenceScore,
        hr:            iv.hrScore,
      },
      strengths:  iv.strengths,
      weaknesses: iv.weaknesses,
    }).then(async (report) => {
      if (report?.executiveSummary) {
        await Interview.findByIdAndUpdate(iv._id, {
          $set: { "aiFeedback": iv.aiFeedback + "\n\n" + report.executiveSummary },
        });
      }
    }).catch(() => {});

    res.json({
      success:  true,
      message:  "Interview submitted and evaluated!",
      interview: iv,
      report:    ai,
      meta: {
        resumeContextUsed: !!resumeText,
        hiringProbability: ai.hiringProbability || 0,
        topicsMissed:      ai.topicsMissed      || [],
      },
    });
  } catch (err) {
    logger.error("submitInterview error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ─── Real-time Single Answer Evaluation ──────────────────── */
exports.evaluateAnswer = async (req, res) => {
  try {
    const { question, answer, jobRole } = req.body;
    if (!question) return res.status(400).json({ success: false, message: "Question is required." });

    // Get resume for context
    let resumeContext = "";
    try {
      const resume = await Resume.findOne({ user: req.user._id });
      if (resume) resumeContext = (resume.extractedSkills || []).join(", ");
    } catch {}

    const result = await evaluateSingleAnswer(
      question, answer, jobRole || "Software Developer", resumeContext
    );

    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ─── Regenerate Questions for Same Interview ─────────────── */
exports.regenerateQuestions = async (req, res) => {
  try {
    const iv = await Interview.findOne({ _id: req.params.id, user: req.user._id });
    if (!iv) return res.status(404).json({ success: false, message: "Interview not found." });

    let resumeText = "";
    let skills     = [];
    try {
      const resume = await Resume.findOne({ user: req.user._id });
      if (resume) { resumeText = resume.extractedText || ""; skills = resume.extractedSkills || []; }
    } catch {}

    const questions = await generateResumeAwareQuestions({
      jobRole:       iv.jobRole,
      experience:    iv.experience,
      interviewType: iv.interviewType,
      difficulty:    iv.difficulty,
      company:       iv.company,
      resumeText,
      skills,
      count: iv.questions.length || 10,
    });

    iv.questions = questions;
    iv.answers   = [];
    iv.status    = "In Progress";
    await iv.save();

    res.json({ success: true, message: "New questions generated!", interview: iv });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ─── Delete Interview ─────────────────────────────────────── */
exports.deleteInterview = async (req, res) => {
  try {
    const iv = await Interview.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!iv) return res.status(404).json({ success: false, message: "Interview not found." });
    res.json({ success: true, message: "Interview deleted." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
