const mongoose = require("mongoose");

const interviewSessionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        role: {
            type: String,
            required: true,
        },
        questions: {
            type: Array,
            default: [],
        },
        answers: {
            type: Array, // Array of strings or objects matching questions
            default: [],
        },
        currentQuestionIndex: {
            type: Number,
            default: 0,
        },
        skillTest: {
            type: Object, // Stores the generated skill test if applicable
            default: null,
        },
        skillAnswer: {
            type: String,
            default: "",
        },
        status: {
            type: String,
            enum: ["in_progress", "completed"],
            default: "in_progress",
        },
        assessment: {
            type: Object, // Full assessment raw data
        },
        startedAt: {
            type: Date,
            default: Date.now,
        },
        completedAt: {
            type: Date,
        },
    },
    { timestamps: true }
);

interviewSessionSchema.index({ user: 1, status: 1 });

module.exports = mongoose.model("InterviewSession", interviewSessionSchema);
