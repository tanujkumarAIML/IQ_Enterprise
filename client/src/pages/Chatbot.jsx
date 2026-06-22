import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  RiSendPlaneLine, RiRobot2Line, RiUserLine, RiAddLine,
  RiDeleteBinLine, RiBrainLine, RiCodeLine, RiFileTextLine,
  RiUserHeartLine, RiVideoLine, RiSparklingLine,
} from "react-icons/ri";

import DashboardLayout from "../components/Layout/DashboardLayout";
import { Card, Loader } from "../components/common/index.jsx";
import {
  setActiveChat, setChatHistory, addMessage,
  setChatLoading, clearChat,
} from "../redux/slices/chatSlice";
import api from "../services/api";

const CHAT_TYPES = [
  { value: "general",   label: "General",  icon: RiBrainLine,    color: "text-violet-600 bg-violet-50",   desc: "Ask anything" },
  { value: "career",    label: "Career",   icon: RiUserHeartLine,color: "text-blue-600   bg-blue-50",     desc: "Job & career advice" },
  { value: "resume",    label: "Resume",   icon: RiFileTextLine, color: "text-green-600  bg-green-50",    desc: "Resume & cover letter" },
  { value: "coding",    label: "Coding",   icon: RiCodeLine,     color: "text-orange-600 bg-orange-50",   desc: "DSA & system design" },
  { value: "interview", label: "Interview",icon: RiVideoLine,    color: "text-indigo-600 bg-indigo-50",   desc: "Interview coaching" },
  { value: "hr",        label: "HR",       icon: RiUserLine,     color: "text-pink-600   bg-pink-50",     desc: "HR & behavioral" },
];

const QUICK_STARTERS = {
  general:   ["What is InterviewIQ?", "How can I improve my profile?", "What makes a great engineer?"],
  career:    ["How do I switch from backend to ML?", "Tips for salary negotiation?", "Best skills for 2025?"],
  resume:    ["How to beat ATS systems?", "What makes a perfect resume bullet?", "Should I use a summary or objective?"],
  coding:    ["Explain binary search with code", "How to prepare for DSA in 30 days?", "Best system design resources?"],
  interview: ["Teach me the STAR method", "Most common React interview questions?", "How to answer 'Tell me about yourself'?"],
  hr:        ["Common behavioral questions at Google?", "How to explain gaps in resume?", "How to negotiate a job offer?"],
};

const MsgBubble = ({ msg }) => {
  const isUser = msg.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"} gap-2.5 items-end`}
    >
      {!isUser && (
        <div className="w-7 h-7 shrink-0 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center mb-1">
          <RiRobot2Line className="text-white text-xs" />
        </div>
      )}
      <div
        className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? "bg-gradient-to-br from-violet-600 to-indigo-600 text-white rounded-br-sm"
            : "bg-slate-100 text-slate-800 rounded-bl-sm"
        }`}
      >
        {msg.content}
      </div>
      {isUser && (
        <div className="w-7 h-7 shrink-0 rounded-full bg-slate-200 flex items-center justify-center mb-1">
          <RiUserLine className="text-slate-500 text-xs" />
        </div>
      )}
    </motion.div>
  );
};

const TypingIndicator = () => (
  <div className="flex items-end gap-2.5">
    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center">
      <RiRobot2Line className="text-white text-xs" />
    </div>
    <div className="bg-slate-100 rounded-2xl rounded-bl-sm px-4 py-3">
      <div className="flex gap-1 items-center">
        {[0, 1, 2].map((i) => (
          <span key={i} className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
    </div>
  </div>
);

const Chatbot = () => {
  const dispatch = useDispatch();
  const { activeChat, history: chatHistory, loading } = useSelector((s) => s.chat);

  const [input,    setInput]    = useState("");
  const [chatType, setChatType] = useState("general");
  const [historyLoading, setHistoryLoading] = useState(true);

  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  useEffect(() => {
    api.get("/chatbot/history")
      .then(({ data }) => dispatch(setChatHistory(data.chats || [])))
      .catch(() => {})
      .finally(() => setHistoryLoading(false));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages, loading]);

  const newChat = useCallback(() => {
    dispatch(clearChat());
    setInput("");
    inputRef.current?.focus();
  }, [dispatch]);

  const loadChat = async (id) => {
    try {
      const { data } = await api.get(`/chatbot/${id}`);
      dispatch(setActiveChat(data.chat));
      setChatType(data.chat.type || "general");
    } catch { toast.error("Could not load chat"); }
  };

  const deleteChat = async (id, e) => {
    e.stopPropagation();
    try {
      await api.delete(`/chatbot/${id}`);
      dispatch(setChatHistory(chatHistory.filter((c) => c._id !== id)));
      if (activeChat?._id === id) dispatch(clearChat());
      toast.success("Deleted");
    } catch { toast.error("Delete failed"); }
  };

  const send = async (text = input) => {
    const msg = text.trim();
    if (!msg || loading) return;
    setInput("");
    dispatch(addMessage({ role: "user", content: msg, timestamp: new Date() }));
    dispatch(setChatLoading(true));
    try {
      const { data } = await api.post("/chatbot", {
        message: msg,
        chatId: activeChat?._id,
        type: chatType,
      });
      if (!activeChat) {
        const { data: chatData } = await api.get(`/chatbot/${data.chatId}`);
        dispatch(setActiveChat(chatData.chat));
      } else {
        dispatch(addMessage({ role: "assistant", content: data.response, timestamp: new Date() }));
      }
      api.get("/chatbot/history").then(({ data: h }) => dispatch(setChatHistory(h.chats || []))).catch(() => {});
    } catch {
      dispatch(addMessage({ role: "assistant", content: "Sorry, I encountered an error. Please try again.", timestamp: new Date() }));
    } finally { dispatch(setChatLoading(false)); }
  };

  const currentType = CHAT_TYPES.find((t) => t.value === chatType) || CHAT_TYPES[0];
  const messages    = activeChat?.messages || [];

  return (
    <DashboardLayout title="AI Chatbot">
      <div className="flex h-[calc(100vh-4.5rem)] gap-4 -m-4 md:-m-6 p-4 md:p-6">
        {/* ── Sidebar ── */}
        <div className="w-60 shrink-0 hidden lg:flex flex-col gap-3">
          <button onClick={newChat}
            className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition">
            <RiAddLine className="text-lg" /> New Chat
          </button>

          {/* Chat type selector */}
          <Card className="p-3">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">Assistant Mode</p>
            <div className="space-y-1">
              {CHAT_TYPES.map(({ value, label, icon: Icon, color, desc }) => (
                <button key={value}
                  onClick={() => { setChatType(value); dispatch(clearChat()); }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2 ${
                    chatType === value ? "bg-violet-100 text-violet-700" : "text-slate-600 hover:bg-slate-100"
                  }`}>
                  <span className={`p-1.5 rounded-lg ${chatType === value ? color : "bg-slate-100 text-slate-400"}`}>
                    <Icon className="text-sm" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold leading-none">{label}</p>
                    <p className="text-xs text-slate-400 leading-none mt-0.5">{desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* History */}
          <Card className="flex-1 overflow-y-auto p-3">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">Recent Chats</p>
            {historyLoading ? <Loader size="sm" /> : chatHistory.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">No chats yet</p>
            ) : chatHistory.map((c) => (
              <div key={c._id}
                onClick={() => loadChat(c._id)}
                className={`flex items-center justify-between px-2.5 py-2 rounded-xl cursor-pointer text-xs transition group mb-1 ${
                  activeChat?._id === c._id ? "bg-violet-100 text-violet-700" : "hover:bg-slate-100 text-slate-600"
                }`}>
                <span className="truncate flex-1">{c.title || "Chat"}</span>
                <button onClick={(e) => deleteChat(c._id, e)}
                  className="opacity-0 group-hover:opacity-100 transition ml-1 text-slate-400 hover:text-red-500">
                  <RiDeleteBinLine className="text-xs" />
                </button>
              </div>
            ))}
          </Card>
        </div>

        {/* ── Chat Window ── */}
        <div className="flex-1 flex flex-col bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden min-w-0">
          {/* Header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 shrink-0">
            <div className={`p-2 rounded-xl ${currentType.color}`}>
              {React.createElement(currentType.icon, { className: "text-lg" })}
            </div>
            <div>
              <p className="font-semibold text-slate-800 text-sm">{currentType.label} Assistant</p>
              <p className="text-xs text-slate-400">{currentType.desc}</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" /> Online
              </div>
              {/* Mobile type switcher */}
              <select value={chatType} onChange={(e) => { setChatType(e.target.value); dispatch(clearChat()); }}
                className="lg:hidden text-xs border border-slate-200 rounded-lg px-2 py-1.5 outline-none text-slate-600">
                {CHAT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center py-10">
                <div className="w-16 h-16 bg-gradient-to-br from-violet-100 to-indigo-100 rounded-2xl flex items-center justify-center mb-4">
                  <RiBrainLine className="text-3xl text-violet-500" />
                </div>
                <h3 className="font-semibold text-slate-700 mb-1">Ask me anything!</h3>
                <p className="text-sm text-slate-400 mb-6 max-w-xs">
                  I'm your {currentType.label} AI assistant. {currentType.desc}.
                </p>
                <div className="flex flex-wrap justify-center gap-2 max-w-md">
                  {(QUICK_STARTERS[chatType] || []).map((q) => (
                    <button key={q} onClick={() => send(q)}
                      className="text-xs bg-violet-50 text-violet-700 border border-violet-200 px-3 py-2 rounded-full hover:bg-violet-100 transition text-left">
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <AnimatePresence>
              {messages.map((msg, i) => <MsgBubble key={i} msg={msg} />)}
            </AnimatePresence>

            {loading && <TypingIndicator />}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t border-slate-100 shrink-0">
            <div className="flex gap-2 items-end">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                placeholder={`Ask ${currentType.label} assistant… (Enter to send)`}
                rows={1}
                className="flex-1 resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-violet-400 placeholder:text-slate-400 max-h-32 overflow-y-auto leading-relaxed"
                style={{ lineHeight: 1.5 }}
              />
              <button onClick={() => send()}
                disabled={!input.trim() || loading}
                className="w-11 h-11 shrink-0 bg-gradient-to-br from-violet-600 to-indigo-600 text-white rounded-xl flex items-center justify-center hover:from-violet-700 hover:to-indigo-700 disabled:opacity-40 transition active:scale-95">
                <RiSendPlaneLine className="text-lg" />
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-2 text-center">
              Powered by Gemini AI · Shift+Enter for new line
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Chatbot;
