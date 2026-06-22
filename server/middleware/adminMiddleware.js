"use strict";
const adminGuard = (req, res, next) => {
  if (!["admin","superadmin"].includes(req.user?.role)) {
    return res.status(403).json({ success: false, message: "Admin access required." });
  }
  next();
};
module.exports = { adminGuard };
