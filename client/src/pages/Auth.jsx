import { auth } from "../firebase";

import {
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm }  from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import api         from "../services/api";
import Button      from "../components/common/Button";
import { Input }   from "../components/common/index.jsx";
import { FcGoogle } from "react-icons/fc";
import {
  RiBrainLine, RiMailLine, RiLockLine, RiUserLine,
  RiEyeLine, RiEyeOffLine, RiArrowLeftLine, RiCheckLine,
  RiVideoLine, RiFileTextLine, RiRobot2Line,
} from "react-icons/ri";

const TABS = { LOGIN: "login", REGISTER: "register", FORGOT: "forgot", OTP: "otp" };

const slide = (dir = 1) => ({
  initial:   { opacity: 0, x: dir * 24 },
  animate:   { opacity: 1, x: 0 },
  exit:      { opacity: 0, x: -dir * 24 },
  transition: { duration: 0.25 },
});

const Auth = () => {
  const [tab,          setTab]          = useState(TABS.LOGIN);
  const [showPw,       setShowPw]       = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");

  const { login, register: authRegister } = useAuth();
  const navigate = useNavigate();

  const {
    register, handleSubmit, watch, reset,
    formState: { errors },
  } = useForm();

  const err = (f) => errors[f]?.message;

  const switchTab = (t) => { setTab(t); reset(); setShowPw(false); };

  /* ── Login ── */
  const onLogin = async ({ email, password }) => {
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome Back! 🎉");
      navigate("/dashboard");
    } catch (e) {
      toast.error(e.message || "Login failed. Check your credentials.");
    } finally { setLoading(false); }
  };
  const googleLogin = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const idToken = await result.user.getIdToken();
    const response = await api.post("/auth/google-login", {
      idToken,
});

localStorage.setItem(
  "token",
  response.data.token
);
toast.success("Google Login Successful");
navigate("/dashboard");

  } catch (error) {
    console.error(error);

    toast.error(error.message);
  }
};

  /* ── Register ── */
  const onRegister = async ({ name, email, password }) => {
    setLoading(true);
    try {
      await authRegister(name, email, password);
      setPendingEmail(email);
      toast.success("Account created! Check your email for OTP.");

switchTab(TABS.OTP);
    } catch (e) {
      toast.error(e.message || "Registration failed.");
    } finally { setLoading(false); }
  };

  /* ── Forgot ── */
  const onForgot = async ({ email }) => {
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      toast.success("Reset link sent to your email.");
      switchTab(TABS.LOGIN);
    } catch (e) {
      toast.error(e.message || "Failed to send reset email.");
    } finally { setLoading(false); }
  };

  /* ── OTP ── */
  const onOTP = async ({ otp }) => {
    setLoading(true);
    try {
      await api.post("/auth/verify-otp", { email: pendingEmail, otp });
      toast.success("Email verified! 🎉");
      navigate("/dashboard");
    } catch (e) {
      toast.error(e.message || "Invalid or expired OTP.");
    } finally { setLoading(false); }
  };

  const resendOTP = async () => {
    try {
      await api.post("/auth/resend-otp", { email: pendingEmail });
      toast.success("OTP resent!");
    } catch { toast.error("Could not resend OTP."); }
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Left Panel ── */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900 text-white p-12">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-violet-600 rounded-xl flex items-center justify-center">
            <RiBrainLine className="text-xl" />
          </div>
          <span className="font-bold text-xl" style={{ fontFamily: "Poppins, sans-serif" }}>
            InterviewIQ AI
          </span>
        </Link>

        <div>
          <h2 className="text-4xl font-extrabold leading-tight mb-6" style={{ fontFamily: "Poppins, sans-serif" }}>
            Ace Every Interview<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">
              with AI Confidence
            </span>
          </h2>
          <ul className="space-y-3 mb-8">
            {[
              { icon: RiVideoLine,     text: "AI-generated questions from your resume" },
              { icon: RiFileTextLine,  text: "ATS resume scoring & optimization" },
              { icon: RiRobot2Line,    text: "24/7 AI career & interview coaching" },
              { icon: RiCheckLine,     text: "Detailed PDF reports with improvement plans" },
            ].map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-slate-300 text-sm">
                <span className="w-6 h-6 bg-violet-500/30 rounded-lg flex items-center justify-center text-violet-400 shrink-0">
                  <Icon className="text-xs" />
                </span>
                {text}
              </li>
            ))}
          </ul>
          <div className="flex gap-3">
            {[
              { v: "50K+", l: "Users" },
              { v: "94%",  l: "Success" },
              { v: "4.9★", l: "Rating" },
            ].map(({ v, l }) => (
              <div key={l} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-center">
                <p className="text-lg font-bold text-violet-300">{v}</p>
                <p className="text-xs text-slate-400 mt-0.5">{l}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-slate-500 text-xs">
          © {new Date().getFullYear()} InterviewIQ AI
        </p>
      </div>

      {/* ── Right Panel ── */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-10 bg-slate-50 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link to="/" className="flex lg:hidden items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
              <RiBrainLine className="text-white" />
            </div>
            <span className="font-bold text-slate-800">InterviewIQ AI</span>
          </Link>

          <AnimatePresence mode="wait">
            {/* ── Login ── */}
            {tab === TABS.LOGIN && (
              <motion.div key="login" {...slide(1)}>
                <h1 className="text-2xl font-bold text-slate-800 mb-1">Welcome back</h1>
                <p className="text-slate-400 text-sm mb-7">Sign in to your account</p>

                <form onSubmit={handleSubmit(onLogin)} className="space-y-4">
                  <Input label="Email" type="email" placeholder="you@example.com"
                    icon={<RiMailLine />} error={err("email")}
                    {...register("email", { required: "Email is required" })} />

                  <div>
                    <Input label="Password" type={showPw ? "text" : "password"}
                      placeholder="••••••••" icon={<RiLockLine />} error={err("password")}
                      {...register("password", { required: "Password is required" })} />
                    <button type="button" onClick={() => setShowPw((s) => !s)}
                      className="mt-1 text-xs text-violet-600 hover:underline flex items-center gap-1">
                      {showPw ? <RiEyeOffLine /> : <RiEyeLine />}
                      {showPw ? "Hide" : "Show"} password
                    </button>
                  </div>

                  <div className="flex justify-end">
                    <button type="button" onClick={() => switchTab(TABS.FORGOT)}
                      className="text-xs text-violet-600 hover:underline">
                      Forgot password?
                    </button>
                  </div>

                  <Button type="submit" fullWidth loading={loading} size="lg">
                    Sign In
                  </Button>
                  <button
                  type="button"
                  onClick={googleLogin}
                  className="mt-3 w-full flex items-center justify-center gap-3 rounded-2xl border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:bg-slate-50 hover:shadow-md active:scale-[0.98]"
                  >
                    <FcGoogle className="text-2xl" />
                    <span>Continue with Google</span>
                    </button>
                </form>

                <p className="text-center text-sm text-slate-500 mt-6">
                  Don't have an account?{" "}
                  <button onClick={() => switchTab(TABS.REGISTER)}
                    className="text-violet-600 font-semibold hover:underline">
                    Create one free
                  </button>
                </p>
              </motion.div>
            )}

            {/* ── Register ── */}
            {tab === TABS.REGISTER && (
              <motion.div key="register" {...slide(1)}>
                <h1 className="text-2xl font-bold text-slate-800 mb-1">Create account</h1>
                <p className="text-slate-400 text-sm mb-7">Start your AI interview prep journey</p>

                <form onSubmit={handleSubmit(onRegister)} className="space-y-4">
                  <Input label="Full Name" placeholder="John Doe"
                    icon={<RiUserLine />} error={err("name")}
                    {...register("name", {
                      required: "Name is required",
                      minLength: { value: 2, message: "Min 2 characters" },
                    })} />
                  <Input label="Email" type="email" placeholder="you@example.com"
                    icon={<RiMailLine />} error={err("email")}
                    {...register("email", { required: "Email is required" })} />
                  <div>
                    <Input label="Password" type={showPw ? "text" : "password"}
                      placeholder="Minimum 6 characters" icon={<RiLockLine />} error={err("password")}
                      {...register("password", {
                        required: "Password is required",
                        minLength: { value: 6, message: "Minimum 6 characters" },
                      })} />
                    <button type="button" onClick={() => setShowPw((s) => !s)}
                      className="mt-1 text-xs text-violet-600 hover:underline flex items-center gap-1">
                      {showPw ? <RiEyeOffLine /> : <RiEyeLine />}
                      {showPw ? "Hide" : "Show"} password
                    </button>
                  </div>

                  <Button type="submit" fullWidth loading={loading} size="lg">
                    Create Free Account
                  </Button>
                </form>

                <p className="text-center text-sm text-slate-500 mt-6">
                  Already have an account?{" "}
                  <button onClick={() => switchTab(TABS.LOGIN)}
                    className="text-violet-600 font-semibold hover:underline">
                    Sign in
                  </button>
                </p>
              </motion.div>
            )}

            {/* ── Forgot Password ── */}
            {tab === TABS.FORGOT && (
              <motion.div key="forgot" {...slide(1)}>
                <button onClick={() => switchTab(TABS.LOGIN)}
                  className="flex items-center gap-1 text-sm text-slate-500 hover:text-violet-600 mb-6 transition">
                  <RiArrowLeftLine /> Back to login
                </button>
                <h1 className="text-2xl font-bold text-slate-800 mb-1">Reset Password</h1>
                <p className="text-slate-400 text-sm mb-7">
                  Enter your email and we'll send a reset link
                </p>
                <form onSubmit={handleSubmit(onForgot)} className="space-y-4">
                  <Input label="Email" type="email" placeholder="you@example.com"
                    icon={<RiMailLine />} error={err("email")}
                    {...register("email", { required: "Email is required" })} />
                  <Button type="submit" fullWidth loading={loading} size="lg">
                    Send Reset Link
                  </Button>
                </form>
              </motion.div>
            )}

            {/* ── OTP Verification ── */}
            {tab === TABS.OTP && (
              <motion.div key="otp" {...slide(1)}>
                <div className="w-14 h-14 bg-violet-100 rounded-2xl flex items-center justify-center text-3xl mb-6 mx-auto">
                  ✉️
                </div>
                <h1 className="text-2xl font-bold text-slate-800 mb-1 text-center">Verify Email</h1>
                <p className="text-slate-400 text-sm mb-2 text-center">
                  We sent a 6-digit OTP to
                </p>
                <p className="text-violet-600 font-semibold text-center mb-7">{pendingEmail}</p>

                <form onSubmit={handleSubmit(onOTP)} className="space-y-4">
                  <Input
                    label="OTP Code"
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    error={err("otp")}
                    className="text-center text-2xl tracking-[0.5em] font-bold"
                    {...register("otp", {
                      required: "OTP is required",
                      pattern: { value: /^\d{6}$/, message: "Must be 6 digits" },
                    })}
                  />
                  <Button type="submit" fullWidth loading={loading} size="lg" icon={<RiCheckLine />}>
                    Verify Email
                  </Button>
                </form>

                <p className="text-center text-sm text-slate-500 mt-5">
                  Didn't receive it?{" "}
                  <button onClick={resendOTP}
                    className="text-violet-600 font-semibold hover:underline">
                    Resend OTP
                  </button>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Auth;
