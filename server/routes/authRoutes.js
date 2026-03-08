const express = require("express");
const { registerUser, loginUser, resetPassword } = require("../controllers/authController");

const router = express.Router();

// POST /api/auth/register
router.post("/register", registerUser);

// POST /api/auth/login
router.post("/login", loginUser);

// POST /api/auth/reset-password
router.post("/reset-password", resetPassword);

module.exports = router;