"use strict";
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name:  { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6, select: false },
  role: { type: String, enum: ["superadmin","admin","hr","recruiter","premium","user","guest"], default: "user" },
  avatar: { publicId: { type: String, default: "" }, url: { type: String, default: "" } },
  phone: { type: String, default: "" },
  bio: { type: String, default: "", maxlength: 600 },
  location: { type: String, default: "" },
  jobTitle: { type: String, default: "" },
  company: { type: String, default: "" },
  experience: { type: Number, default: 0 },
  linkedin: { type: String, default: "" },
  github: { type: String, default: "" },
  portfolio: { type: String, default: "" },
  skills: [{ type: String }],
  education: [{ degree: String, institution: String, year: String, grade: String }],
  certificates: [{ title: String, issuer: String, year: String, url: String }],
  isEmailVerified: { type: Boolean, default: false },
  otp: { type: String, default: null },
  otpExpiry: { type: Date, default: null },
  resetPasswordToken: { type: String, default: null },
  resetPasswordExpire: { type: Date, default: null },
  refreshToken: { type: String, default: null, select: false },
  totalInterviews: { type: Number, default: 0 },
  completedInterviews: { type: Number, default: 0 },
  avgScore: { type: Number, default: 0 },
  bestScore: { type: Number, default: 0 },
  plan: { type: String, enum: ["free","pro","enterprise"], default: "free" },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date, default: null },
  loginCount: { type: Number, default: 0 },
  preferences: {
    darkMode: { type: Boolean, default: false },
    notifications: { type: Boolean, default: true },
    language: { type: String, default: "en" },
  },
}, { timestamps: true });

userSchema.index({ email: 1 });
userSchema.index({ role: 1 });

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.password);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  ["password","otp","otpExpiry","resetPasswordToken","resetPasswordExpire","refreshToken"].forEach(k => delete obj[k]);
  return obj;
};

module.exports = mongoose.model("User", userSchema);
