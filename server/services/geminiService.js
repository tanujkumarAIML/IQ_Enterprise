"use strict";
/**
 * InterviewIQ Enterprise — AI Service
 * ALL questions generated LIVE from resume + role context.
 * No pre-loaded question bank. Every session is unique.
 */

const ai     = require("../config/openrouter");
const logger = require("../utils/logger");

/* ─── Model Selection ─────────────────────────────────────── */
const MODEL = process.env.OPENROUTER_MODEL || "google/gemini-2.5-flash";

/* ─── FIX 2: Universal text extractor (handles all OpenRouter response shapes) ─── */
const extractText = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(extractText).join("");
  if (typeof value === "object") {
    if (value.text)    return extractText(value.text);
    if (value.content) return extractText(value.content);
    if (value.parts)   return extractText(value.parts);
    if (value.message) return extractText(value.message);
    if (value.output)  return extractText(value.output);
    return "";
  }
  return String(value);
};

/* ─── FIX 1: System prompt added | FIX 6: temperature 0.2 | FIX 7: response cleanup ─── */
const generateText = async (prompt, modelName = MODEL) => {

  // FIX 1 + FIX 3 + FIX 5: System prompt forces rich Markdown, real code, proper fences
  const SYSTEM_PROMPT = `You are InterviewIQ AI. Behave exactly like ChatGPT.

Always produce rich Markdown.

Rules:
- Use headings
- Use bullet points
- Use numbered lists
- Use tables when useful
- Use fenced code blocks with the language name
- Never answer in one long paragraph
- Explain first, then show code
- Never output JSON unless explicitly asked
- Never output [object Object]
- Always wrap code like this:

\`\`\`python
print("Hello")
\`\`\`

Never omit triple backticks.
When writing code: always generate complete, runnable code. Never write placeholders. Never write "Complete code here".`;

  const attempt = async () => {
    const response = await ai.chat.completions.create({
      model: modelName,
      messages: [
        { role: "system", content: SYSTEM_PROMPT }, // FIX 1
        { role: "user",   content: prompt },
      ],
      temperature: 0.2,  // FIX 6: deterministic, better for coding
      top_p: 0.9,
      frequency_penalty: 0.2,
      presence_penalty: 0.2,
      max_tokens: 3500,
    });

    const content = response?.choices?.[0]?.message?.content;
    return extractText(content); // FIX 2
  };

  try {
    const result = await attempt();
    // FIX 7: normalize code fences and clean output
    return result
      .replace(/```python/g, "```python")
      .replace(/```js\b/g, "```javascript")
      .replace(/\r/g, "")
      .trim();
  } catch (err) {
    logger.error("OpenRouter Error (attempt 1):", err.message);
    try {
      const result = await attempt();
      return result
        .replace(/```python/g, "```python")
        .replace(/```js\b/g, "```javascript")
        .replace(/\r/g, "")
        .trim();
    } catch (err2) {
      logger.error("OpenRouter Error (attempt 2):", err2.message);
      throw new Error("InterviewIQ AI is temporarily unavailable. Please try again.");
    }
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
    if (clean.startsWith("[")) return JSON.parse(clean);
    if (clean.startsWith("{")) return JSON.parse(clean);
    return null;
  } catch {
    return null;
  }
};

/* ─── Company-specific focus areas ───────────────────────── */
const getCompanyFocus = (company = "") => {
  const c = company.toLowerCase();
  if (c.includes("google"))    return "Focus on DSA, System Design, follow-up questions, optimization, and scalability.";
  if (c.includes("amazon"))    return "Focus on Leadership Principles, ownership mindset, STAR-format, backend systems, and APIs.";
  if (c.includes("microsoft")) return "Focus on debugging, software architecture, OOP principles, and design patterns.";
  if (c.includes("meta") || c.includes("facebook")) return "Focus on React internals, frontend performance, Virtual DOM, and state management.";
  if (c.includes("tcs"))       return "Focus on OOP, DBMS, OS concepts, networking fundamentals, and HR questions.";
  if (c.includes("infosys"))   return "Focus on Java, SQL, HR questions, and communication skills.";
  if (c.includes("wipro"))     return "Focus on project experience, programming basics, and problem-solving approach.";
  return "";
};

/* ═══════════════════════════════════════════════════════════
   RESUME-AWARE QUESTION GENERATION
   ══════════════════════════════════════════════════════════ */
const generateResumeAwareQuestions = async ({
  jobRole,
  experience    = 0,
  interviewType = "Mixed",
  difficulty    = "Medium",
  company       = "",
  resumeText    = "",
  skills        = [],
  count         = 10,
}) => {
  const companyFocus = getCompanyFocus(company);
  const skillList    = skills.slice(0, 15).join(", ");
  const resumeSnip   = resumeText ? resumeText.slice(0, 1800) : "";

  const prompt = `You are a Senior FAANG Interviewer. Generate EXACTLY ${count} interview questions.

CANDIDATE PROFILE
- Role: ${jobRole}
- Experience: ${experience} year${experience !== 1 ? "s" : ""}
- Interview Type: ${interviewType}
- Difficulty: ${difficulty}
${company   ? `- Company: ${company}`  : ""}
${skillList ? `- Skills: ${skillList}` : ""}
${companyFocus}
${resumeSnip ? `\nResume:\n"""\n${resumeSnip}\n"""` : ""}

DIFFICULTY PROGRESSION
- Q1–Q2: Easy — fundamentals, basic concepts
- Q3–Q5: Medium — practical, project-based, debugging
- Q6–Q8: Hard — architecture, optimization, trade-offs
- Q9–Q10: Expert — edge cases, deep technical, industry decisions

RULES
1. EXACTLY ${count} unique questions — no repeated concepts
2. If resume has projects, ask specific implementation questions, not "tell me about your project"
   Example — BAD: "Tell me about your Food Delivery project."
   Example — GOOD: "In your Food Delivery project you used JWT. Why not OAuth? How would you scale it to 1M users?"
3. Questions get progressively harder
4. Interview type "${interviewType}": ${
    interviewType === "HR"            ? "STAR-based behavioral questions only" :
    interviewType === "DSA"           ? "Arrays, Trees, Graphs, DP, time/space complexity" :
    interviewType === "System Design" ? "Distributed systems, microservices, caching, scalability" :
    "mix of technical and practical questions"
  }
5. Do NOT ask "Tell me about yourself" or "Why should we hire you" unless type is HR
6. Each question: 1–3 sentences max — concise and direct
7. Return ONLY a valid JSON array of question strings. No markdown. No explanation. No numbering.

Example output:
["Question 1?", "Question 2?", "Question 3?"]`;

  const text   = await generateText(prompt);
  const parsed = parseJSON(text);

  if (Array.isArray(parsed) && parsed.length >= 5) {
    return parsed.map(String).slice(0, count);
  }

  // Fallback: extract lines that look like questions
  const lines = text
    .split("\n")
    .map((l) => l.replace(/^\d+[.)]\s*/, "").replace(/^["']|["']$/g, "").trim())
    .filter((l) => l.length > 15 && l.includes("?"));

  if (lines.length >= 3) return lines.slice(0, count);

  throw new Error("AI returned invalid question format. Please retry.");
};

/* ═══════════════════════════════════════════════════════════
   FOLLOW-UP QUESTION GENERATION
   ══════════════════════════════════════════════════════════ */
const generateFollowupQuestion = async (question, answer, jobRole) => {
  const prompt = `You are a strict ${jobRole} Technical Interviewer.

Previous Question: ${question}
Candidate's Answer: ${answer || "(No answer)"}

Generate ONE sharp follow-up question.
- If answer is weak: challenge what they missed or got wrong
- If answer is good: go deeper than what they said
- If answer mentions a project: ask about specific implementation decisions or trade-offs

Return only the question. No explanation. No numbering.`;

  const text = await generateText(prompt);
  return text.trim().replace(/^["']|["']$/g, "");
};

/* ═══════════════════════════════════════════════════════════
   SINGLE ANSWER EVALUATION (real-time feedback)
   ══════════════════════════════════════════════════════════ */
const evaluateSingleAnswer = async (question, answer, jobRole, resumeContext = "") => {
  const resumeCtx = resumeContext ? `Resume context: ${resumeContext.slice(0, 400)}\n` : "";

  const prompt = `You are a strict Senior Interviewer for ${jobRole}. Do NOT be polite or inflate scores.
${resumeCtx}
Q: ${question}
A: ${answer || "(No answer)"}

Scoring rules:
- Deduct heavily for vague, textbook-only, or example-less answers
- Deduct if depth is missing or answer sounds memorized
- Score 0-40 only if answer is wrong or irrelevant

Return ONLY valid JSON:
{
  "technicalAccuracy":  <0-100>,
  "depth":              <0-100>,
  "clarity":            <0-100>,
  "confidence":         <0-100>,
  "problemSolving":     <0-100>,
  "industryKnowledge":  <0-100>,
  "codeQuality":        <0-100>,
  "examples":           <0-100>,
  "overallScore":       <weighted average of above>,
  "communicationScore": <0-100>,
  "grammarScore":       <0-100>,
  "strengths":          ["<genuine strength in this answer>"],
  "weaknesses":         ["<specific weakness in this answer>"],
  "followupQuestion":   "<one sharp follow-up based on this answer>",
  "interviewerComment": "<what a real interviewer would say>",
  "feedback":           "<2-3 sentences — strict, specific, actionable>",
  "betterAnswer":       "<concise model answer in 2-4 sentences>",
  "missingPoints":      ["<key point not covered>"],
  "keywords":           ["<relevant keywords present or missing>"]
}`;

  const text   = await generateText(prompt);
  const parsed = parseJSON(text);

  if (parsed) {
    if (!parsed.overallScore) {
      const fields = ["technicalAccuracy","depth","clarity","confidence","problemSolving","industryKnowledge","codeQuality","examples"];
      const vals   = fields.map((f) => parsed[f] || 0);
      parsed.overallScore = Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
    }
    parsed.score           = parsed.overallScore;
    parsed.technicalScore  = parsed.technicalAccuracy;
    parsed.confidenceScore = parsed.confidence;
    return parsed;
  }

  return {
    score: 50, overallScore: 50, technicalAccuracy: 50, depth: 50,
    clarity: 55, confidence: 50, problemSolving: 50, industryKnowledge: 50,
    codeQuality: 50, examples: 50, technicalScore: 50,
    communicationScore: 55, grammarScore: 60, confidenceScore: 50,
    strengths: [], weaknesses: [],
    followupQuestion: "", interviewerComment: "",
    feedback: "Provide a more detailed answer with specific examples.",
    betterAnswer: "", missingPoints: [], keywords: [],
  };
};

/* ═══════════════════════════════════════════════════════════
   FULL INTERVIEW BATCH EVALUATION
   ══════════════════════════════════════════════════════════ */
const evaluateAllAnswers = async (questions, answers, jobRole, resumeText = "") => {
  const pairs = questions
    .map((q, i) => `Q${i + 1}: ${q}\nA${i + 1}: ${answers[i] || "(No answer)"}`)
    .join("\n\n");

  const resumeCtx = resumeText
    ? `Resume:\n"""\n${resumeText.slice(0, 1200)}\n"""\n`
    : "";

  const prompt = `You are the Hiring Committee for a ${jobRole} role. Do NOT inflate scores. Reject weak answers firmly.
${resumeCtx}
Interview Transcript:
${pairs}

Decide: Strong Hire | Hire | Borderline | Reject — and explain why with specific references to their answers.

Return ONLY valid JSON:
{
  "overallScore":          <0-100>,
  "technicalScore":        <0-100>,
  "communicationScore":    <0-100>,
  "confidenceScore":       <0-100>,
  "hrScore":               <0-100>,
  "grammarScore":          <0-100>,
  "bodyLanguageScore":     70,
  "answerScores":          [<score per answer>],
  "answerFeedback":        ["<1-2 sentence per answer>"],
  "betterAnswers":         ["<model answer per question>"],
  "strengths":             ["<3-5 genuine strengths>"],
  "weaknesses":            ["<3-5 specific weaknesses>"],
  "suggestions":           ["<5 concrete next steps>"],
  "interviewerSummary":    "<2-3 sentences from interviewer's perspective>",
  "managerComments":       "<what the hiring manager would say>",
  "technicalVerdict":      "<Pass | Fail | Marginal>",
  "behavioralVerdict":     "<Pass | Fail | Marginal>",
  "systemDesignVerdict":   "<Pass | Fail | Marginal | N/A>",
  "codingVerdict":         "<Pass | Fail | Marginal | N/A>",
  "resumeVerdict":         "<Strong | Average | Weak>",
  "feedback":              "<3-5 sentence honest overall summary>",
  "recommendation":        "<Strong Hire | Hire | Borderline | Reject>",
  "hiringProbability":     <0-100>,
  "keywords":              ["<technical keywords mentioned correctly>"],
  "topicsMissed":          ["<important topics candidate failed to cover>"],
  "overallGrade":          "<A+ | A | B+ | B | C | D>",
  "interviewerComments":   "<candid comment a panel interviewer would share internally>",
  "technicalRoundResult":  "<Pass | Fail | Marginal>",
  "hrRoundResult":         "<Pass | Fail | Marginal>",
  "nextRoundReady":        <true|false>,
  "salaryLevel":           "<Entry | Mid | Senior | Lead>",
  "experienceLevel":       "<Fresher | Junior | Mid-level | Senior | Lead>"
}`;

  const text   = await generateText(prompt);
  const parsed = parseJSON(text);

  if (parsed && typeof parsed.overallScore === "number") return parsed;

  return {
    overallScore: 60, technicalScore: 58, communicationScore: 65,
    confidenceScore: 60, hrScore: 65, grammarScore: 68, bodyLanguageScore: 70,
    answerScores:    questions.map(() => 60),
    answerFeedback:  questions.map(() => "Provide more specific details and examples."),
    betterAnswers:   questions.map(() => ""),
    strengths:       ["Attempted all questions", "Showed basic understanding"],
    weaknesses:      ["Needs deeper technical explanations", "Missing concrete examples"],
    suggestions: [
      "Practice technical concepts daily",
      "Use STAR method for behavioral questions",
      "Add real-world examples to your answers",
      "Work on speaking with more confidence",
      "Study system design fundamentals",
    ],
    interviewerSummary:  "Candidate showed reasonable effort but lacked depth.",
    managerComments:     "Would need significant improvement before hire consideration.",
    technicalVerdict:    "Marginal", behavioralVerdict: "Marginal",
    systemDesignVerdict: "N/A",     codingVerdict:      "N/A",
    resumeVerdict:       "Average",
    feedback:            "Consistent practice will improve scores significantly.",
    recommendation:      "Borderline", hiringProbability: 45,
    keywords: [], topicsMissed: [],
    overallGrade:         "C", interviewerComments: "",
    technicalRoundResult: "Marginal", hrRoundResult: "Marginal",
    nextRoundReady: false, salaryLevel: "Mid", experienceLevel: "Mid-level",
  };
};

/* ═══════════════════════════════════════════════════════════
   RESUME ANALYSIS (ATS + Multi-perspective)
   ══════════════════════════════════════════════════════════ */
const analyzeResume = async (resumeText, jobRole = "", jobDescription = "") => {
  const roleCtx = jobRole        ? `Target Role: ${jobRole}\n`                        : "";
  const jdCtx   = jobDescription ? `JD:\n"""\n${jobDescription.slice(0, 800)}\n"""\n` : "";

  const prompt = `You are a panel of experts: ATS System, Recruiter, HR Manager, and Technical Reviewer.
Analyze this resume from all four perspectives.

${roleCtx}${jdCtx}Resume:
"""
${resumeText.slice(0, 5000)}
"""

Return ONLY valid JSON:
{
  "atsScore":                    <0-100>,
  "hrScore":                     <0-100>,
  "recruiterScore":              <0-100>,
  "technicalScore":              <0-100>,
  "linkedinScore":               <0-100>,
  "githubScore":                 <0-100>,
  "portfolioScore":              <0-100>,
  "grammarScore":                <0-100>,
  "formattingScore":             <0-100>,
  "keywordScore":                <0-100>,
  "overallRating":               <0-10>,
  "extractedSkills":             ["<every technical skill found>"],
  "missingSkills":               ["<important skills missing for ${jobRole || "the role"}>"],
  "matchedKeywords":             ["<ATS keywords present>"],
  "suggestions":                 ["<6 specific, actionable suggestions>"],
  "grammarIssues":               ["<grammar/spelling issues if found>"],
  "strengths":                   ["<3 genuine strengths>"],
  "improvements":                ["<3 improvements>"],
  "summary":                     "<2-3 sentence professional assessment>",
  "coverLetterHint":             "<tailored 2-3 sentence opener for ${jobRole || "the role"}>",
  "linkedinTips":                ["<3 LinkedIn optimization tips>"],
  "roleMatch":                   <0-100>,
  "experienceLevel":             "<Fresher | Junior | Mid-level | Senior | Lead>",
  "topProjects":                 ["<notable project extracted from resume>"],
  "certifications":              ["<certifications found>"],
  "githubSuggestions":           ["<specific improvements for GitHub profile>"],
  "portfolioSuggestions":        ["<specific improvements for portfolio/personal site>"],
  "projectSuggestions":          ["<new projects candidate should build>"],
  "atsMissingKeywords":          ["<high-value ATS keywords not present>"],
  "interviewPreparationTopics":  ["<topics candidate should prepare based on this resume>"]
}`;

  const text   = await generateText(prompt);
  const parsed = parseJSON(text);

  if (parsed && typeof parsed.atsScore === "number") return parsed;

  return {
    atsScore: 50, hrScore: 50, recruiterScore: 50, technicalScore: 50,
    linkedinScore: 40, githubScore: 40, portfolioScore: 40,
    grammarScore: 60, formattingScore: 55, keywordScore: 45, overallRating: 5,
    extractedSkills: [], missingSkills: [], matchedKeywords: [],
    suggestions: [
      "Add quantifiable achievements", "Use action verbs", "Add a professional summary",
      "Include relevant certifications", "Optimize with keywords", "Add GitHub/portfolio link",
    ],
    grammarIssues: [], strengths: ["Resume uploaded successfully"],
    improvements: ["Add more detail to experience section"],
    summary: "Resume analyzed. Add more relevant content for a higher ATS score.",
    coverLetterHint: "", linkedinTips: [], roleMatch: 50,
    experienceLevel: "Mid-level", topProjects: [], certifications: [],
    githubSuggestions: [], portfolioSuggestions: [], projectSuggestions: [],
    atsMissingKeywords: [], interviewPreparationTopics: [],
  };
};

/* ═══════════════════════════════════════════════════════════
   GENERATE COVER LETTER
   ══════════════════════════════════════════════════════════ */
const generateCoverLetter = async (resumeText, jobRole, company = "") => {
  const prompt = `You are a professional cover letter writer. Write a FAANG-quality cover letter for a ${jobRole}${company ? ` at ${company}` : ""} role.

Resume:
"""
${resumeText.slice(0, 2500)}
"""

Requirements:
- Confident, results-driven, concise
- Mention measurable achievements from the resume
- Use ATS keywords naturally
- 3-4 paragraphs, 250-320 words
- Strong opening hook, compelling middle, confident close with call-to-action

Return ONLY the cover letter text.`;

  return generateText(prompt);
};

/* ═══════════════════════════════════════════════════════════
   AI CHATBOT (multi-persona)
   ══════════════════════════════════════════════════════════ */
const chatWithAI = async (message, history = [], type = "general", userContext = "") => {

  // FIX 4: Stronger coding persona with explicit format
  const PERSONAS = {
    career: `You are Maya, an expert career counselor and LinkedIn coach.
Help with career transitions, job searching, salary negotiation, and professional growth.
Give concrete, actionable advice. Use markdown — headings, bullets, numbered steps.
Keep answers focused and concise. No filler.`,

    resume: `You are an ATS Resume Reviewer.
Review resumes from four perspectives: ATS System, Recruiter, Hiring Manager, Technical Lead.
Give specific, strict, actionable feedback. Never inflate scores.
Use bullet points. Keep it scannable.`,

    // FIX 4: Completely rewritten coding persona
    coding: `You are a Senior Google Staff Software Engineer.

For EVERY coding question, answer in this EXACT format — never skip a section:

## Explanation
Explain the concept in 2-4 sentences.

## Algorithm
Numbered step-by-step logic.

## Code
Complete, runnable code in a fenced block with language name. Never write placeholder code.

## Dry Run
Walk through a small example input/output.

## Time Complexity
State Big-O with a one-line reason.

## Space Complexity
State Big-O with a one-line reason.

## Interview Tip
One common mistake or tip for this specific topic.`,

    interview: `You are a Senior FAANG Interviewer.
- Ask one question at a time
- Score every answer out of 10 with specific reasoning
- Point out mistakes immediately
- Give one improvement tip
- Ask a follow-up based on the answer
Be tough but fair. Keep responses concise.`,

    hr: `You are Aria, an experienced HR professional.
Help with behavioral questions, culture fit, and workplace scenarios.
Use STAR method. Give concrete scripts candidates can practice.
Keep answers focused — no fluff.`,

    systemdesign: `You are Arch, a Staff Engineer specializing in distributed systems.

For every system design question:
1. Clarify requirements and scale
2. High-level architecture (described clearly)
3. Deep-dive into key components
4. Trade-offs discussion
5. Bottlenecks and failure scenarios

Use markdown. Think at millions-of-users scale. Be concise.`,

    behavioral: `You are Bex, a behavioral interview coach.
Train candidates on STAR method (Situation, Task, Action, Result).

For every behavioral question:
- Give a strong STAR-format example answer
- Highlight what makes it compelling
- Point out common mistakes

Keep answers tight and practical.`,

    mockinterviewer: `You are a strict interviewer from Google/Amazon/Meta.
- Ask one question at a time
- Score immediately (1-10) with specific reasoning
- Give one improvement tip
- Ask a follow-up or move on
Professional, direct, tough but fair.`,

    salary: `You are Sam, a compensation and negotiation expert.
Help candidates negotiate salaries, evaluate offers, and handle counter-offers.
Give specific negotiation scripts. Use real market data ranges when possible.
Be concise and practical.`,

    roadmap: `You are Guide, a tech career roadmap advisor.
For any tech role, give a structured learning path:
- Topics to learn in order
- Resources (courses, books, YouTube channels)
- Realistic timeline
- Projects to build
- Interview prep milestones
Use numbered steps and clear headings.`,

    placement: `You are PlaceBot, a campus placement expert.
Help freshers with aptitude prep, coding rounds, HR scripts, and company-specific tips.
Be encouraging but practical. Keep answers focused.`,

    general: `You are InterviewIQ AI, an advanced interview preparation assistant.
Answer like a knowledgeable senior professional.
- Use markdown: headings, bullets, numbered steps, bold, tables, code blocks
- Never write one huge paragraph
- Give real examples and practical advice
- For coding questions: explain first, then show complete runnable code
- For career advice: give a structured roadmap
- For resume questions: give a recruiter's perspective
Keep every answer focused and well-structured. No unnecessary padding.`,
  };

  const persona     = PERSONAS[type] || PERSONAS.general;
  const ctx         = userContext ? `\nUser Context: ${userContext.slice(0, 300)}` : "";
  const history_ctx = history
    .slice(-10)
    .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
    .join("\n");

  const prompt = `${persona}
${ctx}
${history_ctx ? `Conversation History:\n${history_ctx}\n` : ""}
User: ${message}`;

  return generateText(prompt);
};

/* ═══════════════════════════════════════════════════════════
   INTERVIEW REPORT GENERATION
   ══════════════════════════════════════════════════════════ */
const generateInterviewReport = async (interviewData) => {
  const { jobRole, scores, strengths, weaknesses } = interviewData;

  const prompt = `You are a professional interview coach. Generate a detailed improvement report for a ${jobRole} candidate.

Scores — Overall: ${scores.overall}% | Technical: ${scores.technical}% | Communication: ${scores.communication}% | Confidence: ${scores.confidence}% | HR: ${scores.hr}%
Strengths: ${(strengths || []).join(", ")}
Weaknesses: ${(weaknesses || []).join(", ")}

Return ONLY valid JSON:
{
  "executiveSummary":   "<2-3 sentence honest assessment>",
  "performanceGrade":   "<A+ | A | B+ | B | C | D>",
  "overallGrade":       "<same as performanceGrade>",
  "hireProbability":    <0-100>,
  "readyToHire":        <true|false>,
  "technicalScore":     <0-100>,
  "behaviorScore":      <0-100>,
  "communicationScore": <0-100>,
  "improvementPlan": {
    "week1":  ["<3 daily action items>"],
    "week30": ["<3 monthly goals>"]
  },
  "roadmap": {
    "sevenDayPlan":  ["<day-by-day focus areas>"],
    "thirtyDayPlan": ["<week-by-week milestones>"]
  },
  "learningRoadmap": {
    "fundamentals":  ["<core topics to master first>"],
    "intermediate":  ["<mid-level topics>"],
    "advanced":      ["<advanced/expert topics>"]
  },
  "recommendedCourses":   ["<course name + platform>"],
  "recommendedBooks":     ["<book title + author>"],
  "recommendedProjects":  ["<project idea that strengthens this profile>"],
  "youtubeChannels":      ["<channel name + what it covers>"],
  "leetcodeTopics":       ["<DSA topic to practice>"],
  "leetcodePlan":         ["<structured LeetCode plan>"],
  "systemDesignTopics":   ["<system design topic>"],
  "systemDesignPlan":     ["<structured system design study plan>"],
  "hrPracticeQuestions":  ["<behavioral question to practice>"],
  "nextInterviewTips":    ["<5 tips for next interview>"],
  "books":                ["<must-read book for this role>"]
}`;

  const text   = await generateText(prompt);
  return parseJSON(text) || {};
};

module.exports = {
  generateText,
  parseJSON,
  generateResumeAwareQuestions,
  generateFollowupQuestion,
  evaluateSingleAnswer,
  evaluateAllAnswers,
  analyzeResume,
  generateCoverLetter,
  chatWithAI,
  generateInterviewReport,
  generateInterviewQuestions: generateResumeAwareQuestions,
};
