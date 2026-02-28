const express = require("express");
const { protect } = require("../midleware/authMiddleware");
const { generateQuestions, submitAnswers } = require("../controllers/interviewController");

const router = express.Router();

router.post("/generate", protect, generateQuestions);
router.post("/submit", protect, submitAnswers);

module.exports = router;