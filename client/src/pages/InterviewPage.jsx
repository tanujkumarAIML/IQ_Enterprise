import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import Webcam from "react-webcam";
import {
  RiMicLine, RiMicOffLine, RiVideoLine, RiVideoOffLine,
  RiSendPlaneLine, RiArrowRightLine, RiArrowLeftLine,
  RiTimeLine, RiCheckLine, RiSparklingLine, RiDeleteBack2Line,
  RiRefreshLine, RiEyeLine,
} from "react-icons/ri";
import DashboardLayout from "../components/Layout/DashboardLayout";
import Button          from "../components/common/Button";
import { Card, Loader, Badge } from "../components/common/index.jsx";
import { setInterview, saveAnswer, setCurrentIndex, setStatus, setReport, resetInterview } from "../redux/slices/interviewSlice";
import api from "../services/api";

const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

const InterviewPage = () => {
  const { id }     = useParams();
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const { current: interview, currentIndex, answers, status } = useSelector((s) => s.interview);

  const [localAnswer,       setLocalAnswer]       = useState("");
  const [timeLeft,          setTimeLeft]           = useState(180);
  const [totalTime,         setTotalTime]          = useState(0);
  const [camOn,             setCamOn]              = useState(false);
  const [submitting,        setSubmitting]         = useState(false);
  const [aiFeedback,        setAiFeedback]         = useState(null);
  const [loadingFeedback,   setLoadingFeedback]    = useState(false);
  const [loadingInterview,  setLoadingInterview]   = useState(true);
  const [showConfirm,       setShowConfirm]        = useState(false);

  const webcamRef  = useRef(null);
  const timerRef   = useRef(null);
  const totalRef   = useRef(null);
  const textareaRef = useRef(null);

  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  // Append voice transcript to answer
  useEffect(() => {
    if (transcript.trim()) {
      setLocalAnswer((prev) => (prev + " " + transcript).trim());
    }
  }, [transcript]);

  // Load interview
  useEffect(() => {
    const load = async () => {
      try {
        if (!interview || interview._id !== id) {
          const { data } = await api.get(`/interviews/${id}`);
          dispatch(setInterview(data.interview));
          dispatch(setStatus("active"));
        }
      } catch {
        toast.error("Interview not found");
        navigate("/interview");
      } finally { setLoadingInterview(false); }
    };
    load();
  }, [id]);

  // Per-question countdown timer
  useEffect(() => {
    setTimeLeft(180);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(timerRef.current); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [currentIndex]);

  // Total elapsed
  useEffect(() => {
    totalRef.current = setInterval(() => setTotalTime((t) => t + 1), 1000);
    return () => clearInterval(totalRef.current);
  }, []);

  // Restore saved answer when switching questions
  useEffect(() => {
    setLocalAnswer(answers[currentIndex] || "");
    setAiFeedback(null);
    resetTranscript();
    textareaRef.current?.focus();
  }, [currentIndex]);

  const toggleMic = () => {
    if (listening) {
      SpeechRecognition.stopListening();
      resetTranscript();
    } else {
      SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
    }
  };

  const getFeedback = async () => {
    if (!localAnswer.trim()) { toast.error("Write or speak your answer first!"); return; }
    setLoadingFeedback(true);
    try {
      const { data } = await api.post("/interviews/evaluate-answer", {
        question: interview.questions[currentIndex],
        answer:   localAnswer,
        jobRole:  interview.jobRole,
      });
      setAiFeedback(data.result);
    } catch {
      toast.error("Could not get AI feedback. Try again.");
    } finally { setLoadingFeedback(false); }
  };

  const saveAndMove = (direction) => {
    dispatch(saveAnswer({ index: currentIndex, answer: localAnswer }));
    setAiFeedback(null);
    resetTranscript();
    if (listening) SpeechRecognition.stopListening();
    if (direction === "next") dispatch(setCurrentIndex(currentIndex + 1));
    else                      dispatch(setCurrentIndex(currentIndex - 1));
  };

  const jumpToQuestion = (i) => {
    dispatch(saveAnswer({ index: currentIndex, answer: localAnswer }));
    dispatch(setCurrentIndex(i));
  };

  const submitInterview = async () => {
    dispatch(saveAnswer({ index: currentIndex, answer: localAnswer }));
    const finalAnswers = [...answers];
    finalAnswers[currentIndex] = localAnswer;

    setSubmitting(true);
    clearInterval(totalRef.current);
    try {
      const { data } = await api.put(`/interviews/${id}/submit`, {
        answers: finalAnswers,
        duration: totalTime,
      });
      dispatch(setReport(data.report));
      dispatch(setStatus("done"));
      toast.success("Interview submitted! Generating your report…");
      navigate(`/report/${id}`);
    } catch (err) {
      toast.error(err.message || "Submission failed. Please try again.");
      setSubmitting(false);
    }
  };

  if (loadingInterview) return <DashboardLayout title="Interview"><Loader text="Loading your interview…" /></DashboardLayout>;
  if (!interview)       return <DashboardLayout title="Interview"><p className="text-center text-slate-400 py-20">Interview not found.</p></DashboardLayout>;

  const questions  = interview.questions || [];
  const total      = questions.length;
  const progress   = Math.round(((currentIndex + 1) / total) * 100);
  const isLast     = currentIndex === total - 1;
  const answeredCount = answers.filter(Boolean).length;

  return (
    <DashboardLayout title="Mock Interview">
      <div className="max-w-5xl mx-auto space-y-4">

        {/* Header */}
        <div className="flex items-center justify-between bg-white rounded-2xl px-5 py-3 border border-slate-100 shadow-sm">
          <div>
            <p className="font-semibold text-slate-800">{interview.jobRole}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge color="violet">{interview.interviewType}</Badge>
              <Badge color={interview.difficulty === "Hard" ? "red" : interview.difficulty === "Medium" ? "yellow" : "green"}>
                {interview.difficulty}
              </Badge>
              {interview.company && <Badge color="blue">{interview.company}</Badge>}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-1.5 text-sm font-mono font-bold px-3 py-1.5 rounded-xl ${
              timeLeft <= 30 ? "bg-red-50 text-red-600" : timeLeft <= 60 ? "bg-yellow-50 text-yellow-600" : "bg-slate-50 text-slate-600"
            }`}>
              <RiTimeLine />
              {fmt(timeLeft)}
            </div>
            <div className="text-xs text-slate-400 hidden sm:block">Total: {fmt(totalTime)}</div>
            <div className="text-sm font-bold text-violet-700 bg-violet-50 px-3 py-1.5 rounded-xl">
              {currentIndex + 1} / {total}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <div className="grid lg:grid-cols-5 gap-4">
          {/* Left: Question + Answer */}
          <div className="lg:col-span-3 space-y-4">
            {/* Question card */}
            <AnimatePresence mode="wait">
              <motion.div key={currentIndex} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.25 }}>
                <Card className="p-5 border-l-4 border-l-violet-500">
                  <div className="flex items-start gap-3">
                    <span className="w-8 h-8 shrink-0 bg-violet-100 text-violet-700 text-sm font-bold rounded-full flex items-center justify-center">
                      {currentIndex + 1}
                    </span>
                    <p className="text-slate-800 font-medium leading-relaxed text-base">
                      {questions[currentIndex]}
                    </p>
                  </div>
                </Card>
              </motion.div>
            </AnimatePresence>

            {/* Answer textarea */}
            <Card className="p-5">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-slate-600">Your Answer</label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">{localAnswer.split(/\s+/).filter(Boolean).length} words</span>
                  {localAnswer && (
                    <button onClick={() => setLocalAnswer("")} className="text-xs text-slate-400 hover:text-red-500 transition flex items-center gap-0.5">
                      <RiDeleteBack2Line /> Clear
                    </button>
                  )}
                  {browserSupportsSpeechRecognition && (
                    <button onClick={toggleMic}
                      className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                        listening ? "bg-red-100 text-red-600 animate-pulse" : "bg-slate-100 text-slate-600 hover:bg-violet-100 hover:text-violet-700"
                      }`}>
                      {listening ? <><RiMicLine /> Listening…</> : <><RiMicOffLine /> Voice</>}
                    </button>
                  )}
                </div>
              </div>

              {/* Voice wave */}
              {listening && (
                <div className="flex items-end justify-center gap-1 h-8 mb-3">
                  {[1,2,3,4,5].map((i) => <div key={i} className="wave-bar" style={{ animationDelay: `${(i-1)*0.1}s` }} />)}
                  <span className="text-xs text-violet-500 ml-2 font-medium">Listening…</span>
                </div>
              )}

              <textarea
                ref={textareaRef}
                value={localAnswer}
                onChange={(e) => setLocalAnswer(e.target.value)}
                placeholder="Type your answer here, or click Voice to speak…"
                rows={8}
                className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-violet-400 placeholder:text-slate-400 leading-relaxed"
              />
            </Card>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" size="sm" onClick={getFeedback}
                loading={loadingFeedback} icon={<RiSparklingLine />}
                disabled={!localAnswer.trim()}>
                AI Feedback
              </Button>

              {currentIndex > 0 && (
                <Button variant="ghost" size="sm" icon={<RiArrowLeftLine />} onClick={() => saveAndMove("prev")}>
                  Previous
                </Button>
              )}

              {!isLast ? (
                <Button size="sm" iconRight={<RiArrowRightLine />} onClick={() => saveAndMove("next")}>
                  Next Question
                </Button>
              ) : (
                <Button variant="success" size="sm" icon={<RiCheckLine />}
                  onClick={() => setShowConfirm(true)} loading={submitting}>
                  Submit Interview
                </Button>
              )}
            </div>

            {/* AI Feedback panel */}
            <AnimatePresence>
              {aiFeedback && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                  <Card className="p-5 bg-gradient-to-br from-violet-50 to-indigo-50 border-violet-100">
                    <div className="flex items-center gap-2 mb-3">
                      <RiSparklingLine className="text-violet-600 text-lg" />
                      <h4 className="font-semibold text-violet-700 text-sm">Gemini AI Feedback</h4>
                      <div className="ml-auto flex items-center gap-2">
                        <span className="text-xs text-slate-500">Score:</span>
                        <span className={`text-lg font-bold ${aiFeedback.score >= 75 ? "text-green-600" : aiFeedback.score >= 55 ? "text-yellow-600" : "text-red-500"}`}>
                          {aiFeedback.score}/100
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-slate-700 mb-3 leading-relaxed">{aiFeedback.feedback}</p>

                    {aiFeedback.missingPoints?.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs font-semibold text-slate-500 mb-1">Points you missed:</p>
                        <ul className="space-y-1">
                          {aiFeedback.missingPoints.map((p, i) => (
                            <li key={i} className="text-xs text-slate-600 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />{p}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {aiFeedback.betterAnswer && (
                      <div className="bg-white rounded-xl p-3 border border-violet-100">
                        <p className="text-xs font-semibold text-violet-700 mb-1 flex items-center gap-1">
                          <RiEyeLine /> Model Answer
                        </p>
                        <p className="text-xs text-slate-600 leading-relaxed">{aiFeedback.betterAnswer}</p>
                      </div>
                    )}

                    <div className="flex gap-3 mt-3 text-xs text-slate-500">
                      <span>Tech: <b className="text-slate-700">{aiFeedback.technicalScore}</b></span>
                      <span>Comm: <b className="text-slate-700">{aiFeedback.communicationScore}</b></span>
                      <span>Conf: <b className="text-slate-700">{aiFeedback.confidenceScore}</b></span>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right panel */}
          <div className="lg:col-span-2 space-y-4">
            {/* Webcam */}
            <Card className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-slate-600">Camera</span>
                <button onClick={() => setCamOn((o) => !o)}
                  className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium transition ${
                    camOn ? "bg-violet-100 text-violet-700" : "bg-slate-100 text-slate-500 hover:bg-violet-50"
                  }`}>
                  {camOn ? <><RiVideoLine /> On</> : <><RiVideoOffLine /> Off</>}
                </button>
              </div>
              <div className="bg-slate-800 rounded-xl overflow-hidden aspect-video flex items-center justify-center relative">
                {camOn ? (
                  <Webcam ref={webcamRef} className="w-full h-full object-cover" mirrored audio={false} />
                ) : (
                  <div className="text-center text-slate-500">
                    <RiVideoOffLine className="text-4xl mx-auto mb-2" />
                    <p className="text-xs">Enable camera for body language analysis</p>
                  </div>
                )}
                {camOn && (
                  <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> Live
                  </div>
                )}
              </div>
            </Card>

            {/* Question Navigator */}
            <Card className="p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-slate-600">Questions</p>
                <span className="text-xs text-slate-400">{answeredCount}/{total} answered</span>
              </div>
              <div className="grid grid-cols-5 gap-1.5 mb-3">
                {questions.map((_, i) => (
                  <button key={i} onClick={() => jumpToQuestion(i)}
                    className={`h-8 rounded-lg text-xs font-bold transition-all ${
                      i === currentIndex     ? "bg-violet-600 text-white shadow-sm"
                      : answers[i]?.trim()   ? "bg-green-100 text-green-700 border border-green-200"
                      :                        "bg-slate-100 text-slate-500 hover:bg-violet-50"
                    }`}>
                    {answers[i]?.trim() && i !== currentIndex ? "✓" : i + 1}
                  </button>
                ))}
              </div>
              {/* Question preview list */}
              <div className="space-y-1.5 max-h-64 overflow-y-auto">
                {questions.map((q, i) => (
                  <button key={i} onClick={() => jumpToQuestion(i)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all flex items-start gap-2 ${
                      i === currentIndex  ? "bg-violet-100 text-violet-700 font-semibold"
                      : answers[i]?.trim() ? "bg-green-50 text-green-700"
                      :                      "bg-slate-50 text-slate-500 hover:bg-slate-100"
                    }`}>
                    <span className={`w-5 h-5 shrink-0 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 ${
                      i === currentIndex   ? "bg-violet-500 text-white"
                      : answers[i]?.trim() ? "bg-green-500 text-white"
                      :                      "bg-slate-200 text-slate-500"
                    }`}>
                      {answers[i]?.trim() ? "✓" : i + 1}
                    </span>
                    <span className="line-clamp-2 leading-tight">{q}</span>
                  </button>
                ))}
              </div>

              {/* Submit button in panel */}
              {answeredCount >= Math.ceil(total / 2) && (
                <button onClick={() => setShowConfirm(true)}
                  className="w-full mt-3 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold rounded-xl hover:from-violet-700 hover:to-indigo-700 transition flex items-center justify-center gap-2">
                  <RiCheckLine /> Submit Interview
                </button>
              )}
            </Card>
          </div>
        </div>

        {/* Submit confirmation modal */}
        <AnimatePresence>
          {showConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowConfirm(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
              >
                <h3 className="text-lg font-bold text-slate-800 mb-2">Submit Interview?</h3>
                <p className="text-sm text-slate-500 mb-4">
                  You've answered <strong>{answeredCount}</strong> of <strong>{total}</strong> questions.
                  {answeredCount < total && ` ${total - answeredCount} question(s) are unanswered.`} Gemini AI will evaluate all your answers and generate a detailed report.
                </p>
                <div className="flex gap-3">
                  <Button variant="secondary" fullWidth onClick={() => setShowConfirm(false)}>
                    Keep Answering
                  </Button>
                  <Button fullWidth loading={submitting} onClick={submitInterview} icon={<RiCheckLine />}>
                    Submit Now
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
};

export default InterviewPage;
