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

/* ─── Raw text generation ────────────────────────────────── */
const generateText = async (prompt, modelName = MODEL) => {
  const attempt = async () => {
    const response = await ai.chat.completions.create({
      model: modelName,
      messages: [{ role: "user", content: prompt }],
      temperature:       0.85,
      top_p:             0.95,
      frequency_penalty: 0.4,
      presence_penalty:  0.5,
      max_tokens:        4000,
    });
    return response.choices[0].message.content;
  };

  try {
    return await attempt();
  } catch (err) {
    logger.error("OpenRouter Error (attempt 1):", err.message);
    try {
      return await attempt(); // retry once
    } catch (err2) {
      logger.error("OpenRouter Error (attempt 2):", err2.message);
      throw new Error("AI service unavailable.");
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
  experience  = 0,
  interviewType = "Mixed",
  difficulty  = "Medium",
  company     = "",
  resumeText  = "",
  skills      = [],
  count       = 10,
}) => {
  const companyFocus = getCompanyFocus(company);
  const skillList    = skills.slice(0, 15).join(", ");
  const resumeSnip   = resumeText ? resumeText.slice(0, 1800) : "";

  const prompt = `You are a Senior Technical Interviewer. Generate exactly ${count} interview questions for a ${jobRole} candidate (${experience} yr exp), interview type: ${interviewType}, difficulty: ${difficulty}${company ? `, company: ${company}` : ""}.

${skillList   ? `Skills: ${skillList}`    : ""}
${companyFocus ? companyFocus             : ""}
${resumeSnip  ? `Resume:\n"""\n${resumeSnip}\n"""` : ""}

Difficulty progression (STRICTLY follow this order):
Q1-2: Easy (foundational concepts)
Q3-5: Medium (scenario-based, how-would-you)
Q6-8: Hard (system design, architecture, trade-offs)
Q9-10: Expert (optimization, edge cases, deep-dive)

Rules:
- If resume mentions specific projects, ask about them directly (e.g. "How did you design X in your project?")
- If skills listed, ask internals — not just "what is React" but "explain reconciliation in React"
- Interview type mapping: HR→STAR behavioral | Technical→concepts+debugging | DSA→algorithms+complexity | System Design→architecture+scalability | Mixed→40% Technical, 30% Behavioral, 30% HR
- NO generic questions like "Tell me about yourself" unless type is HR
- Zero duplicates

Return ONLY a JSON array: ["Q1?", "Q2?", ..., "Q${count}?"]`;

  const text   = await generateText(prompt);
  const parsed = parseJSON(text);

  if (Array.isArray(parsed) && parsed.length >= 5) {
    return parsed.map(String).slice(0, count);
  }

  // Fallback: extract lines
  const lines = text
    .split("\n")
    .map((l) => l.replace(/^\d+[.)]\s*/, "").replace(/^["']|["']$/g, "").trim())
    .filter((l) => l.length > 15 && l.includes("?"));

  if (lines.length >= 3) return lines.slice(0, count);

  throw new Error("AI returned invalid question format. Please retry.");
};

/* ═══════════════════════════════════════════════════════════
   FOLLOW-UP / CROSS QUESTION GENERATION
   Called after candidate answers each question
   ══════════════════════════════════════════════════════════ */
const generateFollowupQuestion = async (question, answer, jobRole) => {
  const prompt = `You are a strict Technical Interviewer conducting a ${jobRole} interview.

Previous Question: ${question}
Candidate's Answer: ${answer || "(No answer)"}

Generate 1 sharp follow-up question that:
- Digs deeper into a weak or vague point in the answer
- Tests real understanding, not memorized definitions
- Challenges assumptions if the answer seems shallow

Return ONLY the follow-up question as plain text. No explanation.`;

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
- Deduct if industry practices or real-world usage not mentioned
- Score 0-40 only if answer is wrong or irrelevant

Evaluate on: Technical Accuracy, Depth, Examples Used, Clarity, Confidence, Problem Solving, Industry Practices, Code Quality (if applicable).

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
  "feedback":           "<2-3 sentences — strict, specific, actionable>",
  "betterAnswer":       "<concise model answer in 2-4 sentences>",
  "missingPoints":      ["<key point not covered>"],
  "keywords":           ["<relevant keywords present or missing>"]
}`;

  const text   = await generateText(prompt);
  const parsed = parseJSON(text);

  if (parsed) {
    // Calculate overallScore if AI didn't or we want our own
    if (!parsed.overallScore) {
      const fields = ["technicalAccuracy","depth","clarity","confidence","problemSolving","industryKnowledge","codeQuality","examples"];
      const vals   = fields.map((f) => parsed[f] || 0);
      parsed.overallScore = Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
    }
    // Backfill legacy fields for compatibility
    parsed.score              = parsed.overallScore;
    parsed.technicalScore     = parsed.technicalAccuracy;
    parsed.confidenceScore    = parsed.confidence;
    return parsed;
  }

  return {
    score: 50, overallScore: 50, technicalAccuracy: 50, depth: 50,
    clarity: 55, confidence: 50, problemSolving: 50, industryKnowledge: 50,
    codeQuality: 50, examples: 50, technicalScore: 50,
    communicationScore: 55, grammarScore: 60, confidenceScore: 50,
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

  const prompt = `You are the Hiring Committee for a ${jobRole} role. You have just reviewed the full interview. Do NOT inflate any scores. Reject weak answers firmly.
${resumeCtx}
Interview Transcript:
${pairs}

Decide: Strong Hire | Hire | Borderline | Reject — and explain why with specific references to their answers.

Return ONLY valid JSON:
{
  "overallScore":         <0-100>,
  "technicalScore":       <0-100>,
  "communicationScore":   <0-100>,
  "confidenceScore":      <0-100>,
  "hrScore":              <0-100>,
  "grammarScore":         <0-100>,
  "bodyLanguageScore":    70,
  "answerScores":         [<score per answer>],
  "answerFeedback":       ["<1-2 sentence per answer>"],
  "betterAnswers":        ["<model answer per question>"],
  "strengths":            ["<3-5 genuine strengths>"],
  "weaknesses":           ["<3-5 specific weaknesses>"],
  "suggestions":          ["<5 concrete next steps>"],
  "interviewerSummary":   "<2-3 sentences from interviewer's perspective>",
  "managerComments":      "<what the hiring manager would say>",
  "technicalVerdict":     "<Pass | Fail | Marginal>",
  "behavioralVerdict":    "<Pass | Fail | Marginal>",
  "systemDesignVerdict":  "<Pass | Fail | Marginal | N/A>",
  "codingVerdict":        "<Pass | Fail | Marginal | N/A>",
  "resumeVerdict":        "<Strong | Average | Weak>",
  "feedback":             "<3-5 sentence honest overall summary>",
  "recommendation":       "<Strong Hire | Hire | Borderline | Reject>",
  "hiringProbability":    <0-100>,
  "keywords":             ["<technical keywords mentioned correctly>"],
  "topicsMissed":         ["<important topics candidate failed to cover>"]
}`;

  const text   = await generateText(prompt);
  const parsed = parseJSON(text);

  if (parsed && typeof parsed.overallScore === "number") return parsed;

  // Graceful fallback
  return {
    overallScore: 60, technicalScore: 58, communicationScore: 65,
    confidenceScore: 60, hrScore: 65, grammarScore: 68, bodyLanguageScore: 70,
    answerScores:        questions.map(() => 60),
    answerFeedback:      questions.map(() => "Provide more specific details and examples."),
    betterAnswers:       questions.map(() => ""),
    strengths:           ["Attempted all questions", "Showed basic understanding"],
    weaknesses:          ["Needs deeper technical explanations", "Missing concrete examples"],
    suggestions:         [
      "Practice technical concepts daily",
      "Use STAR method for behavioral questions",
      "Add real-world examples to your answers",
      "Work on speaking with more confidence",
      "Study system design fundamentals",
    ],
    interviewerSummary:  "Candidate showed reasonable effort but lacked depth.",
    managerComments:     "Would need significant improvement before hire consideration.",
    technicalVerdict:    "Marginal",
    behavioralVerdict:   "Marginal",
    systemDesignVerdict: "N/A",
    codingVerdict:       "N/A",
    resumeVerdict:       "Average",
    feedback:            "Consistent practice will improve scores significantly.",
    recommendation:      "Borderline",
    hiringProbability:   45,
    keywords:            [],
    topicsMissed:        [],
  };
};

/* ═══════════════════════════════════════════════════════════
   RESUME ANALYSIS (ATS + Multi-perspective)
   ══════════════════════════════════════════════════════════ */
const analyzeResume = async (resumeText, jobRole = "", jobDescription = "") => {
  const roleCtx = jobRole        ? `Target Role: ${jobRole}\n`                               : "";
  const jdCtx   = jobDescription ? `JD:\n"""\n${jobDescription.slice(0, 800)}\n"""\n`        : "";

  const prompt = `You are a panel of experts: ATS System, Recruiter, HR Manager, and Technical Reviewer.

Analyze this resume from all four perspectives.

${roleCtx}${jdCtx}Resume:
"""
${resumeText.slice(0, 5000)}
"""

Return ONLY valid JSON:
{
  "atsScore":         <0-100, ATS parse-ability and keyword match>,
  "hrScore":          <0-100, HR/cultural fit impression>,
  "recruiterScore":   <0-100, first-impression and marketability>,
  "technicalScore":   <0-100, technical depth and skill relevance>,
  "linkedinScore":    <0-100, LinkedIn profile readiness>,
  "githubScore":      <0-100, GitHub/portfolio signal strength>,
  "portfolioScore":   <0-100, overall online presence>,
  "grammarScore":     <0-100>,
  "formattingScore":  <0-100>,
  "keywordScore":     <0-100>,
  "overallRating":    <0-10>,
  "extractedSkills":  ["<every technical skill found>"],
  "missingSkills":    ["<important skills missing for ${jobRole || "the role"}>"],
  "matchedKeywords":  ["<ATS keywords present>"],
  "suggestions":      ["<6 specific, actionable suggestions>"],
  "grammarIssues":    ["<grammar/spelling issues if found>"],
  "strengths":        ["<3 genuine strengths>"],
  "improvements":     ["<3 improvements>"],
  "summary":          "<2-3 sentence professional assessment>",
  "coverLetterHint":  "<tailored 2-3 sentence opener for ${jobRole || "the role"}>",
  "linkedinTips":     ["<3 LinkedIn optimization tips>"],
  "roleMatch":        <0-100>,
  "experienceLevel":  "<Fresher | Junior | Mid-level | Senior | Lead>",
  "topProjects":      ["<notable project extracted from resume>"],
  "certifications":   ["<certifications found>"]
}`;

  const text   = await generateText(prompt);
  const parsed = parseJSON(text);

  if (parsed && typeof parsed.atsScore === "number") return parsed;

  return {
    atsScore: 50, hrScore: 50, recruiterScore: 50, technicalScore: 50,
    linkedinScore: 40, githubScore: 40, portfolioScore: 40,
    grammarScore: 60, formattingScore: 55, keywordScore: 45, overallRating: 5,
    extractedSkills: [], missingSkills: [], matchedKeywords: [],
    suggestions: ["Add quantifiable achievements", "Use action verbs", "Add a professional summary",
                  "Include relevant certifications", "Optimize with role-specific keywords", "Add GitHub/portfolio link"],
    grammarIssues: [], strengths: ["Resume uploaded successfully"],
    improvements: ["Add more detail to experience section"],
    summary: "Resume analyzed. Add more relevant content for a higher ATS score.",
    coverLetterHint: "", linkedinTips: [], roleMatch: 50,
    experienceLevel: "Mid-level", topProjects: [], certifications: [],
  };
};

/* ═══════════════════════════════════════════════════════════
   GENERATE COVER LETTER
   ══════════════════════════════════════════════════════════ */
const generateCoverLetter = async (resumeText, jobRole, company = "") => {
  const prompt = `You are a professional cover letter writer. Write a compelling cover letter for a ${jobRole}${company ? ` at ${company}` : ""} role.

Resume:
"""
${resumeText.slice(0, 2500)}
"""

Requirements:
- 3-4 paragraphs, recruiter-friendly and ATS-optimized
- Use action words and quantified achievements from the resume
- Include relevant keywords naturally
- Professional tone, confident close with call-to-action
- 250-320 words

Return ONLY the cover letter text.`;

  return generateText(prompt);
};

/* ═══════════════════════════════════════════════════════════
   AI CHATBOT (multi-persona)
   ══════════════════════════════════════════════════════════ */
const chatWithAI = async (message, history = [], type = "general", userContext = "") => {
  const PERSONAS = {
    career:         "You are Maya, an expert career counselor and LinkedIn coach. Help with career transitions, job searching, salary negotiation, and professional growth. Give concrete, actionable advice.",
    resume:         "You are Rex, an ATS-certified resume writer. Help craft compelling resumes, cover letters, and LinkedIn profiles. Focus on keywords, formatting, and impact metrics.",
    coding:         "You are CodeBot, a senior software engineer. Help with DSA, system design, debugging, code reviews, and interview coding problems. Show code examples.",
    interview:      "You are Coach, an expert interview preparation coach. Help practice questions, structure STAR answers, and build confidence. Give real examples.",
    hr:             "You are Aria, an experienced HR professional. Help with HR processes, behavioral questions, culture fit, and workplace scenarios.",
    systemdesign:   "You are Arch, a Staff Engineer with expertise in distributed systems. Help with system design interviews — scalability, databases, caching, load balancing, microservices.",
    behavioral:     "You are Bex, a behavioral interview coach. Train candidates on STAR method, leadership examples, conflict resolution, and situational questions for top companies.",
    mockinterviewer:"You are a strict interviewer from a top tech company. Conduct a realistic mock interview — ask one question at a time, evaluate answers, give harsh but fair feedback.",
    salary:         "You are Sam, a compensation and negotiation expert. Help candidates negotiate salaries, understand market rates, evaluate offers, and handle counter-offers.",
    roadmap:        "You are Guide, a tech career roadmap advisor. Give structured learning paths for any tech role — what to learn, in what order, with resources and timelines.",
    placement:      "You are PlaceBot, a campus placement expert. Help freshers and students with placement prep, aptitude, coding rounds, HR rounds, and company-specific tips.",
    general:        "You are InterviewIQ AI, an intelligent assistant for career and interview preparation. Be helpful, concise, and encouraging.",
  };

  const persona     = PERSONAS[type] || PERSONAS.general;
  const ctx         = userContext ? `\nUser Context: ${userContext.slice(0, 300)}` : "";
  const history_ctx = history
    .slice(-6)
    .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
    .join("\n");

  const prompt = `${persona}${ctx}

${history_ctx ? `Conversation:\n${history_ctx}\n` : ""}User: ${message}
Assistant:`;

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
  "executiveSummary":  "<2-3 sentence honest assessment>",
  "performanceGrade":  "<A+ | A | B+ | B | C | D>",
  "overallGrade":      "<same as performanceGrade>",
  "hireProbability":   <0-100>,
  "readyToHire":       <true|false>,
  "technicalScore":    <0-100>,
  "behaviorScore":     <0-100>,
  "communicationScore":<0-100>,
  "improvementPlan": {
    "week1":  ["<3 daily action items>"],
    "week30": ["<3 monthly goals>"]
  },
  "roadmap": {
    "sevenDayPlan":   ["<day-by-day focus areas>"],
    "thirtyDayPlan":  ["<week-by-week milestones>"]
  },
  "recommendedCourses":      ["<course name + platform>"],
  "recommendedBooks":        ["<book title + author>"],
  "youtubeChannels":         ["<channel name>"],
  "leetcodeTopics":          ["<DSA topic to practice>"],
  "systemDesignTopics":      ["<system design topic>"],
  "hrPracticeQuestions":     ["<behavioral question to practice>"],
  "nextInterviewTips":       ["<5 tips for next interview>"]
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
  // Legacy alias
  generateInterviewQuestions: generateResumeAwareQuestions,
};
