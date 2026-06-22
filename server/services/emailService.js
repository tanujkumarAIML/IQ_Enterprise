"use strict";
const nodemailer = require("nodemailer");
const logger = require("../utils/logger");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

const FROM = `"${process.env.FROM_NAME || "InterviewIQ AI"}" <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`;

const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const info = await transporter.sendMail({ from: FROM, to, subject, html, text });
    logger.info(`Email sent: ${info.messageId}`);
    return info;
  } catch (err) {
    logger.error("Email error:", err.message);
    throw new Error("Failed to send email.");
  }
};

const HEADER = (subtitle) => `
<div style="background:linear-gradient(135deg,#7c3aed,#4f46e5);padding:30px;border-radius:12px 12px 0 0;text-align:center;">
  <h1 style="color:white;margin:0;font-size:26px;font-family:Arial,sans-serif;">InterviewIQ AI</h1>
  <p style="color:#c4b5fd;margin:6px 0 0;font-family:Arial,sans-serif;">${subtitle}</p>
</div>
<div style="background:#f8fafc;padding:30px;border-radius:0 0 12px 12px;font-family:Arial,sans-serif;">`;

const FOOTER = `</div>`;

const sendOTPEmail = (email, name, otp) =>
  sendEmail({
    to: email,
    subject: "InterviewIQ AI — Email Verification OTP",
    html: `<div style="max-width:600px;margin:0 auto;">
      ${HEADER("Email Verification")}
      <h2 style="color:#1e293b;">Hello, ${name}!</h2>
      <p style="color:#64748b;">Your OTP code:</p>
      <div style="background:#7c3aed;color:white;font-size:36px;font-weight:bold;letter-spacing:12px;text-align:center;padding:20px;border-radius:8px;margin:20px 0;">${otp}</div>
      <p style="color:#64748b;">Expires in <strong>10 minutes</strong>.</p>
      ${FOOTER}</div>`,
  });

const sendPasswordResetEmail = (email, name, resetUrl) =>
  sendEmail({
    to: email,
    subject: "InterviewIQ AI — Password Reset",
    html: `<div style="max-width:600px;margin:0 auto;">
      ${HEADER("Password Reset")}
      <h2 style="color:#1e293b;">Hi, ${name}!</h2>
      <p style="color:#64748b;">Click below to reset your password:</p>
      <div style="text-align:center;margin:24px 0;">
        <a href="${resetUrl}" style="background:#7c3aed;color:white;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;">Reset Password</a>
      </div>
      <p style="color:#64748b;">Link expires in <strong>1 hour</strong>.</p>
      ${FOOTER}</div>`,
  });

const sendWelcomeEmail = (email, name) =>
  sendEmail({
    to: email,
    subject: "Welcome to InterviewIQ AI! 🎉",
    html: `<div style="max-width:600px;margin:0 auto;">
      ${HEADER("Welcome!")}
      <h2 style="color:#1e293b;">Welcome aboard, ${name}! 🚀</h2>
      <p style="color:#64748b;">You're all set to start your AI-powered interview preparation journey.</p>
      <ul style="color:#64748b;">
        <li>Take AI mock interviews</li>
        <li>Analyze your resume with ATS scoring</li>
        <li>Chat with your AI career assistant</li>
        <li>Track your progress with detailed reports</li>
      </ul>
      ${FOOTER}</div>`,
  });

module.exports = { sendEmail, sendOTPEmail, sendPasswordResetEmail, sendWelcomeEmail };
