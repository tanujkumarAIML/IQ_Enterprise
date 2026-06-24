"use strict";
const router = require("express").Router();
const ctrl = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

router.post("/register",         ctrl.register);
router.post("/login",            ctrl.login);
router.post("/google-login", ctrl.googleLogin);
router.post("/logout",           protect, ctrl.logout);
router.post("/refresh",          ctrl.refreshToken);
router.get("/me",                protect, ctrl.getMe);
router.post("/verify-otp",       ctrl.verifyOTP);
router.post("/resend-otp",       ctrl.resendOTP);
router.post("/forgot-password",  ctrl.forgotPassword);
router.put("/reset-password/:token", ctrl.resetPassword);
module.exports = router;
