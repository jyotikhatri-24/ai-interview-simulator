const express = require("express");
const { protect } = require("../midleware/authMiddleware");
const { getUserProfile, getUserInterviews } = require("../controllers/userController");

const router = express.Router();

// GET /api/users/profile
router.get("/profile", protect, getUserProfile);

// GET /api/users/interviews
router.get("/interviews", protect, getUserInterviews);

module.exports = router;