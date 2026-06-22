import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RiQuestionLine } from "react-icons/ri";

const QuestionCard = ({ question, index, total }) => (
  <AnimatePresence mode="wait">
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.25 }}
      className="bg-white rounded-2xl border-l-4 border-l-violet-500 shadow-sm p-5"
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 shrink-0 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-sm font-bold">
          {index + 1}
        </div>
        <div>
          {total && (
            <p className="text-xs text-slate-400 font-medium mb-1">
              Question {index + 1} of {total}
            </p>
          )}
          <p className="text-slate-800 font-medium leading-relaxed text-base">{question}</p>
        </div>
      </div>
    </motion.div>
  </AnimatePresence>
);

export default QuestionCard;
