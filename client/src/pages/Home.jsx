import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  RiVideoLine, RiFileTextLine, RiRobot2Line, RiArrowRightLine, RiArrowLeftLine, RiArrowUpLine,
  RiStarFill, RiDoubleQuotesL, RiCodeLine, RiBarChartLine, RiShieldLine,
  RiPlayCircleLine, RiCloseLine, RiMenuLine, RiCheckLine, RiArrowDownSLine,
  RiTwitterXFill, RiGithubFill, RiLinkedinBoxFill, RiMailLine, RiPhoneLine,
  RiMapPin2Line, RiTimeLine, RiFlashlightLine, RiCpuLine, RiChatSmile2Line,
  RiBookmarkLine, RiSendPlane2Line, RiUser3Line, RiSparklingLine,
  RiTeamLine, RiLightbulbFlashLine, RiTrophyLine, RiMedalLine, RiContrast2Line,
  RiDatabase2Line, RiBrainLine, RiMicroscopeLine, RiServiceLine,
  // --- NEWLY ADDED ICONS TO REPLACE EMOJIS ---
  RiUploadCloud2Line, RiFocus3Line, RiLineChartLine, RiCodeSSlashLine, 
  RiBuilding2Line, RiLayoutMasonryLine, RiServerLine, 
} from "react-icons/ri";

/* ══════════════════════════════════════════════════════════════════════
   1. CUSTOM HOOKS
   ══════════════════════════════════════════════════════════════════════ */

const useMouseSpotlight = (ref) => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e) => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [ref]);
  return pos;
};

const useTypingEffect = (text, speed = 30, startDelay = 0) => {
  const [displayed, setDisplayed] = useState("");
  const [isDone, setIsDone] = useState(false);
  useEffect(() => {
    let timeout; let i = 0;
    const start = setTimeout(() => {
      const tick = () => {
        if (i < text.length) { setDisplayed(text.substring(0, i + 1)); i++; timeout = setTimeout(tick, speed); }
        else { setIsDone(true); }
      }; tick();
    }, startDelay);
    return () => { clearTimeout(start); clearTimeout(timeout); };
  }, [text, speed, startDelay]);
  return { displayed, isDone };
};

/* ══════════════════════════════════════════════════════════════════════
   2. SVG COMPONENTS
   ══════════════════════════════════════════════════════════════════════ */

export const Logo = ({ className = "w-9 h-9" }) => (
  <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="10" fill="url(#lg)" />
    <path d="M20 11C16.134 11 13 14.134 13 18C13 19.66 13.63 21.16 14.66 22.28L13 27H27L25.34 22.28C26.37 21.16 27 19.66 27 18C27 14.134 23.866 11 20 11Z" fill="white" opacity="0.95"/>
    <path d="M17.5 18H22.5M20 15.5V20.5" stroke="#6D28D9" strokeWidth="2" strokeLinecap="round"/>
    <path d="M15.5 29H24.5" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
    <defs><linearGradient id="lg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse"><stop stopColor="#8B5CF6"/><stop offset="1" stopColor="#4F46E5"/></linearGradient></defs>
  </svg>
);

const DashboardMockup = () => (
  <div className="relative w-full max-w-5xl mx-auto bg-slate-50 border border-slate-200/80 rounded-2xl shadow-2xl shadow-slate-300/50 overflow-hidden">
    <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-200 bg-white">
      <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-red-400"/><div className="w-3 h-3 rounded-full bg-amber-400"/><div className="w-3 h-3 rounded-full bg-green-400"/></div>
      <div className="flex-1 mx-4"><div className="bg-slate-100 h-7 rounded-lg max-w-lg mx-auto flex items-center justify-center text-[10px] text-slate-400 font-medium border border-slate-200/50">interviewiq.ai/dashboard/sde-2-amazon</div></div>
    </div>
    <div className="grid grid-cols-12 min-h-[450px] bg-slate-50">
      <div className="col-span-3 border-r border-slate-200 p-4 bg-white hidden md:block">
        <div className="flex items-center gap-2 mb-6 px-2"><div className="w-7 h-7 rounded-lg bg-violet-100 flex items-center justify-center text-violet-600 text-xs"><RiBrainLine /></div><span className="text-xs font-bold text-slate-700">InterviewIQ</span></div>
        {["Dashboard", "Interviews", "Resume ATS", "Reports", "AI Chatbot", "Settings"].map((t, i) => (
          <div key={t} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-xs font-medium transition-colors ${i === 0 ? "bg-violet-50 text-violet-700 shadow-sm" : "text-slate-500 hover:bg-slate-50"}`}>
            <div className={`w-5 h-5 rounded-md ${i === 0 ? "bg-violet-200" : "bg-slate-200"}`} /> {t}
          </div>
        ))}
      </div>
      <div className="col-span-12 md:col-span-9 p-6 bg-slate-50/50">
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[{l: "Overall Score", v: "92%", c: "from-violet-500 to-indigo-500"}, {l: "Confidence", v: "88%", c: "from-blue-500 to-cyan-500"}, {l: "Technical", v: "95%", c: "from-emerald-500 to-teal-500"}].map(s => (
            <div key={s.l} className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm">
              <p className="text-[10px] text-slate-400 font-medium mb-2 uppercase tracking-wider">{s.l}</p>
              <p className="text-2xl font-extrabold text-slate-800 mb-2">{s.v}</p>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden"><div className={`h-full bg-gradient-to-r ${s.c} rounded-full`} style={{width: s.v}} /></div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm">
            <p className="text-xs font-bold text-slate-700 mb-3">Skills Extracted</p>
            <div className="flex flex-wrap gap-1.5">
              {["React", "Node.js", "AWS", "System Design", "Python"].map(s => (
                <span key={s} className="text-[10px] font-semibold bg-violet-50 text-violet-600 px-2 py-1 rounded-md border border-violet-100">{s}</span>
              ))}
            </div>
          </div>
          <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm flex flex-col items-center justify-center text-slate-400">
            <RiBarChartLine className="text-4xl mb-1" /><p className="text-[10px] font-medium">Performance Radar</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════════════════════
   3. ANIMATION VARIANTS
   ══════════════════════════════════════════════════════════════════════ */

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" }, transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
});

const staggerContainer = {
  initial: {}, whileInView: { transition: { staggerChildren: 0.08 } }, viewport: { once: true, margin: "-60px" },
};

const staggerChild = {
  initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
};

const scaleIn = { initial: { opacity: 0, scale: 0.95 }, whileInView: { opacity: 1, scale: 1 }, viewport: { once: true }, transition: { duration: 0.5, ease: "easeOut" } };

/* ══════════════════════════════════════════════════════════════════════
   4. MASSIVE DATA ARRAYS (NO EMOJIS, PURE RI ICONS)
   ══════════════════════════════════════════════════════════════════════ */

const NAV_LINKS = ["Features", "How It Works", "Pricing", "Testimonials", "FAQ"];

const FEATURES = [
  { icon: RiVideoLine, title: "AI Mock Interviews", desc: "Gemini AI generates personalized questions from your resume. Practice HR, Technical, DSA & System Design rounds.", iconBg: "bg-violet-100 text-violet-600", glow: "hover:shadow-violet-200/80" },
  { icon: RiFileTextLine, title: "Resume ATS Analyzer", desc: "Upload PDF/DOCX → get ATS score, keyword gaps, grammar check, skill extraction & AI optimization.", iconBg: "bg-blue-100 text-blue-600", glow: "hover:shadow-blue-200/80" },
  { icon: RiRobot2Line, title: "AI Career Chatbot", desc: "Career, Resume, Coding, Interview & HR assistants. Powered by Gemini AI with conversation memory.", iconBg: "bg-emerald-100 text-emerald-600", glow: "hover:shadow-emerald-200/80" },
  { icon: RiBarChartLine, title: "Detailed Reports", desc: "Technical, communication, confidence & grammar scores. Radar charts, PDF export & improvement plans.", iconBg: "bg-amber-100 text-amber-600", glow: "hover:shadow-amber-200/80" },
  { icon: RiCodeLine, title: "NLP & Voice AI", desc: "Real-time voice input via Web Speech API. Filler word detection, pace analysis & deep scoring.", iconBg: "bg-pink-100 text-pink-600", glow: "hover:shadow-pink-200/80" },
  { icon: RiShieldLine, title: "Computer Vision", desc: "Eye contact tracking, emotion detection, body language scoring & confidence analysis during interviews.", iconBg: "bg-indigo-100 text-indigo-600", glow: "hover:shadow-indigo-200/80" },
];

const INTERVIEW_TYPES = [
  { icon: RiCodeSSlashLine, title: "DSA & Coding", desc: "Data structures, algorithms, and live coding environments.", color: "from-blue-500 to-cyan-500" },
  { icon: RiBuilding2Line, title: "System Design", desc: "Scalability, load balancing, and high-level architecture.", color: "from-violet-500 to-purple-500" },
  { icon: RiTeamLine, title: "Behavioral & HR", desc: "Leadership principles, conflict resolution, and culture fit.", color: "from-emerald-500 to-green-500" },
  { icon: RiLayoutMasonryLine, title: "Frontend Specific", desc: "React, DOM, performance optimization, and state management.", color: "from-cyan-500 to-blue-500" },
  { icon: RiServerLine, title: "Backend & APIs", desc: "Databases, microservices, REST vs GraphQL, and caching.", color: "from-orange-500 to-red-500" },
  { icon: RiBrainLine, title: "Machine Learning", desc: "ML fundamentals, model deployment, and deep learning.", color: "from-pink-500 to-rose-500" },
];

const WHY_US = [
  { title: "Traditional Prep", features: ["Generic questions from Leetcode", "No resume matching", "Static text feedback", "No voice/video analysis", "Manual progress tracking", "Expensive human mentors"] },
  { title: "InterviewIQ AI", features: ["100% personalized to YOUR resume", "Deep skill extraction & mapping", "Real-time multi-modal feedback", "Eye-contact & emotion tracking", "Automated detailed analytics", "24/7 AI mentor for cheap"], highlight: true },
  { title: "Other AI Tools", features: ["Basic GPT wrappers", "Simple keyword matching", "Text-only responses", "No computer vision", "Basic score cards", "No role-specific tuning"] },
];

const PRICING_TIERS = [
  { name: "Starter", desc: "Perfect for trying out AI interviews.", monthlyPrice: 0, yearlyPrice: 0, cta: "Get Started Free", popular: false, features: ["3 AI Mock Interviews/mo", "Basic Resume ATS Check", "General AI Chatbot", "Text-based Input Only", "Basic Score Reports"] },
  { name: "Pro", desc: "For serious job seekers aiming for top tech.", monthlyPrice: 29, yearlyPrice: 19, cta: "Start 7-Day Trial", popular: true, features: ["Unlimited AI Interviews", "Advanced ATS Analyzer", "Role-Specific AI Chat", "Voice & Video Input", "Advanced Analytics & Radar Charts", "PDF Report Export", "Interview Recording Playback", "Priority Support"] },
  { name: "Enterprise", desc: "For universities and bootcamps.", monthlyPrice: 99, yearlyPrice: 79, cta: "Contact Sales", popular: false, features: ["Everything in Pro", "Up to 100 Student Seats", "Admin Dashboard & Analytics", "Custom Branding", "API Access", "Bulk Resume Processing", "Dedicated Account Manager", "SLA Guarantee"] },
];

const FAQS = [
  { q: "How does the AI generate personalized questions?", a: "When you upload your resume, our AI (powered by Gemini) extracts your skills, projects, and experience. It cross-references this with the specific job role and company you select to generate highly relevant, contextual interview questions." },
  { q: "Is my video and audio data secure?", a: "Absolutely. We take privacy extremely seriously. All video and audio processing happens in real-time and is not stored permanently on our servers unless you explicitly choose to save the recording. Data is encrypted in transit and at rest." },
  { q: "Can I use InterviewIQ for non-tech roles?", a: "Yes! While we excel at technical interviews (DSA, System Design), our AI is highly capable of generating questions for HR, Marketing, Product Management, and other non-technical roles." },
  { q: "How accurate is the ATS Resume Analyzer?", a: "Our analyzer parses your resume against standard ATS algorithms (like those used by Workday and Lever). It checks formatting, keyword density, and provides actionable fixes. Users typically see a 30-50% increase in ATS scores." },
  { q: "Do I need to install any software?", a: "No! InterviewIQ is a 100% web-based platform. You just need a modern browser (Chrome, Edge, Safari) and a webcam/microphone if you want to practice video interviews." },
  { q: "What payment methods do you accept?", a: "We accept all major credit/debit cards (Visa, Mastercard, Amex), UPI, and PayPal. For Enterprise plans, we also support invoice-based payments and bank transfers." },
];

const TESTIMONIALS = [
  { name: "Arjun Sharma", role: "SDE-2 at Amazon", text: "InterviewIQ's resume-personalized questions were exactly what I faced in my Amazon loop. The feedback on my system design answer was spot-on. Got the offer!", rating: 5, avatar: "A", color: "from-orange-400 to-amber-500" },
  { name: "Priya Nair", role: "Frontend Dev at Google", text: "The ATS analyzer boosted my resume score from 38% to 91%. The keyword suggestions were incredibly targeted. Got 8 interview calls in 2 weeks.", rating: 5, avatar: "P", color: "from-blue-400 to-cyan-500" },
  { name: "Rahul Verma", role: "ML Engineer at Meta", text: "The AI chatbot helped me nail system design and DSA prep. The follow-up questions felt like a real interview. Best prep platform I've used.", rating: 5, avatar: "R", color: "from-emerald-400 to-teal-500" },
  { name: "Sneha Patel", role: "PM at Microsoft", text: "Even for non-tech roles, the AI was incredibly accurate. It picked up on my case study experience and asked tough PM questions.", rating: 5, avatar: "S", color: "from-pink-400 to-rose-500" },
  { name: "Alex Chen", role: "Backend Dev at Netflix", text: "The voice analysis caught my filler words and pacing issues I didn't even realize I had. After 3 sessions, my communication score jumped 40%.", rating: 5, avatar: "A", color: "from-red-400 to-orange-500" },
];

const BLOGS = [
  { title: "How to Crack Amazon's Leadership Principles Interview", tag: "Interview Tips", date: "Oct 24, 2024", img: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&q=80" },
  { title: "10 ATS Resume Mistakes That Are Killing Your Chances", tag: "Resume", date: "Oct 20, 2024", img: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&q=80" },
  { title: "The Ultimate Guide to System Design Interviews", tag: "Technical", date: "Oct 15, 2024", img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80" },
];

const STATS = [
  { value: 50, suffix: "K+", label: "Interviews Taken", decimal: false },
  { value: 94, suffix: "%", label: "Success Rate", decimal: false },
  { value: 500, suffix: "+", label: "Companies", decimal: false },
  { value: 4.9, suffix: "★", label: "User Rating", decimal: true },
];

const COMPANIES = [
  { name: "Google", logo: "https://cdn.simpleicons.org/google" }, { name: "Amazon", logo: "https://cdn.simpleicons.org/amazon" },
  { name: "Microsoft", logo: "https://cdn.simpleicons.org/microsoft" }, { name: "Meta", logo: "https://cdn.simpleicons.org/meta" },
  { name: "Apple", logo: "https://cdn.simpleicons.org/apple" }, { name: "Netflix", logo: "https://cdn.simpleicons.org/netflix" },
  { name: "Adobe", logo: "https://cdn.simpleicons.org/adobe" }, { name: "Uber", logo: "https://cdn.simpleicons.org/uber" },
  { name: "Infosys", logo: "https://cdn.simpleicons.org/infosys" }, { name: "Spotify", logo: "https://cdn.simpleicons.org/spotify" },
];

const CHAT_HISTORY = [
  { role: "ai", text: "Hello Arjun! I've analyzed your resume for the SDE-2 role at Amazon. Are you ready to begin the System Design round?" },
  { role: "user", text: "Yes, I'm ready." },
  { role: "ai", text: "Great. Let's start: Design a URL shortener like Bitly. We need to handle 100M daily active users with high availability. How would you approach the high-level design?" },
  { role: "user", text: "I would use a REST API gateway, a NoSQL database like Cassandra for fast reads/writes, and a caching layer with Redis." },
  { role: "ai", text: "Excellent start. But what happens when the cache misses? How do you handle database write contention when generating the unique short codes?" },
];

const CountUp = ({ value, suffix = "", decimal = false }) => {
  const ref = useRef(null); const isInView = useInView(ref, { once: true, margin: "-80px" }); const [display, setDisplay] = useState("0");
  useEffect(() => { if (!isInView) return; const num = parseFloat(value); const dur = 2200; const start = performance.now(); const tick = (now) => { const p = Math.min((now - start) / dur, 1); const e = 1 - Math.pow(1 - p, 4); setDisplay(decimal ? (e * num).toFixed(1) : Math.floor(e * num).toLocaleString()); if (p < 1) requestAnimationFrame(tick); }; requestAnimationFrame(tick); }, [isInView, value, decimal]);
  return <span ref={ref}>{display}{suffix}</span>;
};

/* ══════════════════════════════════════════════════════════════════════
   5. SUB-COMPONENTS (ZERO OVERLAP GUARANTEED)
   ══════════════════════════════════════════════════════════════════════ */

const MobileMenu = ({ isOpen, onClose }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm md:hidden" onClick={onClose}>
        <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="absolute right-0 top-0 h-full w-80 bg-white shadow-2xl p-8 flex flex-col" onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-end mb-10"><button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition"><RiCloseLine className="text-2xl text-slate-600" /></button></div>
          <div className="flex flex-col gap-2">{NAV_LINKS.map((item, i) => (<motion.a key={item} href={`#${item.toLowerCase().replace(/\s+/g, "-")}`} onClick={onClose} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * i }} className="text-lg font-semibold text-slate-700 hover:text-violet-600 py-3 border-b border-slate-100 transition">{item}</motion.a>))}</div>
          <div className="mt-auto flex flex-col gap-3">
            <Link to="/auth" className="text-center font-semibold border border-slate-300 py-3 rounded-xl hover:bg-slate-50 transition">Sign In</Link>
            <Link to="/auth" className="text-center font-bold bg-violet-600 text-white py-3 rounded-xl shadow-lg shadow-violet-200 hover:bg-violet-500 transition">Get Started</Link>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => { const onScroll = () => setScrolled(window.scrollY > 20); window.addEventListener("scroll", onScroll); return () => window.removeEventListener("scroll", onScroll); }, []);
  return (
    <>
      <nav className={`sticky top-0 z-50 transition-all duration-500 ${scrolled ? "bg-white/90 backdrop-blur-2xl shadow-lg shadow-slate-200/50 border-b border-slate-200/50" : "bg-transparent border-b border-transparent"}`}>
        <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group"><Logo className="w-9 h-9 group-hover:scale-105 transition-transform" /><span className="font-bold text-[17px] tracking-tight font-display text-slate-900">InterviewIQ<span className="text-violet-600">.ai</span></span></Link>
          <div className="hidden lg:flex items-center gap-1 text-sm">{NAV_LINKS.map((item) => (<a key={item} href={`#${item.toLowerCase().replace(/\s+/g, "-")}`} className="px-4 py-2 text-slate-500 hover:text-violet-600 rounded-lg hover:bg-violet-50 transition-all font-medium">{item}</a>))}</div>
          <div className="hidden lg:flex items-center gap-2.5">
            <Link to="/auth" className="text-sm text-slate-600 hover:text-violet-600 transition px-4 py-2 rounded-xl hover:bg-slate-100 font-medium">Sign In</Link>
            <Link to="/auth" className="text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white transition shadow-lg shadow-violet-200/50 px-5 py-2 rounded-xl">Get Started</Link>
          </div>
          <button onClick={() => setMenuOpen(true)} className="lg:hidden p-2 hover:bg-slate-100 rounded-xl transition"><RiMenuLine className="text-2xl text-slate-700" /></button>
        </div>
      </nav>
      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
};

const HeroSection = () => {
  const ref = useRef(null);
  const mouse = useMouseSpotlight(ref);
  return (
    <section ref={ref} className="relative overflow-hidden pt-16 pb-32 px-6">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1920&q=80')" }} />
      <div className="absolute inset-0 bg-gradient-to-b from-white via-white/90 to-slate-50/95 backdrop-blur-[3px]" />
      <div className="absolute inset-0 dot-grid opacity-50" />
      <div className="absolute inset-0 pointer-events-none transition-all duration-300" style={{ background: `radial-gradient(800px circle at ${mouse.x}px ${mouse.y}px, rgba(124, 58, 237, 0.06), transparent 50%)` }} />
      <div className="absolute top-[10%] left-[15%] w-[600px] h-[600px] bg-violet-300/20 rounded-full blur-[150px] animate-float-slow" />
      <div className="absolute bottom-[5%] right-[10%] w-[500px] h-[500px] bg-cyan-200/20 rounded-full blur-[120px] animate-float-slower" />
      
      <div className="relative max-w-4xl mx-auto text-center z-10">
        <motion.div {...fadeUp(0)}>
          <div className="inline-flex items-center gap-2 text-xs font-bold bg-violet-50 text-violet-700 border border-violet-200/80 px-5 py-2.5 rounded-full mb-8 shadow-sm">
            <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500" /></span>
            Powered by Gemini AI • Trusted by 50K+ Users
          </div>
          <h1 className="text-[clamp(2.8rem,7vw,5.5rem)] font-extrabold leading-[1.05] mb-8 tracking-tight font-display text-slate-900">
            Ace Every <span className="relative inline-block"><span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600">Interview</span><span className="absolute -bottom-2 left-0 right-0 h-4 bg-gradient-to-r from-violet-300/50 to-cyan-300/50 blur-2xl rounded-full" /></span><br />with AI Confidence
          </h1>
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed">Upload your resume → AI generates personalized questions → Get real-time feedback → Land your dream job. Used by <span className="text-slate-900 font-bold">50,000+</span> developers.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/auth" className="group flex items-center gap-2.5 bg-violet-600 hover:bg-violet-500 text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-violet-300/40 transition-all duration-300 text-[15px] hover:-translate-y-0.5">Start for Free <RiArrowRightLine className="text-xl group-hover:translate-x-1 transition-transform" /></Link>
            <Link to="/auth" className="group flex items-center gap-2.5 border border-slate-300 hover:bg-white/60 hover:border-slate-400 text-slate-700 font-semibold px-8 py-4 rounded-2xl transition-all duration-300 text-[15px] backdrop-blur-sm shadow-sm"><RiPlayCircleLine className="text-xl text-violet-500" /> Watch Demo</Link>
          </div>
        </motion.div>
        
        <motion.div {...fadeUp(0.2)} className="mt-20 grid grid-cols-2 sm:grid-cols-4 max-w-2xl mx-auto gap-4">
          {STATS.map(s => (
            <div key={s.label} className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-2xl py-5 px-3 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:border-violet-300 transition-all duration-500 hover:-translate-y-0.5">
              <p className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600"><CountUp {...s} /></p>
              <p className="text-[11px] text-slate-400 mt-1.5 font-bold uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.div {...scaleIn} className="mt-24 px-4 relative z-10">
        <DashboardMockup />
      </motion.div>
    </section>
  );
};

const LogosSection = () => (
  <section className="relative py-20 overflow-hidden border-y border-slate-200/80 bg-white">
    <div className="relative text-center mb-12 px-6">
      <p className="uppercase tracking-[0.3em] text-violet-500 text-[11px] font-bold mb-3">Trusted by top companies</p>
      <h3 className="text-3xl md:text-4xl font-bold text-slate-900 font-display">Candidates Placed At</h3>
    </div>
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute left-0 top-0 h-full w-40 bg-gradient-to-r from-white to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-40 bg-gradient-to-l from-white to-transparent z-10" />
      <div className="flex animate-marquee gap-6 w-max">
        {[...COMPANIES, ...COMPANIES].map((c, i) => (
          <div key={i} className="group flex items-center gap-4 min-w-[220px] rounded-2xl border border-slate-100 bg-slate-50/50 px-6 py-5 transition-all duration-500 hover:-translate-y-1 hover:border-violet-200 hover:bg-white hover:shadow-xl hover:shadow-violet-100/50">
            <img src={c.logo} alt={c.name} className="w-9 h-9 object-contain opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 no-drag" />
            <span className="font-bold text-[16px] text-slate-300 group-hover:text-slate-900 transition-colors duration-500">{c.name}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const FeaturesSection = () => (
  <section id="features" className="section-padding px-6 max-w-6xl mx-auto bg-gradient-to-b from-white to-slate-50/50">
    <motion.div {...fadeUp(0)} className="text-center mb-20">
      <span className="inline-block text-[11px] font-bold uppercase tracking-[0.3em] text-violet-500 mb-4">Features</span>
      <h2 className="text-4xl md:text-5xl font-bold mb-6 font-display text-slate-900">Everything You Need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">Succeed</span></h2>
    </motion.div>
    <motion.div variants={staggerContainer} initial="initial" whileInView="whileInView" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {FEATURES.map(f => (
        <motion.div key={f.title} variants={staggerChild} className={`group relative bg-white border border-slate-100 rounded-2xl p-8 hover:border-violet-200 transition-all duration-500 hover:shadow-2xl ${f.glow} cursor-default hover:-translate-y-1`}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6 transition-all duration-500 group-hover:scale-110 shadow-sm"><div className={`${f.iconBg} w-full h-full rounded-2xl flex items-center justify-center`}><f.icon /></div></div>
          <h3 className="font-bold text-slate-900 mb-3 text-lg group-hover:text-violet-600 transition-colors">{f.title}</h3>
          <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
        </motion.div>
      ))}
    </motion.div>
  </section>
);

const InterviewTypesSection = () => (
  <section className="section-padding px-6 max-w-6xl mx-auto bg-slate-50 border-y border-slate-200/80">
    <motion.div {...fadeUp(0)} className="text-center mb-16">
      <span className="inline-block text-[11px] font-bold uppercase tracking-[0.3em] text-violet-500 mb-4">Versatility</span>
      <h2 className="text-4xl md:text-5xl font-bold mb-6 font-display text-slate-900">Master Any <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-cyan-600">Interview Type</span></h2>
    </motion.div>
    <motion.div variants={staggerContainer} initial="initial" whileInView="whileInView" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {INTERVIEW_TYPES.map((t) => (
        <motion.div key={t.title} variants={staggerChild} className="group relative bg-white rounded-2xl p-8 border border-slate-100 hover:border-transparent transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-br ${t.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${t.color} text-white flex items-center justify-center text-xl mb-5 shadow-lg transition-transform group-hover:scale-110`}><t.icon /></div>
          <h3 className="font-bold text-slate-900 mb-2 text-lg group-hover:text-violet-600 transition">{t.title}</h3>
          <p className="text-sm text-slate-500 leading-relaxed">{t.desc}</p>
        </motion.div>
      ))}
    </motion.div>
  </section>
);

const LiveDemoSection = () => {
  const [activeStep, setActiveStep] = useState(0);
  const { displayed: aiText, isDone } = useTypingEffect(CHAT_HISTORY[activeStep]?.text || "", 15, 800);
  const chatEndRef = useRef(null);
  
  useEffect(() => { if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: "smooth" }); }, [activeStep]);
  useEffect(() => {
    if (CHAT_HISTORY[activeStep]?.role === 'ai' && isDone) { const t = setTimeout(() => setActiveStep(p => Math.min(p + 1, CHAT_HISTORY.length - 1)), 2500); return () => clearTimeout(t); }
    if (CHAT_HISTORY[activeStep]?.role === 'user' && isDone) { const t = setTimeout(() => setActiveStep(p => Math.min(p + 1, CHAT_HISTORY.length - 1)), 1500); return () => clearTimeout(t); }
  }, [isDone, activeStep]);

  return (
    <section className="section-padding px-6 bg-white">
      <div className="max-w-3xl mx-auto">
        <motion.div {...fadeUp(0)} className="text-center mb-12">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.3em] text-violet-500 mb-4">Live Demo</span>
          <h2 className="text-4xl md:text-5xl font-bold font-display text-slate-900">See the AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">in Action</span></h2>
        </motion.div>
        <motion.div {...scaleIn} className="bg-slate-50 border border-slate-200 rounded-3xl shadow-2xl shadow-slate-200/50 overflow-hidden">
          <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-violet-200"><RiCpuLine className="text-xl" /></div>
              <div><p className="font-bold text-sm text-slate-800">System Design AI</p><p className="text-[10px] text-emerald-500 font-bold flex items-center gap-1"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block animate-pulse"/> Active • SDE-2 Amazon</p></div>
            </div>
            <RiUser3Line className="text-xl text-slate-300" />
          </div>
          <div className="p-6 h-96 overflow-y-auto scrollbar-hide space-y-5 bg-slate-50/50">
            {CHAT_HISTORY.slice(0, activeStep + 1).map((msg, i) => (
              <motion.div key={i} initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{duration:0.3}} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center text-white text-xs font-bold shadow-md ${msg.role === 'ai' ? 'bg-gradient-to-br from-violet-500 to-indigo-600 shadow-violet-200' : 'bg-slate-700 shadow-slate-300'}`}>{msg.role === 'ai' ? 'AI' : 'A'}</div>
                <div className={`max-w-[80%] px-5 py-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'ai' ? 'bg-white border border-slate-200 text-slate-700 rounded-tl-none' : 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-tr-none'}`}>
                  {i === activeStep ? aiText : msg.text}
                  {i === activeStep && !isDone && <span className="inline-block w-0.5 h-4 bg-current ml-0.5 animate-pulse" />}
                </div>
              </motion.div>
            ))}
            <div ref={chatEndRef} />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const WhyChooseUsSection = () => (
  <section className="section-padding px-6 bg-slate-900 text-white overflow-hidden relative">
    <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
    <motion.div {...fadeUp(0)} className="text-center mb-16 max-w-3xl mx-auto relative z-10">
      <span className="inline-block text-[11px] font-bold uppercase tracking-[0.3em] text-violet-400 mb-4">Comparison</span>
      <h2 className="text-4xl md:text-5xl font-bold mb-6 font-display">Why InterviewIQ <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">Wins</span></h2>
    </motion.div>
    <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6 relative z-10">
      {WHY_US.map((col, colIdx) => (
        <motion.div key={col.title} {...fadeUp(colIdx * 0.1)} className={`rounded-2xl p-8 flex flex-col min-h-[400px] ${col.highlight ? 'bg-gradient-to-b from-violet-600 to-indigo-700 text-white shadow-2xl shadow-violet-900/50 border border-violet-500/30' : 'bg-slate-800/50 border border-slate-700/50 text-slate-300'}`}>
          <h3 className="text-xl font-bold mb-8 font-display">{col.title}</h3>
          <ul className="space-y-5 flex-1">
            {col.features.map((f, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <RiCheckLine className={`text-lg flex-shrink-0 mt-0.5 ${col.highlight ? 'text-white/80' : 'text-slate-600'}`} /> {f}
              </li>
            ))}
          </ul>
          {col.highlight && <Link to="/auth" className="mt-8 block text-center bg-white text-violet-700 font-bold py-3.5 rounded-xl shadow-lg hover:bg-slate-100 transition">Start Free Trial</Link>}
        </motion.div>
      ))}
    </div>
  </section>
);

const HowItWorksSection = () => (
  <section id="how-it-works" className="section-padding px-6 bg-white">
    <div className="max-w-5xl mx-auto">
      <motion.div {...fadeUp(0)} className="text-center mb-24">
        <span className="inline-block text-[11px] font-bold uppercase tracking-[0.3em] text-violet-500 mb-4">How It Works</span>
        <h2 className="text-4xl md:text-5xl font-bold font-display text-slate-900">Four Steps to <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">Your Offer</span></h2>
      </motion.div>
      <motion.div variants={staggerContainer} initial="initial" whileInView="whileInView" className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
        {[
          { step: "01", title: "Upload Resume", desc: "PDF or DOCX — AI extracts skills, projects & experience automatically", icon: RiUploadCloud2Line },
          { step: "02", title: "Choose Interview", desc: "Select role type, difficulty level & target company for customization", icon: RiFocus3Line },
          { step: "03", title: "AI Generates Q&A", desc: "Gemini creates 10+ personalized questions based on YOUR resume", icon: RiRobot2Line },
          { step: "04", title: "Get Your Report", desc: "Detailed scores, feedback, strengths & a step-by-step improvement plan", icon: RiLineChartLine },
        ].map(s => (
          <motion.div key={s.step} variants={staggerChild} className="relative text-center group">
            <div className="relative mx-auto mb-8 w-28 h-28 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-[2rem] rotate-6 group-hover:rotate-12 transition-transform duration-500 opacity-20 blur-md" />
              <div className="relative w-full h-full bg-gradient-to-br from-violet-500 to-indigo-600 rounded-[2rem] flex flex-col items-center justify-center shadow-xl shadow-violet-200 group-hover:shadow-2xl transition-all border border-violet-400/20">
                <s.icon className="text-3xl text-white mb-1" /><span className="text-xs font-extrabold text-white/80">{s.step}</span>
              </div>
            </div>
            <h3 className="font-bold text-slate-900 mb-3 text-lg">{s.title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed max-w-[240px] mx-auto">{s.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

const PricingSection = () => {
  const [isYearly, setIsYearly] = useState(false);
  return (
    <section id="pricing" className="section-padding px-6 bg-gradient-to-b from-slate-50 to-white border-y border-slate-200/80">
      <div className="max-w-5xl mx-auto">
        <motion.div {...fadeUp(0)} className="text-center mb-14">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.3em] text-violet-500 mb-4">Pricing</span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 font-display text-slate-900">Simple, Transparent <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">Pricing</span></h2>
          <div className="flex items-center justify-center gap-5 mt-8 bg-white inline-flex px-6 py-3 rounded-full border border-slate-200 shadow-sm">
            <span className={`text-sm font-bold transition ${!isYearly ? 'text-slate-900' : 'text-slate-400'}`}>Monthly</span>
            <button onClick={() => setIsYearly(!isYearly)} className={`relative w-16 h-8 rounded-full transition-colors duration-300 ${isYearly ? 'bg-violet-600' : 'bg-slate-300'}`}>
              <motion.div animate={{ x: isYearly ? 32 : 2 }} transition={{ type: "spring", stiffness: 500, damping: 30 }} className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md" />
            </button>
            <span className={`text-sm font-bold transition ${isYearly ? 'text-slate-900' : 'text-slate-400'}`}>Yearly <span className="text-emerald-500 font-extrabold text-xs ml-1">SAVE 30%</span></span>
          </div>
        </motion.div>
        
        <motion.div variants={staggerContainer} initial="initial" whileInView="whileInView" className="grid md:grid-cols-3 gap-8 items-stretch">
          {PRICING_TIERS.map(tier => (
            <motion.div key={tier.name} variants={staggerChild} className={`relative bg-white rounded-3xl p-8 flex flex-col transition-all duration-500 ${tier.popular ? 'border-2 border-violet-500 shadow-2xl shadow-violet-200/50 z-10' : 'border border-slate-200 hover:shadow-xl hover:border-slate-300'}`}>
              {tier.popular && <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold px-6 py-1.5 rounded-full shadow-lg shadow-violet-300/50">Most Popular</div>}
              <h3 className="text-2xl font-bold text-slate-900 mb-2 font-display">{tier.name}</h3>
              <p className="text-sm text-slate-500 mb-8">{tier.desc}</p>
              <div className="mb-10">
                <span className="text-6xl font-extrabold text-slate-900">${isYearly ? tier.yearlyPrice : tier.monthlyPrice}</span>
                <span className="text-slate-400 text-sm font-medium">/mo</span>
              </div>
              <ul className="space-y-4 mb-10 flex-1">
                {tier.features.map(f => (
                  <li key={f} className="flex items-start gap-3 text-sm text-slate-600">
                    <RiCheckLine className="text-violet-500 text-xl flex-shrink-0 mt-0.5" /> {f}
                  </li>
                ))}
              </ul>
              <Link to="/auth" className={`block text-center font-bold py-4 rounded-2xl transition-all duration-300 text-[15px] ${tier.popular ? 'bg-violet-600 text-white shadow-xl shadow-violet-200/50 hover:bg-violet-500 hover:-translate-y-0.5' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                {tier.cta}
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const TestimonialsSection = () => {
  const [current, setCurrent] = useState(0);
  const next = useCallback(() => setCurrent(p => (p + 1) % TESTIMONIALS.length), []);
  const prev = useCallback(() => setCurrent(p => (p - 1 + TESTIMONIALS.length) % TESTIMONIALS.length), []);
  useEffect(() => { const t = setInterval(next, 6000); return () => clearInterval(t); }, [next]);

  return (
    <section id="testimonials" className="section-padding px-6 max-w-4xl mx-auto bg-slate-50 border-y border-slate-200/80">
      <motion.div {...fadeUp(0)} className="text-center mb-16">
        <span className="inline-block text-[11px] font-bold uppercase tracking-[0.3em] text-violet-500 mb-4">Testimonials</span>
        <h2 className="text-4xl md:text-5xl font-bold font-display text-slate-900">Loved by <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">Developers</span></h2>
      </motion.div>
      
      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div key={current} initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }} transition={{ duration: 0.5, ease: "easeInOut" }} className="bg-white border border-slate-200 rounded-3xl p-10 md:p-14 text-center shadow-xl">
            <RiDoubleQuotesL className="text-violet-100 text-5xl mx-auto mb-6" />
            <div className="flex justify-center gap-1 mb-6">{Array.from({ length: TESTIMONIALS[current].rating }).map((_, i) => <RiStarFill key={i} className="text-amber-400 text-xl" />)}</div>
            <p className="text-xl text-slate-700 leading-relaxed mb-10 font-medium max-w-2xl mx-auto">"{TESTIMONIALS[current].text}"</p>
            <div className="flex items-center justify-center gap-4 pt-8 border-t border-slate-100">
              <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${TESTIMONIALS[current].color} flex items-center justify-center text-white font-bold text-xl shadow-lg`}>{TESTIMONIALS[current].avatar}</div>
              <div className="text-left"><p className="font-bold text-slate-900 text-lg">{TESTIMONIALS[current].name}</p><p className="text-sm text-violet-500">{TESTIMONIALS[current].role}</p></div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      
      <div className="flex items-center justify-center gap-6 mt-10">
        <button onClick={prev} className="p-4 border border-slate-200 rounded-full hover:bg-white hover:border-slate-300 transition shadow-sm hover:shadow-md bg-white/50"><RiArrowLeftLine className="text-xl text-slate-600" /></button>
        <div className="flex gap-2.5">{TESTIMONIALS.map((_, i) => <button key={i} onClick={() => setCurrent(i)} className={`h-2.5 rounded-full transition-all duration-500 ${i === current ? 'bg-violet-600 w-8' : 'bg-slate-300 w-2.5 hover:bg-slate-400'}`} />)}</div>
        <button onClick={next} className="p-4 border border-slate-200 rounded-full hover:bg-white hover:border-slate-300 transition shadow-sm hover:shadow-md bg-white/50"><RiArrowRightLine className="text-xl text-slate-600" /></button>
      </div>
    </section>
  );
};

const FAQSection = () => {
  const [open, setOpen] = useState(null);
  return (
    <section id="faq" className="section-padding px-6 bg-white">
      <div className="max-w-3xl mx-auto">
        <motion.div {...fadeUp(0)} className="text-center mb-16">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.3em] text-violet-500 mb-4">FAQ</span>
          <h2 className="text-4xl md:text-5xl font-bold font-display text-slate-900">Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">Questions</span></h2>
        </motion.div>
        <motion.div variants={staggerContainer} initial="initial" whileInView="whileInView" className="space-y-4">
          {FAQS.map((faq, i) => (
            <motion.div key={i} variants={staggerChild} className="bg-slate-50 border border-slate-200/80 rounded-2xl overflow-hidden hover:border-violet-200 transition-colors duration-300">
              <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between p-6 text-left group">
                <span className="font-bold text-slate-800 pr-4 group-hover:text-violet-700 transition">{faq.q}</span>
                <motion.div animate={{ rotate: open === i ? 180 : 0 }} transition={{ duration: 0.3 }} className="bg-white rounded-full p-1 shadow-sm border border-slate-200 flex-shrink-0"><RiArrowDownSLine className="text-lg text-violet-500" /></motion.div>
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                    <div className="px-6 pb-6 text-sm text-slate-500 leading-relaxed border-t border-slate-200/80 pt-5">{faq.a}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const BlogSection = () => (
  <section className="section-padding px-6 max-w-6xl mx-auto bg-slate-50 border-y border-slate-200/80">
    <motion.div {...fadeUp(0)} className="text-center mb-16">
      <span className="inline-block text-[11px] font-bold uppercase tracking-[0.3em] text-violet-500 mb-4">Resources</span>
      <h2 className="text-4xl md:text-5xl font-bold font-display text-slate-900">Latest from the <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">Blog</span></h2>
    </motion.div>
    <motion.div variants={staggerContainer} initial="initial" whileInView="whileInView" className="grid md:grid-cols-3 gap-8">
      {BLOGS.map((blog) => (
        <motion.div key={blog.title} variants={staggerChild} className="group bg-white border border-slate-200/80 rounded-2xl overflow-hidden hover:shadow-2xl hover:border-slate-300 transition-all duration-500 cursor-pointer hover:-translate-y-1">
          <div className="h-56 overflow-hidden relative">
            <img src={blog.img} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
          </div>
          <div className="p-7">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-violet-600 bg-violet-50 px-3 py-1 rounded-full border border-violet-100">{blog.tag}</span>
              <span className="text-xs text-slate-400 font-medium">{blog.date}</span>
            </div>
            <h3 className="font-bold text-slate-900 group-hover:text-violet-600 transition-colors leading-snug text-lg">{blog.title}</h3>
          </div>
        </motion.div>
      ))}
    </motion.div>
  </section>
);

const NewsletterSection = () => (
  <section className="py-24 px-6 bg-white relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-r from-violet-50 via-transparent to-indigo-50" />
    <div className="max-w-2xl mx-auto text-center relative z-10">
      <motion.div {...fadeUp(0)}>
        <div className="inline-flex items-center justify-center w-16 h-16 bg-violet-100 rounded-2xl mb-6 border border-violet-200 text-violet-600"><RiMailLine className="text-3xl" /></div>
        <h2 className="text-3xl md:text-4xl font-bold mb-4 font-display text-slate-900">Stay in the Loop</h2>
        <p className="text-slate-500 mb-8 leading-relaxed">Get weekly interview tips, AI updates, and exclusive offers directly in your inbox.</p>
        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input type="email" placeholder="Enter your email" className="flex-1 px-5 py-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white shadow-sm text-sm" />
          <button className="bg-violet-600 hover:bg-violet-500 text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-violet-200/50 transition-all hover:-translate-y-0.5 text-sm whitespace-nowrap">Subscribe Free</button>
        </div>
      </motion.div>
    </div>
  </section>
);

const CTASection = () => (
  <section className="section-padding px-6 bg-slate-50">
    <div className="max-w-3xl mx-auto relative">
      <div className="absolute inset-0 -m-24 bg-violet-200/30 rounded-full blur-[100px] pointer-events-none" />
      <motion.div {...fadeUp(0)} className="relative text-center">
        {/* ADDED overflow-hidden HERE to prevent spinning gradient overlap */}
        <div className="gradient-border overflow-hidden">
          <div className="bg-white rounded-3xl px-8 py-20 md:px-20 md:py-24 shadow-2xl relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-violet-50 rounded-2xl mb-8 border border-violet-100 text-violet-500"><RiSparklingLine className="text-3xl" /></div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight font-display text-slate-900">Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">Land Your Dream Job?</span></h2>
            <p className="text-slate-500 mb-12 leading-relaxed max-w-lg mx-auto text-lg">Join 50,000+ developers who prepare smarter, interview with confidence, and get hired faster.</p>
            <Link to="/auth" className="group inline-flex items-center gap-3 bg-violet-600 hover:bg-violet-500 text-white font-bold px-12 py-5 rounded-2xl shadow-2xl shadow-violet-300/40 hover:shadow-violet-400/50 transition-all duration-300 text-lg hover:-translate-y-1">Start Free — No Credit Card <RiArrowRightLine className="text-2xl group-hover:translate-x-1 transition-transform" /></Link>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mt-10 text-sm text-slate-400 font-medium">
              {["✅ Free forever plan", "✅ No credit card required", "✅ Instant access"].map(t => <span key={t}>{t}</span>)}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-slate-950 text-white pt-24 pb-12 px-6 border-t border-slate-800">
    <div className="max-w-6xl mx-auto">
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-16 mb-20">
        <div className="lg:col-span-2">
          <Link to="/" className="flex items-center gap-3 mb-8"><Logo className="w-10 h-10 brightness-125" /><span className="font-bold text-xl font-display">InterviewIQ<span className="text-violet-400">.ai</span></span></Link>
          <p className="text-sm text-slate-400 leading-relaxed max-w-sm mb-8">AI-powered interview preparation platform. Practice smarter, not harder. Land your dream tech job with personalized AI coaching.</p>
          <div className="flex gap-3">
            {[RiTwitterXFill, RiGithubFill, RiLinkedinBoxFill].map((Icon, i) => (
              <a key={i} href="#" className="w-11 h-11 bg-slate-800/80 hover:bg-violet-600 rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-all duration-300 border border-slate-700/50 hover:border-violet-500"><Icon className="text-lg" /></a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-8">Product</h4>
          <ul className="space-y-4">{["Mock Interviews", "ATS Analyzer", "AI Chatbot", "Reports", "Integrations"].map(item => <li key={item}><Link to="/auth" className="text-sm text-slate-400 hover:text-white transition">{item}</Link></li>)}</ul>
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-8">Company</h4>
          <ul className="space-y-4">{["About Us", "Blog", "Careers", "Contact Us", "Press Kit"].map(item => <li key={item}><Link to="/auth" className="text-sm text-slate-400 hover:text-white transition">{item}</Link></li>)}</ul>
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-8">Contact</h4>
          <ul className="space-y-4 text-sm text-slate-400">
            <li className="flex items-center gap-3"><RiMailLine className="text-violet-400" /> hello@interviewiq.ai</li>
            <li className="flex items-center gap-3"><RiPhoneLine className="text-violet-400" /> +1 (555) 123-4567</li>
            <li className="flex items-center gap-3"><RiMapPin2Line className="text-violet-400" /> San Francisco, CA</li>
          </ul>
        </div>
      </div>
      <div className="pt-10 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="text-slate-500 text-xs">© {new Date().getFullYear()} InterviewIQ AI. All rights reserved.</p>
        <div className="flex items-center gap-8 text-xs text-slate-500 font-medium">
          <Link to="/auth" className="hover:text-white transition">Privacy Policy</Link>
          <Link to="/auth" className="hover:text-white transition">Terms of Service</Link>
        </div>
      </div>
    </div>
  </footer>
);

const BackToTop = () => {
  const [show, setShow] = useState(false);
  useEffect(() => { const onScroll = () => setShow(window.scrollY > 800); window.addEventListener("scroll", onScroll); return () => window.removeEventListener("scroll", onScroll); }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="fixed bottom-8 right-8 z-50 w-14 h-14 bg-violet-600 hover:bg-violet-500 text-white rounded-2xl shadow-2xl shadow-violet-300/40 flex items-center justify-center transition-colors hover:-translate-y-1">
          <RiArrowUpLine className="text-2xl" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

/* ══════════════════════════════════════════════════════════════════════
   6. MAIN HOME EXPORT
   ══════════════════════════════════════════════════════════════════════ */

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <LogosSection />
      <FeaturesSection />
      <InterviewTypesSection />
      <LiveDemoSection />
      <WhyChooseUsSection />
      <HowItWorksSection />
      <PricingSection />
      <TestimonialsSection />
      <FAQSection />
      <BlogSection />
      <NewsletterSection />
      <CTASection />
      <Footer />
      <BackToTop />
    </div>
  );
};

export default Home;