"use strict";
const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true, trim: true },
  category: {
    type: String,
    required: true,
    enum: ["HR","Behavioral","Technical","DSA","System Design","Java","Python","JavaScript",
           "React","Node.js","MongoDB","SQL","OS","CN","DBMS","OOP","Cloud","DevOps",
           "AI","ML","DS","Security","Aptitude","Google","Microsoft","Amazon","Meta",
           "Apple","Netflix","Adobe","Uber","Oracle","Infosys","TCS","Wipro","Accenture"],
  },
  difficulty: { type: String, enum: ["Easy","Medium","Hard"], default: "Medium" },
  answer: { type: String, default: "" },
  tags: [{ type: String }],
  company: { type: String, default: "" },
  isActive: { type: Boolean, default: true },
  usageCount: { type: Number, default: 0 },
}, { timestamps: true });

questionSchema.index({ category: 1, difficulty: 1 });
questionSchema.index({ company: 1 });

module.exports = mongoose.model("Question", questionSchema);
