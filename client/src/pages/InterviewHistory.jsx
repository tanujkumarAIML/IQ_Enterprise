import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  RiSearchLine, RiDeleteBinLine, RiFileChartLine,
  RiVideoLine, RiFilterLine,
} from "react-icons/ri";
import toast from "react-hot-toast";
import DashboardLayout from "../components/Layout/DashboardLayout";
import { Card, Loader, Badge, EmptyState } from "../components/common/index.jsx";
import api from "../services/api";

const scoreColor = (s) => s >= 75 ? "text-green-600" : s >= 55 ? "text-yellow-600" : "text-red-500";
const fmtDate    = (d) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
const fmtDur     = (s) => s > 0 ? `${Math.round(s / 60)}m` : "—";

const InterviewHistory = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState("");
  const [filter,     setFilter]     = useState("all");
  const [page,       setPage]       = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const load = async (p = 1) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/interviews?page=${p}&limit=10`);
      setInterviews(data.interviews || []);
      setTotalPages(data.pages || 1);
      setPage(p);
    } catch { toast.error("Failed to load interviews"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const deleteInterview = async (id) => {
    if (!window.confirm("Delete this interview?")) return;
    try {
      await api.delete(`/interviews/${id}`);
      setInterviews((p) => p.filter((iv) => iv._id !== id));
      toast.success("Deleted");
    } catch { toast.error("Delete failed"); }
  };

  const filtered = interviews.filter((iv) => {
    const matchSearch = iv.jobRole.toLowerCase().includes(search.toLowerCase()) || iv.interviewType.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || iv.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <DashboardLayout title="Interview History">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-slate-800">Interview History</h2>
          <Link to="/interview" className="flex items-center gap-2 bg-violet-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-violet-700 transition">
            <RiVideoLine /> New Interview
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by role or type…"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-violet-400 bg-white" />
          </div>
          <div className="flex items-center gap-1">
            <RiFilterLine className="text-slate-400 text-lg shrink-0" />
            {["all","Completed","In Progress","Pending"].map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition ${filter === f ? "bg-violet-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-violet-50"}`}>
                {f === "all" ? "All" : f}
              </button>
            ))}
          </div>
        </div>

        {loading ? <Loader text="Loading interviews…" /> : filtered.length === 0 ? (
          <Card>
            <EmptyState icon={RiVideoLine} title="No interviews found"
              description={search ? "Try a different search term" : "Start your first AI mock interview now!"}
              action={<Link to="/interview" className="bg-violet-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-violet-700 transition">Start Interview</Link>} />
          </Card>
        ) : (
          <div className="space-y-3">
            {filtered.map((iv) => (
              <Card key={iv._id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="font-semibold text-slate-800">{iv.jobRole}</p>
                      {iv.company && <Badge color="blue">{iv.company}</Badge>}
                      <Badge color={iv.difficulty === "Hard" ? "red" : iv.difficulty === "Medium" ? "yellow" : "green"}>{iv.difficulty}</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 flex-wrap">
                      <span>{iv.interviewType}</span>
                      <span>·</span>
                      <span>{fmtDate(iv.createdAt)}</span>
                      {iv.duration > 0 && <><span>·</span><span>⏱ {fmtDur(iv.duration)}</span></>}
                      {iv.questions?.length > 0 && <><span>·</span><span>{iv.questions.length} questions</span></>}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 ml-3 shrink-0">
                    {iv.status === "Completed" && (
                      <span className={`text-xl font-bold ${scoreColor(iv.overallScore)}`}>{iv.overallScore}%</span>
                    )}
                    <Badge color={iv.status === "Completed" ? "green" : iv.status === "In Progress" ? "violet" : "gray"}>
                      {iv.status}
                    </Badge>
                    {iv.status === "Completed" && (
                      <Link to={`/report/${iv._id}`} className="flex items-center gap-1 text-xs text-violet-600 hover:underline font-semibold">
                        <RiFileChartLine /> Report
                      </Link>
                    )}
                    {iv.status === "In Progress" && (
                      <Link to={`/interview/${iv._id}`} className="flex items-center gap-1 text-xs text-indigo-600 hover:underline font-semibold">
                        <RiVideoLine /> Resume
                      </Link>
                    )}
                    <button onClick={() => deleteInterview(iv._id)} className="text-slate-300 hover:text-red-500 transition" title="Delete">
                      <RiDeleteBinLine />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => load(p)}
                className={`w-8 h-8 rounded-lg text-sm font-semibold transition ${p === page ? "bg-violet-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-violet-50"}`}>
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default InterviewHistory;
