"use strict";
const User = require("../models/User");
const cloudinary = require("../config/cloudinary");

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, user });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.updateProfile = async (req, res) => {
  try {
    const allowed = ["name","phone","bio","location","jobTitle","company","experience","linkedin","github","portfolio","website","skills","education","certificates","preferences"];
    const updates = {};
    allowed.forEach((k) => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });
    const user = await User.findByIdAndUpdate(req.user._id, { $set: updates }, { new: true, runValidators: true });
    res.json({ success: true, message: "Profile updated.", user });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "Upload an image." });
    const user = await User.findById(req.user._id);
    if (user.avatar?.publicId) cloudinary.uploader.destroy(user.avatar.publicId).catch(() => {});
    user.avatar = { publicId: req.file.filename, url: req.file.path };
    await user.save({ validateBeforeSave: false });
    res.json({ success: true, message: "Avatar updated.", avatar: user.avatar });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) return res.status(400).json({ success: false, message: "Both passwords required." });
    const user = await User.findById(req.user._id).select("+password");
    if (!(await user.matchPassword(oldPassword))) return res.status(400).json({ success: false, message: "Old password incorrect." });
    if (newPassword.length < 6) return res.status(400).json({ success: false, message: "New password min 6 chars." });
    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: "Password updated." });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};
