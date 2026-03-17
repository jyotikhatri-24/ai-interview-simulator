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

interviewSchema.index({ user: 1 });

module.exports = mongoose.model("Interview", interviewSchema);
