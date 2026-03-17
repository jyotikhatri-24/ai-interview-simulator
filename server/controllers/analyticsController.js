const InterviewResult = require("../models/InterviewResult");
const mongoose = require("mongoose");

exports.getDashboardStats = async (req, res) => {
    try {
        const userId = req.user._id;

        // Run aggregations in parallel
        const [generalStats, trendStats, recentInterviews] = await Promise.all([
            // 1. General Metrics (Total, Avg, Best)
            InterviewResult.aggregate([
                { $match: { user: new mongoose.Types.ObjectId(userId) } },
                {
                    $group: {
                        _id: null,
                        totalInterviews: { $sum: 1 },
                        avgScore: { $avg: "$evaluation.score" },
                        bestScore: { $max: "$evaluation.score" }
                    }
                }
            ]),

            // 2. Trend Stats (Last 7 Days)
            InterviewResult.aggregate([
                {
                    $match: {
                        user: new mongoose.Types.ObjectId(userId),
                        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
                    }
                },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                        score: { $avg: "$evaluation.score" }
                    }
                },
                { $sort: { "_id": 1 } }
            ]),

            // 3. Recent Interviews
            InterviewResult.find({ user: userId })
                .sort({ createdAt: -1 })
                .limit(5)
                .populate("interview")
        ]);

        const stats = generalStats[0] || { totalInterviews: 0, avgScore: 0, bestScore: 0 };

        res.json({
            totalInterviews: stats.totalInterviews,
            avgScore: Math.round(stats.avgScore || 0),
            bestScore: stats.bestScore || 0,
            interviewTrend: trendStats.map(item => ({ date: item._id, score: Math.round(item.score) })),
            recentInterviews: recentInterviews.map(item => ({
                id: item._id,
                date: item.createdAt,
                score: item.evaluation?.score,
                role: item.interview?.assessment?.role || "Software Engineer"
            }))
        });

    } catch (error) {
        console.error("Analytics Error:", error);
        res.status(500).json({ message: "Failed to fetch analytics" });
    }
};
