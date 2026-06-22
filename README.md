# 🧠 InterviewIQ AI — Enterprise Edition

> **AI-Powered Interview Preparation Platform** — Production-ready SaaS built with React 18, Node.js, FastAPI & Gemini AI.

[![CI/CD](https://github.com/your-org/interviewiq/actions/workflows/ci.yml/badge.svg)](https://github.com/your-org/interviewiq/actions)
![Node](https://img.shields.io/badge/Node.js-20-green)
![Python](https://img.shields.io/badge/Python-3.12-blue)
![React](https://img.shields.io/badge/React-18-cyan)
![Gemini](https://img.shields.io/badge/Gemini_AI-2.0_Flash-violet)

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🤖 **AI Question Generation** | Gemini AI generates questions from YOUR resume — zero generic questions |
| 📄 **Resume ATS Analyzer** | ATS score, grammar check, skill gaps, cover letter, LinkedIn tips |
| 🎤 **Voice AI** | Web Speech API — speak your answers, filler word detection |
| 📹 **Computer Vision** | Eye contact, emotion detection, body language scoring |
| 💬 **AI Chatbot** | Career, Resume, Coding, Interview & HR assistants |
| 📊 **Detailed Reports** | PDF export, radar charts, improvement plans |
| 🛡️ **Admin Panel** | User management, analytics, system health |
| 🔒 **Enterprise Auth** | JWT + Refresh tokens, OTP email, role-based access |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+, Python 3.12+, MongoDB Atlas (free tier)
- Gemini API key: [aistudio.google.com](https://aistudio.google.com) (free)
- Cloudinary (free): [cloudinary.com](https://cloudinary.com)

### 1. Clone & Setup
```bash
git clone https://github.com/your-org/interviewiq.git
cd interviewiq
```

### 2. Server Setup
```bash
cd server
cp .env.example .env    # Fill in your credentials
npm install
npm run dev             # http://localhost:5000
```

### 3. Client Setup
```bash
cd client
cp .env.example .env
npm install
npm run dev             # http://localhost:5173
```

### 4. Python AI Setup
```bash
cd python-ai
cp .env.example .env    # Add GEMINI_API_KEY
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m spacy download en_core_web_sm
uvicorn main:app --reload  # http://localhost:8000
```

### 5. Seed Database (Optional)
```bash
cd server
node seed.js
# Admin: admin@interviewiq.ai / Admin@123
# User:  john@example.com / Test@123
```

### 6. Docker (All-in-one)
```bash
cp server/.env.example server/.env  # Fill credentials
docker compose up --build           # http://localhost
```

---

## 🏗️ Architecture

```
InterviewIQ/
├── client/                      # React 18 + Vite + Tailwind
│   └── src/
│       ├── pages/               # 13 pages (Home, Auth, Dashboard, Interview, Resume, Report, Chatbot, Admin...)
│       ├── components/          # Layout, common UI, Interview, Dashboard
│       ├── context/             # AuthContext, ThemeContext
│       ├── redux/               # RTK store + 3 slices
│       ├── hooks/               # useFetch, useCountdown, useLocalStorage
│       └── utils/               # helpers, formatters
│
├── server/                      # Node.js + Express
│   ├── controllers/             # 9 controllers
│   ├── models/                  # User, Interview, Resume, Chat, Analytics
│   ├── routes/                  # 11 route files
│   ├── services/                # geminiService, emailService, analyticsService
│   ├── middleware/              # authMiddleware, uploadMiddleware
│   └── utils/                   # logger, jwtHelper
│
├── python-ai/                   # FastAPI
│   ├── routers/                 # nlp, resume, analysis, interview, vision, voice
│   ├── services/                # 15+ AI services
│   └── utils/                   # constants
│
├── docker/                      # Dockerfiles + Nginx
└── .github/workflows/           # CI/CD
```

---

## 🔑 Required Environment Variables

### server/.env

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | JWT secret (min 32 chars) |
| `JWT_REFRESH_SECRET` | Refresh token secret (min 32 chars) |
| `GEMINI_API_KEY` | Google Gemini AI key |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `SMTP_USER` | Gmail address |
| `SMTP_PASS` | Gmail App Password (16 chars) |
| `CLIENT_URL` | http://localhost:5173 |

### python-ai/.env

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | Same Gemini API key |

---

## 🎯 How AI Question Generation Works

1. User uploads resume (PDF/DOCX) → AI extracts skills, projects, experience
2. User configures interview: role + type + difficulty + company
3. **Gemini AI generates 5-20 unique questions** personalized to:
   - Candidate's specific skills from resume
   - Years of experience level
   - Target company's known interview patterns
   - Chosen interview type (Technical/HR/DSA/System Design/Mixed)
4. No pre-loaded question bank — every session is unique!
5. After submission → AI evaluates all answers holistically in one call
6. Detailed report: per-question scores, model answers, radar chart, PDF export

---

## 📊 API Endpoints

### Auth
```
POST /api/auth/register       → Register + send OTP
POST /api/auth/login          → Login + JWT
POST /api/auth/refresh        → Refresh access token
POST /api/auth/verify-otp     → Verify email OTP
POST /api/auth/forgot-password→ Send reset link
PUT  /api/auth/reset-password/:token
GET  /api/auth/me             → Get current user
```

### Interviews (AI-powered)
```
POST /api/interviews                 → Create + generate questions from resume
GET  /api/interviews                 → List with pagination + filters
GET  /api/interviews/:id             → Single interview
PUT  /api/interviews/:id/submit      → Submit + batch AI evaluation
PUT  /api/interviews/:id/regenerate  → Regenerate new questions
POST /api/interviews/evaluate-answer → Real-time single answer feedback
DELETE /api/interviews/:id
```

### Resume AI
```
POST /api/resume/upload   → Upload PDF/DOCX
POST /api/resume/analyze  → Full ATS + Gemini analysis
GET  /api/resume          → Get user's resume
DELETE /api/resume
```

### AI Chatbot
```
POST   /api/chatbot           → Send message (career/resume/coding/interview/hr)
GET    /api/chatbot/history   → Chat history list
GET    /api/chatbot/:id       → Single chat with messages
DELETE /api/chatbot/:id
```

### Reports
```
GET /api/reports              → All completed reports
GET /api/reports/:id          → Full report with Q&A
GET /api/reports/:id/pdf      → PDF export data
```

### Questions (AI-generated)
```
GET /api/questions/generate?jobRole=&category=&difficulty=&count=
GET /api/questions/categories
```

### Admin
```
GET    /api/admin/dashboard
GET    /api/admin/users?search=&role=
PUT    /api/admin/users/:id   → Update role/plan/status
DELETE /api/admin/users/:id   → Delete user + cascade
GET    /api/admin/analytics
```

### Python AI (FastAPI)
```
POST /api/nlp/analyze         → Full NLP analysis of answer text
POST /api/nlp/grammar         → Grammar check
POST /api/nlp/sentiment       → Sentiment analysis
POST /api/resume/parse        → PDF/DOCX text extraction
POST /api/interview/questions → AI question generation
POST /api/interview/evaluate  → Single answer evaluation
POST /api/interview/report    → Full interview report
GET  /api/vision/full-analysis→ Body language + emotion + eye contact
POST /api/voice/analyze-text  → Voice sentiment from transcript
```

---

## 🔒 Security
- JWT Access (1d) + Refresh Tokens (7d) in HTTP-only cookies
- bcrypt (12 rounds) password hashing
- Helmet.js security headers
- CORS configured to frontend origin
- Rate limiting: 500 req/15min global, 20 req/15min on auth
- MongoDB sanitization (express-mongo-sanitize)
- File type + size validation on uploads

---

## 🧪 Demo Credentials (after running seed.js)

| Role  | Email | Password |
|---|---|---|
| Admin | admin@interviewiq.ai | Admin@123 |
| User  | john@example.com | Test@123 |
| User  | priya@example.com | Test@123 |

---

© 2025 InterviewIQ AI — Built for developers, by developers.
