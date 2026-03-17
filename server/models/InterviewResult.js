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
        evaluation: {
            type: Object,
            required: true,
        },
    },
    { timestamps: true }
);

interviewResultSchema.index({ user: 1 });
interviewResultSchema.index({ createdAt: -1 });

module.exports = mongoose.model("InterviewResult", interviewResultSchema);
