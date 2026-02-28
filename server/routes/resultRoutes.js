const express = require("express");
const { protect } = require("../midleware/authMiddleware");
const { getResult, getHistory } = require("../controllers/resultController");

const router = express.Router();

router.get("/:resultId", protect, getResult);
router.get("/history/all", protect, getHistory);

module.exports = router;