const express = require("express");
const router = express.Router();
const { protect } = require("../midleware/authMiddleware");
const { executeCode } = require("../controllers/codeExecutionController");

router.post("/", protect, executeCode);

module.exports = router;
