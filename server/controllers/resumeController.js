const pdfParse = require("pdf-parse");
const Resume = require("../models/Resume");

exports.uploadResume = async (req, res) => {
  console.log("uploadResume called; user=", req.user, "file=", req.file && req.file.originalname);
  if (!req.file) {
    console.log("no file in request");
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    console.log("starting pdf parsing");
    const parsed = await pdfParse(req.file.buffer);
    console.log("pdf parsing succeeded, text length=", parsed.text?.length);

    console.log("updating resume document for user", req.user?._id);
    const resume = await Resume.findOneAndUpdate(
      { user: req.user._id },
      {
        fileName: req.file.originalname,
        extractedText: parsed.text,
      },
      { new: true, upsert: true }
    );
    console.log("database update result", resume);

    res.status(201).json({
      message: "Resume uploaded successfully",
      resume,
    });
  } catch (err) {
    console.error("error parsing/uploading resume", err);
    console.error(err.stack);
    // if error is from pdfParse or mongoose, send back message for debugging
    const msg = err.message || "Server error during resume upload";
    res.status(500).json({ message: msg, stack: err.stack });
  }
};

exports.getResume = async (req, res) => {
  const resume = await Resume.findOne({ user: req.user._id });

  if (!resume) {
    return res.status(404).json({ message: "No resume found" });
  }

  res.json({
    ...resume.toObject(),
    filename: resume.fileName // Map for frontend Dashboard compatibility
  });
};