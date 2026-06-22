import React from "react";

// ── Input ─────────────────────────────────────────────────────
export const Input = React.forwardRef(
  ({ label, error, icon, className = "", ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          className={`w-full rounded-xl border px-4 py-2.5 text-sm text-slate-800 bg-white outline-none
            transition focus:ring-2 focus:ring-violet-400 focus:border-violet-400
            border-slate-200 placeholder:text-slate-400
            ${icon ? "pl-10" : ""}
            ${error ? "border-red-400 focus:ring-red-300" : ""}
            ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
);
Input.displayName = "Input";

// ── Textarea ──────────────────────────────────────────────────
export const Textarea = React.forwardRef(
  ({ label, error, className = "", rows = 4, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
      <textarea
        ref={ref}
        rows={rows}
        className={`w-full resize-none rounded-xl border px-4 py-3 text-sm text-slate-800 bg-white outline-none
          transition focus:ring-2 focus:ring-violet-400 border-slate-200 placeholder:text-slate-400
          ${error ? "border-red-400" : ""}
          ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
);
Textarea.displayName = "Textarea";

// ── Card ──────────────────────────────────────────────────────
export const Card = ({ children, className = "", ...props }) => (
  <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm ${className}`} {...props}>
    {children}
  </div>
);

// ── Badge ─────────────────────────────────────────────────────
const BADGE_COLORS = {
  violet: "bg-violet-100 text-violet-700",
  green:  "bg-green-100  text-green-700",
  red:    "bg-red-100    text-red-700",
  yellow: "bg-yellow-100 text-yellow-700",
  blue:   "bg-blue-100   text-blue-700",
  gray:   "bg-slate-100  text-slate-600",
  orange: "bg-orange-100 text-orange-700",
};

export const Badge = ({ children, color = "violet", className = "" }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${BADGE_COLORS[color] || BADGE_COLORS.violet} ${className}`}>
    {children}
  </span>
);

// ── Loader ────────────────────────────────────────────────────
export const Loader = ({ fullScreen = false, size = "md", text = "" }) => {
  const ring = size === "sm" ? "w-5 h-5 border-2" : size === "lg" ? "w-14 h-14 border-4" : "w-10 h-10 border-3";
  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <div className={`${ring} border-violet-500 border-t-transparent rounded-full animate-spin`} />
      {text && <p className="text-sm text-slate-500">{text}</p>}
    </div>
  );
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
        {spinner}
      </div>
    );
  }
  return <div className="flex items-center justify-center p-8">{spinner}</div>;
};

// ── Empty State ───────────────────────────────────────────────
export const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    {Icon && <Icon className="text-6xl text-slate-300 mb-4" />}
    <h3 className="font-semibold text-slate-600 mb-2">{title}</h3>
    {description && <p className="text-sm text-slate-400 mb-5 max-w-sm">{description}</p>}
    {action}
  </div>
);

// ── Divider ───────────────────────────────────────────────────
export const Divider = ({ text }) =>
  text ? (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-px bg-slate-200" />
      <span className="text-xs text-slate-400 font-medium">{text}</span>
      <div className="flex-1 h-px bg-slate-200" />
    </div>
  ) : <div className="h-px bg-slate-200 w-full" />;

export default Loader;
