"use strict";
const router = require("express").Router();
const ctrl   = require("../controllers/interviewController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);
router.post("/",                        ctrl.createInterview);
router.get("/",                         ctrl.getInterviews);
router.get("/:id",                      ctrl.getInterview);
router.put("/:id/submit",               ctrl.submitInterview);
router.put("/:id/regenerate",           ctrl.regenerateQuestions);
router.post("/evaluate-answer",         ctrl.evaluateAnswer);
router.delete("/:id",                   ctrl.deleteInterview);
module.exports = router;
