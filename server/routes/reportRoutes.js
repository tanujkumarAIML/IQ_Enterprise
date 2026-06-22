"use strict";
const router = require("express").Router();
const ctrl = require("../controllers/reportController");
const { protect } = require("../middleware/authMiddleware");
router.use(protect);
router.get("/",        ctrl.getAllReports);
router.get("/:id",     ctrl.getReport);
router.get("/:id/pdf", ctrl.getReportPDF);
module.exports = router;
