const pdfParse = require("pdf-parse");
const Resume = require("../models/Resume");

exports.uploadResume = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const parsed = await pdfParse(req.file.buffer);

  const resume = await Resume.findOneAndUpdate(
    { user: req.user._id },
    {
      fileName: req.file.originalname,
      extractedText: parsed.text,
    },
    { new: true, upsert: true }
  );

  res.status(201).json({
    message: "Resume uploaded successfully",
    resume,
  });
};

exports.getResume = async (req, res) => {
  const resume = await Resume.findOne({ user: req.user._id });

  if (!resume) {
    return res.status(404).json({ message: "No resume found" });
  }

  res.json(resume);
};