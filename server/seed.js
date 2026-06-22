"use strict";
/**
 * InterviewIQ Enterprise — Database Seed
 * Creates admin + sample users with interview history.
 * NOTE: Questions are generated LIVE by Gemini AI — no pre-seeding needed.
 *
 * Usage: node seed.js
 */
const dns = require("node:dns");
dns.setServers([
  "1.1.1.1",
  "8.8.8.8"
]);
require("dotenv").config();
const mongoose = require("mongoose");
const User      = require("./models/User");
const Interview = require("./models/Interview");
const Resume    = require("./models/Resume");

const SAMPLE_USERS = [
  {
    name: "Admin User",
    email: "admin@interviewiq.ai",
    password: "Admin@123",
    role: "admin",
    isEmailVerified: true,
    plan: "enterprise",
    jobTitle: "Platform Administrator",
    skills: ["Node.js","React","MongoDB","Python","AWS"],
  },
  {
    name: "John Developer",
    email: "john@example.com",
    password: "Test@123",
    role: "user",
    isEmailVerified: true,
    plan: "pro",
    jobTitle: "Software Engineer",
    experience: 3,
    skills: ["JavaScript","React","Node.js","Python","SQL","MongoDB","Docker"],
    bio: "Full-stack developer with 3 years of experience building scalable web applications.",
    linkedin: "https://linkedin.com/in/johndev",
    github: "https://github.com/johndev",
  },
  {
    name: "Priya Engineer",
    email: "priya@example.com",
    password: "Test@123",
    role: "user",
    isEmailVerified: true,
    plan: "pro",
    jobTitle: "ML Engineer",
    experience: 5,
    skills: ["Python","TensorFlow","PyTorch","scikit-learn","Pandas","AWS","Docker","FastAPI"],
    bio: "ML Engineer with 5 years of experience in NLP and computer vision.",
  },
];

const SAMPLE_INTERVIEWS = [
  {
    jobRole: "Frontend Developer",
    interviewType: "Technical",
    difficulty: "Medium",
    company: "Google",
    status: "Completed",
    overallScore: 82,
    technicalScore: 85,
    communicationScore: 78,
    confidenceScore: 80,
    hrScore: 83,
    grammarScore: 88,
    bodyLanguageScore: 75,
    duration: 1200,
    questions: [
      "How does the React Virtual DOM work and why is it faster than direct DOM manipulation?",
      "Explain the differences between useState and useReducer hooks.",
      "What is the purpose of useCallback and useMemo? When would you use each?",
      "How would you optimize a React application that is rendering slowly?",
      "Explain the concept of code splitting and lazy loading in React.",
    ],
    answers: [
      { question: "How does the React Virtual DOM work?", answer: "The Virtual DOM is a lightweight JavaScript representation of the actual DOM. React keeps a copy of the UI in memory and syncs it with the real DOM using a process called reconciliation. When state changes, React creates a new Virtual DOM tree, diffs it with the previous one, and only updates the changed parts in the real DOM — making updates much faster.", score: 88, feedback: "Excellent explanation of Virtual DOM and reconciliation." },
      { question: "Explain useState vs useReducer.", answer: "useState is for simple state management, while useReducer is better for complex state logic with multiple sub-values or when next state depends on previous. useReducer follows the Redux pattern with dispatch and actions.", score: 85, feedback: "Good comparison with practical guidance on when to use each." },
    ],
    strengths: ["Strong React fundamentals", "Clear and structured answers", "Good understanding of hooks"],
    weaknesses: ["Could go deeper on performance optimization", "Missing mention of Suspense for lazy loading"],
    suggestions: ["Study React Profiler tool", "Practice system design for frontend", "Learn about Concurrent Mode"],
    aiFeedback: "Strong candidate with solid React knowledge. Answers were clear and structured. Recommended for mid-senior frontend roles.",
    recommendation: "Hire",
  },
  {
    jobRole: "Backend Engineer",
    interviewType: "Mixed",
    difficulty: "Hard",
    company: "Amazon",
    status: "Completed",
    overallScore: 74,
    technicalScore: 78,
    communicationScore: 70,
    confidenceScore: 72,
    hrScore: 76,
    grammarScore: 80,
    bodyLanguageScore: 68,
    duration: 1800,
    questions: [
      "Design a URL shortener service like bit.ly. Discuss the system architecture.",
      "How would you handle database migrations in a production system without downtime?",
      "Explain the difference between optimistic and pessimistic locking.",
      "How does JWT authentication work and what are its security considerations?",
      "Describe how you would implement rate limiting in an API.",
    ],
    answers: [
      { question: "Design a URL shortener service.", answer: "I would use a hash function like MD5 to generate short codes, store the mapping in a database with Redis caching for frequently accessed URLs, use a load balancer for horizontal scaling, and implement CDN for global distribution.", score: 75, feedback: "Good start. Should mention hash collision handling and base62 encoding for shorter URLs." },
    ],
    strengths: ["Good system design thinking", "Understands distributed systems basics"],
    weaknesses: ["Communication could be clearer", "Missing security depth on JWT"],
    suggestions: ["Practice more system design problems", "Study JWT best practices", "Work on explaining trade-offs"],
    aiFeedback: "Solid backend knowledge. Improve communication style and add more technical depth to answers.",
    recommendation: "Maybe",
  },
];

const seed = async () => {
  try {
    console.log("\n🌱 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
    console.log("✅ Connected\n");

    // Clear existing seed data
    const emails = SAMPLE_USERS.map((u) => u.email);
    await User.deleteMany({ email: { $in: emails } });
    console.log("🗑  Cleared existing seed users");

    // Create users
    const created = {};
    for (const userData of SAMPLE_USERS) {
      const user = await User.create(userData);
      created[userData.email] = user;
      console.log(`👤 Created: ${user.email} (${user.role} / ${user.plan})`);
    }

    // Create sample interviews for john
    const john = created["john@example.com"];
    if (john) {
      await Interview.deleteMany({ user: john._id });
      for (const iv of SAMPLE_INTERVIEWS) {
        await Interview.create({ ...iv, user: john._id });
      }
      await User.findByIdAndUpdate(john._id, {
        totalInterviews: SAMPLE_INTERVIEWS.length,
        completedInterviews: SAMPLE_INTERVIEWS.filter((i) => i.status === "Completed").length,
        avgScore: Math.round(SAMPLE_INTERVIEWS.reduce((s, i) => s + i.overallScore, 0) / SAMPLE_INTERVIEWS.length),
        bestScore: Math.max(...SAMPLE_INTERVIEWS.map((i) => i.overallScore)),
      });
      console.log(`\n📋 ${SAMPLE_INTERVIEWS.length} sample interviews created for john@example.com`);
    }

    console.log("\n==========================================");
    console.log("✅ Database seeded successfully!");
    console.log("==========================================");
    console.log("👑 Admin:      admin@interviewiq.ai  /  Admin@123");
    console.log("👤 User (Pro): john@example.com      /  Test@123");
    console.log("👤 User (Pro): priya@example.com     /  Test@123");
    console.log("\n💡 NOTE: Interview questions are generated LIVE");
    console.log("   by Gemini AI when a user starts an interview.");
    console.log("   No pre-loaded question bank required!");
    console.log("==========================================\n");
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

seed();
