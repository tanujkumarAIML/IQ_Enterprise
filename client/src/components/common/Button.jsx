import React from "react";

const VARIANTS = {
  primary:   "bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700 shadow-md shadow-violet-200/60",
  secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200",
  danger:    "bg-red-500 text-white hover:bg-red-600 shadow-sm",
  ghost:     "bg-transparent text-slate-600 hover:bg-slate-100",
  outline:   "border-2 border-violet-600 text-violet-600 hover:bg-violet-50",
  success:   "bg-green-500 text-white hover:bg-green-600 shadow-sm",
  dark:      "bg-slate-800 text-white hover:bg-slate-700",
};

const SIZES = {
  xs: "px-2.5 py-1.5 text-xs rounded-lg",
  sm: "px-3.5 py-2 text-sm rounded-xl",
  md: "px-4 py-2.5 text-sm rounded-xl",
  lg: "px-6 py-3 text-base rounded-xl",
  xl: "px-8 py-4 text-base rounded-2xl",
};

const Button = ({
  children,
  variant   = "primary",
  size      = "md",
  loading   = false,
  disabled  = false,
  className = "",
  icon,
  iconRight,
  fullWidth = false,
  ...props
}) => (
  <button
    disabled={disabled || loading}
    className={`
      inline-flex items-center justify-center gap-2 font-semibold
      transition-all duration-200 active:scale-95 cursor-pointer select-none
      disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
      ${VARIANTS[variant] || VARIANTS.primary}
      ${SIZES[size]       || SIZES.md}
      ${fullWidth ? "w-full" : ""}
      ${className}
    `}
    {...props}
  >
    {loading ? (
      <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
    ) : (
      icon && <span className="text-lg leading-none">{icon}</span>
    )}
    {children}
    {!loading && iconRight && (
      <span className="text-lg leading-none">{iconRight}</span>
    )}
  </button>
);

export default Button;
