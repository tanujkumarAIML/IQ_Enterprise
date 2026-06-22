"use strict";
const { verifyAccessToken } = require("../utils/jwtHelper");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }
    if (!token) return res.status(401).json({ success: false, message: "Access denied. Please login." });

    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ success: false, message: "User not found." });
    if (!user.isActive) return res.status(401).json({ success: false, message: "Account deactivated." });

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Session expired. Please login again." });
    }
    return res.status(401).json({ success: false, message: "Invalid token." });
  }
};

const adminOnly = (req, res, next) => {
  if (!["admin","superadmin"].includes(req.user?.role)) {
    return res.status(403).json({ success: false, message: "Admins only." });
  }
  next();
};

const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user?.role)) {
    return res.status(403).json({ success: false, message: `Role '${req.user?.role}' is not authorized.` });
  }
  next();
};

module.exports = { protect, adminOnly, authorize };
