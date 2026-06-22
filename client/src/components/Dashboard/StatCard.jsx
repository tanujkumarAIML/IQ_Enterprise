import React from "react";

const COLORS = {
  violet: { bg: "bg-violet-50", icon: "bg-violet-100 text-violet-600", text: "text-violet-700", border: "border-violet-100" },
  green:  { bg: "bg-green-50",  icon: "bg-green-100  text-green-600",  text: "text-green-700",  border: "border-green-100"  },
  blue:   { bg: "bg-blue-50",   icon: "bg-blue-100   text-blue-600",   text: "text-blue-700",   border: "border-blue-100"   },
  orange: { bg: "bg-orange-50", icon: "bg-orange-100 text-orange-600", text: "text-orange-700", border: "border-orange-100" },
  red:    { bg: "bg-red-50",    icon: "bg-red-100    text-red-600",    text: "text-red-700",    border: "border-red-100"    },
};

const StatCard = ({ title, value, subtitle, icon, color = "violet", trend }) => {
  const c = COLORS[color] || COLORS.violet;
  return (
    <div className={`${c.bg} rounded-2xl p-5 border ${c.border} shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-slate-500 font-medium truncate">{title}</p>
          <p className="text-3xl font-bold text-slate-800 mt-1 leading-none">{value}</p>
          {subtitle && (
            <p className={`text-xs mt-1.5 font-medium ${c.text}`}>{subtitle}</p>
          )}
          {trend !== undefined && (
            <p className={`text-xs mt-1 font-semibold ${trend >= 0 ? "text-green-600" : "text-red-500"}`}>
              {trend >= 0 ? "▲" : "▼"} {Math.abs(trend)}% vs last month
            </p>
          )}
        </div>
        <div className={`${c.icon} p-3 rounded-xl text-2xl shrink-0 ml-3`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
