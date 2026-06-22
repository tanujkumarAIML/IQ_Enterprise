import React from "react";
import { RiSparklingLine, RiEyeLine } from "react-icons/ri";
import { motion } from "framer-motion";

const scoreColor = (s) =>
  s >= 80 ? "text-green-600" : s >= 60 ? "text-yellow-600" : "text-red-500";

const FeedbackCard = ({ feedback }) => {
  if (!feedback) return null;
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-100 rounded-2xl p-5"
    >
      <div className="flex items-center gap-2 mb-3">
        <RiSparklingLine className="text-violet-600 text-lg" />
        <h4 className="font-semibold text-violet-700 text-sm">AI Feedback</h4>
        {feedback.score !== undefined && (
          <span className={`ml-auto text-lg font-bold ${scoreColor(feedback.score)}`}>
            {feedback.score}/100
          </span>
        )}
      </div>

      <p className="text-sm text-slate-700 mb-3 leading-relaxed">{feedback.feedback}</p>

      {feedback.missingPoints?.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-semibold text-slate-500 mb-1">Key points missed:</p>
          <ul className="space-y-1">
            {feedback.missingPoints.map((p, i) => (
              <li key={i} className="flex items-start gap-1.5 text-xs text-slate-600">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1 shrink-0" />
                {p}
              </li>
            ))}
          </ul>
        </div>
      )}

      {feedback.betterAnswer && (
        <div className="bg-white rounded-xl p-3 border border-violet-100">
          <p className="text-xs font-semibold text-violet-700 mb-1 flex items-center gap-1">
            <RiEyeLine /> Model Answer
          </p>
          <p className="text-xs text-slate-600 leading-relaxed">{feedback.betterAnswer}</p>
        </div>
      )}

      {(feedback.technicalScore !== undefined) && (
        <div className="flex gap-4 mt-3 text-xs text-slate-500">
          <span>Tech: <b className={scoreColor(feedback.technicalScore)}>{feedback.technicalScore}</b></span>
          <span>Comm: <b className={scoreColor(feedback.communicationScore)}>{feedback.communicationScore}</b></span>
          <span>Conf: <b className={scoreColor(feedback.confidenceScore)}>{feedback.confidenceScore}</b></span>
        </div>
      )}
    </motion.div>
  );
};

export default FeedbackCard;
