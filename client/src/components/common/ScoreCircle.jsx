import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const getColor = (s) => s >= 80 ? "#16a34a" : s >= 60 ? "#d97706" : "#dc2626";
const getLabel = (s) => s >= 80 ? "Excellent" : s >= 65 ? "Good" : s >= 50 ? "Average" : "Needs Work";

const ScoreCircle = ({ score = 0, label = "", size = "md" }) => {
  const color = getColor(score);
  const dim   = size === "sm" ? "w-20 h-20" : size === "lg" ? "w-40 h-40" : "w-28 h-28";
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={dim}>
        <CircularProgressbar
          value={score}
          text={`${Math.round(score)}%`}
          styles={buildStyles({
            pathColor: color, textColor: color, trailColor: "#f1f5f9",
            textSize: "20px", pathTransitionDuration: 0.8,
          })}
        />
      </div>
      {label && <p className="text-xs font-semibold text-slate-500 text-center">{label}</p>}
      {size !== "sm" && <p className="text-xs font-bold" style={{ color }}>{getLabel(score)}</p>}
    </div>
  );
};

export default ScoreCircle;
