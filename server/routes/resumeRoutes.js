const express = require("express");
const { protect } = require("../midleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const { uploadResume, getResume } = require("../controllers/resumeController");

const router = express.Router();

router.post("/upload", protect, upload.single("resume"), uploadResume);
router.get("/my-resume", protect, getResume);

module.exports = router;