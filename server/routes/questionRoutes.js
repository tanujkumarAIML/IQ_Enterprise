"use strict";
const router = require("express").Router();
const { generateQuestions, getCategories } = require("../controllers/questionController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);
router.get("/generate",   generateQuestions);
router.get("/categories", getCategories);
module.exports = router;
