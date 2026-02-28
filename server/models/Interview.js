const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    questions: [String],
    answers: [String],
    score: Number,
    feedback: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Interview", interviewSchema);
