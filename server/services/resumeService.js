"use strict";
/**
 * Resume Service — delegates to geminiService for AI analysis
 */
const { analyzeResume, generateCoverLetter } = require("./geminiService");

module.exports = { analyzeResume, generateCoverLetter };
