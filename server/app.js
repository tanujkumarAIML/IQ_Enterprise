"use strict";

const express     = require("express");
const cors        = require("cors");
const helmet      = require("helmet");
const morgan      = require("morgan");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const rateLimit   = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");

const logger  = require("./utils/logger");

// ── Routes ─────────────────────────────────────────────────
const authRoutes      = require("./routes/authRoutes");
const profileRoutes   = require("./routes/profileRoutes");
const resumeRoutes    = require("./routes/resumeRoutes");
const interviewRoutes = require("./routes/interviewRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const aiRoutes        = require("./routes/aiRoutes");
const chatbotRoutes   = require("./routes/chatbotRoutes");
const adminRoutes     = require("./routes/adminRoutes");
const reportRoutes    = require("./routes/reportRoutes");
const questionRoutes  = require("./routes/questionRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

const app = express();

// ── Security ───────────────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(mongoSanitize());

// ── Rate Limiting ──────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests. Try again later." },
});
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: "Too many auth attempts. Try again later." },
});

app.use("/api/", globalLimiter);
app.use("/api/auth/login",    authLimiter);
app.use("/api/auth/register", authLimiter);

// ── CORS ───────────────────────────────────────────────────
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://interviewiq-bamm.onrender.com",
  ],
  credentials: true,
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
}));

// ── Body Parsers ───────────────────────────────────────────
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));
app.use(cookieParser(process.env.COOKIE_SECRET || "secret"));
app.use(compression());

// ── Logger ─────────────────────────────────────────────────
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// ── Health ─────────────────────────────────────────────────
app.get("/",         (_req, res) => res.json({ success: true, message: "🚀 InterviewIQ AI v3.0 Running" }));
app.get("/api/health", (_req, res) => res.json({ success: true, status: "healthy", uptime: process.uptime() }));

// ── API Routes ─────────────────────────────────────────────
app.use("/api/auth",       authRoutes);
app.use("/api/profile",    profileRoutes);
app.use("/api/resume",     resumeRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/dashboard",  dashboardRoutes);
app.use("/api/ai",         aiRoutes);
app.use("/api/chatbot",    chatbotRoutes);
app.use("/api/admin",      adminRoutes);
app.use("/api/reports",    reportRoutes);
app.use("/api/questions",  questionRoutes);
app.use("/api/analytics",  analyticsRoutes);

// ── 404 ────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// ── Global Error Handler ───────────────────────────────────
app.use((err, req, res, _next) => {
  logger.error(`${req.method} ${req.url} - ${err.message}`);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

module.exports = app;
