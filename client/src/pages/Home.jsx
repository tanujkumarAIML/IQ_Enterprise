import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import {
  RiBrainLine, RiVideoLine, RiFileTextLine, RiRobot2Line,
  RiArrowRightLine, RiStarFill, 
  RiCodeLine, RiBarChartLine, RiShieldLine, RiPlayCircleLine,
} from "react-icons/ri";

/* ──────────────── Custom Animations (marquee fix + extras) ──────────────── */
const CustomStyles = () => (
  <style>{`
    @keyframes marquee {
      0%   { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    .animate-marquee { animation: marquee 40s linear infinite; }
    .animate-marquee:hover { animation-play-state: paused; }

    @keyframes float-slow {
      0%, 100% { transform: translateY(0) scale(1); }
      50%      { transform: translateY(-18px) scale(1.03); }
    }
    @keyframes float-slower {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50%      { transform: translateY(-12px) rotate(2deg); }
    }
    .animate-float-slow   { animation: float-slow 7s ease-in-out infinite; }
    .animate-float-slower { animation: float-slower 9s ease-in-out infinite; }

    @keyframes gradient-spin {
      0%   { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .animate-gradient-spin { animation: gradient-spin 3s linear infinite; }

    @keyframes pulse-glow {
      0%, 100% { opacity: 0.4; }
      50%      { opacity: 0.8; }
    }
    .animate-pulse-glow { animation: pulse-glow 4s ease-in-out infinite; }

    /* Noise texture overlay */
    .noise-overlay::after {
      content: '';
      position: fixed;
      inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
      pointer-events: none;
      z-index: 9999;
      opacity: 0.35;
    }

    /* Smooth scrollbar */
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: #020617; }
    ::-webkit-scrollbar-thumb { background: #334155; border-radius: 3px; }
    ::-webkit-scrollbar-thumb:hover { background: #475569; }
  `}</style>
);

/* ──────────────── Count-Up Component ──────────────── */
const CountUp = ({ value, suffix = "", decimal = false }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!isInView) return;
    const num = parseFloat(value);
    const duration = 2200;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4); // easeOutQuart
      const current = eased * num;
      setDisplay(decimal ? current.toFixed(1) : Math.floor(current).toLocaleString());
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [isInView, value, decimal]);

  return <span ref={ref}>{display}{suffix}</span>;
};

/* ──────────────── Data ──────────────── */
const FEATURES = [
  {
    icon: RiVideoLine,
    title: "AI Mock Interviews",
    desc: "Gemini AI generates personalized questions from your resume. Practice HR, Technical, DSA & System Design rounds.",
    color: "from-violet-500/20 to-violet-600/5",
    iconBg: "bg-violet-500/15 text-violet-400",
    glow: "group-hover:shadow-violet-500/20",
  },
  {
    icon: RiFileTextLine,
    title: "Resume ATS Analyzer",
    desc: "Upload PDF/DOCX → get ATS score, keyword gaps, grammar check, skill extraction & AI-powered suggestions.",
    color: "from-blue-500/20 to-blue-600/5",
    iconBg: "bg-blue-500/15 text-blue-400",
    glow: "group-hover:shadow-blue-500/20",
  },
  {
    icon: RiRobot2Line,
    title: "AI Career Chatbot",
    desc: "Career, Resume, Coding, Interview & HR assistants. Powered by Gemini AI with full conversation memory.",
    color: "from-emerald-500/20 to-emerald-600/5",
    iconBg: "bg-emerald-500/15 text-emerald-400",
    glow: "group-hover:shadow-emerald-500/20",
  },
  {
    icon: RiBarChartLine,
    title: "Detailed Reports",
    desc: "Technical, communication, confidence & grammar scores. Radar charts, PDF export & improvement plans.",
    color: "from-amber-500/20 to-amber-600/5",
    iconBg: "bg-amber-500/15 text-amber-400",
    glow: "group-hover:shadow-amber-500/20",
  },
  {
    icon: RiCodeLine,
    title: "NLP & Voice AI",
    desc: "Real-time voice input via Web Speech API. Filler word detection, pace analysis & communication scoring.",
    color: "from-pink-500/20 to-pink-600/5",
    iconBg: "bg-pink-500/15 text-pink-400",
    glow: "group-hover:shadow-pink-500/20",
  },
  {
    icon: RiShieldLine,
    title: "Computer Vision",
    desc: "Eye contact tracking, emotion detection, body language scoring & confidence analysis during interviews.",
    color: "from-indigo-500/20 to-indigo-600/5",
    iconBg: "bg-indigo-500/15 text-indigo-400",
    glow: "group-hover:shadow-indigo-500/20",
  },
];

const TESTIMONIALS = [
  {
    name: "Arjun Sharma",
    role: "SDE-2 at Amazon",
    text: "InterviewIQ's resume-personalized questions were exactly what I faced in my Amazon loop. The feedback on my system design answer was spot-on. Got the offer!",
    rating: 5,
    avatar: "A",
    color: "from-orange-500 to-amber-600",
  },
  {
    name: "Priya Nair",
    role: "Frontend Dev at Google",
    text: "The ATS analyzer boosted my resume score from 38% to 91%. The keyword suggestions were incredibly targeted. Got 8 interview calls in 2 weeks.",
    rating: 5,
    avatar: "P",
    color: "from-blue-500 to-cyan-600",
  },
  {
    name: "Rahul Verma",
    role: "ML Engineer at Meta",
    text: "The AI chatbot helped me nail system design and DSA prep. The follow-up questions felt like a real interview. Best prep platform I've used.",
    rating: 5,
    avatar: "R",
    color: "from-emerald-500 to-teal-600",
  },
];

const STATS = [
  { value: 50, suffix: "K+", label: "Interviews Taken", decimal: false },
  { value: 94, suffix: "%", label: "Success Rate", decimal: false },
  { value: 500, suffix: "+", label: "Companies", decimal: false },
  { value: 4.9, suffix: "★", label: "User Rating", decimal: true },
];

const COMPANIES = [
  { name: "Google",    logo: "https://cdn.simpleicons.org/google/ffffff" },
  { name: "Amazon",   logo: "https://cdn.simpleicons.org/amazon/ffffff" },
  { name: "Microsoft",logo: "https://cdn.simpleicons.org/microsoft/ffffff" },
  { name: "Meta",     logo: "https://cdn.simpleicons.org/meta/ffffff" },
  { name: "Apple",    logo: "https://cdn.simpleicons.org/apple/ffffff" },
  { name: "Netflix",  logo: "https://cdn.simpleicons.org/netflix/ffffff" },
  { name: "Adobe",    logo: "https://cdn.simpleicons.org/adobe/ffffff" },
  { name: "Uber",     logo: "https://cdn.simpleicons.org/uber/ffffff" },
  { name: "Infosys",  logo: "https://cdn.simpleicons.org/infosys/ffffff" },
  { name: "Spotify",  logo: "https://cdn.simpleicons.org/spotify/ffffff" },
];

/* ──────────────── Animation Helpers ──────────────── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
});

const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.08 } },
  viewport: { once: true, margin: "-60px" },
};

const staggerChild = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
};

/* ══════════════════════════════════════════════════════════════════════════ */
/*                                HOME PAGE                                  */
/* ══════════════════════════════════════════════════════════════════════════ */
const Home = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);

  // Mouse-following spotlight in hero
  useEffect(() => {
    const onMove = (e) => {
      if (!heroRef.current) return;
      const r = heroRef.current.getBoundingClientRect();
      setMousePos({ x: e.clientX - r.left, y: e.clientY - r.top });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-white noise-overlay">
      <CustomStyles />

      {/* ────────── Navbar ────────── */}
      <nav className="sticky top-0 z-50 backdrop-blur-2xl bg-[#020617]/70 border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/25 group-hover:shadow-violet-500/40 transition-shadow">
              <RiBrainLine className="text-white text-lg" />
            </div>
            <span className="font-bold text-[17px] tracking-tight" style={{ fontFamily: "Poppins, sans-serif" }}>
              InterviewIQ<span className="text-violet-400">.ai</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1 text-sm">
            {["Features", "How It Works", "Testimonials"].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                className="px-4 py-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition-all">
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2.5">
            <Link to="/auth"
              className="text-sm text-slate-300 hover:text-white transition px-4 py-2 rounded-xl hover:bg-white/[0.06]">
              Sign In
            </Link>
            <Link to="/auth"
              className="text-sm font-semibold bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.1] transition px-5 py-2 rounded-xl">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ────────── Hero ────────── */}
      <section ref={heroRef} className="relative overflow-hidden pt-20 pb-28 px-6">
        {/* Dot grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.25]"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />

        {/* Mouse-following spotlight */}
        <div
          className="absolute inset-0 pointer-events-none transition-all duration-300"
          style={{
            background: `radial-gradient(700px circle at ${mousePos.x}px ${mousePos.y}px, rgba(139,92,246,0.07), transparent 45%)`,
          }}
        />

        {/* Aurora blobs */}
        <div className="absolute top-[10%] left-[15%] w-[500px] h-[500px] bg-violet-600/25 rounded-full blur-[160px] animate-float-slow" />
        <div className="absolute bottom-[5%] right-[10%] w-[400px] h-[400px] bg-cyan-500/15 rounded-full blur-[140px] animate-float-slower" />
        <div className="absolute top-[40%] left-[55%] w-[300px] h-[300px] bg-indigo-500/15 rounded-full blur-[120px] animate-pulse-glow" />

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div {...fadeUp(0)}>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 text-xs font-semibold bg-violet-500/10 text-violet-300 border border-violet-500/20 px-5 py-2 rounded-full mb-8 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500" />
              </span>
              Powered by Gemini AI
            </div>

            {/* Heading */}
            <h1
              className="text-[clamp(2.8rem,7vw,5rem)] font-extrabold leading-[1.08] mb-7 tracking-tight"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Ace Every{" "}
              <span className="relative">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400">
                  Interview
                </span>
                <span className="absolute -bottom-1 left-0 right-0 h-3 bg-gradient-to-r from-violet-500/20 via-fuchsia-500/20 to-cyan-500/20 blur-xl rounded-full" />
              </span>
              <br />
              with AI Confidence
            </h1>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-11 leading-relaxed">
              Upload your resume → AI generates personalized questions → Get real-time
              feedback → Land your dream job. Used by{" "}
              <span className="text-white font-semibold">50,000+</span> developers.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/auth"
                className="group flex items-center gap-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold px-8 py-4 rounded-2xl shadow-2xl shadow-violet-500/25 hover:shadow-violet-500/40 transition-all duration-300 text-[15px] hover:-translate-y-0.5"
              >
                Start for Free
                <RiArrowRightLine className="text-xl group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/auth"
                className="group flex items-center gap-2.5 border border-white/[0.12] hover:bg-white/[0.06] hover:border-white/[0.2] text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300 text-[15px]"
              >
                <RiPlayCircleLine className="text-xl text-violet-400" />
                Watch Demo
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            {...fadeUp(0.25)}
            className="grid grid-cols-2 sm:grid-cols-4 max-w-2xl mx-auto mt-20 gap-3"
          >
            {STATS.map(({ value, suffix, label, decimal }) => (
              <div
                key={label}
                className="relative bg-white/[0.04] border border-white/[0.08] rounded-2xl py-5 px-3 hover:bg-white/[0.07] hover:border-white/[0.14] transition-all duration-300 group"
              >
                <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-violet-300 to-cyan-300 bg-clip-text text-transparent">
                  <CountUp value={value} suffix={suffix} decimal={decimal} />
                </p>
                <p className="text-[11px] text-slate-500 mt-1.5 font-medium uppercase tracking-wider">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ────────── Company Logos ────────── */}
      <section className="relative py-16 overflow-hidden border-y border-white/[0.06] bg-gradient-to-b from-[#020617] via-slate-900/50 to-[#020617]">
        {/* Center glow */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-48 bg-violet-600/[0.07] rounded-full blur-[100px] pointer-events-none" />

        <div className="relative text-center mb-10 px-6">
          <p className="uppercase tracking-[0.3em] text-violet-400/80 text-[11px] font-bold mb-3">
            Trusted by top companies
          </p>
          <h3 className="text-2xl md:text-3xl font-bold">Candidates Placed At</h3>
          <p className="text-slate-500 mt-2 text-sm">Thousands of developers landed interviews at leading tech companies.</p>
        </div>

        <div className="relative overflow-hidden">
          {/* Fade edges */}
          <div className="pointer-events-none absolute left-0 top-0 h-full w-32 bg-gradient-to-r from-[#020617] to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-[#020617] to-transparent z-10" />

          <div className="flex animate-marquee gap-5 w-max">
            {[...COMPANIES, ...COMPANIES].map((company, i) => (
              <div
                key={i}
                className="group flex items-center gap-3.5 min-w-[200px] rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl px-5 py-4 transition-all duration-500 hover:-translate-y-1.5 hover:border-violet-500/30 hover:bg-white/[0.07] hover:shadow-xl hover:shadow-violet-500/[0.07]"
              >
                <img
                  src={company.logo}
                  alt={company.name}
                  className="w-8 h-8 object-contain opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
                />
                <span className="font-semibold text-[15px] text-slate-500 group-hover:text-white transition-colors duration-500">
                  {company.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ────────── Features ────────── */}
      <section id="features" className="py-24 px-6 max-w-6xl mx-auto">
        <motion.div {...fadeUp(0)} className="text-center mb-16">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.3em] text-violet-400/80 mb-4">
            Features
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-5" style={{ fontFamily: "Poppins, sans-serif" }}>
            Everything You Need to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">Succeed</span>
          </h2>
          <p className="text-slate-500 max-w-lg mx-auto leading-relaxed">
            Enterprise-grade AI tools that adapt to your resume and target role — no generic questions, ever.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {FEATURES.map(({ icon: Icon, title, desc, iconBg, glow }, i) => (
            <motion.div
              key={title}
              variants={staggerChild}
              className={`group relative bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.07] rounded-2xl p-7 hover:border-white/[0.15] transition-all duration-500 hover:shadow-2xl ${glow} cursor-default`}
            >
              {/* Hover gradient overlay */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-5 ${iconBg} group-hover:scale-110 transition-transform duration-500`}>
                  <Icon />
                </div>
                <h3 className="font-bold text-white mb-2.5 text-[15px] group-hover:text-violet-300 transition-colors duration-300">
                  {title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed group-hover:text-slate-400 transition-colors duration-300">
                  {desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ────────── How It Works ────────── */}
      <section id="how-it-works" className="py-24 px-6 border-y border-white/[0.06] bg-white/[0.015]">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp(0)} className="text-center mb-20">
            <span className="inline-block text-[11px] font-bold uppercase tracking-[0.3em] text-violet-400/80 mb-4">
              How It Works
            </span>
            <h2 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: "Poppins, sans-serif" }}>
              Four Steps to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">Your Offer</span>
            </h2>
          </motion.div>

          <div className="relative">
            {/* Connecting line (desktop) */}
            <div className="hidden lg:block absolute top-11 left-[15%] right-[15%] h-px bg-gradient-to-r from-violet-500/0 via-violet-500/30 to-violet-500/0" />

            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="whileInView"
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6"
            >
              {[
                { step: "01", title: "Upload Resume", desc: "PDF or DOCX — AI extracts skills, projects & experience automatically", icon: "📄" },
                { step: "02", title: "Choose Interview", desc: "Select role type, difficulty level & target company for customization", icon: "🎯" },
                { step: "03", title: "AI Generates Q&A", desc: "Gemini creates 10+ personalized questions based on YOUR resume", icon: "🤖" },
                { step: "04", title: "Get Your Report", desc: "Detailed scores, feedback, strengths & a step-by-step improvement plan", icon: "📊" },
              ].map(({ step, title, desc, icon }) => (
                <motion.div key={step} variants={staggerChild} className="relative text-center group">
                  {/* Step circle */}
                  <div className="relative mx-auto mb-6 w-[88px] h-[88px]">
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-3xl rotate-6 group-hover:rotate-12 transition-transform duration-500 opacity-60 blur-sm" />
                    <div className="relative w-full h-full bg-gradient-to-br from-violet-600 to-indigo-600 rounded-3xl flex flex-col items-center justify-center shadow-2xl shadow-violet-500/20 group-hover:shadow-violet-500/40 transition-shadow">
                      <span className="text-2xl mb-0.5">{icon}</span>
                      <span className="text-[11px] font-bold opacity-80">{step}</span>
                    </div>
                  </div>
                  <h3 className="font-bold text-white mb-2 text-[15px]">{title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-[220px] mx-auto">{desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ────────── Testimonials ────────── */}
      <section id="testimonials" className="py-24 px-6 max-w-6xl mx-auto">
        <motion.div {...fadeUp(0)} className="text-center mb-16">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.3em] text-violet-400/80 mb-4">
            Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: "Poppins, sans-serif" }}>
            Loved by{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">Developers</span>
          </h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          className="grid md:grid-cols-3 gap-5"
        >
          {TESTIMONIALS.map(({ name, role, text, rating, avatar, color }, i) => (
            <motion.div
              key={name}
              variants={staggerChild}
              className="group relative bg-white/[0.03] border border-white/[0.07] rounded-2xl p-7 hover:border-white/[0.14] hover:bg-white/[0.05] transition-all duration-500 hover:shadow-2xl hover:shadow-violet-500/[0.06]"
            >
              {/* Quote icon */}
               <span className="text-violet-500/20 text-5xl font-serif mb-4 group-hover:text-violet-500/40 transition-colors">&ldquo;
               </span>

              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: rating }).map((_, j) => (
                  <RiStarFill key={j} className="text-amber-400 text-sm" />
                ))}
              </div>

              <p className="text-sm text-slate-400 mb-6 leading-relaxed group-hover:text-slate-300 transition-colors">
                "{text}"
              </p>

              <div className="flex items-center gap-3 pt-5 border-t border-white/[0.06]">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                  {avatar}
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{name}</p>
                  <p className="text-xs text-violet-400/80">{role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ────────── CTA ────────── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto relative">
          {/* Background glow */}
          <div className="absolute inset-0 -m-20 bg-violet-600/[0.08] rounded-full blur-[100px] pointer-events-none" />

          <motion.div {...fadeUp(0)} className="relative text-center">
            {/* Animated gradient border card */}
            <div className="relative p-[1px] rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 animate-gradient-spin opacity-60" />
              <div className="relative bg-[#0a0f1e] rounded-3xl px-8 py-16 md:px-16 md:py-20">
                <h2
                  className="text-3xl md:text-5xl font-bold mb-5 leading-tight"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Ready to{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">
                    Land Your Dream Job?
                  </span>
                </h2>
                <p className="text-slate-400 mb-10 leading-relaxed max-w-lg mx-auto">
                  Join 50,000+ developers who prepare smarter, interview with confidence, and get hired faster.
                </p>

                <Link
                  to="/auth"
                  className="group inline-flex items-center gap-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold px-10 py-4 rounded-2xl shadow-2xl shadow-violet-500/25 hover:shadow-violet-500/40 transition-all duration-300 text-[15px] hover:-translate-y-0.5"
                >
                  Start Free — No Credit Card
                  <RiArrowRightLine className="text-xl group-hover:translate-x-1 transition-transform" />
                </Link>

                <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-8 text-sm text-slate-500">
                  {["✅ Free forever plan", "✅ No credit card required", "✅ Instant access"].map((t) => (
                    <span key={t} className="flex items-center gap-1.5">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ────────── Footer ────────── */}
      <footer className="border-t border-white/[0.06] py-10 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <RiBrainLine className="text-white text-sm" />
                </div>
                <span className="font-bold text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>
                  InterviewIQ<span className="text-violet-400">.ai</span>
                </span>
              </Link>
              <p className="text-xs text-slate-600 leading-relaxed max-w-[240px]">
                AI-powered interview preparation platform. Practice smarter, not harder.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Product</h4>
              <ul className="space-y-2.5">
                {["Mock Interviews", "ATS Analyzer", "AI Chatbot", "Reports"].map((item) => (
                  <li key={item}>
                    <Link to="/auth" className="text-sm text-slate-600 hover:text-white transition">{item}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Company</h4>
              <ul className="space-y-2.5">
                {["About", "Blog", "Careers", "Contact"].map((item) => (
                  <li key={item}>
                    <Link to="/auth" className="text-sm text-slate-600 hover:text-white transition">{item}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Legal</h4>
              <ul className="space-y-2.5">
                {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
                  <li key={item}>
                    <Link to="/auth" className="text-sm text-slate-600 hover:text-white transition">{item}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-slate-700 text-xs">
              © {new Date().getFullYear()} InterviewIQ AI. Built with ❤️ for developers worldwide.
            </p>
            <div className="flex items-center gap-2">
              {["Made with Gemini", "Open Source", "v2.0"].map((badge) => (
                <span key={badge} className="text-[10px] font-medium bg-white/[0.04] border border-white/[0.06] text-slate-500 px-3 py-1 rounded-full">
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;