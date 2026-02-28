const User = require("../models/User");
const Interview = require("../models/Interview");
const InterviewResult = require("../models/InterviewResult");

exports.getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalInterviews = await Interview.countDocuments();
        const totalResults = await InterviewResult.countDocuments();

        // Calculate average score across all results
        const results = await InterviewResult.find();
        const averageScore = results.length > 0
            ? Math.round(results.reduce((acc, curr) => acc + curr.score, 0) / results.length)
            : 0;

        res.json({
            totalUsers,
            totalInterviews,
            averageScore,
            totalResults
        });
    } catch (error) {
        console.error("Error fetching admin stats:", error);
        res.status(500).json({ message: "Failed to fetch admin statistics" });
    }
};
