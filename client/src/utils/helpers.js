/**
 * InterviewIQ — Shared utility helpers
 */

/** Format seconds → MM:SS */
export const formatTime = (seconds = 0) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

/** Format duration nicely: 90s → "1m 30s" */
export const formatDuration = (seconds = 0) => {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
};

/** Format ISO date → human readable */
export const formatDate = (date, opts = {}) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric", ...opts,
  });

/** Format ISO date → short "12 Jan" */
export const formatShortDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short" });

/** Score color class */
export const getScoreColor = (score) =>
  score >= 80 ? "text-green-600" : score >= 60 ? "text-yellow-600" : "text-red-500";

/** Score hex color */
export const getScoreHex = (score) =>
  score >= 80 ? "#16a34a" : score >= 60 ? "#d97706" : "#dc2626";

/** Score label */
export const getScoreLabel = (score) =>
  score >= 90 ? "Outstanding" :
  score >= 80 ? "Excellent"   :
  score >= 70 ? "Good"        :
  score >= 60 ? "Average"     :
  score >= 50 ? "Below Average" : "Needs Work";

/** Badge color by status */
export const getStatusColor = (status) =>
  status === "Completed"  ? "green"  :
  status === "In Progress"? "violet" :
  status === "Pending"    ? "yellow" : "gray";

/** Truncate text */
export const truncate = (str = "", n = 80) =>
  str.length > n ? str.slice(0, n) + "…" : str;

/** Capitalize first letter */
export const capitalize = (str = "") =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

/** Calculate word count */
export const wordCount = (str = "") =>
  str.trim().split(/\s+/).filter(Boolean).length;

/** Copy text to clipboard */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

/** Difficulty badge color */
export const getDifficultyColor = (d) =>
  d === "Hard" ? "red" : d === "Medium" ? "yellow" : "green";
