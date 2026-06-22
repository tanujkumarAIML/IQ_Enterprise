import React from "react";
import { RiTimeLine } from "react-icons/ri";

const fmt = (s) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

const Timer = ({ seconds = 0, warn = 30, danger = 10, label = "Time Left" }) => {
  const color =
    seconds <= danger ? "text-red-600 bg-red-50"
    : seconds <= warn ? "text-yellow-600 bg-yellow-50"
    : "text-slate-700 bg-slate-50";

  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-xl font-mono font-bold text-sm ${color} transition-colors`}>
      <RiTimeLine className={seconds <= danger ? "animate-pulse" : ""} />
      <span>{fmt(seconds)}</span>
      {label && <span className="text-xs font-medium opacity-60 ml-1">{label}</span>}
    </div>
  );
};

export default Timer;
