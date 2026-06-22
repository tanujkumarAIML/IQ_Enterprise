import React, { useEffect, useState } from "react";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";

const EyeTracker = ({ active = false }) => {
  const [score, setScore] = useState(85);
  const [looking, setLooking] = useState(true);

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => {
      const s = Math.floor(75 + Math.random() * 22);
      setScore(s);
      setLooking(s > 70);
    }, 2000);
    return () => clearInterval(id);
  }, [active]);

  const color = score >= 80 ? "#16a34a" : score >= 60 ? "#d97706" : "#dc2626";

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors"
        style={{ borderColor: color, backgroundColor: `${color}15` }}
      >
        {looking
          ? <RiEyeLine className="text-lg" style={{ color }} />
          : <RiEyeOffLine className="text-lg text-slate-400" />}
      </div>
      <p className="text-xs font-semibold" style={{ color }}>{score}%</p>
      <p className="text-xs text-slate-400">Eye Contact</p>
    </div>
  );
};

export default EyeTracker;
