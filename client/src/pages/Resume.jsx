import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  RiUploadCloud2Line, RiFileTextLine, RiDeleteBinLine,
  RiDownloadLine, RiCheckLine, RiCloseLine, RiSparklingLine,
  RiRefreshLine, RiBrainLine, RiLightbulbLine,
} from "react-icons/ri";

import DashboardLayout from "../components/Layout/DashboardLayout";
import ScoreCircle     from "../components/common/ScoreCircle";
import { Card, Loader, Badge } from "../components/common/index.jsx";
import Button from "../components/common/Button";
import { setResume, setAnalysis, setUploading, setAnalyzing } from "../redux/slices/resumeSlice";
import api from "../services/api";

/* ── PDF text extraction via pdf.js CDN ── */
const loadPDFJS = () =>
  new Promise((resolve) => {
    if (window.__pdfjs_loaded) { resolve(window.pdfjsLib); return; }
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    s.onload = () => {
      window.__pdfjs_loaded = true;
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
      resolve(window.pdfjsLib);
    };
    s.onerror = () => resolve(null);
    document.head.appendChild(s);
  });

const extractPDFText = async (file) => {
  try {
    const pdfjsLib = await loadPDFJS();
    if (!pdfjsLib) return "";
    const buf = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((item) => item.str).join(" ") + "\n";
    }
    return text.trim();
  } catch { return ""; }
};

const Resume = () => {
  const dispatch = useDispatch();
  const { data: resume, analysis, uploading, analyzing } = useSelector((s) => s.resume);

  const [dragOver,   setDragOver]   = useState(false);
  const [jobRole,    setJobRole]    = useState("");
  const [tab,        setTab]        = useState("analysis"); // analysis | coverLetter
  const [coverLetter, setCoverLetter] = useState("");
  const [genCover,   setGenCover]   = useState(false);
  const fileRef = useRef(null);

  // Load existing resume on mount
  useEffect(() => {
    api.get("/resume")
      .then(({ data }) => {
        dispatch(setResume(data.resume));
        if (data.resume?.analyzed) dispatch(setAnalysis(data.resume));
      })
      .catch(() => {});
  }, []);

  const handleFile = async (file) => {
    if (!file) return;
    const allowed = ["application/pdf", "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowed.includes(file.type)) { toast.error("Only PDF or DOCX files allowed"); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("File must be under 5MB"); return; }

    dispatch(setUploading(true));
    try {
      // Extract text client-side first (PDF only)
      let extractedText = "";
      if (file.type === "application/pdf") {
        extractedText = await extractPDFText(file);
      }

      const form = new FormData();
      form.append("resume", file);
      const { data: up } = await api.post("/resume/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Attach extracted text to resume obj
      const resumeWithText = { ...up.resume, _localText: extractedText };
      dispatch(setResume(resumeWithText));
      toast.success("Resume uploaded! Click Analyze to get AI insights.");
    } catch (err) {
      toast.error(err.message || "Upload failed");
    } finally { dispatch(setUploading(false)); }
  };

  const analyze = async () => {
    if (!resume) { toast.error("Upload a resume first."); return; }
    dispatch(setAnalyzing(true));
    try {
      const text = resume._localText || resume.extractedText || "";
      const { data } = await api.post("/resume/analyze", {
        resumeText: text,
        jobRole: jobRole || "",
      });
      dispatch(setResume({ ...resume, ...data.resume }));
      dispatch(setAnalysis(data.analysis));
      toast.success("Resume analyzed by Gemini AI!");
    } catch (err) {
      toast.error(err.message || "Analysis failed");
    } finally { dispatch(setAnalyzing(false)); }
  };

  const generateCoverLetter = async () => {
    if (!resume) return;
    setGenCover(true);
    try {
      const text = resume._localText || resume.extractedText || "";
      const { data } = await api.post("/ai/query", {
        prompt: `You are a professional cover letter writer.\n\nWrite a compelling, personalized 3-paragraph cover letter based on this resume for the role of ${jobRole || "Software Engineer"}.\n\nResume:\n"""\n${text.slice(0, 2500)}\n"""\n\nRequirements:\n- Tailored to ${jobRole || "the target role"}\n- References specific achievements from the resume\n- Professional and confident tone\n- 250-300 words\n- End with a strong call to action\n\nReturn only the cover letter text.`,
      });
      setCoverLetter(data.response || "");
      setTab("coverLetter");
      toast.success("Cover letter generated!");
    } catch { toast.error("Cover letter generation failed"); }
    finally { setGenCover(false); }
  };

  const deleteResume = async () => {
    if (!window.confirm("Delete your resume?")) return;
    try {
      await api.delete("/resume");
      dispatch(setResume(null));
      dispatch(setAnalysis(null));
      setCoverLetter("");
      toast.success("Resume deleted.");
    } catch { toast.error("Delete failed"); }
  };

  const onDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const a = analysis || (resume?.analyzed ? resume : null);

  return (
    <DashboardLayout title="Resume Analyzer">
      <div className="max-w-4xl mx-auto space-y-5">
        <div>
          <h2 className="text-xl font-bold text-slate-800">AI Resume Analyzer</h2>
          <p className="text-slate-400 text-sm mt-1">Upload your resume → Get ATS score, keyword analysis, grammar check & personalized suggestions powered by Gemini AI</p>
        </div>

        {/* Upload Zone */}
        {!resume ? (
          <div
            onDrop={onDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onClick={() => fileRef.current.click()}
            className={`border-2 border-dashed rounded-2xl p-14 text-center cursor-pointer transition-all ${
              dragOver ? "border-violet-500 bg-violet-50" : "border-slate-200 hover:border-violet-300 hover:bg-slate-50"
            }`}
          >
            <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" className="hidden"
              onChange={(e) => handleFile(e.target.files[0])} />
            {uploading
              ? <Loader size="md" text="Uploading…" />
              : (
                <>
                  <RiUploadCloud2Line className="text-6xl text-slate-300 mx-auto mb-4" />
                  <p className="font-semibold text-slate-600 mb-1">Drag & drop your resume here</p>
                  <p className="text-sm text-slate-400 mb-4">PDF or DOCX · Max 5 MB</p>
                  <Button variant="outline" size="sm">Browse File</Button>
                </>
              )}
          </div>
        ) : (
          /* Uploaded File Card */
          <Card className="p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center text-violet-600 text-xl shrink-0">
                <RiFileTextLine />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-slate-700 text-sm truncate">{resume.fileName}</p>
                <p className="text-xs text-slate-400">
                  {resume.fileType?.toUpperCase()}
                  {resume.fileSize ? ` · ${(resume.fileSize / 1024).toFixed(0)} KB` : ""}
                  {resume.analyzed && " · ✅ Analyzed"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {resume.fileUrl && (
                <a href={resume.fileUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-violet-600 hover:underline font-semibold">
                  <RiDownloadLine /> View
                </a>
              )}
              <button onClick={() => fileRef.current.click()}
                className="text-xs text-slate-400 hover:text-violet-600 transition font-medium">
                Replace
              </button>
              <button onClick={deleteResume} className="text-slate-300 hover:text-red-500 transition">
                <RiDeleteBinLine />
              </button>
              <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" className="hidden"
                onChange={(e) => handleFile(e.target.files[0])} />
            </div>
          </Card>
        )}

        {/* Analysis Controls */}
        {resume && (
          <Card className="p-5">
            <div className="flex flex-col sm:flex-row gap-3 items-end">
              <div className="flex-1">
                <label className="text-sm font-medium text-slate-700 mb-1 block">Target Job Role (Optional)</label>
                <input value={jobRole} onChange={(e) => setJobRole(e.target.value)}
                  placeholder="e.g. Backend Developer, ML Engineer, Data Scientist"
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-400" />
              </div>
              <div className="flex gap-2">
                <Button onClick={analyze} loading={analyzing} icon={<RiSparklingLine />}>
                  {analyzing ? "Analyzing…" : "Analyze with AI"}
                </Button>
                {a && (
                  <Button variant="secondary" onClick={generateCoverLetter} loading={genCover}
                    icon={<RiLightbulbLine />}>
                    Cover Letter
                  </Button>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Results Tabs */}
        {(a || coverLetter) && (
          <div className="flex gap-2 border-b border-slate-200 pb-3">
            <button onClick={() => setTab("analysis")}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${tab === "analysis" ? "bg-violet-100 text-violet-700" : "text-slate-500 hover:bg-slate-100"}`}>
              Analysis Results
            </button>
            {coverLetter && (
              <button onClick={() => setTab("coverLetter")}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${tab === "coverLetter" ? "bg-violet-100 text-violet-700" : "text-slate-500 hover:bg-slate-100"}`}>
                Cover Letter
              </button>
            )}
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* Analysis Results */}
          {tab === "analysis" && a?.analyzed && (
            <motion.div key="analysis" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
              {/* Score Circles */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-semibold text-slate-700">ATS Score Breakdown</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Overall Rating:</span>
                    <span className="text-lg font-bold text-violet-700">{a.overallRating || 0}/10</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                  <ScoreCircle score={a.atsScore        || 0} label="ATS Score"   size="lg" />
                  <ScoreCircle score={a.keywordScore    || 0} label="Keywords"    />
                  <ScoreCircle score={a.grammarScore    || 0} label="Grammar"     />
                  <ScoreCircle score={a.formattingScore || 0} label="Formatting"  />
                </div>
              </Card>

              {/* Skills */}
              <div className="grid md:grid-cols-2 gap-5">
                <Card className="p-5">
                  <h3 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <RiCheckLine className="text-green-500" /> Detected Skills ({(a.extractedSkills || []).length})
                  </h3>
                  {(a.extractedSkills || []).length === 0
                    ? <p className="text-sm text-slate-400">No skills detected</p>
                    : (
                      <div className="flex flex-wrap gap-2">
                        {(a.extractedSkills || []).map((s) => (
                          <Badge key={s} color="green">{s}</Badge>
                        ))}
                      </div>
                    )}
                </Card>
                <Card className="p-5">
                  <h3 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <RiCloseLine className="text-red-500" /> Missing Skills
                  </h3>
                  {(a.missingSkills || []).length === 0
                    ? <p className="text-sm text-slate-400">No missing skills detected 🎉</p>
                    : (
                      <div className="flex flex-wrap gap-2">
                        {(a.missingSkills || []).map((s) => (
                          <Badge key={s} color="red">{s}</Badge>
                        ))}
                      </div>
                    )}
                </Card>
              </div>

              {/* Strengths & Improvements */}
              <div className="grid md:grid-cols-2 gap-5">
                <Card className="p-5">
                  <h3 className="font-semibold text-slate-700 mb-3">✅ Strengths</h3>
                  <ul className="space-y-2">
                    {(a.strengths || []).map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                        <span className="w-5 h-5 shrink-0 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs mt-0.5">✓</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </Card>
                <Card className="p-5">
                  <h3 className="font-semibold text-slate-700 mb-3">🔧 Improvements</h3>
                  <ul className="space-y-2">
                    {(a.improvements || []).map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                        <span className="w-5 h-5 shrink-0 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center text-xs mt-0.5">{i + 1}</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>

              {/* AI Suggestions */}
              {(a.suggestions || []).length > 0 && (
                <Card className="p-5 bg-violet-50 border-violet-100">
                  <h3 className="font-semibold text-violet-700 mb-3 flex items-center gap-2">
                    <RiSparklingLine /> Gemini AI Suggestions
                  </h3>
                  <ul className="space-y-2">
                    {a.suggestions.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                        <span className="w-5 h-5 shrink-0 bg-violet-200 text-violet-700 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">{i + 1}</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </Card>
              )}

              {/* LinkedIn Tips */}
              {(a.linkedinTips || []).length > 0 && (
                <Card className="p-5">
                  <h3 className="font-semibold text-slate-700 mb-3">💼 LinkedIn Optimization Tips</h3>
                  <ul className="space-y-2">
                    {a.linkedinTips.map((t, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                        <span className="text-blue-500 shrink-0 mt-0.5">→</span>{t}
                      </li>
                    ))}
                  </ul>
                </Card>
              )}

              {/* Grammar Issues */}
              {(a.grammarIssues || []).length > 0 && (
                <Card className="p-5">
                  <h3 className="font-semibold text-slate-700 mb-3">⚠️ Grammar Issues</h3>
                  <ul className="space-y-1.5">
                    {a.grammarIssues.map((g, i) => (
                      <li key={i} className="text-sm text-red-600 flex items-start gap-2">
                        <span className="text-red-400 shrink-0">•</span>{g}
                      </li>
                    ))}
                  </ul>
                </Card>
              )}
            </motion.div>
          )}

          {/* Cover Letter Tab */}
          {tab === "coverLetter" && coverLetter && (
            <motion.div key="cover" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                    <RiBrainLine className="text-violet-500" /> AI-Generated Cover Letter
                  </h3>
                  <div className="flex gap-2">
                    <button onClick={() => { navigator.clipboard.writeText(coverLetter); toast.success("Copied!"); }}
                      className="text-xs text-violet-600 hover:underline font-semibold">Copy</button>
                    <button onClick={generateCoverLetter}
                      className="text-xs text-slate-400 hover:text-violet-600 flex items-center gap-0.5 font-medium">
                      <RiRefreshLine /> Regenerate
                    </button>
                  </div>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 text-sm text-slate-700 leading-7 whitespace-pre-wrap font-serif border border-slate-200">
                  {coverLetter}
                </div>
                <p className="text-xs text-slate-400 mt-3">✨ Customized for {jobRole || "your target role"} based on your resume</p>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
};

export default Resume;
