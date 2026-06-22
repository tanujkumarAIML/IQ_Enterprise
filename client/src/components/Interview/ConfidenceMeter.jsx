import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const getColor = (s) => s >= 80 ? "#16a34a" : s >= 60 ? "#d97706" : "#dc2626";
const getLabel = (s) => s >= 80 ? "High" : s >= 60 ? "Moderate" : "Low";

const ConfidenceMeter = ({ score = 0, label = "Confidence" }) => (
  <div className="flex flex-col items-center gap-1">
    <div className="w-16 h-16">
      <CircularProgressbar
        value={score}
        text={`${Math.round(score)}%`}
        styles={buildStyles({
          pathColor: getColor(score),
          textColor: getColor(score),
          trailColor: "#f1f5f9",
          textSize: "22px",
          pathTransitionDuration: 0.6,
        })}
      />
    </div>
    <p className="text-xs font-medium text-slate-500 text-center">{label}</p>
    <p className="text-xs font-bold" style={{ color: getColor(score) }}>{getLabel(score)}</p>
  </div>
);

export default ConfidenceMeter;
