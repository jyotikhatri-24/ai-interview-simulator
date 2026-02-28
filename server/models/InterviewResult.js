const mongoose = require("mongoose");

const interviewResultSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        interview: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Interview",
            required: true,
        },
        score: {
            type: Number,
            required: true,
        },
        feedback: {
            type: String,
            required: true,
        },
        strengths: [String],
        weaknesses: [String],
    },
    { timestamps: true }
);

module.exports = mongoose.model("InterviewResult", interviewResultSchema);
