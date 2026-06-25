import React from "react";
import { RiArrowUpSLine, RiArrowDownSLine } from "react-icons/ri";

/* ══════════════════════════════════════════════════════════════════════
   STAT CARD COMPONENT
   ══════════════════════════════════════════════════════════════════════ */
const StatCard = ({
  title,
  value,
  icon: Icon = "div", // Fallback empty div if no icon is passed
  trend = null, // Ex: { value: 12.5, isPositive: true }
  iconBg = "bg-violet-100 text-violet-600", // Default styling
  className = "",
}) => {
  return (
    <div
      className={`group relative bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-slate-300/80 transition-all duration-300 hover:-translate-y-0.5 ${className}`}
    >
      {/* ── Icon ── */}
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${iconBg}`}>
        <Icon className="text-2xl" />
      </div>

      {/* ── Text Content ── */}
      <p className="text-sm font-medium text-slate-400 mb-1">
        {title}
      </p>
      <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight">
        {value}
      </h3>

      {/* ── Trend Indicator (Optional) ── */}
      {trend && (
        <div className="mt-4 flex items-center gap-1.5">
          <div
            className={`flex items-center justify-center w-5 h-5 rounded-full ${
              trend.isPositive
                ? "bg-emerald-100 text-emerald-600"
                : "bg-red-100 text-red-500"
            }`}
          >
            {trend.isPositive ? (
              <RiArrowUpSLine className="text-sm" />
            ) : (
              <RiArrowDownSLine className="text-sm" />
            )}
          </div>
          <span
            className={`text-xs font-bold ${
              trend.isPositive ? "text-emerald-600" : "text-red-500"
            }`}
          >
            {trend.value}%
          </span>
          <span className="text-xs text-slate-400 font-medium">vs last month</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;