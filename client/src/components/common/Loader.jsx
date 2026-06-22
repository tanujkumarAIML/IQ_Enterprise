import React from "react";

const Loader = ({ fullScreen = false, size = "md", text = "" }) => {
  const ring = size === "sm" ? "w-5 h-5 border-2" : size === "lg" ? "w-14 h-14 border-4" : "w-10 h-10 border-[3px]";
  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <div className={`${ring} border-violet-500 border-t-transparent rounded-full animate-spin`} />
      {text && <p className="text-sm text-slate-500">{text}</p>}
    </div>
  );
  if (fullScreen) return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">{spinner}</div>
  );
  return <div className="flex items-center justify-center p-8">{spinner}</div>;
};

export default Loader;
