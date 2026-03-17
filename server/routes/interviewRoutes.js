const express = require("express");
const { protect } = require("../midleware/authMiddleware");
const { generateQuestions, submitAnswers, getActiveSession, saveAnswer } = require("../controllers/interviewController");

const router = express.Router();

router.get("/session", protect, getActiveSession);
router.post("/generate", protect, generateQuestions);
router.post("/answer", protect, saveAnswer);
router.post("/submit", protect, submitAnswers);

module.exports = router;