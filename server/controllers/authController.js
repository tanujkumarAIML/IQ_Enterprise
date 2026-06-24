"use strict";
const crypto = require("crypto");
const User = require("../models/User");
const { generateAccessToken, generateRefreshToken, verifyRefreshToken, setRefreshCookie } = require("../utils/jwtHelper");
const { sendOTPEmail, sendPasswordResetEmail, sendWelcomeEmail } = require("../services/emailService");
const logger = require("../utils/logger");

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();
const admin = require("../config/firebase");

const sendTokenResponse = (user, code, res, message = "Success") => {
  const accessToken  = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  setRefreshCookie(res, refreshToken);
  res.status(code).json({
    success: true, message, token: accessToken,
    user: {
      id: user._id, name: user.name, email: user.email, role: user.role,
      avatar: user.avatar, plan: user.plan, isEmailVerified: user.isEmailVerified,
    },
  });
};

// ── Register ─────────────────────────────────────────────────
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: "All fields are required." });
    if (password.length < 6)
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters." });

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(400).json({ success: false, message: "Email already registered." });

    const otp = generateOTP();
    const user = await User.create({
      name: name.trim(), email: email.toLowerCase().trim(), password,
      otp, otpExpiry: new Date(Date.now() + 10 * 60 * 1000),
    });

    sendOTPEmail(user.email, user.name, otp).catch(logger.error);
    sendTokenResponse(user, 201, res, "Account created! Please verify your email.");
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── Login ─────────────────────────────────────────────────────
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: "Email and password are required." });

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    if (!user.isActive)
      return res.status(401).json({ success: false, message: "Account deactivated. Contact support." });

    user.lastLogin  = new Date();
    user.loginCount = (user.loginCount || 0) + 1;
    await user.save({ validateBeforeSave: false });

    sendTokenResponse(user, 200, res, "Login successful.");
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── Refresh Token ─────────────────────────────────────────────
exports.refreshToken = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) return res.status(401).json({ success: false, message: "No refresh token." });

    const decoded = verifyRefreshToken(token);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ success: false, message: "User not found." });

    const accessToken = generateAccessToken(user._id);
    res.json({ success: true, token: accessToken });
  } catch {
    res.status(401).json({ success: false, message: "Invalid refresh token." });
  }
};

// ── Get Current User ──────────────────────────────────────────
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── Logout ────────────────────────────────────────────────────
exports.logout = async (req, res) => {
  res.clearCookie("refreshToken");
  res.json({ success: true, message: "Logged out successfully." });
};

// ── Verify OTP ────────────────────────────────────────────────
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase() });
    if (!user) return res.status(404).json({ success: false, message: "User not found." });
    if (user.isEmailVerified) return res.status(400).json({ success: false, message: "Email already verified." });
    if (user.otp !== otp || !user.otpExpiry || user.otpExpiry < new Date())
      return res.status(400).json({ success: false, message: "Invalid or expired OTP." });

    user.isEmailVerified = true;
    user.otp = null; user.otpExpiry = null;
    await user.save({ validateBeforeSave: false });

    sendWelcomeEmail(user.email, user.name).catch(logger.error);
    res.json({ success: true, message: "Email verified!" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── Resend OTP ────────────────────────────────────────────────
exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase() });
    if (!user) return res.status(404).json({ success: false, message: "User not found." });

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save({ validateBeforeSave: false });

    await sendOTPEmail(user.email, user.name, otp);
    res.json({ success: true, message: "OTP resent." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── Forgot Password ───────────────────────────────────────────
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase() });
    if (!user) return res.json({ success: true, message: "If this email exists, a reset link was sent." });

    const token = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");
    user.resetPasswordExpire = new Date(Date.now() + 60 * 60 * 1000);
    await user.save({ validateBeforeSave: false });

    const url = `${process.env.CLIENT_URL}/reset-password/${token}`;
    await sendPasswordResetEmail(user.email, user.name, url);
    res.json({ success: true, message: "Password reset link sent." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── Reset Password ────────────────────────────────────────────
exports.resetPassword = async (req, res) => {
  try {
    const hashed = crypto.createHash("sha256").update(req.params.token).digest("hex");
    const user = await User.findOne({
      resetPasswordToken: hashed,
      resetPasswordExpire: { $gt: new Date() },
    });
    if (!user) return res.status(400).json({ success: false, message: "Invalid or expired link." });

    user.password = req.body.password;
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;
    await user.save();

    sendTokenResponse(user, 200, res, "Password reset successful.");
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: "Firebase Token Missing",
      });
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);

    const {
      uid,
      email,
      name,
      picture,
    } = decodedToken;

    const userEmail = email.toLowerCase();
    let user = await User.findOne({

    email: userEmail,
});

    if (!user) {
      user = await User.create({
        name,
        email: userEmail,

        avatar: {
          publicId: "",
          url: picture || "",
        },

        firebaseUID: uid,

        password: Math.random().toString(36).slice(-12),

        isEmailVerified: true,
      });
    }

    if (user && !user.firebaseUID) {
  user.firebaseUID = uid;
  user.isEmailVerified = true;

  if (!user.avatar?.url && picture) {
    user.avatar = {
      publicId: "",
      url: picture,
    };
  }

  await user.save({ validateBeforeSave: false });
}

if (!user.isActive) {
  return res.status(401).json({
    success: false,
    message: "Account has been disabled.",
  });
}

    sendTokenResponse(
      user,
      200,
      res,
      "Google Login Successful"
    );

  } catch (error) {

    console.error(error);

    res.status(401).json({
      success: false,
      message: "Google Authentication Failed",
    });

  }
};