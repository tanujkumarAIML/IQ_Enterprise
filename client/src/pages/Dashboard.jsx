import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  PieChart, Pie, Cell, BarChart, Bar,
} from "recharts";
import {
  RiVideoLine, RiFileTextLine,RiTimeLine,
  RiArrowRightLine, RiAddLine, RiCheckboxCircleLine,
  RiSparklingLine, RiRobot2Line, RiBrainLine,
} from "react-icons/ri";
import toast from "react-hot-toast";

import DashboardLayout from "../components/Layout/DashboardLayout";
import StatCard        from "../components/Dashboard/StatCard";
import { Card, Loader, Badge } from "../components/common/index.jsx";
import { useAuth }    from "../context/AuthContext";
import api            from "../services/api";

const COLORS = ["#7c3aed","#4f46e5","#0ea5e9","#16a34a","#d97706","#dc2626"];
const scoreColor = (s) => s >= 80 ? "#16a34a" : s >= 60 ? "#d97706" : "#dc2626";
const scoreBadge = (s) => s >= 80 ? "green" : s >= 60 ? "yellow" : "red";
const fmtDate    = (d) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short" });

const Dashboard = () => {
  const { user }  = useAuth();
  const [dash, setDash]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/dashboard")
      .then(({ data }) => setDash(data.dashboard))
      .catch(() => toast.error("Failed to load dashboard"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <DashboardLayout title="Dashboard"><Loader text="Loading your dashboard…" /></DashboardLayout>;

  const stats   = dash?.stats || {};
  const trend   = dash?.scoreTrend || [];
  const types   = (dash?.typeBreakdown || []).map((t) => ({ name: t._id, value: t.count }));
  const recent  = dash?.latestInterviews || [];
  const resume  = dash?.latestResume;

  const radarData = [
    { subject: "Technical",    A: stats.avgScore ? Math.min(100, stats.avgScore + 2) : 0 },
    { subject: "Communication",A: stats.avgScore ? Math.min(100, stats.avgScore + 5) : 0 },
    { subject: "Confidence",   A: stats.avgScore ? Math.max(0,   stats.avgScore - 3) : 0 },
    { subject: "HR",           A: stats.avgScore ? Math.min(100, stats.avgScore + 8) : 0 },
    { subject: "Grammar",      A: stats.avgScore ? Math.min(100, stats.avgScore + 6) : 0 },
    { subject: "Resume",       A: resume?.atsScore || 0 },
  ];

  return (
    <DashboardLayout title="Dashboard">
      {/* Welcome */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
            Welcome back, {user?.name?.split(" ")[0]} 👋
          </h2>
          <p className="text-slate-400 dark:text-slate-300 text-sm mt-1">
            {stats.totalInterviews === 0
              ? "Start your first AI-powered mock interview today!"
              : `${stats.completedInterviews} interviews completed · Avg score: ${stats.avgScore}%`}
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/chatbot"
            className="flex items-center gap-1.5 text-sm font-semibold border border-violet-200 dark:border-slate-700 text-violet-700 dark:text-violet-300 px-3 py-2 rounded-xl hover:bg-violet-50 dark:hover:bg-slate-800 transition">
            <RiRobot2Line /> AI Chat
          </Link>
          <Link to="/interview"
            className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-md shadow-violet-200 hover:shadow-lg transition">
            <RiAddLine /> New Interview
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard title="Total Interviews"   value={stats.totalInterviews || 0}     icon={<RiVideoLine />}           color="violet" />
        <StatCard title="Completed"          value={stats.completedInterviews || 0} icon={<RiCheckboxCircleLine />}  color="green"  />
        <StatCard title="Average Score"      value={`${stats.avgScore || 0}%`}      icon={<RiTrophyLine />}          color="blue"   />
        <StatCard title="Best Score"         value={`${stats.bestScore || 0}%`}     icon={<RiTimeLine />}            color="orange" />
      </div>

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-3 gap-4 mb-5">
        {/* Score Trend Line Chart */}
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-700 dark:text-white">Score Trend</h3>
            <span className="text-xs text-slate-400 dark:text-slate-500">Last {trend.length} interviews</span>
          </div>
          {trend.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-slate-400 dark:text-slate-500">
              <RiVideoLine className="text-4xl mb-2 text-slate-300" />
              <p className="text-sm">Complete interviews to see your trend</p>
              <Link to="/interview" className="mt-3 text-xs text-violet-600 hover:underline font-semibold">Start Interview →</Link>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={trend}>
                <XAxis
                dataKey="createdAt"
                tickFormatter={fmtDate}
                tick={{
                  fontSize: 10,
                  fill: "#94a3b8",
                  }}
                  />

<YAxis
  domain={[0,100]}
  tick={{
    fontSize: 10,
    fill: "#94a3b8",
  }}
/>
                <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Tooltip
                  formatter={(v) => [`${v}%`, "Score"]}
                  labelFormatter={fmtDate}
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "1px solid #334155",
                    borderRadius: 12,
                    color: "#fff",
                  }}

labelStyle={{
  color: "#cbd5e1",
}}

itemStyle={{
  color: "#ffffff",
}}
                />
                <Line
                  type="monotone" dataKey="overallScore" stroke="#7c3aed"
                  strokeWidth={2.5} dot={{ fill: "#7c3aed", r: 4 }}
                  activeDot={{ r: 6, fill: "#4f46e5" }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Card>

        {/* Interview Types Pie */}
        <Card className="p-5">
          <h3 className="font-semibold text-slate-700 dark:text-white mb-4">Interview Types</h3>
          {types.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-slate-400 dark:text-slate-500 text-sm">No data yet</div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie data={types} cx="50%" cy="50%" innerRadius={38} outerRadius={60} dataKey="value" paddingAngle={3}>
                    {types.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v, n) => [v, n]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-1.5 justify-center mt-2">
                {types.map((t, i) => (
                  <span key={t.name} className="text-xs flex items-center gap-1 text-slate-600">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                    {t.name} <span className="text-slate-400 dark:text-slate-500">({t.value})</span>
                  </span>
                ))}
              </div>
            </>
          )}
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid lg:grid-cols-3 gap-4 mb-5">
        {/* Skill Radar */}
        <Card className="p-5">
          <h3 className="font-semibold text-slate-700 dark:text-white mb-2">Skill Radar</h3>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData} margin={{ top: 5, right: 20, bottom: 5, left: 20 }}>
              <PolarGrid stroke="#475569" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: "#64748b" }} />
              <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
              <Radar dataKey="A" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.2} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </Card>

        {/* Recent Interviews Table */}
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-700 dark:text-white">Recent Interviews</h3>
            <Link to="/history" className="text-xs text-violet-600 hover:underline flex items-center gap-1 font-semibold">
              View all <RiArrowRightLine />
            </Link>
          </div>
          {recent.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <RiVideoLine className="text-5xl text-slate-300 mb-3" />
              <p className="text-slate-400 dark:text-slate-500 text-sm mb-4">No interviews yet</p>
              <Link to="/interview"
                className="flex items-center gap-2 text-sm font-semibold bg-violet-600 text-white px-4 py-2.5 rounded-xl hover:bg-violet-700 transition">
                <RiAddLine /> Start First Interview
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {recent.map((iv) => (
                <div key={iv._id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl hover:bg-violet-50 dark:hover:bg-slate-700 transition group">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-slate-700 dark:text-white truncate">{iv.jobRole}</p>
                      {iv.company && <span className="text-xs text-slate-400 dark:text-slate-400 hidden sm:block">{iv.company}</span>}
                    </div>
                    <p className="text-xs text-slate-400 dark:text-slate-400 mt-0.5">{iv.interviewType} · {fmtDate(iv.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-2 shrink-0">
                    {iv.status === "Completed" && (
                      <span className="text-sm font-bold" style={{ color: scoreColor(iv.overallScore) }}>
                        {iv.overallScore}%
                      </span>
                    )}
                    <Badge color={iv.status === "Completed" ? "green" : "violet"}>{iv.status}</Badge>
                    {iv.status === "Completed" && (
                      <Link to={`/report/${iv._id}`} className="text-xs text-violet-600 hover:underline font-semibold opacity-0 group-hover:opacity-100 transition">
                        Report
                      </Link>
                    )}
                    {iv.status === "In Progress" && (
                      <Link to={`/interview/${iv._id}`} className="text-xs text-indigo-600 hover:underline font-semibold">
                        Resume →
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Quick Actions Row */}
      <div className="grid sm:grid-cols-3 gap-4">
        {/* Resume CTA */}
        {!resume ? (
          <Card className="p-5 bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 border-violet-100 dark:border-slate-700 sm:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-white mb-1">📄 Analyze Your Resume</h3>
                <p className="text-sm text-slate-500 dark:text-slate-300">Upload resume → Get ATS score, skill gaps, AI suggestions & personalized interview questions</p>
              </div>
              <Link to="/resume"
                className="flex items-center gap-2 bg-violet-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-violet-700 transition shrink-0 ml-4">
                <RiFileTextLine /> Upload
              </Link>
            </div>
          </Card>
        ) : (
          <Card className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-green-800/20 border-green-100 dark:border-green-800 sm:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-white mb-1 flex items-center gap-2">
                  ✅ Resume Analyzed
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-300">
                  ATS Score: <span className="font-bold text-green-700">{resume.atsScore}%</span>
                  {resume.extractedSkills?.length > 0 && ` · ${resume.extractedSkills.length} skills detected`}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{resume.fileName}</p>
              </div>
              <Link to="/resume"
                className="flex items-center gap-2 bg-green-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-green-700 transition shrink-0 ml-4">
                View Analysis
              </Link>
            </div>
          </Card>
        )}

        {/* AI Chatbot CTA */}
        <Card className="p-5 bg-gradient-to-br from-slate-800 to-black border-slate-700 text-white">
          <RiBrainLine className="text-3xl text-violet-400 mb-2" />
          <h3 className="font-semibold mb-1">AI Career Assistant</h3>
          <p className="text-xs text-slate-300 dark:text-slate-400 mb-3">Get personalized career advice, resume tips & interview coaching 24/7</p>
          <Link to="/chatbot"
            className="text-xs font-semibold bg-violet-600 hover:bg-violet-500 px-3 py-2 rounded-lg transition inline-flex items-center gap-1">
            <RiRobot2Line /> Chat Now
          </Link>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
