const express = require("express");
const { protect, admin } = require("../midleware/authMiddleware");
const { getAdminStats } = require("../controllers/adminController");

const router = express.Router();

router.get("/stats", protect, admin, getAdminStats);

module.exports = router;
