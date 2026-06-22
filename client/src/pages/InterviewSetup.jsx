import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import {
  RiVideoLine, RiCodeLine, RiUserHeartLine, RiCpuLine,
  RiBuilding4Line, RiSparklingLine, RiBrainLine,
  RiFileTextLine, RiCheckLine, RiArrowRightLine,
} from "react-icons/ri";
import DashboardLayout from "../components/Layout/DashboardLayout";
import Button           from "../components/common/Button";
import { Input, Card }  from "../components/common/index.jsx";
import { setInterview, setStatus } from "../redux/slices/interviewSlice";
import api from "../services/api";

const TYPES = [
  { value: "Mixed",         label: "Mixed",         icon: RiSparklingLine,  desc: "Balanced: Technical + HR" },
  { value: "Technical",     label: "Technical",     icon: RiCodeLine,       desc: "Concepts, debugging, code" },
  { value: "HR",            label: "HR",            icon: RiUserHeartLine,  desc: "Culture fit & motivation" },
  { value: "Behavioral",    label: "Behavioral",    icon: RiVideoLine,      desc: "STAR method questions" },
  { value: "System Design", label: "System Design", icon: RiCpuLine,        desc: "Architecture & scale" },
  { value: "DSA",           label: "DSA",           icon: RiBrainLine,      desc: "Algorithms & data structures" },
];

const COMPANIES = [
  "Google","Amazon","Microsoft","Meta","Apple","Netflix","Adobe","Uber",
  "Oracle","Infosys","TCS","Wipro","Accenture","Cognizant","Capgemini","IBM",
];

const DIFFICULTIES = [
  { value: "Easy",   label: "Easy",   color: "border-green-400 bg-green-50 text-green-700",   desc: "Fresher / Entry" },
  { value: "Medium", label: "Medium", color: "border-yellow-400 bg-yellow-50 text-yellow-700", desc: "Mid-level" },
  { value: "Hard",   label: "Hard",   color: "border-red-400 bg-red-50 text-red-700",         desc: "Senior / Lead" },
];

const InterviewSetup = () => {
  const [selectedType,  setSelectedType]  = useState("Mixed");
  const [difficulty,    setDifficulty]    = useState("Medium");
  const [loading,       setLoading]       = useState(false);
  const [hasResume,     setHasResume]     = useState(false);
  const [resumeData,    setResumeData]    = useState(null);
  const [questionCount, setQuestionCount] = useState(10);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { jobRole: "", experience: 0, company: "" },
  });

  const dispatch  = useDispatch();
  const navigate  = useNavigate();

  // Check if user has uploaded resume
  useEffect(() => {
    api.get("/resume")
      .then(({ data }) => {
        if (data.resume) {
          setHasResume(true);
          setResumeData(data.resume);
        }
      })
      .catch(() => {});
  }, []);

  const onSubmit = async ({ jobRole, experience, company }) => {
    setLoading(true);
    try {
      const { data } = await api.post("/interviews", {
        jobRole,
        experience:    Number(experience),
        interviewType: selectedType,
        difficulty,
        company,
        questionCount,
        voiceEnabled: true,
        videoEnabled: true,
      });

      dispatch(setInterview(data.interview));
      dispatch(setStatus("active"));

      toast.success(
        `${data.interview.questions.length} questions generated${data.meta?.resumeUsed ? " (resume-personalized) 🎯" : ""}`
      );
      navigate(`/interview/${data.interview._id}`);
    } catch (err) {
      toast.error(err.message || "Failed to generate questions. Check GEMINI_API_KEY.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="New Interview">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-2xl font-bold text-slate-800 mb-1">Setup Your AI Interview</h2>
          <p className="text-slate-400 text-sm mb-6">
            Gemini AI will generate personalized questions based on your profile
            {hasResume ? " and uploaded resume" : ""}.
          </p>

          {/* Resume Status Banner */}
          <div className={`flex items-center gap-3 p-4 rounded-2xl mb-6 border ${
            hasResume
              ? "bg-green-50 border-green-200 text-green-700"
              : "bg-amber-50 border-amber-200 text-amber-700"
          }`}>
            <RiFileTextLine className="text-xl shrink-0" />
            <div className="flex-1">
              {hasResume ? (
                <>
                  <p className="text-sm font-semibold flex items-center gap-1">
                    <RiCheckLine /> Resume Loaded — Questions will be personalized!
                  </p>
                  <p className="text-xs mt-0.5 opacity-70">
                    {resumeData?.fileName} · ATS Score: {resumeData?.atsScore || "—"}%
                    {(resumeData?.extractedSkills || []).length > 0 && ` · ${resumeData.extractedSkills.length} skills detected`}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm font-semibold">No Resume Uploaded</p>
                  <p className="text-xs mt-0.5 opacity-70">Upload your resume for role-specific, personalized questions</p>
                </>
              )}
            </div>
            {!hasResume && (
              <button
                onClick={() => navigate("/resume")}
                className="text-xs font-semibold bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-lg transition"
              >
                Upload Resume →
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Job Details */}
            <Card className="p-5 space-y-4">
              <h3 className="font-semibold text-slate-700">Job Details</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="Target Job Role *"
                  placeholder="e.g. Senior React Developer, ML Engineer"
                  error={errors.jobRole?.message}
                  {...register("jobRole", { required: "Job role is required" })}
                />
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1.5">Years of Experience</label>
                  <select {...register("experience")}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-400">
                    {[0,1,2,3,4,5,6,7,8,10,12,15,20].map((y) => (
                      <option key={y} value={y}>{y === 0 ? "Fresher (0 years)" : `${y}+ years`}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1.5">Target Company (Optional)</label>
                  <select {...register("company")}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-400">
                    <option value="">Any / General</option>
                    {COMPANIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1.5">
                    Number of Questions: <span className="text-violet-600 font-bold">{questionCount}</span>
                  </label>
                  <input type="range" min={5} max={20} step={5}
                    value={questionCount}
                    onChange={(e) => setQuestionCount(Number(e.target.value))}
                    className="w-full accent-violet-600 mt-2" />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>5 (Quick)</span><span>10 (Standard)</span><span>15</span><span>20 (Full)</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Interview Type */}
            <Card className="p-5">
              <h3 className="font-semibold text-slate-700 mb-4">Interview Type</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {TYPES.map(({ value, label, icon: Icon, desc }) => (
                  <button key={value} type="button" onClick={() => setSelectedType(value)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      selectedType === value
                        ? "border-violet-500 bg-violet-50 shadow-sm"
                        : "border-slate-200 hover:border-violet-200 hover:bg-slate-50"
                    }`}>
                    <Icon className={`text-2xl mb-2 ${selectedType === value ? "text-violet-600" : "text-slate-400"}`} />
                    <p className={`font-semibold text-sm ${selectedType === value ? "text-violet-700" : "text-slate-700"}`}>{label}</p>
                    <p className="text-xs text-slate-400 mt-0.5 leading-tight">{desc}</p>
                  </button>
                ))}
              </div>
            </Card>

            {/* Difficulty */}
            <Card className="p-5">
              <h3 className="font-semibold text-slate-700 mb-4">Difficulty Level</h3>
              <div className="grid grid-cols-3 gap-3">
                {DIFFICULTIES.map(({ value, label, color, desc }) => (
                  <button key={value} type="button" onClick={() => setDifficulty(value)}
                    className={`py-4 rounded-xl border-2 font-semibold text-sm transition-all ${
                      difficulty === value ? color : "border-slate-200 text-slate-500 hover:border-slate-300"
                    }`}>
                    <span className="block">{label}</span>
                    <span className="text-xs font-normal opacity-70">{desc}</span>
                  </button>
                ))}
              </div>
            </Card>

            {/* AI Info box */}
            <div className="flex items-start gap-3 bg-violet-50 border border-violet-100 rounded-2xl p-4">
              <RiSparklingLine className="text-violet-500 text-xl shrink-0 mt-0.5" />
              <div className="text-sm text-violet-700">
                <p className="font-semibold mb-1">Powered by Gemini AI</p>
                <p className="text-xs text-violet-600 leading-relaxed">
                  {hasResume
                    ? `Questions will be tailored to your resume skills and projects for the ${selectedType} interview. No two sessions are alike.`
                    : `Gemini will generate ${questionCount} unique ${difficulty} ${selectedType} questions for your role. Upload your resume for even more personalized questions.`}
                </p>
              </div>
            </div>

            <Button type="submit" fullWidth size="xl" loading={loading}
              icon={loading ? null : <RiArrowRightLine />}>
              {loading
                ? "AI Generating Questions…"
                : `Start Interview · ${questionCount} Questions`}
            </Button>
          </form>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default InterviewSetup;
