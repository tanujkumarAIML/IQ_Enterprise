import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

/* ══════════════════════════════════════════════════════════════════════
   CUSTOM TOOLTIP (Matches Admin Light Theme)
   ══════════════════════════════════════════════════════════════════════ */
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-4 py-3 shadow-xl shadow-slate-200/50 rounded-xl border border-slate-100">
        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">
          {label}
        </p>
        <div className="space-y-1.5">
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div 
                  className="w-2.5 h-2.5 rounded-full" 
                  style={{ backgroundColor: entry.color }} 
                />
                <span className="font-medium text-slate-600">{entry.name}</span>
              </div>
              <span className="font-bold text-slate-800">{entry.value}%</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

/* ══════════════════════════════════════════════════════════════════════
   MAIN CHART COMPONENT
   ══════════════════════════════════════════════════════════════════════ */
const AnalyticsChart = ({ 
  data = [], 
  title = "Performance Overview", 
  subtitle = "Average scores over the past 6 months" 
}) => {
  // Default mock data in case no data is passed
  const chartData = data.length > 0 ? data : [
    { month: "Jul", overall: 65, confidence: 60, technical: 70 },
    { month: "Aug", overall: 72, confidence: 68, technical: 75 },
    { month: "Sep", overall: 68, confidence: 75, technical: 65 },
    { month: "Oct", overall: 80, confidence: 78, technical: 82 },
    { month: "Nov", overall: 85, confidence: 82, technical: 88 },
    { month: "Dec", overall: 92, confidence: 88, technical: 95 },
  ];

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
      {/* ── Chart Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800">{title}</h3>
          <p className="text-sm text-slate-400 mt-1">{subtitle}</p>
        </div>
        
        {/* Mini Legend */}
        <div className="flex items-center gap-5 text-sm font-medium">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-violet-500" />
            <span className="text-slate-500">Overall</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-cyan-500" />
            <span className="text-slate-500">Confidence</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-slate-500">Technical</span>
          </div>
        </div>
      </div>

      {/* ── Recharts Container ── */}
      <div className="w-full h-[350px] -ml-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart 
            data={chartData} 
            margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
          >
            {/* Subtle Grid */}
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#f1f5f9" 
              vertical={false} 
            />

            {/* X-Axis */}
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 13, fontWeight: 500 }} 
              dy={10}
            />

            {/* Y-Axis (Fixed 0-100 for percentage scores) */}
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 13, fontWeight: 500 }} 
              domain={[0, 100]} 
              dx={-10}
              tickFormatter={(value) => `${value}%`}
            />

            {/* Custom Tooltip */}
            <Tooltip content={<CustomTooltip />} />

            {/* Line 1: Overall Score */}
            <Line 
              type="monotone" 
              dataKey="overall" 
              name="Overall Score"
              stroke="#8b5cf6" 
              strokeWidth={3} 
              dot={false} 
              activeDot={{ 
                r: 7, 
                fill: "#8b5cf6", 
                stroke: "#ffffff", 
                strokeWidth: 3,
                boxShadow: "0 0 10px rgba(139, 92, 246, 0.5)"
              }} 
            />

            {/* Line 2: Confidence Score */}
            <Line 
              type="monotone" 
              dataKey="confidence" 
              name="Confidence"
              stroke="#06b6d4" 
              strokeWidth={3} 
              dot={false} 
              activeDot={{ 
                r: 7, 
                fill: "#06b6d4", 
                stroke: "#ffffff", 
                strokeWidth: 3,
                boxShadow: "0 0 10px rgba(6, 182, 212, 0.5)"
              }} 
            />

            {/* Line 3: Technical Score */}
            <Line 
              type="monotone" 
              dataKey="technical" 
              name="Technical"
              stroke="#10b981" 
              strokeWidth={3} 
              dot={false} 
              activeDot={{ 
                r: 7, 
                fill: "#10b981", 
                stroke: "#ffffff", 
                strokeWidth: 3,
                boxShadow: "0 0 10px rgba(16, 185, 129, 0.5)"
              }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalyticsChart;