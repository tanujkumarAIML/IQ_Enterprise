import React from "react";
import { RiLoader4Line } from "react-icons/ri";

/* ══════════════════════════════════════════════════════════════════════
   VARIANTS (Refined shadows & subtle hover transitions)
   ══════════════════════════════════════════════════════════════════════ */
const VARIANTS = {
  primary:
    "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm shadow-violet-200/50 hover:from-violet-500 hover:to-indigo-500 hover:shadow-md hover:shadow-violet-300/50 focus-visible:ring-violet-500",
  
  secondary:
    "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 focus-visible:ring-slate-400",
  
  danger:
    "bg-red-500 text-white shadow-sm shadow-red-200/50 hover:bg-red-600 hover:shadow-md hover:shadow-red-300/50 focus-visible:ring-red-500",
  
  ghost:
    "bg-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus-visible:ring-slate-400",
  
  outline:
    "border-2 border-violet-500 text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-500/10 focus-visible:ring-violet-500",
  
  success:
    "bg-emerald-500 text-white shadow-sm shadow-emerald-200/50 hover:bg-emerald-600 hover:shadow-md hover:shadow-emerald-300/50 focus-visible:ring-emerald-500",
  
  dark:
    "bg-slate-800 dark:bg-slate-700 text-white hover:bg-slate-700 dark:hover:bg-slate-600 focus-visible:ring-slate-500",
};

/* ══════════════════════════════════════════════════════════════════════
   SIZES (Consistent padding and border-radius)
   ══════════════════════════════════════════════════════════════════════ */
const SIZES = {
  xs: "px-3 py-1.5 text-xs rounded-lg gap-1.5",
  sm: "px-4 py-2 text-sm rounded-xl gap-2",
  md: "px-5 py-2.5 text-sm rounded-xl gap-2",
  lg: "px-6 py-3 text-base rounded-xl gap-2.5",
  xl: "px-8 py-4 text-base rounded-2xl gap-2.5",
};

/* ══════════════════════════════════════════════════════════════════════
   BUTTON COMPONENT
   ══════════════════════════════════════════════════════════════════════ */
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
  type = "button",
  ...props
}) => {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={`
        relative inline-flex items-center justify-center font-semibold
        transition-all duration-200 ease-out select-none
        focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 
        active:scale-[0.97] 
        disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
        ${VARIANTS[variant] || VARIANTS.primary}
        ${SIZES[size]       || SIZES.md}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      {...props}
    >
      {/* Left Icon / Loading Spinner */}
      {loading ? (
        <RiLoader4Line className="animate-spin text-[1.15em] leading-none" />
      ) : (
        icon && <span className="text-[1.15em] leading-none flex-shrink-0">{icon}</span>
      )}

      {/* Button Text */}
      <span className={loading ? "opacity-70" : ""}>
        {children}
      </span>

      {/* Right Icon */}
      {!loading && iconRight && (
        <span className="text-[1.15em] leading-none flex-shrink-0">{iconRight}</span>
      )}
    </button>
  );
};

export default Button;
