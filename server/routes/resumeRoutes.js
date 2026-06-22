"use strict";
const router = require("express").Router();
const { uploadResume: upl, analyzeResume: analyze, getResume, deleteResume } = require("../controllers/resumeController");
const { protect } = require("../middleware/authMiddleware");
const { uploadResume } = require("../middleware/uploadMiddleware");

router.use(protect);
router.post("/upload",  uploadResume.single("resume"), upl);
router.post("/analyze", analyze);
router.get("/",         getResume);
router.delete("/",      deleteResume);
module.exports = router;
