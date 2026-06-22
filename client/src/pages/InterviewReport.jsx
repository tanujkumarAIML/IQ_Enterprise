import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import {
  RiDownloadLine, RiArrowLeftLine, RiCheckLine,
  RiCloseLine, RiLightbulbLine, RiVideoLine,
  RiSparklingLine, RiShareLine,
} from "react-icons/ri";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import toast from "react-hot-toast";

import DashboardLayout from "../components/Layout/DashboardLayout";
import ScoreCircle     from "../components/common/ScoreCircle";
import { Card, Loader, Badge } from "../components/common/index.jsx";
import api from "../services/api";

const scoreColor = (s) => s >= 80 ? "#16a34a" : s >= 60 ? "#d97706" : "#dc2626";
const scoreLabel = (s) => s >= 85 ? "Excellent" : s >= 70 ? "Good" : s >= 55 ? "Average" : "Needs Work";
const fmtDur     = (s) => { const m = Math.floor(s/60); const sec = s%60; return `${m}m ${sec}s`; };

const InterviewReport = () => {
  const { id }          = useParams();
  const [report, setReport]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const reportRef = useRef(null);

  useEffect(() => {
    api.get(`/reports/${id}`)
      .then(({ data }) => setReport(data.report))
      .catch(() => toast.error("Report not found"))
      .finally(() => setLoading(false));
  }, [id]);

  const exportPDF = async () => {
    setExporting(true);
    try {
      const el      = reportRef.current;
      const canvas  = await html2canvas(el, { scale: 1.5, useCORS: true, logging: false });
      const img     = canvas.toDataURL("image/png");
      const pdf     = new jsPDF("p", "mm", "a4");
      const pw      = pdf.internal.pageSize.getWidth();
      const ph      = pdf.internal.pageSize.getHeight();
      const ratio   = canvas.height / canvas.width;
      const imgH    = pw * ratio;

      let pos = 0;
      while (pos < imgH) {
        pdf.addImage(img, "PNG", 0, -pos, pw, imgH);
        pos += ph;
        if (pos < imgH) pdf.addPage();
      }

      pdf.save(`InterviewIQ_Report_${report.jobRole?.replace(/\s+/g, "_")}_${new Date().toISOString().slice(0, 10)}.pdf`);
      toast.success("PDF downloaded!");
    } catch {
      toast.error("PDF export failed. Please try again.");
    } finally { setExporting(false); }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Report link copied!");
  };

  if (loading) return <DashboardLayout title="Interview Report"><Loader text="Loading report…" /></DashboardLayout>;
  if (!report)  return (
    <DashboardLayout title="Interview Report">
      <div className="max-w-2xl mx-auto text-center py-20">
        <RiVideoLine className="text-6xl text-slate-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-700 mb-2">Report Not Found</h2>
        <p className="text-slate-400 mb-6">This interview may not be completed yet.</p>
        <Link to="/history" className="bg-violet-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-violet-700 transition">
          View History
        </Link>
      </div>
    </DashboardLayout>
  );

  const overall = report.overallScore || 0;

  const radarData = [
    { subject: "Technical",     A: report.technicalScore     || 0 },
    { subject: "Communication", A: report.communicationScore || 0 },
    { subject: "Confidence",    A: report.confidenceScore    || 0 },
    { subject: "HR",            A: report.hrScore            || 0 },
    { subject: "Grammar",       A: report.grammarScore       || 0 },
  ];

  const barData = (report.answers || []).map((a, i) => ({
    name: `Q${i + 1}`, score: a.score || 0,
  }));

  const recColor = (r) => r === "Strong Hire" ? "bg-green-100 text-green-700" : r === "Hire" ? "bg-blue-100 text-blue-700" : r === "Maybe" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700";

  return (
    <DashboardLayout title="Interview Report">
      <div className="max-w-4xl mx-auto">
        {/* Actions */}
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <Link to="/history" className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-violet-600 transition font-medium">
            <RiArrowLeftLine /> Back to History
          </Link>
          <div className="flex items-center gap-2">
            <button onClick={copyLink}
              className="flex items-center gap-1.5 text-sm border border-slate-200 text-slate-600 px-3 py-2 rounded-xl hover:bg-slate-50 transition">
              <RiShareLine /> Share
            </button>
            <Link to="/interview"
              className="flex items-center gap-1.5 text-sm border border-violet-200 text-violet-700 px-3 py-2 rounded-xl hover:bg-violet-50 transition">
              <RiVideoLine /> New Interview
            </Link>
            <button onClick={exportPDF} disabled={exporting}
              className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition disabled:opacity-60">
              {exporting ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <RiDownloadLine />}
              Export PDF
            </button>
          </div>
        </div>

        {/* Report Content (captured for PDF) */}
        <div ref={reportRef} className="space-y-5">
          {/* Header Banner */}
          <Card className="p-6 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <p className="text-violet-200 text-xs font-bold uppercase tracking-widest mb-1">InterviewIQ AI Report</p>
                <h2 className="text-2xl font-bold">{report.jobRole}</h2>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="text-xs bg-white/20 px-2.5 py-0.5 rounded-full font-semibold">{report.interviewType}</span>
                  <span className="text-xs bg-white/20 px-2.5 py-0.5 rounded-full font-semibold">{report.difficulty}</span>
                  {report.company && <span className="text-xs bg-white/20 px-2.5 py-0.5 rounded-full font-semibold">{report.company}</span>}
                  <span className="text-xs text-violet-200">{new Date(report.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
                  {report.duration > 0 && <span className="text-xs text-violet-200">⏱ {fmtDur(report.duration)}</span>}
                </div>
              </div>
              <div className="text-right">
                <div className="text-5xl font-extrabold">{overall}%</div>
                <p className="text-violet-200 text-sm mt-1">{scoreLabel(overall)}</p>
                {report.recommendation && (
                  <span className={`text-xs font-bold px-3 py-1 rounded-full mt-2 inline-block ${recColor(report.recommendation)}`}>
                    {report.recommendation}
                  </span>
                )}
              </div>
            </div>
          </Card>

          {/* Score Circles */}
          <Card className="p-6">
            <h3 className="font-semibold text-slate-700 mb-6">Score Breakdown</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              <ScoreCircle score={report.overallScore       || 0} label="Overall"       size="lg" />
              <ScoreCircle score={report.technicalScore     || 0} label="Technical"     />
              <ScoreCircle score={report.communicationScore || 0} label="Communication" />
              <ScoreCircle score={report.confidenceScore    || 0} label="Confidence"    />
              <ScoreCircle score={report.hrScore            || 0} label="HR"            />
              <ScoreCircle score={report.grammarScore       || 0} label="Grammar"       />
            </div>
          </Card>

          {/* Charts */}
          <div className="grid md:grid-cols-2 gap-5">
            <Card className="p-5">
              <h3 className="font-semibold text-slate-700 mb-4">Skill Radar</h3>
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "#64748b" }} />
                  <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar dataKey="A" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.2} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-5">
              <h3 className="font-semibold text-slate-700 mb-4">Per-Question Scores</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={barData} barCategoryGap="35%">
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v) => [`${v}%`, "Score"]} />
                  <Bar dataKey="score" radius={[6,6,0,0]}>
                    {barData.map((e, i) => <Cell key={i} fill={scoreColor(e.score)} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* AI Feedback */}
          {report.aiFeedback && (
            <Card className="p-5 bg-gradient-to-br from-violet-50 to-indigo-50 border-violet-100">
              <h3 className="font-semibold text-violet-700 mb-2 flex items-center gap-2">
                <RiSparklingLine /> AI Overall Feedback
              </h3>
              <p className="text-slate-700 text-sm leading-relaxed">{report.aiFeedback}</p>
            </Card>
          )}

          {/* Strengths & Weaknesses */}
          <div className="grid md:grid-cols-2 gap-5">
            <Card className="p-5">
              <h3 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <RiCheckLine className="text-green-500" /> Strengths
              </h3>
              <ul className="space-y-2">
                {(report.strengths || []).length === 0
                  ? <li className="text-sm text-slate-400">No data</li>
                  : (report.strengths || []).map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="w-5 h-5 shrink-0 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs mt-0.5">✓</span>
                      {s}
                    </li>
                  ))}
              </ul>
            </Card>
            <Card className="p-5">
              <h3 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <RiCloseLine className="text-red-500" /> Areas to Improve
              </h3>
              <ul className="space-y-2">
                {(report.weaknesses || []).length === 0
                  ? <li className="text-sm text-slate-400">No data</li>
                  : (report.weaknesses || []).map((w, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="w-5 h-5 shrink-0 bg-red-100 text-red-500 rounded-full flex items-center justify-center text-xs mt-0.5">!</span>
                      {w}
                    </li>
                  ))}
              </ul>
            </Card>
          </div>

          {/* Suggestions */}
          {(report.suggestions || []).length > 0 && (
            <Card className="p-5">
              <h3 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <RiLightbulbLine className="text-yellow-500" /> AI Suggestions for Improvement
              </h3>
              <ul className="space-y-2">
                {report.suggestions.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="w-5 h-5 shrink-0 bg-yellow-100 text-yellow-700 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">{i+1}</span>
                    {s}
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Q&A Review */}
          {(report.answers || []).length > 0 && (
            <Card className="p-5">
              <h3 className="font-semibold text-slate-700 mb-4">Question-by-Question Review</h3>
              <div className="space-y-4">
                {report.answers.map((a, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="border border-slate-100 rounded-xl p-4 hover:border-violet-100 transition"
                  >
                    <div className="flex items-start justify-between mb-2 gap-3">
                      <p className="text-sm font-semibold text-slate-700 flex-1">
                        <span className="text-violet-500 mr-1.5">Q{i+1}.</span>
                        {a.question}
                      </p>
                      <span className="font-bold text-sm shrink-0" style={{ color: scoreColor(a.score) }}>
                        {a.score}/100
                      </span>
                    </div>
                    {a.answer && (
                      <div className="bg-slate-50 rounded-lg px-3 py-2 mb-2 text-xs text-slate-500 italic border-l-2 border-slate-200">
                        "{a.answer.length > 250 ? a.answer.slice(0, 250) + "…" : a.answer}"
                      </div>
                    )}
                    {a.feedback && (
                      <p className="text-xs text-violet-700 bg-violet-50 rounded-lg px-3 py-2 mb-1.5">
                        <span className="font-semibold">Feedback:</span> {a.feedback}
                      </p>
                    )}
                    {a.betterAnswer && (
                      <p className="text-xs text-green-700 bg-green-50 rounded-lg px-3 py-2">
                        <span className="font-semibold">Model Answer:</span> {a.betterAnswer}
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            </Card>
          )}

          {/* Footer */}
          <div className="text-center text-xs text-slate-400 py-2">
            Generated by InterviewIQ AI · {new Date().toLocaleString("en-IN")}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InterviewReport;
