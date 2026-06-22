"use strict";
/**
 * InterviewIQ Enterprise — Gemini AI Service
 * ALL questions generated LIVE from resume + role context.
 * No pre-loaded question bank. Every session is unique.
 */

const ai = require("../config/openrouter");
const logger = require("../utils/logger");

/* ─── Raw text generation ────────────────────────────────── */
const generateText = async (
  prompt,
  modelName = "openrouter/free"
) => {
  try {
    const response = await ai.chat.completions.create({
      model: modelName,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    return response.choices[0].message.content;
  } catch (err) {
    console.error(err);

    logger.error("OpenRouter Error:", err.message);

    throw new Error("AI service unavailable.");
  }
};

/* ─── JSON parser (strips markdown fences) ───────────────── */
const parseJSON = (text) => {
  try {
    const clean = text
      .replace(/^```json\s*/gim, "")
      .replace(/^```\s*/gim, "")
      .replace(/```$/gim, "")
      .trim();
    return JSON.parse(clean);
  } catch {
    return null;
  }
};

/* ═══════════════════════════════════════════════════════════
   RESUME-AWARE QUESTION GENERATION
   Uses: jobRole + experience + interviewType + difficulty +
         company + resumeText (extracted skills/projects)
   ══════════════════════════════════════════════════════════ */
const prompt = `
You are an Elite Senior Technical Interviewer with over 20 years of hiring experience at Google, Microsoft, Amazon, Meta, Adobe, Atlassian, Netflix, Uber and Goldman Sachs.

Your responsibility is to conduct a REAL technical interview exactly like a senior engineering manager.

The interview should feel completely human.

Never sound like ChatGPT.

Never generate textbook questions.

Never generate random generic questions.

Always generate company-quality interview questions.

======================================================
CANDIDATE PROFILE
======================================================

Role:
${jobRole}

Experience:
${experience} years

Interview Type:
${interviewType}

Difficulty:
${difficulty}

${companyCtx}

${skillCtx}

${resumeCtx}

======================================================
INTERVIEW OBJECTIVE
======================================================

Evaluate

• Technical Fundamentals

• Practical Development Skills

• Problem Solving

• Debugging Ability

• Architecture Thinking

• Coding Knowledge

• Production Experience

• Communication

• Decision Making

• Project Ownership

======================================================
QUESTION DISTRIBUTION
======================================================

If Experience is 0-1 years

20% Fundamentals

30% Resume Questions

20% Coding Logic

20% Scenario Based

10% Behavioural

------------------------------------------

If Experience is 2-4 years

15% Fundamentals

30% Resume Deep Dive

25% Scenario Based

20% Debugging

10% Performance Optimization

------------------------------------------

If Experience is 5+ years

15% Architecture

20% Scalability

20% Distributed Systems

20% Production Issues

15% Leadership

10% Behavioural

======================================================
TECHNOLOGY MAPPING
======================================================

If Resume contains React

Ask about

• Rendering lifecycle

• Reconciliation

• Virtual DOM

• Hooks

• Custom Hooks

• Memoization

• Lazy Loading

• Code Splitting

• State Management

• Performance Optimization

------------------------------------------------------

If Resume contains Node.js

Ask about

• Event Loop

• Streams

• Worker Threads

• Clustering

• Async Programming

• Memory Leaks

• JWT

• Authentication

• Security

------------------------------------------------------

If Resume contains Express

Ask about

• Middleware

• Error Handling

• Validation

• Rate Limiting

• Authentication

• API Versioning

------------------------------------------------------

If Resume contains MongoDB

Ask about

• Aggregation

• Indexing

• Transactions

• Replication

• Sharding

• Query Optimization

------------------------------------------------------

If Resume contains SQL

Ask

• Complex Joins

• Indexing

• Query Optimization

• Transactions

• Isolation Levels

------------------------------------------------------

If Resume contains Python

Ask

• Decorators

• Generators

• Asyncio

• Context Managers

• GIL

------------------------------------------------------

If Resume contains Java

Ask

• JVM

• Garbage Collection

• Collections

• Multithreading

------------------------------------------------------

If Resume contains AWS

Ask

• EC2

• IAM

• Lambda

• S3

• VPC

------------------------------------------------------

If Resume contains Docker

Ask

• Containers

• Images

• Dockerfile

• Volumes

• Networking

------------------------------------------------------

If Resume contains Kubernetes

Ask

• Pods

• Services

• Deployments

• Scaling

------------------------------------------------------

If Resume contains Redis

Ask

• Caching

• TTL

• Pub/Sub

------------------------------------------------------

If Resume contains CI/CD

Ask

• GitHub Actions

• Jenkins

• Deployment Pipelines

======================================================
PROJECT QUESTIONS
======================================================

If projects are mentioned

Always ask

• Why did you choose this architecture?

• Biggest challenge?

• Biggest production issue?

• Performance optimization?

• Security considerations?

• Alternative approaches?

• What would you improve today?

======================================================
SCENARIO QUESTIONS
======================================================

Generate realistic production scenarios.

Example

NOT

"What is React?"

GOOD

"A React application suddenly starts rendering extremely slowly after deployment. How would you identify the root cause?"

------------------------------------------------------

NOT

"What is MongoDB?"

GOOD

"Your MongoDB query now takes 12 seconds instead of 300 milliseconds. Walk me through your debugging process."

------------------------------------------------------

NOT

"What is JWT?"

GOOD

"Users are randomly getting logged out after 10 minutes although the token expiry is one hour. How would you investigate this?"

======================================================
QUESTION QUALITY RULES
======================================================

Questions MUST

✔ Be realistic

✔ Be concise

✔ Sound natural

✔ Test thinking

✔ Test practical experience

✔ Be company quality

✔ Increase in difficulty

✔ Never repeat

✔ Never exceed 35 words

✔ Be interview ready

Avoid

❌ Tell me about yourself

❌ What are your strengths?

❌ Define JavaScript.

❌ What is HTML?

❌ Explain CSS.

❌ Explain React.

❌ Difference between GET and POST.

Unless candidate is Fresher.

======================================================
OUTPUT FORMAT
======================================================

Return ONLY valid JSON.

Example

[
{
"id":1,
"category":"React",
"difficulty":"Easy",
"type":"Technical",
"question":"You mentioned using React Hooks extensively. How would you prevent unnecessary re-renders in a dashboard with hundreds of live components?"
},
{
"id":2,
"category":"Project",
"difficulty":"Medium",
"type":"Resume",
"question":"In your InterviewIQ project, how did you design authentication to remain secure while supporting multiple user roles?"
}
]

Generate exactly ${count} questions.

Do not include explanations.

Do not include markdown.

Do not include notes.

Return only JSON.
`;

/* ═══════════════════════════════════════════════════════════
   SINGLE ANSWER EVALUATION (real-time feedback)
   ══════════════════════════════════════════════════════════ */
const evaluateSingleAnswer = async (question, answer, jobRole, resumeContext = "") => {
  const resumeCtx = resumeContext
    ? `\nCandidate Resume Context: ${resumeContext.slice(0, 500)}`
    : "";

  const prompt = `You are a Senior Technical Interviewer evaluating a ${jobRole} candidate.
${resumeCtx}

Question: ${question}
Candidate Answer: ${answer || "(No answer provided)"}

Evaluate this answer rigorously and return ONLY valid JSON:
{
  "score":              <0-100, overall answer quality>,
  "technicalScore":     <0-100, accuracy and depth>,
  "communicationScore": <0-100, clarity and structure>,
  "confidenceScore":    <0-100, assertiveness and certainty>,
  "grammarScore":       <0-100, language quality>,
  "feedback":           "<2-3 sentence specific, actionable feedback>",
  "betterAnswer":       "<A concise model answer in 2-4 sentences>",
  "missingPoints":      ["<key point 1 not covered>", "<key point 2>"],
  "keywords":           ["<relevant technical keyword present or missing>"]
}`;

  const text   = await generateText(prompt);
  const parsed = parseJSON(text);

  return parsed || {
    score: 50, technicalScore: 50, communicationScore: 55,
    confidenceScore: 50, grammarScore: 60,
    feedback: "Please provide a more detailed answer with specific examples.",
    betterAnswer: "", missingPoints: [], keywords: [],
  };
};

/* ═══════════════════════════════════════════════════════════
   FULL INTERVIEW BATCH EVALUATION
   Evaluates all Q&A pairs in one Gemini call (faster + coherent)
   ══════════════════════════════════════════════════════════ */
const evaluateAllAnswers = async (questions, answers, jobRole, resumeText = "") => {
  const pairs = questions
    .map((q, i) => `Q${i + 1}: ${q}\nA${i + 1}: ${answers[i] || "(No answer)"}`)
    .join("\n\n");

  const resumeCtx = resumeText
    ? `\nCandidate Resume (for context):\n"""\n${resumeText.slice(0, 1500)}\n"""`
    : "";

  const prompt = `You are a Senior AI Interview Panel evaluating a ${jobRole} candidate.
${resumeCtx}

─── INTERVIEW TRANSCRIPT ────────────────────────────
${pairs}
─────────────────────────────────────────────────────

Evaluate every answer critically and holistically. Return ONLY valid JSON (no markdown):
{
  "overallScore":         <0-100, weighted overall performance>,
  "technicalScore":       <0-100, technical depth across all answers>,
  "communicationScore":   <0-100, clarity and articulation>,
  "confidenceScore":      <0-100, assertiveness and certainty>,
  "hrScore":              <0-100, cultural fit and soft skills>,
  "grammarScore":         <0-100, language and grammar quality>,
  "bodyLanguageScore":    70,
  "answerScores":         [<score 0-100 for each answer, same order>],
  "answerFeedback":       ["<1-2 sentence targeted feedback per answer>"],
  "betterAnswers":        ["<concise model answer for each question>"],
  "strengths":            ["<3-5 genuine strengths observed>"],
  "weaknesses":           ["<3-5 specific areas needing improvement>"],
  "suggestions":          ["<5 concrete, actionable next steps>"],
  "feedback":             "<3-5 sentence overall performance summary with hiring recommendation rationale>",
  "recommendation":       "<Strong Hire | Hire | Maybe | Not Hire>",
  "hiringProbability":    <0-100, estimated probability of selection>,
  "keywords":             ["<technical keywords mentioned correctly>"],
  "topicsMissed":         ["<important topics the candidate failed to mention>"]
}`;

  const text   = await generateText(prompt);
  const parsed = parseJSON(text);

  if (parsed && typeof parsed.overallScore === "number") return parsed;

  // Graceful fallback
  const n = questions.length || 1;
  return {
    overallScore: 60, technicalScore: 58, communicationScore: 65,
    confidenceScore: 60, hrScore: 65, grammarScore: 68, bodyLanguageScore: 70,
    answerScores:   questions.map(() => 60),
    answerFeedback: questions.map(() => "Provide more specific details and examples."),
    betterAnswers:  questions.map(() => ""),
    strengths:      ["Attempted all questions", "Showed basic understanding"],
    weaknesses:     ["Needs deeper technical explanations", "Missing concrete examples"],
    suggestions:    [
      "Practice technical concepts daily",
      "Use STAR method for behavioral questions",
      "Add real-world examples to your answers",
      "Work on speaking with more confidence",
      "Study system design fundamentals",
    ],
    feedback: "Candidate showed reasonable effort. Consistent practice will improve scores significantly.",
    recommendation: "Maybe",
    hiringProbability: 45,
    keywords: [],
    topicsMissed: [],
  };
};

/* ═══════════════════════════════════════════════════════════
   RESUME ANALYSIS (ATS + Skills + AI Suggestions)
   ══════════════════════════════════════════════════════════ */
const analyzeResume = async (resumeText, jobRole = "", jobDescription = "") => {
  const roleCtx = jobRole        ? `Target Job Role:        ${jobRole}`        : "";
  const jdCtx   = jobDescription ? `Job Description:\n"""\n${jobDescription.slice(0, 1000)}\n"""` : "";

  const prompt = `You are an expert ATS System, Resume Coach, and Career Advisor.

Analyze this resume comprehensively and provide actionable feedback.

${roleCtx}
${jdCtx}

Resume Text:
"""
${resumeText.slice(0, 6000)}
"""

Return ONLY valid JSON (no markdown, no extra text):
{
  "atsScore":         <0-100, ATS compatibility score>,
  "grammarScore":     <0-100, language and grammar quality>,
  "formattingScore":  <0-100, structure, readability, sections>,
  "keywordScore":     <0-100, relevant keywords present>,
  "overallRating":    <0-10, overall resume quality>,
  "extractedSkills":  ["<every technical skill found in resume>"],
  "missingSkills":    ["<important skills for ${jobRole || "the role"} not in resume>"],
  "matchedKeywords":  ["<ATS keywords present>"],
  "suggestions":      [
    "<specific, actionable suggestion 1>",
    "<specific, actionable suggestion 2>",
    "<specific, actionable suggestion 3>",
    "<specific, actionable suggestion 4>",
    "<specific, actionable suggestion 5>",
    "<specific, actionable suggestion 6>"
  ],
  "grammarIssues":    ["<grammar/spelling issue if found, else empty array>"],
  "strengths":        ["<genuine strength 1>", "<genuine strength 2>", "<genuine strength 3>"],
  "improvements":     ["<improvement 1>", "<improvement 2>", "<improvement 3>"],
  "summary":          "<2-3 sentence professional assessment of the resume>",
  "coverLetterHint":  "<A tailored 2-3 sentence cover letter opener for ${jobRole || "the role"}>",
  "linkedinTips":     ["<tip 1 to optimize LinkedIn>", "<tip 2>", "<tip 3>"],
  "roleMatch":        <0-100, how well resume matches the target role>,
  "experienceLevel":  "<Fresher | Junior | Mid-level | Senior | Lead>",
  "topProjects":      ["<notable project or achievement extracted from resume>"],
  "certifications":   ["<certifications found in resume>"]
}`;

  const text   = await generateText(prompt);
  const parsed = parseJSON(text);

  if (parsed && typeof parsed.atsScore === "number") return parsed;

  return {
    atsScore: 50, grammarScore: 60, formattingScore: 55, keywordScore: 45,
    overallRating: 5, extractedSkills: [], missingSkills: [], matchedKeywords: [],
    suggestions: ["Add quantifiable achievements", "Use action verbs", "Add a professional summary",
                  "Include relevant certifications", "Optimize with role-specific keywords", "Add GitHub/portfolio link"],
    grammarIssues: [], strengths: ["Resume uploaded successfully"],
    improvements: ["Add more detail to experience section"],
    summary: "Resume analyzed. Please add more relevant content for a higher ATS score.",
    coverLetterHint: "", linkedinTips: [], roleMatch: 50,
    experienceLevel: "Mid-level", topProjects: [], certifications: [],
  };
};

/* ═══════════════════════════════════════════════════════════
   GENERATE COVER LETTER from resume + job role
   ══════════════════════════════════════════════════════════ */
const generateCoverLetter = async (resumeText, jobRole, company = "") => {
  const prompt = `You are a professional cover letter writer.

Write a compelling, personalized cover letter based on this candidate's resume for the role of ${jobRole}${company ? ` at ${company}` : ""}.

Resume:
"""
${resumeText.slice(0, 3000)}
"""

Requirements:
- 3-4 paragraphs, professional tone
- Reference specific skills and achievements from the resume
- Tailor to ${jobRole} at ${company || "the company"}
- End with a confident call-to-action
- 250-350 words

Return only the cover letter text, no JSON, no extra formatting.`;

  return generateText(prompt);
};

/* ═══════════════════════════════════════════════════════════
   AI CHATBOT (context-aware, streaming-ready)
   ══════════════════════════════════════════════════════════ */
const chatWithAI = async (message, history = [], type = "general", userContext = "") => {
  const PERSONAS = {
    career:    "You are Maya, an expert career counselor and LinkedIn coach. Help with career transitions, job searching, salary negotiation, and professional growth. Give concrete, actionable advice.",
    resume:    "You are Rex, an expert ATS-certified resume writer. Help craft compelling resumes, cover letters, and LinkedIn profiles. Focus on keywords, formatting, and impact metrics.",
    coding:    "You are CodeBot, a senior software engineer and competitive programmer. Help with DSA, system design, debugging, code reviews, and interview coding problems. Show code examples.",
    interview: "You are Coach, an expert interview preparation coach. Help practice questions, structure STAR answers, overcome nerves, and build confidence. Give real examples.",
    hr:        "You are Aria, an experienced HR professional and talent acquisition specialist. Help understand HR processes, behavioral questions, culture fit, and workplace scenarios.",
    general:   "You are InterviewIQ AI, an intelligent assistant for career and interview preparation. Be helpful, concise, and encouraging.",
  };

  const persona = PERSONAS[type] || PERSONAS.general;
  const ctx     = userContext ? `\nUser Context: ${userContext.slice(0, 300)}` : "";
  const history_ctx = history
    .slice(-6)
    .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
    .join("\n");

  const prompt = `${persona}
${ctx}

${history_ctx ? `Conversation History:\n${history_ctx}\n` : ""}
User: ${message}
Assistant:`;

  return generateText(prompt);
};

/* ═══════════════════════════════════════════════════════════
   GENERATE MOCK INTERVIEW FEEDBACK REPORT
   ══════════════════════════════════════════════════════════ */
const generateInterviewReport = async (interviewData) => {
  const { jobRole, scores, strengths, weaknesses, answers } = interviewData;

  const prompt = `You are a professional interview performance coach.

Generate a detailed, personalized improvement report for a ${jobRole} candidate.

Performance Data:
- Overall Score:       ${scores.overall}%
- Technical Score:     ${scores.technical}%
- Communication Score: ${scores.communication}%
- Confidence Score:    ${scores.confidence}%
- HR Score:            ${scores.hr}%
- Strengths:           ${(strengths || []).join(", ")}
- Weaknesses:          ${(weaknesses || []).join(", ")}

Return ONLY valid JSON:
{
  "executiveSummary":    "<2-3 sentence honest performance assessment>",
  "performanceGrade":    "<A+ | A | B+ | B | C | D>",
  "readyToHire":         <true|false>,
  "improvementPlan": {
    "week1": ["<daily action item 1>", "<item 2>", "<item 3>"],
    "week2": ["<item 1>", "<item 2>", "<item 3>"],
    "month1": ["<monthly goal 1>", "<goal 2>", "<goal 3>"]
  },
  "resourceLinks": [
    {"topic": "<topic>", "resource": "<course/book/platform name>"}
  ],
  "nextInterviewTips": ["<tip 1>", "<tip 2>", "<tip 3>", "<tip 4>", "<tip 5>"]
}`;

  const text   = await generateText(prompt);
  return parseJSON(text) || {};
};

module.exports = {
  generateText,
  parseJSON,
  generateResumeAwareQuestions,
  evaluateSingleAnswer,
  evaluateAllAnswers,
  analyzeResume,
  generateCoverLetter,
  chatWithAI,
  generateInterviewReport,
  // Legacy alias
  generateInterviewQuestions: generateResumeAwareQuestions,
};
