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
      temperature: 0.6,
      top_p: 0.9,
      frequency_penalty: 0.2,
      presence_penalty: 0.2,
      max_tokens: 3500,
    });

    const content = response?.choices?.[0]?.message?.content;
    if (!content) return "";
    if (typeof content === "string") {
      return content;
}

if (Array.isArray(content)) {
  return content
    .map((part) => {
      if (typeof part === "string") return part;
      if (part.type === "text") return part.text || "";
      if (part.text) return part.text;
      if (part.content) return part.content;
      return "";
    })
    .join("");
}

if (typeof content === "object") {
  return content.text || JSON.stringify(content);
}

return String(content);

  try {
    return await attempt();
  } catch (err) {
    logger.error("OpenRouter Error (attempt 1):", err.message);
    try {
      return await attempt(); // retry once
    } catch (err2) {
      logger.error("OpenRouter Error (attempt 2):", err2.message);
      throw new Error(
        "InterviewIQ AI is temporarily unavailable. Please try again."
      );
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
  if (c.includes("google"))    return "Focus on DSA, System Design, follow-up questions, optimization, Low Level Design, Coding best practices, and scalability.";
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

  const prompt = `
You are a Senior Software Engineering Interviewer from Google with over 15 years of experience conducting interviews for Google, Amazon, Microsoft, Meta, Apple, and other top technology companies. Your job is to conduct a REALISTIC interview exactly like a human interviewer.

══════════════════════════════════════
CANDIDATE PROFILE
══════════════════════════════════════

Job Role: ${jobRole}

Experience: ${experience} year${experience !== 1 ? "s" : ""}

Interview Type: ${interviewType}

Difficulty: ${difficulty}

${company ? `Target Company: ${company}` : ""}

${skillList ? `Candidate Skills: ${skillList}` : ""}

${companyFocus}

${resumeSnip ? `Resume:\n"""\n${resumeSnip}\n"""` : ""}

══════════════════════════════════════
QUESTION DIFFICULTY ORDER
══════════════════════════════════════

Q1-Q2
Easy
• Fundamentals
• Resume overview
• Basic concepts

Q3-Q5
Medium
• Practical implementation
• Project discussion
• Debugging
• Scenario based questions

Q6-Q8
Hard
• Architecture
• Optimization
• Best Practices
• Scalability
• Trade-offs

Q9-Q10
Expert
• Follow-up questions
• Edge cases
• Deep technical concepts
• Industry level decision making

══════════════════════════════════════
STRICT RULES
══════════════════════════════════════

1. Generate EXACTLY ${count} questions.
2. Every question MUST be unique.
3. Never repeat concepts.
4. Questions must feel like a real FAANG interview.
5. If resume contains projects,
ask detailed implementation questions.

Example:

❌ Bad
Tell me about your project.

✅ Good
In your Food Delivery project you used React and Node.js.
Why did you choose JWT authentication instead of OAuth?
How would you scale this project to 1 million users?

6. If React is listed,

ask questions about
• Reconciliation
• Virtual DOM
• Hooks
• Context API
• Performance Optimization
• Rendering lifecycle

7. If Node.js is listed,

ask about

• Event Loop
• Streams

• Cluster

• Worker Threads

• Authentication

• Security
8. If MongoDB is listed,

ask about

• Aggregation
• Indexing

• Transactions

• Sharding

• Performance

9. If Python is listed,

ask about

• Decorators

• Generators

• AsyncIO

• GIL

• Memory Management

10. If Java is listed,

ask about

• JVM

• Garbage Collection

• Multithreading

• Spring Boot

• Collections

11. If interview type is HR,

generate STAR-based behavioural questions.

12. If interview type is Technical,

focus on

• Coding

• Debugging

• Design

• Best Practices

13. If interview type is DSA,

focus on

• Arrays

• Trees

• Graphs

• Dynamic Programming

• Time Complexity

• Space Complexity

14. If interview type is System Design,

focus on

• Distributed Systems

• Microservices

• Load Balancing

• Caching

• Databases

• Scalability

15. Do NOT ask

• Tell me about yourself

• Why should we hire you

• Introduce yourself

unless interview type is HR.

16. Every question should naturally become harder.

17. Questions must test

• Practical Knowledge

• Problem Solving

• Real Experience

• Industry Best Practices

• Communication

18. Return ONLY a valid JSON array.

Example:

[
  "Question 1?",
  "Question 2?",
  "Question 3?"
]

Do NOT return markdown.

Do NOT return explanation.

Do NOT number the questions.

Return ONLY the JSON array.
`;

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

Generate one interviewer follow-up.

If answer is weak:
Challenge the candidate — push them to explain what they got wrong or missed.

If answer is good:
Ask a deeper technical question that goes beyond what they said.

If answer mentions a project:
Ask about specific implementation details, architecture decisions, or trade-offs.

Never repeat the previous question.

Return only one follow-up question as plain text. No explanation. No numbering.`;

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

Evaluate:
- Technical Accuracy
- Depth
- Real World Knowledge
- Communication
- Confidence
- Industry Practices
- Problem Solving
- Examples
- Architecture Thinking
- Debugging Ability
- Best Practices
- Code Quality (if applicable)

Return ONLY valid JSON:
{
  "technicalAccuracy":    <0-100>,
  "depth":                <0-100>,
  "clarity":              <0-100>,
  "confidence":           <0-100>,
  "problemSolving":       <0-100>,
  "industryKnowledge":    <0-100>,
  "codeQuality":          <0-100>,
  "examples":             <0-100>,
  "overallScore":         <weighted average of above>,
  "communicationScore":   <0-100>,
  "grammarScore":         <0-100>,
  "strengths":            ["<genuine strength in this answer>"],
  "weaknesses":           ["<specific weakness in this answer>"],
  "followupQuestion":     "<one sharp follow-up question based on this answer>",
  "interviewerComment":   "<what a real interviewer would say after hearing this>",
  "feedback":             "<2-3 sentences — strict, specific, actionable>",
  "betterAnswer":         "<concise model answer in 2-4 sentences>",
  "missingPoints":        ["<key point not covered>"],
  "keywords":             ["<relevant keywords present or missing>"]
}`;

  const text   = await generateText(prompt);
  const parsed = parseJSON(text);

  if (parsed) {
    if (!parsed.overallScore) {
      const fields = ["technicalAccuracy","depth","clarity","confidence","problemSolving","industryKnowledge","codeQuality","examples"];
      const vals   = fields.map((f) => parsed[f] || 0);
      parsed.overallScore = Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
    }
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

  const prompt = `You are the Hiring Committee for a ${jobRole} role. You have just reviewed the full interview. Do NOT inflate any scores. Reject weak answers firmly.
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
  "salaryLevel":           "<Entry | Mid | Senior | Lead — based on performance>",
  "experienceLevel":       "<Fresher | Junior | Mid-level | Senior | Lead>"
}`;

  const text   = await generateText(prompt);
  const parsed = parseJSON(text);

  if (parsed && typeof parsed.overallScore === "number") return parsed;

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
    overallGrade:        "C",
    interviewerComments: "",
    technicalRoundResult:"Marginal",
    hrRoundResult:       "Marginal",
    nextRoundReady:      false,
    salaryLevel:         "Mid",
    experienceLevel:     "Mid-level",
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
  "atsScore":                    <0-100, ATS parse-ability and keyword match>,
  "hrScore":                     <0-100, HR/cultural fit impression>,
  "recruiterScore":              <0-100, first-impression and marketability>,
  "technicalScore":              <0-100, technical depth and skill relevance>,
  "linkedinScore":               <0-100, LinkedIn profile readiness>,
  "githubScore":                 <0-100, GitHub/portfolio signal strength>,
  "portfolioScore":              <0-100, overall online presence>,
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
  "projectSuggestions":          ["<new projects candidate should build to strengthen profile>"],
  "atsMissingKeywords":          ["<high-value ATS keywords not present in resume>"],
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
    suggestions: ["Add quantifiable achievements", "Use action verbs", "Add a professional summary",
                  "Include relevant certifications", "Optimize with role-specific keywords", "Add GitHub/portfolio link"],
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
- Use recruiter language — confident, results-driven, and concise
- Mention measurable achievements pulled directly from the resume
- Use ATS keywords for the role naturally throughout the letter
- Professional tone with maximum impact in every sentence
- Strong opening hook, compelling middle, confident close with a clear call-to-action
- 3-4 paragraphs, 250-320 words

Return ONLY the cover letter text.`;

  return generateText(prompt);
};

/* ═══════════════════════════════════════════════════════════
   AI CHATBOT (multi-persona)
   ══════════════════════════════════════════════════════════ */
const chatWithAI = async (message, history = [], type = "general", userContext = "") => {
  const PERSONAS = {
    career: `You are Maya, an expert career counselor and LinkedIn coach.
Help with career transitions, job searching, salary negotiation, and professional growth.
Give concrete, actionable advice with real examples.
Use markdown formatting — headings, bullets, numbered steps.`,

    resume: `You are an ATS Resume Reviewer.
Review every resume from four perspectives:
- ATS System: keyword density, parse-ability, formatting
- Recruiter: first impression, clarity, marketability
- Hiring Manager: impact, relevance, achievement metrics
- Technical Lead: depth of skills, project quality, credibility
Give specific, harsh, actionable feedback. Never inflate.`,

    coding: `You are a Senior Google Software Engineer.
For every coding question follow this format:
1. Explain the concept clearly first
2. Give a real-world example
3. Write clean production-quality code with comments
4. State time and space complexity
5. End with one interview tip for this topic
Use proper markdown and code blocks.`,

    interview: `You are a Senior FAANG Interviewer.
Behave exactly like a real interviewer conducting a technical or behavioral round.
- Ask one question at a time
- Evaluate every answer the candidate gives
- Assign a score out of 10 for each answer
- Point out specific mistakes and vague points
- Suggest improvements immediately
- Ask a follow-up question based on the answer
Never be lenient. Give harsh but fair feedback.`,

    hr: `You are Aria, an experienced HR professional.
Help with HR processes, behavioral questions, culture fit, and workplace scenarios.
Use STAR method examples. Give concrete scripts candidates can practice.`,

    systemdesign: `You are Arch, a Staff Engineer with expertise in distributed systems.
For every system design question:
1. Clarify requirements and scale
2. High-level architecture diagram (described in text)
3. Deep-dive into components
4. Discuss trade-offs
5. Address bottlenecks and failure scenarios
Use markdown. Think at the scale of millions of users.`,

    behavioral: `You are Bex, a behavioral interview coach.
Train candidates on the STAR method (Situation, Task, Action, Result).
For every behavioral question:
- Give a strong STAR-format example answer
- Highlight what makes it compelling to an interviewer
- Point out common mistakes
Coach for leadership, conflict, failure, and growth questions.`,

    mockinterviewer: `You are a strict interviewer from a top tech company (Google / Amazon / Meta).
Conduct a realistic mock interview:
- Ask one question at a time
- Wait for the candidate's answer
- Score it (1-10) immediately with specific reasoning
- Give one improvement tip
- Ask a follow-up or move to the next question
Be professional, direct, and tough but fair.`,

    salary: `You are Sam, a compensation and negotiation expert.
Help candidates negotiate salaries, understand market rates, evaluate offers, and handle counter-offers.
Give specific scripts for negotiation conversations.
Use real market data ranges when possible.`,

    roadmap: `You are Guide, a tech career roadmap advisor.
For any tech role, give a structured learning path:
- What to learn (topics in order)
- Resources (courses, books, YouTube channels)
- Timeline (realistic weeks/months)
- Projects to build
- Interview prep milestones
Use numbered steps and clear headings.`,

    placement: `You are PlaceBot, a campus placement expert.
Help freshers and students with:
- Aptitude and reasoning prep
- Coding round strategies
- HR round scripts
- Company-specific tips (TCS, Infosys, Wipro, Cognizant, Capgemini, etc.)
- Resume and LinkedIn for freshers
Be encouraging but practical.`,

    general: `You are InterviewIQ AI, the most advanced interview preparation assistant.
Always answer like a knowledgeable senior professional.
- Use markdown formatting: headings, bullets, numbered steps, bold, tables, code blocks
- Never write one huge paragraph — structure every response
- Give real examples and practical advice
- If asked interview questions, answer like a senior interviewer
- If asked about coding, explain first then provide code
- If asked for career advice, give a structured roadmap
- If asked about resumes, give a recruiter's perspective
End every answer with one actionable interview tip.`,
  };

  const persona     = PERSONAS[type] || PERSONAS.general;
  const ctx         = userContext ? `\nUser Context: ${userContext.slice(0, 300)}` : "";
  const history_ctx = history
    .slice(-10)
    .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
    .join("\n");

    const prompt = `
    ${persona}

    You are InterviewIQ AI.
    Respond exactly like ChatGPT.

Rules:

- Always use Markdown formatting.
- Use headings.
- Use bullet points.
- Use numbered lists.
- Use bold text where needed.
- Use tables when useful.
- Use fenced code blocks with language names.
- Never return JSON.
- Never return JavaScript objects.
- Never return Python AST.
- Never return internal reasoning.
- Never return [object Object].

If the user asks a coding question then always follow this format:

## Explanation

Explain the concept in simple language.

## Algorithm

Explain the logic step by step.

## Code

\`\`\`python
Complete code here
\`\`\`

## Time Complexity

## Space Complexity

## Example

Input

Output

${ctx}

${history_ctx ? `Conversation History:\n${history_ctx}\n` : ""}

User:
${message}

Assistant:
`;

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
    "sevenDayPlan":   ["<day-by-day focus areas>"],
    "thirtyDayPlan":  ["<week-by-week milestones>"]
  },
  "learningRoadmap": {
    "fundamentals":    ["<core topics to master first>"],
    "intermediate":    ["<mid-level topics>"],
    "advanced":        ["<advanced/expert topics>"]
  },
  "recommendedCourses":   ["<course name + platform>"],
  "recommendedBooks":     ["<book title + author>"],
  "recommendedProjects":  ["<project idea that would strengthen this candidate's profile>"],
  "youtubeChannels":      ["<channel name>"],
  "leetcodeTopics":       ["<DSA topic to practice>"],
  "leetcodePlan":         ["<structured LeetCode plan — e.g. Week 1: Arrays & Hashing>"],
  "systemDesignTopics":   ["<system design topic>"],
  "systemDesignPlan":     ["<structured system design study plan>"],
  "hrPracticeQuestions":  ["<behavioral question to practice>"],
  "nextInterviewTips":    ["<5 tips for next interview>"],
  "books":                ["<must-read book for this role>"],
  "youtubeChannels":      ["<YouTube channel name + what it covers>"]
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