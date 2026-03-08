const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    assessment: { type: Object },
    answers: { type: Object },
    score: Number,
    feedback: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Interview", interviewSchema);
