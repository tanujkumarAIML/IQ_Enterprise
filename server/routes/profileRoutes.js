"use strict";
const router = require("express").Router();
const ctrl = require("../controllers/profileController");
const { protect } = require("../middleware/authMiddleware");
const { uploadAvatar } = require("../middleware/uploadMiddleware");

router.use(protect);
router.get("/",                   ctrl.getProfile);
router.put("/",                   ctrl.updateProfile);
router.post("/avatar", uploadAvatar.single("avatar"), ctrl.uploadAvatar);
router.put("/change-password",    ctrl.changePassword);
module.exports = router;
