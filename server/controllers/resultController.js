const Interview = require("../models/Interview");

const InterviewResult = require("../models/InterviewResult");

exports.getResult = async (req, res) => {
  try {
    const result = await InterviewResult.findById(req.params.resultId)
      .populate("interview")
      .populate("user", "name email");

    if (!result) {
      return res.status(404).json({ message: "Result not found" });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const results = await InterviewResult.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("interview");

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};