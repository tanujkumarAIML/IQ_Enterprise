"use strict";
/**
 * Interview Service — delegates to geminiService
 * Kept for backward compatibility. All logic now in geminiService.js
 */
const {
  generateResumeAwareQuestions,
  evaluateAllAnswers,
  evaluateSingleAnswer,
  generateInterviewReport,
} = require("./geminiService");

module.exports = {
  generateInterviewQuestions: generateResumeAwareQuestions,
  evaluateAnswers: evaluateAllAnswers,
  evaluateSingleAnswer,
  generateInterviewReport,
  // Legacy: hiring probability util
  calculateHiringProbability: (score) => {
    if (score >= 90) return 95;
    if (score >= 80) return 85;
    if (score >= 70) return 70;
    if (score >= 60) return 55;
    return 30;
  },
};
