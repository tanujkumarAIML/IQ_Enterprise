"use strict";
const router = require("express").Router();
const { getUserAnalytics } = require("../controllers/analyticsController");
const { protect } = require("../middleware/authMiddleware");
router.use(protect);
router.get("/", getUserAnalytics);
module.exports = router;
