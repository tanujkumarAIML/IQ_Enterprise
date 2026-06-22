import React, { useState, useRef } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { RiMicLine, RiMicOffLine, RiDeleteBack2Line, RiSendPlaneLine } from "react-icons/ri";

const AnswerRecorder = ({
  value = "",
  onChange,
  onSubmit,
  placeholder = "Type your answer or click the mic to speak…",
  loading = false,
}) => {
  const [micOn, setMicOn] = useState(false);
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();
  const textRef = useRef(null);

  const toggleMic = () => {
    if (listening) {
      SpeechRecognition.stopListening();
      if (transcript.trim()) {
        onChange?.((prev) => (prev + " " + transcript).trim());
        resetTranscript();
      }
      setMicOn(false);
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
      setMicOn(true);
    }
  };

  const words = value?.trim().split(/\s+/).filter(Boolean).length || 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-600">Your Answer</label>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">{words} words</span>
          {value && (
            <button
              type="button"
              onClick={() => onChange?.("")}
              className="text-xs text-slate-400 hover:text-red-500 transition flex items-center gap-0.5"
            >
              <RiDeleteBack2Line /> Clear
            </button>
          )}
          {browserSupportsSpeechRecognition && (
            <button
              type="button"
              onClick={toggleMic}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                listening
                  ? "bg-red-100 text-red-600 animate-pulse"
                  : "bg-violet-100 text-violet-700 hover:bg-violet-200"
              }`}
            >
              {listening ? <><RiMicLine /> Stop</> : <><RiMicOffLine /> Voice</>}
            </button>
          )}
        </div>
      </div>

      {listening && (
        <div className="flex items-end justify-center gap-1 h-7">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="wave-bar" style={{ animationDelay: `${(i - 1) * 0.1}s` }} />
          ))}
          <span className="text-xs text-violet-500 ml-2 font-medium">Listening…</span>
        </div>
      )}

      <textarea
        ref={textRef}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        rows={6}
        className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-violet-400 placeholder:text-slate-400 leading-relaxed"
      />

      {onSubmit && (
        <button
          type="button"
          onClick={onSubmit}
          disabled={!value?.trim() || loading}
          className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:from-violet-700 hover:to-indigo-700 disabled:opacity-50 transition"
        >
          {loading
            ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            : <RiSendPlaneLine />}
          Submit Answer
        </button>
      )}
    </div>
  );
};

export default AnswerRecorder;
