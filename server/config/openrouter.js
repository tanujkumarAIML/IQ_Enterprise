"use strict";

require("dotenv").config();

const OpenAI = require("openai");

/**
 * OpenRouter Configuration
 * ----------------------------------------
 * Works in:
 *  - Local Development
 *  - GitHub Actions
 *  - Render Deployment
 *
 * GitHub Actions doesn't have a .env file,
 * so we use a dummy key to prevent import errors.
 * The real key will be provided through
 * Render Environment Variables in production.
 */

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY || "dummy-key",
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "https://github.com/tanujkumarAIML/IQ_Enterprise",
    "X-Title": "InterviewIQ Enterprise",
  },
});

module.exports = client;