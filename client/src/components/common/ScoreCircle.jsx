import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const getColor = (score) => {
  if (score >= 80) return "#16a34a";
  if (score >= 60) return "#d97706";
  return "#dc2626";
};

const getLabel = (score) => {
  if (score >= 80) return "Excellent";
  if (score >= 65) return "Good";
  if (score >= 50) return "Average";
  return "Needs Work";
};

const ScoreCircle = ({
  score = 0,
  label = "",
  size = "md",
}) => {
  const color = getColor(score);

  const dimension =
    size === "sm"
      ? "w-20 h-20"
      : size === "lg"
      ? "w-40 h-40"
      : "w-28 h-28";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={dimension}>
        <CircularProgressbar
          value={score}
          text={`${Math.round(score)}%`}
          styles={buildStyles({
            pathColor: color,
            textColor: color,

            // Better for dark mode
            trailColor: "#334155",

            strokeLinecap: "round",
            pathTransitionDuration: 0.8,
            textSize: "20px",
          })}
        />
      </div>

      {label && (
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-300 text-center">
          {label}
        </p>
      )}

      {size !== "sm" && (
        <p
          className="text-xs font-bold"
          style={{ color }}
        >
          {getLabel(score)}
        </p>
      )}
    </div>
  );
};

export default ScoreCircle;