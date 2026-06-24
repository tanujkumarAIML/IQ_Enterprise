import React from "react";

const COLORS = {
  violet: {
    bg: "bg-violet-50 dark:bg-violet-900/20",
    icon: "bg-violet-100 dark:bg-violet-900 text-violet-600 dark:text-violet-300",
    text: "text-violet-700 dark:text-violet-300",
    border: "border-violet-100 dark:border-violet-800",
  },
  green: {
    bg: "bg-green-50 dark:bg-green-900/20",
    icon: "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300",
    text: "text-green-700 dark:text-green-300",
    border: "border-green-100 dark:border-green-800",
  },
  blue: {
    bg: "bg-blue-50 dark:bg-blue-900/20",
    icon: "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300",
    text: "text-blue-700 dark:text-blue-300",
    border: "border-blue-100 dark:border-blue-800",
  },
  orange: {
    bg: "bg-orange-50 dark:bg-orange-900/20",
    icon: "bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300",
    text: "text-orange-700 dark:text-orange-300",
    border: "border-orange-100 dark:border-orange-800",
  },
  red: {
    bg: "bg-red-50 dark:bg-red-900/20",
    icon: "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300",
    text: "text-red-700 dark:text-red-300",
    border: "border-red-100 dark:border-red-800",
  },
};

const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  color = "violet",
  trend,
}) => {
  const c = COLORS[color] || COLORS.violet;

  return (
    <div
      className={`
        ${c.bg}
        ${c.border}
        rounded-2xl
        border
        p-5
        shadow-sm
        hover:shadow-lg
        transition-all
        duration-300
        hover:-translate-y-1
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate">
            {title}
          </p>

          <p className="mt-1 text-3xl font-bold text-slate-800 dark:text-white leading-none">
            {value}
          </p>

          {subtitle && (
            <p className={`mt-2 text-xs font-medium ${c.text}`}>
              {subtitle}
            </p>
          )}

          {trend !== undefined && (
            <p
              className={`mt-2 text-xs font-semibold ${
                trend >= 0
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {trend >= 0 ? "▲" : "▼"} {Math.abs(trend)}% vs last month
            </p>
          )}
        </div>

        <div
          className={`
            ${c.icon}
            ml-4
            rounded-xl
            p-3
            text-2xl
            shrink-0
            shadow-sm
          `}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;