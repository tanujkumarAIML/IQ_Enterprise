import React from "react";
import { Link } from "react-router-dom";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { RiFileChartLine, RiVideoLine } from "react-icons/ri";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { <RiAwardLine /> } from "react-icons/ri";
const scoreColor = (s) => s >= 80 ? "#16a34a" : s >= 60 ? "#d97706" : "#dc2626";

const InterviewResult = ({ report, interviewId }) => {
  if (!report) return null;

  const overall = report.overallScore || 0;
  const radarData = [
    { subject: "Technical",     A: report.technicalScore     || 0 },
    { subject: "Communication", A: report.communicationScore || 0 },
    { subject: "Confidence",    A: report.confidenceScore    || 0 },
    { subject: "HR",            A: report.hrScore            || 0 },
    { subject: "Grammar",       A: report.grammarScore       || 0 },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6">
      <div className="text-center">
        <RiAwardLine className="text-5xl text-yellow-500 mx-auto mb-3" />
        <h2 className="text-2xl font-bold text-slate-800">Interview Complete!</h2>
        <p className="text-slate-400 text-sm mt-1">Here's your AI-generated performance summary</p>
      </div>

      <div className="flex justify-center">
        <div className="w-36 h-36">
          <CircularProgressbar
            value={overall}
            text={`${overall}%`}
            styles={buildStyles({
              pathColor: scoreColor(overall),
              textColor: scoreColor(overall),
              trailColor: "#f1f5f9",
              textSize: "18px",
              pathTransitionDuration: 1,
            })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Technical",    value: report.technicalScore     || 0 },
          { label: "Communication",value: report.communicationScore || 0 },
          { label: "Confidence",   value: report.confidenceScore    || 0 },
          { label: "HR",           value: report.hrScore            || 0 },
        ].map(({ label, value }) => (
          <div key={label} className="text-center bg-slate-50 rounded-xl p-3">
            <p className="text-lg font-bold" style={{ color: scoreColor(value) }}>{value}%</p>
            <p className="text-xs text-slate-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {report.recommendation && (
        <div className={`text-center py-2 px-4 rounded-xl text-sm font-bold ${
          report.recommendation === "Strong Hire" ? "bg-green-100 text-green-700"
          : report.recommendation === "Hire"       ? "bg-blue-100 text-blue-700"
          : report.recommendation === "Maybe"      ? "bg-yellow-100 text-yellow-700"
          :                                          "bg-red-100 text-red-700"
        }`}>
          AI Recommendation: {report.recommendation}
        </div>
      )}

      {report.feedback && (
        <p className="text-sm text-slate-600 leading-relaxed bg-violet-50 rounded-xl p-4 border border-violet-100">
          {report.feedback}
        </p>
      )}

      <ResponsiveContainer width="100%" height={180}>
        <RadarChart data={radarData}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: "#64748b" }} />
          <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
          <Radar dataKey="A" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.2} strokeWidth={2} />
        </RadarChart>
      </ResponsiveContainer>

      <div className="flex gap-3">
        <Link to={`/report/${interviewId}`}
          className="flex-1 flex items-center justify-center gap-2 bg-violet-600 text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-violet-700 transition">
          <RiFileChartLine /> Full Report
        </Link>
        <Link to="/interview"
          className="flex-1 flex items-center justify-center gap-2 border border-slate-200 text-slate-600 text-sm font-semibold py-2.5 rounded-xl hover:bg-slate-50 transition">
          <RiVideoLine /> New Interview
        </Link>
      </div>
    </div>
  );
};

export default InterviewResult;
