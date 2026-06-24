import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  RiBrainLine, RiVideoLine, RiFileTextLine, RiRobot2Line,
  RiArrowRightLine, RiStarFill, RiCheckLine,
  RiCodeLine, RiBarChartLine, RiShieldLine,
} from "react-icons/ri";

const FEATURES = [
  {
    icon: RiVideoLine,
    title: "AI Mock Interviews",
    desc: "Gemini AI generates personalized questions from your resume. Practice HR, Technical, DSA & System Design.",
    color: "bg-violet-100 text-violet-600",
  },
  {
    icon: RiFileTextLine,
    title: "Resume ATS Analyzer",
    desc: "Upload PDF/DOCX → get ATS score, keyword gaps, grammar check, skill extraction & AI suggestions.",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: RiRobot2Line,
    title: "AI Career Chatbot",
    desc: "Career, Resume, Coding, Interview & HR assistants. Powered by Gemini AI with conversation memory.",
    color: "bg-green-100 text-green-600",
  },
  {
    icon: RiBarChartLine,
    title: "Detailed Reports",
    desc: "Technical, communication, confidence & grammar scores. Radar charts, PDF export, improvement plans.",
    color: "bg-orange-100 text-orange-600",
  },
  {
    icon: RiCodeLine,
    title: "NLP & Voice AI",
    desc: "Real-time voice input with Web Speech API. Filler word detection, pace analysis & communication scoring.",
    color: "bg-pink-100 text-pink-600",
  },
  {
    icon: RiShieldLine,
    title: "Computer Vision",
    desc: "Eye contact tracking, emotion detection, body language scoring & confidence analysis during interviews.",
    color: "bg-indigo-100 text-indigo-600",
  },
];

const TESTIMONIALS = [
  {
    name: "Arjun Sharma",
    role: "SDE-2 at Amazon",
    text: "InterviewIQ's resume-personalized questions were exactly what I faced in my Amazon interview. Got the offer!",
    rating: 5,
    avatar: "A",
    color: "bg-orange-500",
  },
  {
    name: "Priya Nair",
    role: "Frontend Dev at Google",
    text: "The ATS analyzer boosted my resume score from 38% to 91%. Got 8 interview calls in 2 weeks.",
    rating: 5,
    avatar: "P",
    color: "bg-blue-500",
  },
  {
    name: "Rahul Verma",
    role: "ML Engineer at Meta",
    text: "The AI chatbot helped me nail system design and DSA prep. Best interview prep platform I've used.",
    rating: 5,
    avatar: "R",
    color: "bg-green-500",
  },
];

const STATS = [
  { value: "50K+", label: "Interviews Taken" },
  { value: "94%",  label: "Success Rate" },
  { value: "500+", label: "Companies" },
  { value: "4.9★", label: "User Rating" },
];

const COMPANIES = [
  {
    name: "Google",
    logo: "https://cdn.simpleicons.org/google",
  },
  {
    name: "Amazon",
    logo: "https://cdn.simpleicons.org/amazon",
  },
  {
    name: "Microsoft",
    logo: "https://cdn.simpleicons.org/microsoft",
  },
  {
    name: "Meta",
    logo: "https://cdn.simpleicons.org/meta",
  },
  {
    name: "Apple",
    logo: "https://cdn.simpleicons.org/apple",
  },
  {
    name: "Netflix",
    logo: "https://cdn.simpleicons.org/netflix",
  },
  {
    name: "Adobe",
    logo: "https://cdn.simpleicons.org/adobe",
  },
  {
    name: "Uber",
    logo: "https://cdn.simpleicons.org/uber",
  },
  {
    name: "Infosys",
    logo: "https://cdn.simpleicons.org/infosys",
  },
  {
    name: "TCS",
    logo: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg",
  },
];


{/* ── Company Logos ── */}
<section className="py-10 border-y border-white/10 overflow-hidden">

<p className="text-center text-xs uppercase tracking-[0.3em] text-slate-500 mb-8 font-semibold">
Candidates Placed At
</p>

<div className="overflow-hidden">

<div className="flex animate-marquee gap-8 w-max">

{[...COMPANIES,...COMPANIES].map((company,index)=>(

<div
key={index}
className="
flex
items-center
gap-3
min-w-[190px]
bg-white/5
border
border-white/10
rounded-2xl
px-6
py-4
hover:bg-white/10
hover:scale-105
transition-all
duration-300
"
>

<img
src={company.logo}
alt={company.name}
className="w-8 h-8 object-contain grayscale hover:grayscale-0 transition"
/>

<span className="font-semibold text-white">
{company.name}
</span>

</div>

))}

</div>

</div>

</section>

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay },
});

const Home = () => (
  <div className="min-h-screen bg-slate-900 text-white">
    {/* ── Navbar ── */}
    <nav className="sticky top-0 z-50 backdrop-blur-lg bg-slate-900/80 border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <RiBrainLine className="text-white text-lg" />
          </div>
          <span className="font-bold text-lg" style={{ fontFamily: "Poppins, sans-serif" }}>
            InterviewIQ AI
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/auth"
            className="text-sm text-slate-300 hover:text-white transition px-4 py-2 rounded-lg hover:bg-white/10">
            Sign In
          </Link>
          <Link to="/auth"
            className="text-sm font-semibold bg-violet-600 hover:bg-violet-500 transition px-5 py-2 rounded-xl">
            Get Started Free
          </Link>
        </div>
      </div>
    </nav>

    {/* ── Hero ── */}
    <section className="relative overflow-hidden py-24 px-6">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-violet-600/20 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-4xl mx-auto text-center">
        <motion.div {...fade(0)}>
          <span className="inline-block text-xs font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30 px-4 py-1.5 rounded-full mb-6 uppercase tracking-widest">
            🚀 Powered by Gemini AI
          </span>
          <h1
            className="text-5xl md:text-7xl font-extrabold leading-tight mb-6"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Ace Every{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">
              Interview
            </span>
            <br />with AI Confidence
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Upload your resume → AI generates personalized interview questions → Get real-time feedback →
            Land your dream job. Used by{" "}
            <span className="text-violet-400 font-semibold">50,000+</span> developers.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/auth"
              className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold px-8 py-4 rounded-2xl shadow-lg shadow-violet-500/30 transition text-base"
            >
              Start for Free <RiArrowRightLine className="text-xl" />
            </Link>
            <Link
              to="/auth"
              className="flex items-center gap-2 border border-white/20 hover:bg-white/10 text-white font-semibold px-8 py-4 rounded-2xl transition text-base"
            >
              <RiVideoLine /> Watch Demo
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div {...fade(0.2)} className="grid grid-cols-2 sm:grid-cols-4 max-w-2xl mx-auto mt-16 gap-4">
          {STATS.map(({ value, label }) => (
            <div key={label} className="bg-white/5 border border-white/10 rounded-2xl py-4 px-2">
              <p className="text-2xl font-bold text-violet-300">{value}</p>
              <p className="text-xs text-slate-400 mt-1">{label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>

    {/* ── Company Logos ── */}
    <section className="py-8 border-y border-white/10 overflow-hidden">
      <p className="text-center text-xs text-slate-500 uppercase tracking-widest mb-5 font-semibold">
        Candidates placed at
      </p>
      <div className="flex gap-8 items-center justify-center flex-wrap px-6">
        {COMPANIES.map((c) => (
          <span key={c} className="text-slate-400 text-sm font-bold hover:text-white transition">{c}</span>
        ))}
      </div>
    </section>

    {/* ── Features ── */}
    <section className="py-20 px-6 max-w-6xl mx-auto">
      <motion.div {...fade(0)} className="text-center mb-14">
        <h2
          className="text-4xl font-bold mb-4"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          Everything You Need to{" "}
          <span className="text-violet-400">Succeed</span>
        </h2>
        <p className="text-slate-400 max-w-xl mx-auto">
          Enterprise-grade AI tools that adapt to your resume and target role — no generic questions.
        </p>
      </motion.div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {FEATURES.map(({ icon: Icon, title, desc, color }, i) => (
          <motion.div key={title} {...fade(i * 0.07)}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-violet-500/40 transition-all group">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-4 ${color}`}>
              <Icon />
            </div>
            <h3 className="font-bold text-white mb-2 group-hover:text-violet-300 transition">{title}</h3>
            <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
          </motion.div>
        ))}
      </div>
    </section>

    {/* ── How It Works ── */}
    <section className="py-20 px-6 bg-white/5 border-y border-white/10">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-14" style={{ fontFamily: "Poppins, sans-serif" }}>
          How It <span className="text-violet-400">Works</span>
        </h2>
        <div className="grid sm:grid-cols-4 gap-6">
          {[
            { step: "01", title: "Upload Resume",       desc: "PDF or DOCX — AI extracts skills, projects & experience" },
            { step: "02", title: "Choose Interview",    desc: "Select role, type, difficulty & target company" },
            { step: "03", title: "AI Generates Q&A",   desc: "Gemini creates 10 personalized questions based on YOUR resume" },
            { step: "04", title: "Get Your Report",    desc: "Detailed scores, feedback, strengths & improvement plan" },
          ].map(({ step, title, desc }) => (
            <div key={step} className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl flex items-center justify-center text-xl font-extrabold mx-auto mb-4 shadow-lg shadow-violet-500/30">
                {step}
              </div>
              <h3 className="font-bold text-white mb-2 text-sm">{title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── Testimonials ── */}
    <section className="py-20 px-6 max-w-6xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-14" style={{ fontFamily: "Poppins, sans-serif" }}>
        Loved by <span className="text-violet-400">Developers</span>
      </h2>
      <div className="grid md:grid-cols-3 gap-5">
        {TESTIMONIALS.map(({ name, role, text, rating, avatar, color }) => (
          <div key={name}
            className="bg-slate-800/60 border border-white/10 rounded-2xl p-6 hover:border-violet-500/30 transition">
            <div className="flex mb-3">
              {Array.from({ length: rating }).map((_, i) => (
                <RiStarFill key={i} className="text-yellow-400 text-sm" />
              ))}
            </div>
            <p className="text-sm text-slate-300 mb-5 leading-relaxed">"{text}"</p>
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-full ${color} flex items-center justify-center text-white font-bold text-sm`}>
                {avatar}
              </div>
              <div>
                <p className="font-semibold text-white text-sm">{name}</p>
                <p className="text-xs text-violet-400">{role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* ── CTA ── */}
    <section className="py-20 px-6 text-center border-t border-white/10">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>
          Ready to <span className="text-violet-400">Land Your Dream Job?</span>
        </h2>
        <p className="text-slate-300 mb-8 leading-relaxed">
          Join 50,000+ developers who use InterviewIQ AI to prepare smarter, interview with confidence,
          and get hired faster.
        </p>
        <Link
          to="/auth"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold px-10 py-4 rounded-2xl shadow-lg shadow-violet-500/30 transition text-base"
        >
          Start Free — No Credit Card <RiArrowRightLine />
        </Link>
        <div className="flex items-center justify-center gap-6 mt-8 text-sm text-slate-400">
          {["✅ Free forever plan", "✅ No credit card", "✅ Instant access"].map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
      </div>
    </section>

    {/* ── Footer ── */}
    <footer className="border-t border-white/10 py-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-violet-600 rounded-lg flex items-center justify-center">
            <RiBrainLine className="text-white text-sm" />
          </div>
          <span className="font-bold text-sm">InterviewIQ AI</span>
        </div>
        <p className="text-slate-500 text-xs">
          © {new Date().getFullYear()} InterviewIQ AI. Built with ❤️ for developers worldwide.
        </p>
        <div className="flex gap-4 text-xs text-slate-500">
          <Link to="/auth" className="hover:text-white transition">Privacy</Link>
          <Link to="/auth" className="hover:text-white transition">Terms</Link>
          <Link to="/auth" className="hover:text-white transition">Contact</Link>
        </div>
      </div>
    </footer>
  </div>
);

export default Home;
